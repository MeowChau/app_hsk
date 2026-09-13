import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms, useTheme } from '@/theme';

interface ContinueLearningCardProps {
  onContinue: () => void;
}

export const ContinueLearningCard = ({ onContinue }: ContinueLearningCardProps) => {
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
        {/* Card Title */}
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#DFF3FF',
              borderRadius: ms(21),
              height: vs(42),
              justifyContent: 'center',
              width: hs(42),
            }}
          >
            <Svg height="22" viewBox="6 4 14 16" width="22">
              <Path
                d="M8 6.82v10.36c0 1.54 1.68 2.49 3 1.57l7.4-5.18c1.17-.82 1.17-2.54 0-3.36l-7.4-5.18c-1.32-.92-3 .03-3 1.57z"
                fill="#1F4086"
              />
            </Svg>
          </View>
          <Text
            style={{
              color: '#111827',
              fontSize: ms(16),
              fontWeight: '700',
              marginLeft: hs(12),
            }}
          >
            Tiếp tục học
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onContinue}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#1F4086',
            borderRadius: ms(999),
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: vs(16),
            width: '90%',
          }}
        >
          <Svg height="18" style={{ marginRight: hs(8), marginTop: vs(1) }} viewBox="6 4 14 16" width="18">
            <Path
              d="M8 6.82v10.36c0 1.54 1.68 2.49 3 1.57l7.4-5.18c1.17-.82 1.17-2.54 0-3.36l-7.4-5.18c-1.32-.92-3 .03-3 1.57z"
              fill="#FFFFFF"
            />
          </Svg>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: ms(18),
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            BẮT ĐẦU HỌC
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
