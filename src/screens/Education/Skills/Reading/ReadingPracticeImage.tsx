import React, { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { hs, ms, vs } from '@/theme';

interface Props {
  uri: string;
  aspectRatio?: number;
  maxHeight?: number;
}

export const ReadingPracticeImage = ({
  uri,
  aspectRatio = 1,
  maxHeight,
}: Props) => {
  const [ratio, setRatio] = useState(aspectRatio);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const escapedUri = uri.replace(
    /[&<>"']/g,
    (value) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[value]!,
  );

  return (
    <View style={{ marginVertical: vs(12) }}>
      {failed ? (
        <TouchableOpacity
          onPress={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
          style={{ padding: ms(16) }}
        >
          <Text style={{ fontSize: ms(14), color: '#4B5563' }}>
            Không tải được hình bài tập. Chạm để thử lại.
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Phóng to hình bài tập"
          onPress={() => setExpanded(true)}
        >
          <Image
            key={attempt}
            source={{ uri }}
            resizeMode="contain"
            style={{
              width: '100%',
              aspectRatio: ratio,
              maxHeight,
              backgroundColor: '#FFFFFF',
            }}
            onLoad={({ nativeEvent }) => {
              const { width, height } = nativeEvent.source;
              if (width > 0 && height > 0) setRatio(width / height);
            }}
            onError={() => setFailed(true)}
          />
          <Text
            style={{ fontSize: ms(12), color: '#1E3A8A', marginTop: vs(8) }}
          >
            Chạm vào hình để phóng to
          </Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={expanded}
        animationType="fade"
        onRequestClose={() => setExpanded(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: hs(16),
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: ms(16),
                color: '#111827',
                fontWeight: '700',
              }}
            >
              Hình bài tập
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setExpanded(false)}
              style={{
                minHeight: ms(44),
                justifyContent: 'center',
                paddingHorizontal: hs(12),
              }}
            >
              <Text
                style={{
                  color: '#1E3A8A',
                  fontSize: ms(14),
                  fontWeight: '600',
                }}
              >
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{
              html: `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=6,user-scalable=yes"></head><body style="margin:0;background:white"><img alt="Hình bài tập" src="${escapedUri}" style="display:block;width:100%;height:auto"></body></html>`,
            }}
            javaScriptEnabled={false}
            domStorageEnabled={false}
            setBuiltInZoomControls
            setDisplayZoomControls={false}
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};
