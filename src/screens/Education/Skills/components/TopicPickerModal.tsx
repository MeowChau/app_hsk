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
  selectedDescription?: string;
  topics: T[];
  getTopicLabel: (topic: T) => string;
  getTopicDescription?: (topic: T) => string;
  getTopicGroup?: (topic: T) => string;
  isSelected: (topic: T) => boolean;
  onSelectTopic: (topic: T) => void;
  getTopicKey?: (topic: T, index: number) => string | number;
  modalTitle?: string;
  description?: string;
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TopicPickerModal<T = any>({
  title = 'Chọn chủ đề / bài học',
  selectedLabel,
  selectedDescription,
  topics,
  getTopicLabel,
  getTopicDescription,
  getTopicGroup,
  isSelected,
  onSelectTopic,
  getTopicKey,
  modalTitle = 'Chủ đề',
  description,
  emptyMessage = 'Chưa có bài luyện để chọn.',
  containerStyle,
}: TopicPickerModalProps<T>) {
  const [showTopicModal, setShowTopicModal] = useState(false);
  const groups = new Map<string, { topic: T; index: number }[]>();
  topics.forEach((topic, index) => {
    const group = getTopicGroup?.(topic) ?? '';
    const items = groups.get(group) ?? [];
    items.push({ topic, index });
    groups.set(group, items);
  });

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
        accessibilityRole="button"
        accessibilityLabel={[title, selectedLabel, selectedDescription]
          .filter(Boolean)
          .join('. ')}
        accessibilityState={{ expanded: showTopicModal }}
        onPress={() => setShowTopicModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          backgroundColor: '#FAF9F6',
          borderRadius: ms(12),
          paddingVertical: vs(12),
          paddingHorizontal: hs(16),
        }}
      >
        <View style={{ flex: 1, minWidth: 0, marginRight: hs(12), gap: vs(4) }}>
          <Text
            style={{
              fontSize: ms(14),
              lineHeight: ms(20),
              color: '#374151',
              fontWeight: '600',
            }}
          >
            {selectedLabel}
          </Text>
          {selectedDescription ? (
            <Text
              style={{ fontSize: ms(12), lineHeight: ms(18), color: '#4B5563' }}
            >
              {selectedDescription}
            </Text>
          ) : null}
        </View>
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

      <Modal
        visible={showTopicModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTopicModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTopicModal(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingVertical: vs(24),
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  marginHorizontal: hs(16),
                  maxHeight: '80%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: ms(16),
                  paddingVertical: vs(12),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: hs(16),
                    paddingBottom: vs(12),
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: hs(12),
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: ms(16),
                        fontWeight: '700',
                        color: '#111827',
                      }}
                    >
                      {modalTitle}
                    </Text>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel="Đóng danh sách bài luyện"
                      onPress={() => setShowTopicModal(false)}
                      style={{
                        width: ms(44),
                        height: ms(44),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Svg height="20" viewBox="0 0 24 24" width="20">
                        <Path
                          d="M6 6l12 12M18 6L6 18"
                          fill="none"
                          stroke="#4B5563"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  {description ? (
                    <Text
                      style={{
                        fontSize: ms(12),
                        lineHeight: ms(18),
                        color: '#4B5563',
                      }}
                    >
                      {description}
                    </Text>
                  ) : null}
                </View>
                <ScrollView
                  showsVerticalScrollIndicator
                  contentContainerStyle={{
                    paddingHorizontal: hs(8),
                    paddingBottom: vs(4),
                  }}
                >
                  {topics.length === 0 ? (
                    <Text
                      style={{
                        padding: ms(16),
                        fontSize: ms(14),
                        lineHeight: ms(20),
                        color: '#4B5563',
                      }}
                    >
                      {emptyMessage}
                    </Text>
                  ) : null}
                  {[...groups].map(([group, items]) => (
                    <View key={group}>
                      {group ? (
                        <Text
                          style={{
                            paddingHorizontal: hs(8),
                            paddingTop: vs(16),
                            paddingBottom: vs(8),
                            fontSize: ms(14),
                            lineHeight: ms(20),
                            fontWeight: '700',
                            color: '#111827',
                          }}
                        >
                          {group}
                        </Text>
                      ) : null}
                      {items.map(({ topic, index }) => {
                        const active = isSelected(topic);
                        const key = getTopicKey
                          ? getTopicKey(topic, index)
                          : index;
                        const topicDescription = getTopicDescription?.(topic);
                        return (
                          <TouchableOpacity
                            key={key}
                            accessibilityRole="radio"
                            accessibilityState={{ selected: active }}
                            accessibilityLabel={[
                              getTopicLabel(topic),
                              topicDescription,
                            ]
                              .filter(Boolean)
                              .join('. ')}
                            onPress={() => {
                              onSelectTopic(topic);
                              setShowTopicModal(false);
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: vs(12),
                              paddingHorizontal: hs(8),
                              marginVertical: vs(4),
                              minHeight: ms(44),
                              borderRadius: ms(12),
                              backgroundColor: active
                                ? '#F3F4F6'
                                : 'transparent',
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                minWidth: 0,
                                marginRight: hs(12),
                                gap: vs(4),
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: ms(14),
                                  color: active ? '#1E3A8A' : '#374151',
                                  fontWeight: '600',
                                  lineHeight: ms(20),
                                }}
                              >
                                {getTopicLabel(topic)}
                              </Text>
                              {topicDescription ? (
                                <Text
                                  style={{
                                    fontSize: ms(12),
                                    lineHeight: ms(18),
                                    color: '#4B5563',
                                  }}
                                >
                                  {topicDescription}
                                </Text>
                              ) : null}
                            </View>
                            <View
                              style={{ width: ms(16), alignItems: 'center' }}
                            >
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
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
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
