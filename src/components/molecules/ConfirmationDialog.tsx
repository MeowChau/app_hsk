import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ms, useControlSizes, useTheme } from '@/theme';
import { useReducedMotion } from '@/navigation/useReducedMotion';

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  children?: ReactNode;
  onClose?: () => void;
  buttons: { text: string; onPress: () => void; secondary?: boolean }[];
}

export default function ConfirmationDialog({
  visible,
  title,
  message,
  children,
  onClose,
  buttons,
}: Props) {
  const { colors } = useTheme();
  const { height, width, fontScale } = useWindowDimensions();
  const sizes = useControlSizes();
  const reducedMotion = useReducedMotion();
  const pressed = useRef(false);
  useEffect(() => {
    if (visible) {
      pressed.current = false;
      Keyboard.dismiss();
    }
  }, [visible]);
  const stacked =
    width < 340 ||
    fontScale > 1.3 ||
    buttons.length > 2 ||
    buttons.some((button) => button.text.length > 20);
  const act = (callback?: () => void) => {
    if (!callback || pressed.current) return;
    pressed.current = true;
    callback();
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'none' : 'fade'}
      onRequestClose={() => act(onClose)}
    >
      <View style={styles.overlay}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.mediaBackground, opacity: 0.4 },
          ]}
        />
        <Pressable
          accessible={false}
          style={StyleSheet.absoluteFill}
          onPress={() => act(onClose)}
          testID="app-alert-backdrop"
        />
        <View
          accessibilityViewIsModal
          testID="app-alert-dialog"
          style={{
            backgroundColor: colors.dialogBackground,
            borderRadius: ms(16),
            maxHeight: Math.max(160, height - 96),
            maxWidth: 420,
            padding: ms(24),
            width: '100%',
          }}
        >
          <ScrollView bounces={false} style={{ flexShrink: 1 }}>
            <Text
              accessibilityRole="header"
              style={{
                color: colors.dialogText,
                fontSize: ms(18),
                lineHeight: ms(26),
                fontWeight: '700',
                textAlign: 'center',
              }}
            >
              {title}
            </Text>
            {!!message && (
              <Text
                style={{
                  color: colors.dialogText,
                  fontSize: ms(14),
                  lineHeight: ms(22),
                  marginTop: ms(14),
                  textAlign: 'center',
                }}
              >
                {message}
              </Text>
            )}
            {children}
            <View
              style={{
                flexDirection: stacked ? 'column' : 'row',
                gap: ms(16),
                marginTop: ms(24),
              }}
            >
              {buttons.map((button, index) => (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  onPress={() => act(button.onPress)}
                  testID={`app-alert-button-${index}`}
                  style={({ pressed: down }) => ({
                    alignItems: 'center',
                    backgroundColor: button.secondary
                      ? colors.dialogBackground
                      : colors.dialogAction,
                    borderColor: button.secondary
                      ? colors.dialogBorder
                      : colors.dialogAction,
                    borderWidth: 1,
                    borderRadius: ms(12),
                    flex: stacked ? undefined : 1,
                    justifyContent: 'center',
                    minHeight: sizes.touchTarget,
                    opacity: down ? 0.75 : 1,
                    paddingHorizontal: ms(10),
                    paddingVertical: ms(12),
                  })}
                >
                  <Text
                    style={{
                      color: button.secondary
                        ? colors.dialogText
                        : colors.onPrimary,
                      fontSize: ms(14),
                      lineHeight: ms(20),
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '7.5%',
    paddingVertical: 48,
  },
});
