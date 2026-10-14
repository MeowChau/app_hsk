package com.apphsk

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import com.facebook.react.bridge.*
import java.io.File
import java.util.UUID
import java.util.concurrent.Executors

class AvatarPickerModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context), ActivityEventListener {
  private var pending: Promise? = null
  private val worker = Executors.newSingleThreadExecutor()
  private val requestCode = 4207

  init { context.addActivityEventListener(this) }
  override fun getName() = "AvatarPicker"

  @ReactMethod
  fun pickImage(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      val activity = context.currentActivity
      if (activity == null) { promise.reject("NO_ACTIVITY", "Không thể mở trình chọn ảnh."); return@runOnUiThread }
      if (pending != null) { promise.reject("PICKER_BUSY", "Trình chọn ảnh đang mở."); return@runOnUiThread }
      pending = promise
      try {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
          type = "image/*"
          addCategory(Intent.CATEGORY_OPENABLE)
        }
        activity.startActivityForResult(intent, requestCode)
      } catch (error: Exception) {
        pending = null
        promise.reject("PICKER_ERROR", error)
      }
    }
  }

  override fun onActivityResult(activity: Activity, code: Int, resultCode: Int, data: Intent?) {
    if (code != requestCode) return
    val promise = pending ?: return
    pending = null
    if (resultCode != Activity.RESULT_OK) { promise.resolve(null); return }
    val uri = data?.data
    if (uri == null) { promise.reject("NO_IMAGE", "Chưa chọn ảnh."); return }
    worker.execute {
      try {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        context.contentResolver.openInputStream(uri).use { BitmapFactory.decodeStream(it, null, bounds) }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) throw IllegalArgumentException("Tệp đã chọn không phải ảnh hợp lệ.")
        var sample = 1
        while (maxOf(bounds.outWidth, bounds.outHeight) / sample > 2048) sample *= 2
        val options = BitmapFactory.Options().apply { inSampleSize = sample }
        val decoded = context.contentResolver.openInputStream(uri).use { BitmapFactory.decodeStream(it, null, options) }
          ?: throw IllegalArgumentException("Không thể đọc ảnh.")
        val orientation = context.contentResolver.openInputStream(uri).use { input ->
          if (input == null) ExifInterface.ORIENTATION_NORMAL
          else try { ExifInterface(input).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL) }
          catch (_: Exception) { ExifInterface.ORIENTATION_NORMAL }
        }
        val matrix = Matrix().apply {
          when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> postRotate(90f)
            ExifInterface.ORIENTATION_ROTATE_180 -> postRotate(180f)
            ExifInterface.ORIENTATION_ROTATE_270 -> postRotate(270f)
            ExifInterface.ORIENTATION_FLIP_HORIZONTAL -> postScale(-1f, 1f)
            ExifInterface.ORIENTATION_FLIP_VERTICAL -> postScale(1f, -1f)
            ExifInterface.ORIENTATION_TRANSPOSE -> { postRotate(90f); postScale(-1f, 1f) }
            ExifInterface.ORIENTATION_TRANSVERSE -> { postRotate(270f); postScale(-1f, 1f) }
          }
        }
        val oriented = Bitmap.createBitmap(decoded, 0, 0, decoded.width, decoded.height, matrix, true)
        val side = minOf(oriented.width, oriented.height)
        val square = Bitmap.createBitmap(oriented, (oriented.width - side) / 2, (oriented.height - side) / 2, side, side)
        val resized = Bitmap.createScaledBitmap(square, 512, 512, true)
        val output = File(context.cacheDir, "avatar-${UUID.randomUUID()}.jpg")
        output.outputStream().use { resized.compress(Bitmap.CompressFormat.JPEG, 90, it) }
        setOf(decoded, oriented, square, resized).forEach { if (!it.isRecycled) it.recycle() }
        promise.resolve(Arguments.createMap().apply {
          putString("uri", Uri.fromFile(output).toString())
          putString("name", output.name)
          putString("type", "image/jpeg")
          putDouble("size", output.length().toDouble())
        })
      } catch (error: Exception) { promise.reject("IMAGE_ERROR", error) }
    }
  }

  @ReactMethod
  fun releaseImage(uri: String) {
    val path = Uri.parse(uri).path ?: return
    val file = File(path)
    if (file.parentFile?.canonicalPath == context.cacheDir.canonicalPath && file.name.startsWith("avatar-")) file.delete()
  }

  override fun onNewIntent(intent: Intent) {}
  override fun invalidate() {
    context.removeActivityEventListener(this)
    pending?.reject("PICKER_CLOSED", "Trình chọn ảnh đã đóng.")
    pending = null
    worker.shutdown()
    super.invalidate()
  }
}
