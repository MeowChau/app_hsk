import { useEffect, useSyncExternalStore } from 'react';
import { Text, View } from 'react-native';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';
import IconButton from '@/components/atoms/IconButton';
import Svg, { Path } from 'react-native-svg';
import {
  closeAppAlert,
  getAppAlertSnapshot,
  subscribeAppAlert,
} from '@/services/feedback/appAlert';
import type { AppAlertEntry } from '@/services/feedback/appAlert';
import { ms, useTheme } from '@/theme';

function Notice({ entry }: { entry: AppAlertEntry }) {
  const { colors } = useTheme();
  useEffect(() => {
    const timer = setTimeout(() => closeAppAlert(entry.id), 5000);
    return () => clearTimeout(timer);
  }, [entry.id]);
  const color =
    entry.variant === 'success'
      ? colors.success
      : entry.variant === 'error' || entry.variant === 'warning'
        ? colors.red500
        : colors.dialogAction;
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: ms(90),
        left: 0,
        right: 0,
        alignItems: 'center',
      }}
    >
      <View
        accessibilityLiveRegion="polite"
        testID="app-notice"
        style={{
          backgroundColor: colors.dialogBackground,
          borderColor: colors.dialogBorder,
          borderWidth: 1,
          borderLeftColor: color,
          borderLeftWidth: 4,
          borderRadius: ms(12),
          elevation: 6,
          maxWidth: 420,
          width: '85%',
          paddingLeft: ms(16),
          paddingVertical: ms(12),
          paddingRight: ms(4),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.dialogText,
              fontWeight: '700',
              fontSize: ms(14),
              lineHeight: ms(20),
            }}
          >
            {entry.title}
          </Text>
          {!!entry.message && (
            <Text
              style={{
                color: colors.dialogText,
                fontSize: ms(13),
                lineHeight: ms(20),
                marginTop: ms(4),
              }}
            >
              {entry.message}
            </Text>
          )}
        </View>
        <IconButton
          accessibilityLabel="Đóng thông báo"
          color={colors.dialogAction}
          onPress={() => closeAppAlert(entry.id)}
          renderIcon={(size, tint) => (
            <Svg width={size} height={size} viewBox="0 0 24 24">
              <Path
                d="m6 6 12 12M18 6 6 18"
                stroke={tint}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          )}
        />
      </View>
    </View>
  );
}

export default function AppAlertHost() {
  const entry = useSyncExternalStore(
    subscribeAppAlert,
    getAppAlertSnapshot,
    getAppAlertSnapshot,
  );
  if (!entry) return null;
  if (entry.presentation === 'toast')
    return <Notice key={entry.id} entry={entry} />;
  const ordered = entry.buttons
    .map((button, index) => ({ button, index }))
    .sort(
      (a, b) =>
        Number(b.button.style === 'cancel') -
        Number(a.button.style === 'cancel'),
    );
  return (
    <ConfirmationDialog
      key={entry.id}
      visible
      title={entry.title}
      message={entry.message}
      onClose={entry.cancelable ? () => closeAppAlert(entry.id) : undefined}
      buttons={ordered.map(({ button, index }) => ({
        text: !button.text || button.text === 'OK' ? 'Đã hiểu' : button.text,
        secondary: button.style === 'cancel',
        onPress: () => closeAppAlert(entry.id, index),
      }))}
    />
  );
}
