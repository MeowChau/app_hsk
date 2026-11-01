// @refresh reset
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '@/services/auth/useAuth';
import {
  getRecommendedLessons,
  RECOMMENDED_SKILLS,
} from '@/services/education/recommendedLessons';
import type {
  BackendQuestionSkill,
  RecommendedLessonTarget,
} from '@/services/education/types';
import { useTheme, hs, vs, ms } from '@/theme';

interface RecommendedLessonsCardProps {
  onSeeAll: () => void;
  onOpenLesson: (lesson: RecommendedLessonTarget) => void;
}

const SKILL_LABELS = {
  LISTENING: 'Nghe',
  SPEAKING: 'Nói',
  READING: 'Đọc',
  WRITING: 'Viết',
};
const ICON_PATHS = {
  LISTENING: 'M4 14v-3a8 8 0 0 1 16 0v3M4 13H3v7h4v-7H4m16 0h1v7h-4v-7h3',
  SPEAKING:
    'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5m-3 6v1a6 6 0 0 0 12 0v-1m-6 7v4m-4 0h8',
  READING:
    'M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z',
  WRITING: 'm15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14l-1 7 1-1Zm10 2h8',
};
function SkillIcon({
  skill,
  size = 22,
}: {
  skill: BackendQuestionSkill;
  size?: number;
}) {
  return (
    <Svg width={ms(size)} height={ms(size)} viewBox="0 0 24 24" fill="none">
      <Path
        d={ICON_PATHS[skill]}
        stroke="#1F4086"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const RecommendedLessonsCard = ({
  onSeeAll,
  onOpenLesson,
}: RecommendedLessonsCardProps) => {
  const { colors, layout } = useTheme();
  const { data: profile } = useProfile();
  const level = profile?.currentHskLevel || 1;
  const query = useQuery({
    queryKey: ['recommended-lessons', level],
    queryFn: () => getRecommendedLessons(level),
    enabled: Boolean(profile?.id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const { isStale, refetch } = query;
  const userId = profile?.id;
  useFocusEffect(React.useCallback(() => {
    if (userId && isStale) void refetch();
  }, [userId, isStale, refetch]));

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
      <View
        style={[
          layout.row,
          layout.justifyBetween,
          layout.itemsCenter,
          { marginBottom: vs(12) },
        ]}
      >
        <View style={[layout.row, layout.itemsCenter, { flex: 1 }]}>
          <View
            style={{
              backgroundColor: '#DFF0FE',
              borderRadius: ms(21),
              height: ms(42),
              width: ms(42),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SkillIcon skill="READING" size={23} />
          </View>
          <Text
            style={{
              color: '#111827',
              fontSize: ms(16),
              fontWeight: '700',
              marginLeft: hs(12),
              flex: 1,
            }}
          >
            Bài học đề xuất cho bạn
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả bài luyện kỹ năng"
          activeOpacity={0.7}
          onPress={onSeeAll}
          style={{
            minHeight: 48,
            justifyContent: 'center',
            paddingLeft: hs(10),
          }}
        >
          <Text
            style={{ color: '#1F4086', fontSize: ms(13), fontWeight: '700' }}
          >
            Xem tất cả {'>'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ gap: hs(10), flexDirection: 'row', flexWrap: 'wrap' }}>
        {RECOMMENDED_SKILLS.map((skill) => {
          const item = query.data?.find((result) => result.skill === skill);
          const lesson = item?.lesson;
          const failed = item?.failed || query.isError;
          const loading = query.isPending && !failed;
          const title =
            lesson?.title ??
            (failed
              ? 'Chưa tải được bài luyện'
              : loading
                ? 'Đang tìm bài phù hợp…'
                : 'Chưa có bài ở cấp này');
          const details = lesson
            ? `${lesson.count} ${lesson.unit}${lesson.authored ? ' · Biên soạn' : ' luyện tập'}`
            : `Dành cho trình độ HSK ${level}`;
          const action = lesson
            ? 'Luyện ngay'
            : failed
              ? 'Thử tải lại'
              : loading
                ? 'Đang tải…'
                : 'Chọn bài khác';
          return (
            <TouchableOpacity
              key={skill}
              accessibilityRole="button"
              accessibilityLabel={`${SKILL_LABELS[skill]}, HSK ${level}. ${title}. ${details}. ${action}`}
              accessibilityState={{ disabled: loading || (failed && query.isFetching) }}
              disabled={loading || (failed && query.isFetching)}
              activeOpacity={0.8}
              onPress={() => {
                if (lesson) onOpenLesson(lesson);
                else if (failed) void query.refetch();
                else onSeeAll();
              }}
              style={{
                flexBasis: '45%',
                flexGrow: 1,
                minWidth: 0,
                backgroundColor: colors.accentLightBlue,
                borderColor: '#D4E8FC',
                borderRadius: ms(14),
                borderWidth: 1,
                padding: ms(12),
                minHeight: ms(154),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hs(6),
                }}
              >
                <SkillIcon skill={skill} size={20} />
                <Text
                  style={{
                    color: '#1F4086',
                    fontSize: ms(14),
                    fontWeight: '700',
                    flex: 1,
                  }}
                >
                  {SKILL_LABELS[skill]}
                </Text>
                <Text
                  style={{
                    color: '#64748B',
                    fontSize: ms(11),
                    fontWeight: '600',
                  }}
                >
                  HSK {level}
                </Text>
              </View>
              <Text
                style={{
                  color: '#111827',
                  fontSize: ms(14),
                  fontWeight: '600',
                  lineHeight: ms(20),
                  marginTop: vs(10),
                  minHeight: ms(40),
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  color: '#64748B',
                  fontSize: ms(12),
                  lineHeight: ms(18),
                  marginTop: vs(6),
                }}
              >
                {details}
              </Text>
              <View style={{ flex: 1, minHeight: vs(12) }} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: hs(4),
                }}
              >
                <Text
                  style={{
                    color: '#1F4086',
                    fontSize: ms(12),
                    fontWeight: '700',
                  }}
                >
                  {action}
                </Text>
                {!loading ? (
                  <Svg
                    width={ms(14)}
                    height={ms(14)}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <Path
                      d="M5 12h14m-5-5 5 5-5 5"
                      stroke="#1F4086"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
