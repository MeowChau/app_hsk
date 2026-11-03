import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Svg, { Path } from 'react-native-svg';
import IconButton from '@/components/atoms/IconButton';
import { hs, ms, vs, useTheme } from '@/theme';
import { imageSource } from '@/services/media';

interface Props {
  uri: string | ImageSourcePropType;
  aspectRatio?: number;
  maxHeight?: number;
  showHint?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export const ReadingPracticeImage = ({
  uri,
  aspectRatio = 1,
  maxHeight,
  showHint = true,
  style,
  accessibilityLabel = 'Phóng to hình bài tập',
}: Props) => {
  const { colors } = useTheme();
  const source = useMemo(() => imageSource(uri), [uri]);
  const resolvedSource = source ? Image.resolveAssetSource(source) : undefined;
  const resolvedUri = resolvedSource?.uri || '';
  const initialRatio = resolvedSource && resolvedSource.width > 0 && resolvedSource.height > 0
    ? resolvedSource.width / resolvedSource.height : aspectRatio;
  const [ratio, setRatio] = useState(initialRatio);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setRatio(initialRatio > 0 ? initialRatio : 1);
    setFailed(false);
    setExpanded(false);
  }, [initialRatio, resolvedUri]);
  useEffect(() => {
    let cancelled = false;
    if (resolvedUri) {
      // Android's onLoad dimensions can describe the resized preview. Read the
      // actual file size so wide scans do not reserve a square of empty space.
      Image.getSize(resolvedUri, (imageWidth, imageHeight) => {
        if (!cancelled && imageWidth > 0 && imageHeight > 0) {
          setRatio(imageWidth / imageHeight);
        }
      }, () => {});
    }
    return () => { cancelled = true; };
  }, [attempt, resolvedUri]);
  const escapedUri = resolvedUri.replace(
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
    <View style={[{ alignSelf: 'stretch', marginVertical: showHint ? vs(12) : 0 }, style]}>
      {failed ? (
        <TouchableOpacity
          onPress={() => {
            setFailed(false);
            setAttempt((value) => value + 1);
          }}
          style={{ padding: ms(16) }}
        >
          <Text style={{ fontSize: ms(14), color: colors.gray400 }}>
            Không tải được hình bài tập. Chạm để thử lại.
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={() => setExpanded(true)}
          onLayout={event => setWidth(event.nativeEvent.layout.width)}
        >
          <Image
            key={attempt}
            source={source}
            resizeMode="contain"
            style={{
              width: '100%',
              height: Math.min((width || ms(240)) / (ratio > 0 ? ratio : 1), maxHeight ?? Infinity),
              backgroundColor: colors.surface,
            }}
            onError={() => setFailed(true)}
          />
          {showHint ? <Text
            style={{ fontSize: ms(12), color: colors.primaryAction, marginTop: vs(8) }}
          >
            Chạm vào hình để phóng to
          </Text> : null}
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
