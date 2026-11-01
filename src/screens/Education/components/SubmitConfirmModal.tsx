import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';
import { ms, useTheme } from '@/theme';

export interface SubmitConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  remainingCount?: number;
  remainingWarningText?: string;
  customMessage?: ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

export const SubmitConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Xác nhận nộp bài?',
  remainingCount,
  remainingWarningText,
  customMessage,
  cancelButtonText = 'Tiếp tục làm bài',
  confirmButtonText = 'Nộp bài',
}: SubmitConfirmModalProps) => {
  const { colors } = useTheme();
  const showWarning = typeof remainingCount === 'number' && remainingCount > 0;
  return (
    <ConfirmationDialog
      visible={visible}
      title={title}
      onClose={onClose}
      buttons={[
        { text: cancelButtonText, onPress: onClose, secondary: true },
        { text: confirmButtonText, onPress: onConfirm },
      ]}
    >
      {!!customMessage && (
        <View style={{ marginTop: ms(16) }}>{customMessage}</View>
      )}
      {showWarning && (
        <View
          style={{
            alignItems: 'flex-start',
            backgroundColor: colors.warningBackground,
            borderRadius: ms(12),
            flexDirection: 'row',
            gap: ms(10),
            marginTop: ms(16),
            padding: ms(12),
          }}
        >
          <Svg
            width={ms(18)}
            height={ms(18)}
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginTop: ms(2) }}
          >
            <Path
              d="m10.3 4.5-8 14A1.7 1.7 0 0 0 3.8 21h16.4a1.7 1.7 0 0 0 1.5-2.5l-8-14a2 2 0 0 0-3.4 0Z M12 9v4m0 4v.1"
              stroke={colors.warningText}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text
            style={{
              color: colors.warningText,
              flex: 1,
              fontSize: ms(14),
              lineHeight: ms(22),
            }}
          >
            {remainingWarningText || (
              <>
                Bạn còn{' '}
                <Text style={{ fontWeight: '700' }}>{remainingCount}</Text> câu
                chưa trả lời, những câu này sẽ bị tính là sai.
              </>
            )}
          </Text>
        </View>
      )}
    </ConfirmationDialog>
  );
};

export default SubmitConfirmModal;
