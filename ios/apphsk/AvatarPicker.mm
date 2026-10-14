#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
@import PhotosUI;
@import UIKit;

@interface AvatarPicker : NSObject <RCTBridgeModule, PHPickerViewControllerDelegate>
@property(nonatomic, copy) RCTPromiseResolveBlock resolve;
@property(nonatomic, copy) RCTPromiseRejectBlock reject;
@end

@implementation AvatarPicker
RCT_EXPORT_MODULE(AvatarPicker)
+ (BOOL)requiresMainQueueSetup { return YES; }
- (dispatch_queue_t)methodQueue { return dispatch_get_main_queue(); }

RCT_EXPORT_METHOD(pickImage:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.resolve) { reject(@"PICKER_BUSY", @"Trình chọn ảnh đang mở.", nil); return; }
  UIViewController *presenter = RCTPresentedViewController();
  if (!presenter) { reject(@"NO_ACTIVITY", @"Không thể mở trình chọn ảnh.", nil); return; }
  self.resolve = resolve;
  self.reject = reject;
  PHPickerConfiguration *configuration = [[PHPickerConfiguration alloc] init];
  configuration.filter = PHPickerFilter.imagesFilter;
  configuration.selectionLimit = 1;
  PHPickerViewController *picker = [[PHPickerViewController alloc] initWithConfiguration:configuration];
  picker.delegate = self;
  [presenter presentViewController:picker animated:YES completion:nil];
}

- (void)picker:(PHPickerViewController *)picker didFinishPicking:(NSArray<PHPickerResult *> *)results {
  [picker dismissViewControllerAnimated:YES completion:nil];
  if (!results.count) { self.resolve((id)kCFNull); self.resolve = nil; self.reject = nil; return; }
  NSItemProvider *provider = results.firstObject.itemProvider;
  if (![provider canLoadObjectOfClass:UIImage.class]) {
    self.reject(@"NO_IMAGE", @"Không thể đọc ảnh đã chọn.", nil); self.resolve = nil; self.reject = nil; return;
  }
  [provider loadObjectOfClass:UIImage.class completionHandler:^(__kindof id<NSItemProviderReading> object, NSError *error) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (!self.resolve) return;
      UIImage *image = (UIImage *)object;
      if (error || !image || image.size.width <= 0 || image.size.height <= 0) {
        self.reject(@"IMAGE_ERROR", @"Không thể đọc ảnh.", error);
      } else {
        CGFloat scale = MAX(512.0 / image.size.width, 512.0 / image.size.height);
        CGSize size = CGSizeMake(image.size.width * scale, image.size.height * scale);
        UIGraphicsImageRendererFormat *format = UIGraphicsImageRendererFormat.defaultFormat;
        format.scale = 1;
        UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:CGSizeMake(512, 512) format:format];
        UIImage *square = [renderer imageWithActions:^(UIGraphicsImageRendererContext *context) {
          [image drawInRect:CGRectMake((512 - size.width) / 2, (512 - size.height) / 2, size.width, size.height)];
        }];
        NSData *data = UIImageJPEGRepresentation(square, 0.9);
        NSString *name = [NSString stringWithFormat:@"avatar-%@.jpg", NSUUID.UUID.UUIDString];
        NSString *path = [NSTemporaryDirectory() stringByAppendingPathComponent:name];
        NSError *writeError = nil;
        if (![data writeToFile:path options:NSDataWritingAtomic error:&writeError]) {
          self.reject(@"IMAGE_ERROR", @"Không thể lưu ảnh tạm.", writeError);
        } else {
          self.resolve(@{ @"uri": [NSURL fileURLWithPath:path].absoluteString, @"name": name, @"type": @"image/jpeg", @"size": @(data.length) });
        }
      }
      self.resolve = nil;
      self.reject = nil;
    });
  }];
}

RCT_EXPORT_METHOD(releaseImage:(NSString *)uri) {
  NSURL *url = [NSURL URLWithString:uri];
  if (url.isFileURL && [url.path.stringByDeletingLastPathComponent isEqualToString:NSTemporaryDirectory().stringByStandardizingPath]
      && [url.lastPathComponent hasPrefix:@"avatar-"]) {
    [NSFileManager.defaultManager removeItemAtURL:url error:nil];
  }
}
@end
