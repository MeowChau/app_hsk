import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';
import ConfirmationDialog from '@/components/molecules/ConfirmationDialog';

interface HskLevelSettingsCardProps {
  currentLevel: number;
  isSaving?: boolean;
  onLevelChange: (level: number) => void;
}

export function HskLevelSettingsCard({ currentLevel, isSaving = false, onLevelChange }: HskLevelSettingsCardProps) {
  const { colors, layout } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [levelToConfirm, setLevelToConfirm] = useState(currentLevel);

  const handleSelectLevel = (level: number) => {
    setModalVisible(false);
    if (level !== currentLevel) {
      setLevelToConfirm(level);
      setTimeout(() => {
        setConfirmModalVisible(true);
      }, 300); // Small delay to let the dropdown modal close smoothly
    }
  };

  const handleConfirm = () => {
    onLevelChange(levelToConfirm);
    setConfirmModalVisible(false);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#F0F2F5',
          borderRadius: ms(16),
          borderWidth: 1,
          elevation: 1.5,
          padding: ms(16),
          shadowColor: '#000',
          shadowOffset: { width: hs(0), height: vs(2) },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        }}
      >
        <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginBottom: vs(8) }}>
          Thay đổi trình độ HSK
        </Text>
        
        <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
          <Text style={{ color: '#374151', fontSize: ms(14) }}>
            Trình độ HSK hiện tại của bạn:
          </Text>
          <TouchableOpacity 
            disabled={isSaving}
            onPress={() => setModalVisible(true)}
            style={{ 
              borderWidth: 1, 
              borderColor: '#D1D5DB', 
              borderRadius: ms(20), 
              paddingHorizontal: hs(16), 
              paddingVertical: vs(6) 
            }}>
            <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700' }}>HSK {currentLevel}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modal (List thả xuống) */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: colors.dialogBackground, borderRadius: ms(12), width: '75%', padding: ms(16), elevation: 5 }}>
                <Text style={{ fontSize: ms(16), fontWeight: '700', marginBottom: vs(16), textAlign: 'center', color: colors.dialogText }}>
                  Chọn trình độ
                </Text>
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <TouchableOpacity 
                    key={lvl} 
                    style={{ paddingVertical: vs(14), borderBottomWidth: lvl !== 6 ? 1 : 0, borderBottomColor: colors.dialogBorder }}
                    onPress={() => handleSelectLevel(lvl)}>
                    <Text style={{ fontSize: ms(16), textAlign: 'center', fontWeight: lvl === currentLevel ? '700' : '400', color: colors.dialogText }}>
                      HSK {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ConfirmationDialog
        visible={confirmModalVisible}
        title="Thay đổi trình độ HSK của bạn?"
        onClose={() => setConfirmModalVisible(false)}
        buttons={[
          { text: 'Hủy', onPress: () => setConfirmModalVisible(false), secondary: true },
          { text: 'Xác nhận', onPress: handleConfirm },
        ]}
      />
    </>
  );
}
