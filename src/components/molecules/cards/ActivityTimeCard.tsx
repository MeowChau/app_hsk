import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

export function ActivityTimeCard() {
  const { layout } = useTheme();

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
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
        <Text
          style={{
            color: '#111827',
            fontSize: ms(14),
            fontWeight: '700',
            marginBottom: vs(14),
          }}
        >
          Thời gian theo hoạt động
        </Text>

        {/* Progress List */}
        <View style={{ rowGap: vs(14) }}>
          {/* Activity 1: Ôn tập */}
          <View>
            <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(4) }]}>
              <Text style={{ color: '#374151', fontSize: ms(12), fontWeight: '600' }}>
                Ôn tập
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: ms(11) }}>
                {'<1 phút • 0%'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: ms(3),
                height: vs(6),
                width: '100%',
              }}
            />
          </View>

          {/* Activity 2: Bài học */}
          <View>
            <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(4) }]}>
              <Text style={{ color: '#374151', fontSize: ms(12), fontWeight: '600' }}>
                Bài học
              </Text>
              <Text style={{ color: '#6B7280', fontSize: ms(11) }}>
                1 giờ 1 phút • 63%
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: ms(3),
                height: vs(6),
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <View
                style={{
                  backgroundColor: '#10B981',
                  borderRadius: ms(3),
                  height: '100%',
                  width: '63%',
                }}
              />
            </View>
          </View>

          {/* Activity 3: Chép chính tả */}
          <View>
            <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(4) }]}>
              <Text style={{ color: '#374151', fontSize: ms(12), fontWeight: '600' }}>
                Chép chính tả
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: ms(11) }}>
                {'<1 phút • 0%'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: ms(3),
                height: vs(6),
                width: '100%',
              }}
            />
          </View>

          {/* Activity 4: Luyện gõ */}
          <View>
            <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(4) }]}>
              <Text style={{ color: '#374151', fontSize: ms(12), fontWeight: '600' }}>
                Luyện gõ
              </Text>
              <Text style={{ color: '#6B7280', fontSize: ms(11) }}>
                35 phút • 36%
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: ms(3),
                height: vs(6),
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <View
                style={{
                  backgroundColor: '#F59E0B',
                  borderRadius: ms(3),
                  height: '100%',
                  width: '36%',
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
