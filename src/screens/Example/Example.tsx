import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useI18n, useUser } from '@/hooks';
import { useTheme } from '@/theme';
import { InputField, ProgressCard, ProgressTracingCard, SegmentControl, QuestionNumberCard, FlashCard } from '@/components/molecules';

import { AssetByVariant, IconByVariant, Skeleton, Logo, Button, ArrowButton, BackButton } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

const MAX_RANDOM_ID = 9;

function Example() {
  const { t } = useTranslation();
  const { useFetchOneQuery } = useUser();
  const { toggleLanguage } = useI18n();

  const {
    backgrounds,
    changeTheme,
    colors,
    components,
    fonts,
    gutters,
    layout,
    variant,
  } = useTheme();

  const [currentId, setCurrentId] = useState(-1);
  const [viewIndex, setViewIndex] = useState(0);
  const totalViews = 7;
  
  const [segment1Index, setSegment1Index] = useState(2);
  const [segment2Index, setSegment2Index] = useState(0);

  const fetchOneUserQuery = useFetchOneQuery(currentId);

  useEffect(() => {
    if (fetchOneUserQuery.isSuccess) {
      Alert.alert(
        t('screen_example.hello_user', { name: fetchOneUserQuery.data.name }),
      );
    }
  }, [fetchOneUserQuery.isSuccess, fetchOneUserQuery.data, t]);

  const onChangeTheme = () => {
    changeTheme(variant === 'default' ? 'dark' : 'default');
  };

  const handleResetError = () => {
    void fetchOneUserQuery.refetch();
  };

  return (
    <SafeScreen
      isError={fetchOneUserQuery.isError}
      onResetError={() => {
        handleResetError();
      }}
    >
      <ScrollView>
        <View
          style={[
            gutters.marginTop_40,
            gutters.paddingHorizontal_16,
            layout.fullWidth,
          ]}
        >
          <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, gutters.marginBottom_24]}>
            <ArrowButton 
              direction="left" 
              onPress={() => setViewIndex(Math.max(0, viewIndex - 1))} 
              style={{ width: 64, height: 64, opacity: viewIndex === 0 ? 0.3 : 1 }}
            />
            <Text style={[fonts.bold, { fontSize: 18, textAlign: 'center', flex: 1 }]}>Phần {viewIndex + 1} / {totalViews}</Text>
            <ArrowButton 
              direction="right" 
              onPress={() => setViewIndex(Math.min(totalViews - 1, viewIndex + 1))} 
              style={{ width: 64, height: 64, opacity: viewIndex === totalViews - 1 ? 0.3 : 1 }}
            />
          </View>

          {viewIndex === 0 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>1. Các loại Nút bấm & Logo</Text>
              <View style={[layout.row, layout.justifyCenter, gutters.marginBottom_24]}>
                <Logo variant="primary" />
              </View>
              <View style={[layout.row, layout.justifyCenter, gutters.marginBottom_24]}>
                <Logo variant="light" />
              </View>
              <Button title="Login" variant="primary" style={[gutters.marginBottom_16]} />
              <Button title="Register" variant="outline" style={[gutters.marginBottom_16]} />
              <Button title="Edit profile" variant="text" style={[gutters.marginBottom_16]} />
              <Button title="Submit" variant="primary" fullWidth style={[gutters.marginBottom_16]} />
              <View style={[layout.row, { gap: 16 }, gutters.marginBottom_16]}>
                <ArrowButton direction="left" />
                <ArrowButton direction="right" />
                <BackButton />
              </View>
            </View>
          )}

          {viewIndex === 1 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>2. Ô nhập liệu (Input)</Text>
              <InputField iconType="user" placeholder="Name" />
              <InputField iconType="mail" placeholder="Email" />
              <InputField iconType="lock" placeholder="Password" secureTextEntry />
              <InputField iconType="lock" placeholder="Confirm password" secureTextEntry />
            </View>
          )}

          {viewIndex === 2 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>3. Thẻ tiến trình lớn (ProgressCard)</Text>
              <View style={[layout.row, layout.wrap, layout.justifyCenter, { gap: 16 }]}>
                <ProgressCard title="Listening" progress={40} variant="listening" />
                <ProgressCard title="Reading" progress={35} variant="reading" />
                <ProgressCard title="Writing" progress={20} variant="writing" />
                <ProgressCard title="FlashCards" progress={25} variant="flashcards" />
              </View>
            </View>
          )}

          {viewIndex === 3 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>4. Thẻ tiến trình nhỏ (ProgressTracingCard)</Text>
              <View style={[layout.row, layout.wrap, layout.justifyCenter, { gap: 16 }]}>
                <ProgressTracingCard title="reading" subtitle="50\nQuestions" variant="reading" />
                <ProgressTracingCard title="Writing" subtitle="35\nQuestions" variant="writing" />
                <ProgressTracingCard title="flashcards" subtitle="12\nword" variant="flashcards" />
                <ProgressTracingCard title="Listening" subtitle="15\nQuestions" variant="listening" />
              </View>
            </View>
          )}

          {viewIndex === 4 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>5. Thanh chọn Tab (SegmentControl)</Text>
              <SegmentControl
                options={['Vocabulary', 'Mock exams', 'flashcards', 'Past papers']}
                selectedIndex={segment1Index}
                onChange={setSegment1Index}
                variant="default"
              />
              <View style={[gutters.marginTop_24]} />
              <SegmentControl
                options={['Achievements', 'Revision']}
                selectedIndex={segment2Index}
                onChange={setSegment2Index}
                variant="primary"
              />
            </View>
          )}

          {viewIndex === 5 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>6. Thẻ số câu hỏi (QuestionNumberCard)</Text>
              <View style={[layout.row, layout.wrap, layout.justifyCenter, { gap: 8 }]}>
                <QuestionNumberCard number={1} status="active" />
                <QuestionNumberCard number={2} status="default" />
                <QuestionNumberCard number={3} status="correct" />
                <QuestionNumberCard number={4} status="incorrect" />
                <QuestionNumberCard number={5} status="default" />
              </View>
            </View>
          )}

          {viewIndex === 6 && (
            <View>
              <Text style={[fonts.bold, gutters.marginBottom_16]}>7. Thẻ học từ (FlashCard)</Text>
              <View style={[layout.itemsCenter]}>
                <FlashCard
                  character="我"
                  translation="Me"
                  currentIndex={1}
                  totalCards={2}
                />
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default Example;
