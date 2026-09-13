import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';

export interface SubmitConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  remainingCount?: number;
  remainingWarningText?: string;
  customMessage?: React.ReactNode;
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
  const showWarning = typeof remainingCount === 'number' && remainingCount > 0;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: '85%',
                backgroundColor: '#FAF9F6',
                borderRadius: ms(12),
                padding: ms(20),
              }}
            >
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{
                  position: 'absolute',
                  top: ms(10),
                  right: ms(10),
                  padding: ms(10),
                  zIndex: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: ms(22),
                    color: '#6B7280',
                    fontWeight: '700',
                    lineHeight: ms(22),
                  }}
                >
                  ×
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: ms(20),
                  fontWeight: '800',
                  color: '#111827',
                  textAlign: 'center',
                  marginBottom: vs(16),
                }}
              >
                {title}
              </Text>

              {customMessage ? (
                <View style={{ marginBottom: vs(24) }}>{customMessage}</View>
              ) : null}

              {showWarning && (
                <View
                  style={{
                    backgroundColor: '#FEF3C7',
                    padding: ms(12),
                    borderRadius: ms(8),
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: vs(24),
                  }}
                >
                  <Svg
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    style={{ marginTop: 2, marginRight: hs(8) }}
                  >
                    <Path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text
                    style={{
                      fontSize: ms(14),
                      color: '#92400E',
                      flex: 1,
                      lineHeight: vs(20),
                    }}
                  >
                    {remainingWarningText || (
                      <>
                        Bạn còn{' '}
                        <Text style={{ fontWeight: '700' }}>{remainingCount}</Text>{' '}
                        câu chưa trả lời, những câu này sẽ bị tính là sai.
                      </>
                    )}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: hs(12),
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: ms(8),
                    paddingVertical: vs(12),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#374151',
                      fontSize: ms(16),
                      fontWeight: '700',
                    }}
                  >
                    {cancelButtonText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  style={{
                    flex: 1,
                    backgroundColor: '#1E3A8A',
                    borderRadius: ms(8),
                    paddingVertical: vs(12),
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: ms(16),
                      fontWeight: '700',
                    }}
                  >
                    {confirmButtonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SubmitConfirmModal;
