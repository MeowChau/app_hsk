import { Paths } from './paths';

export const TAB_ITEMS = {
  [Paths.Home]: { icon: 'home', label: 'Trang chủ' },
  [Paths.Learn]: { icon: 'learn', label: 'Học tập' },
  [Paths.Game]: { icon: 'game', label: 'Trò chơi PK' },
  [Paths.Statistics]: { icon: 'stats', label: 'Thống kê' },
  [Paths.Profile]: { icon: 'profile', label: 'Tài khoản' },
} as const;
