export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  isActive: boolean;
  isAdmin: boolean;
  preferences: string[];
  password?: string; // Only for mock purposes, not for real apps
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  source: 'youtube' | 'vimeo' | 'internal';
  url: string;
  views: number;
  averageWatchTime: number; // in seconds
  likes: number;
  isActive: boolean;
  uploadDate?: string;
  category?: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  videoId?: string;
  amount: number;
  type: 'watch' | 'invite' | 'withdrawal' | 'bonus';
  date: string;
  description?: string;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  userId: string;
  amount: number;
  method: 'PIX' | 'MercadoPago' | 'PagBank' | 'Saldo Virtual';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
}

export interface ChartDataPoint {
  date?: string;
  week?: string;
  month?: string;
  users?: number;
  videos?: number;
  revenue?: number;
  clicks?: number;
  impressions?: number;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalVideosWatched: number;
  totalPendingPayout: number;
  dailyGrowth: ChartDataPoint[];
  weeklyGrowth: ChartDataPoint[];
  monthlyGrowth: ChartDataPoint[];
  activeUsers: number;
}

export interface AdBlock {
  id: string;
  name: string;
  code: string;
  active: boolean;
  placement: string;
}

export interface AdsenseConfig {
  adsenseId: string;
  verificationCodes: string[]; // Changed to array for multiple codes
  adBlocks: AdBlock[];
  revenueReports: ChartDataPoint[];
}

export interface AppSettings {
  appName: string;
  appLogoUrl: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  youtubeApiKey: string;
  vimeoApiKey: string;
  geminiApiKey: string;
  vimeoAccessToken?: string; // Added for Vimeo sync
}

export interface RewardConfig {
  rewardPerVideo: number;
  minWatchTimeSeconds: number;
}