import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, hs, vs, ms } from '@/theme';

export function LearningTimeCard() {
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
        {/* Header */}
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
          <View
            style={{
              backgroundColor: '#DFF0FE',
              borderRadius: ms(21),
              height: vs(42),
              width: hs(42),
            }}
          />
          <Text
            style={{
              color: '#000000',
              fontSize: ms(16),
              fontWeight: '700',
              marginLeft: hs(12),
            }}
          >
            Thời gian học
          </Text>
        </View>

        {/* Grid Tiles */}
        <View style={{ rowGap: vs(8) }}>
          {/* Row 1 */}
          <View style={[layout.row, { columnGap: hs(8) }]}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(12),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>
                "Số lượng"
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), marginTop: vs(2), fontWeight: '800' }}>
                Hôm nay
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(12),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>
                "Số lượng"
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), marginTop: vs(2), fontWeight: '800' }}>
                7 ngày qua
              </Text>
            </View>
          </View>

          {/* Row 2 - Full Width */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#F5F6F8',
              borderRadius: ms(10),
              paddingVertical: vs(12),
            }}
          >
            <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>
              "Số lượng"
            </Text>
            <Text style={{ color: '#000000', fontSize: ms(16), marginTop: vs(2), fontWeight: '800' }}>
              Tổng cộng
            </Text>
          </View>
        </View>

        {/* Info Note */}
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginTop: vs(14),
          }}
        >
          <Svg
            height="14"
            style={{ marginRight: hs(6), marginTop: vs(2) }}
            viewBox="0 0 24 24"
            width="14"
          >
            <Path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="#6B7280"
            />
          </Svg>
          <Text
            style={{
              color: '#4B5563',
              flex: 1,
              fontSize: ms(12),
              lineHeight: ms(16),
            }}
          >
            Chỉ tính lúc bạn thực sự đang học: ôn tập, bài học, chép chính tả và luyện gõ. Tab ẩn hoặc ngồi không quá 1 phút thì đồng hồ tự dừng.
          </Text>
        </View>
      </View>
    </View>
  );
}
