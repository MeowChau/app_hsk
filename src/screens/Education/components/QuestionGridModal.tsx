import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { ms, hs, vs } from '@/theme';

export interface QuestionGridItem {
  id: string | number;
  index?: number | string;
  isAnswered?: boolean;
  isBookmarked?: boolean;
  isCurrent?: boolean;
  isCorrect?: boolean;
}

export interface QuestionGridSection {
  key?: string;
  title: string;
  items: QuestionGridItem[];
}

export interface QuestionGridModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  items?: QuestionGridItem[];
  sections?: QuestionGridSection[];
  onSelectItem: (item: QuestionGridItem, index: number) => void;
  isReviewMode?: boolean;
  showLegend?: boolean;
  closeOnSelect?: boolean;
}

export const QuestionGridModal: React.FC<QuestionGridModalProps> = ({
  visible,
  onClose,
  title = 'Danh sách câu hỏi',
  subtitle,
  items,
  sections,
  onSelectItem,
  isReviewMode = false,
  showLegend = true,
  closeOnSelect = true,
}) => {
  const handleItemPress = (item: QuestionGridItem, index: number) => {
    if (closeOnSelect) {
      onClose();
    }
    onSelectItem(item, index);
  };

  const renderGridItem = (item: QuestionGridItem, index: number) => {
    const label = item.index !== undefined ? item.index : index + 1;
    let bgColor = '#EBE3D5';
    let textColor = '#1E3A8A';
    let borderColor = 'transparent';
    let borderWidth = 0;
    let borderStyle = 'solid';

    if (isReviewMode) {
      if (item.isAnswered) {
        bgColor = item.isCorrect ? '#22C55E' : '#EF4444';
        textColor = '#FFFFFF';
      } else {
        bgColor = 'transparent';
        textColor = '#EF4444';
        borderColor = '#EF4444';
        borderWidth = 1;
        borderStyle = 'dashed';
      }
    } else {
      if (item.isCurrent) {
        bgColor = '#FEF3C7';
        textColor = '#92400E';
        borderWidth = 2;
        borderColor = '#F59E0B';
      } else if (item.isAnswered) {
        bgColor = '#1E3A8A';
        textColor = '#FFFFFF';
      }
    }

    return (
      <TouchableOpacity
        key={String(item.id)}
        onPress={() => handleItemPress(item, index)}
        style={{
          width: ms(44),
          height: ms(44),
          borderRadius: ms(6),
          backgroundColor: bgColor,
          borderColor,
          borderWidth,
          borderStyle: borderStyle as any,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(16) }}>
          {label}
        </Text>
        {item.isBookmarked && (
          <View
            style={{
              position: 'absolute',
              top: -ms(4),
              right: -ms(4),
              width: ms(12),
              height: ms(12),
              borderRadius: ms(6),
              backgroundColor: '#F59E0B',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
                width: '90%',
                maxHeight: '80%',
                backgroundColor: '#FAF9F6',
                borderRadius: ms(12),
                padding: ms(16),
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: vs(16),
                }}
              >
                <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827' }}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={{ position: 'absolute', right: 0, padding: ms(10), zIndex: 10 }}
                >
                  <Text
                    style={{
                      fontSize: ms(24),
                      color: '#6B7280',
                      fontWeight: '700',
                      lineHeight: ms(24),
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Grid content */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {subtitle && (
                  <Text
                    style={{
                      fontSize: ms(16),
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: vs(12),
                    }}
                  >
                    {subtitle}
                  </Text>
                )}

                {sections && sections.length > 0 ? (
                  sections.map((sec, secIdx) => (
                    <View key={sec.key || sec.title || secIdx}>
                      <Text
                        style={{
                          fontSize: ms(16),
                          fontWeight: '700',
                          color: '#1E3A8A',
                          marginBottom: vs(12),
                          borderLeftWidth: 3,
                          borderLeftColor: '#1E3A8A',
                          paddingLeft: hs(8),
                        }}
                      >
                        {sec.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: ms(12),
                          marginBottom: vs(24),
                        }}
                      >
                        {sec.items.map((item, idx) => renderGridItem(item, idx))}
                      </View>
                    </View>
                  ))
                ) : items ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: ms(12),
                      marginBottom: vs(24),
                    }}
                  >
                    {items.map((item, idx) => renderGridItem(item, idx))}
                  </View>
                ) : null}
              </ScrollView>

              {/* Legend */}
              {showLegend && (
                isReviewMode ? (
                  <View style={{ marginTop: vs(16), gap: vs(8) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#22C55E',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
                        Đúng
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#EF4444',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
                        Sai
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(12),
                          height: ms(12),
                          borderRadius: ms(2),
                          borderWidth: 1,
                          borderColor: '#EF4444',
                          borderStyle: 'dashed',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
                        Chưa trả lời
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ marginTop: vs(16), gap: vs(8) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#1E3A8A',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>
                        Đã trả lời
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#EBE3D5',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>
                        Chưa trả lời
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#FEF3C7',
                          borderWidth: 1,
                          borderColor: '#F59E0B',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>
                        Đang học
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View
                        style={{
                          width: ms(10),
                          height: ms(10),
                          borderRadius: ms(5),
                          backgroundColor: '#F59E0B',
                        }}
                      />
                      <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>
                        Đã đánh dấu
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
