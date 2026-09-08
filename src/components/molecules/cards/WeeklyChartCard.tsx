import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

export function WeeklyChartCard() {
  const { layout } = useTheme();

  // Dummy data for 21 bars in the 7 days chart
  const barChartData = [
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(4), isEstimate: false },
    { height: vs(50), isEstimate: false },
    { height: vs(12), isEstimate: false },
    { height: vs(18), isEstimate: false },
    { height: vs(26), isEstimate: false },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(50), isEstimate: true },
    { height: vs(22), isEstimate: false },
    { height: vs(16), isEstimate: false },
    { height: vs(20), isEstimate: false },
    { height: vs(50), isEstimate: true },
    { height: vs(48), isEstimate: false },
    { height: vs(18), isEstimate: false },
    { height: vs(56), isEstimate: false },
    { height: vs(10), isEstimate: false },
  ];

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
        {/* Header */}
        <Text
          style={{
            color: '#111827',
            fontSize: ms(14),
            fontWeight: '700',
            marginBottom: vs(12),
          }}
        >
          7 ngày gần nhất
        </Text>

        {/* Bar Chart Visualization */}
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            height: vs(64),
            justifyContent: 'space-between',
            marginBottom: vs(6),
            paddingHorizontal: hs(4),
          }}
        >
          {barChartData.map((bar, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: bar.isEstimate ? '#E2E8F0' : '#0E84F2',
                borderRadius: ms(2),
                height: bar.height,
                width: hs(5),
              }}
            />
          ))}
        </View>
        <Text
          style={{
            color: '#94A3B8',
            fontSize: ms(10),
            marginBottom: vs(14),
          }}
        >
          Cột nhạt là ngày được ước tính.
        </Text>

        {/* 2x2 Stats Grid */}
        <View style={{ rowGap: vs(8) }}>
          {/* Row 1 */}
          <View style={[layout.row, { columnGap: hs(8) }]}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#6B7280', fontSize: ms(10) }}>
                Trung bình mỗi ngày học
              </Text>
              <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700', marginTop: vs(2) }}>
                "Số lượng"
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#6B7280', fontSize: ms(10) }}>
                Số ngày có học
              </Text>
              <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700', marginTop: vs(2) }}>
                "Số lượng"
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={[layout.row, { columnGap: hs(8) }]}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#6B7280', fontSize: ms(10) }}>
                Ngày học nhiều nhất
              </Text>
              <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700', marginTop: vs(2) }}>
                "Số lượng"
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#6B7280', fontSize: ms(10) }}>
                Chuỗi ngày dài nhất
              </Text>
              <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700', marginTop: vs(2) }}>
                "Số lượng"
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
