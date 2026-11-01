import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Svg, { Path } from 'react-native-svg';
import IconButton from '@/components/atoms/IconButton';
import { hs, ms, vs, useTheme } from '@/theme';

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
  const { colors } = useTheme();
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
  const viewerSource = useMemo(
    () => ({
      html: `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=6,user-scalable=yes" /><style>
      html, body { margin: 0; width: 100%; height: 100%; background: ${colors.mediaBackground}; }
      body { display: flex; align-items: center; justify-content: center; }
      img { display: block; width: 100%; height: 100%; object-fit: contain; }
    </style></head><body><img alt="Hình bài tập" src="${escapedUri}" /></body></html>`,
    }),
    [colors.mediaBackground, escapedUri],
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
      {expanded ? (
        <Modal
          visible={expanded}
          animationType="fade"
          presentationStyle="fullScreen"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setExpanded(false)}
        >
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.mediaBackground}
            translucent
          />
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.mediaBackground }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: hs(16),
                paddingVertical: vs(4),
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: ms(16),
                  color: colors.onPrimary,
                  fontWeight: '700',
                }}
              >
                Hình bài tập
              </Text>
              <IconButton
                accessibilityLabel="Đóng hình bài tập"
                onPress={() => setExpanded(false)}
                color={colors.onPrimary}
                renderIcon={(size, color) => (
                  <Svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <Path
                      d="M6 6l12 12M18 6L6 18"
                      stroke={color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </Svg>
                )}
              />
            </View>
            <WebView
              source={viewerSource}
              javaScriptEnabled={false}
              domStorageEnabled={false}
              setBuiltInZoomControls
              setDisplayZoomControls={false}
              bounces={false}
              overScrollMode="never"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              containerStyle={{ backgroundColor: colors.mediaBackground }}
              style={{ flex: 1, backgroundColor: colors.mediaBackground }}
            />
          </SafeAreaView>
        </Modal>
      ) : null}
    </View>
  );
};
