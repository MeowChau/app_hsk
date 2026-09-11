import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

interface HskLevelSettingsCardProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
}

export function HskLevelSettingsCard({ currentLevel, onLevelChange }: HskLevelSettingsCardProps) {
  const { layout } = useTheme();
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
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: '#FFF', borderRadius: ms(12), width: '75%', padding: ms(16), elevation: 5 }}>
                <Text style={{ fontSize: ms(16), fontWeight: '700', marginBottom: vs(16), textAlign: 'center', color: '#111827' }}>
                  Chọn trình độ
                </Text>
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <TouchableOpacity 
                    key={lvl} 
                    style={{ paddingVertical: vs(14), borderBottomWidth: lvl !== 6 ? 1 : 0, borderBottomColor: '#F3F4F6' }}
                    onPress={() => handleSelectLevel(lvl)}>
                    <Text style={{ fontSize: ms(16), textAlign: 'center', fontWeight: lvl === currentLevel ? '700' : '400', color: lvl === currentLevel ? '#0E84F2' : '#111827' }}>
                      HSK {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Confirm Popup Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: '#FFF', borderRadius: ms(16), width: '85%', padding: ms(24), alignItems: 'center', elevation: 5 }}>
                <Text style={{ fontSize: ms(18), fontWeight: '700', color: '#111827', marginBottom: vs(24), textAlign: 'center' }}>
                  Thay đổi trình độ HSK của bạn?
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <TouchableOpacity 
                    onPress={() => setConfirmModalVisible(false)}
                    style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(12), borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', marginRight: hs(8) }}>
                    <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#374151' }}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleConfirm}
                    style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(12), backgroundColor: '#0E84F2', alignItems: 'center', marginLeft: hs(8) }}>
                    <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#FFF' }}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
