import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { ms, hs, vs } from '@/theme';

interface Props {
  onNext: (answer: string) => void;
}

export const SurveyStep3 = ({ onNext }: Props) => {
  const { width } = useWindowDimensions();
  const imageSize = width * 0.8;
  const [showOtherPicker, setShowOtherPicker] = useState(false);
  
  // Khởi tạo mặc định là 0 giờ 15 phút
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 15, 0, 0);
    return d;
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: hs(24) }}>
      <Image 
        source={require('@/theme/assets/images/survey_3.png')} 
        style={{ width: imageSize, height: imageSize, resizeMode: 'contain', marginBottom: vs(40) }}
      />
      <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(24) }}>
        Mỗi ngày, bạn dự định dành bao nhiêu phút để luyện tập?
      </Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: hs(12), rowGap: vs(12) }}>
        {['15 phút', '30 phút', '45 phút'].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onNext(option)}
            style={{
              paddingHorizontal: hs(20),
              paddingVertical: vs(10),
              borderRadius: ms(20),
              backgroundColor: '#F3F4F6',
            }}
          >
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#374151' }}>{option}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setShowOtherPicker(true)}
          style={{
            paddingHorizontal: hs(20),
            paddingVertical: vs(10),
            borderRadius: ms(20),
            backgroundColor: '#E5E7EB',
          }}
        >
          <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>Khác</Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={showOtherPicker}
        date={date}
        mode="time"
        is24hour={true}
        locale="vi-VN"
        androidVariant="iosClone"
        title="Chọn thời gian luyện tập"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={(selectedDate) => {
          setShowOtherPicker(false);
          setDate(selectedDate);
          const hours = selectedDate.getHours();
          const minutes = selectedDate.getMinutes();
          const totalMinutes = hours * 60 + minutes;
          
          if (totalMinutes === 0) {
            onNext('0 phút');
          } else {
            let str = '';
            if (hours > 0) str += `${hours} giờ `;
            if (minutes > 0) str += `${minutes} phút`;
            onNext(str.trim());
          }
        }}
        onCancel={() => {
          setShowOtherPicker(false);
        }}
      />
    </View>
  );
};
