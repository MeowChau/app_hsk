import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';

export interface TopicPickerModalProps<T = any> {
  title?: string;
  selectedLabel: string;
  topics: T[];
  getTopicLabel: (topic: T) => string;
  isSelected: (topic: T) => boolean;
  onSelectTopic: (topic: T) => void;
  getTopicKey?: (topic: T, index: number) => string | number;
  modalTitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TopicPickerModal<T = any>({
  title = 'Chọn chủ đề / bài học',
  selectedLabel,
  topics,
  getTopicLabel,
  isSelected,
  onSelectTopic,
  getTopicKey,
  modalTitle = 'Chủ đề',
  containerStyle,
}: TopicPickerModalProps<T>) {
  const [showTopicModal, setShowTopicModal] = useState(false);

  return (
    <View style={containerStyle}>
      {title ? (
        <Text
          style={{
            fontSize: ms(16),
            fontWeight: '800',
            color: '#111827',
            marginBottom: vs(12),
          }}
        >
          {title}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={() => setShowTopicModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#FAF9F6',
          borderRadius: ms(8),
          paddingVertical: vs(12),
          paddingHorizontal: hs(16),
        }}
      >
        <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '500' }}>
          {selectedLabel}
        </Text>
        <Svg height="16" viewBox="0 0 24 24" width="16">
          <Path
            d="M7 15l5 5 5-5M7 9l5-5 5 5"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      <Modal visible={showTopicModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowTopicModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  marginHorizontal: hs(16),
                  marginTop: vs(160),
                  maxHeight: '60%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: ms(8),
                  paddingVertical: vs(12),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: ms(16),
                    fontWeight: '800',
                    color: '#111827',
                    paddingHorizontal: hs(16),
                    paddingBottom: vs(12),
                  }}
                >
                  {modalTitle}
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {topics.map((topic, index) => {
                    const active = isSelected(topic);
                    const key = getTopicKey ? getTopicKey(topic, index) : index;
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => {
                          onSelectTopic(topic);
                          setShowTopicModal(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: vs(12),
                          paddingHorizontal: hs(16),
                          backgroundColor: active ? '#F3F4F6' : 'transparent',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: ms(14),
                            color: active ? '#1E3A8A' : '#374151',
                            fontWeight: active ? '700' : '500',
                          }}
                        >
                          {getTopicLabel(topic)}
                        </Text>
                        {active && (
                          <Svg height="16" viewBox="0 0 24 24" width="16">
                            <Path
                              d="M20 6L9 17l-5-5"
                              fill="none"
                              stroke="#1E3A8A"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default TopicPickerModal;
