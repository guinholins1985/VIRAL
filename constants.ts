// Replace with your actual Gemini API Key from environment variables
// For local development, you might set it in your .env file
export const GEMINI_API_KEY: string = process.env.API_KEY || 'YOUR_GEMINI_API_KEY';

export const REWARD_PER_VIDEO: number = 0.10; // Value in virtual currency
export const MIN_WATCH_TIME_SECONDS: number = 30; // Minimum time in seconds to watch a video for rewards

export const YOUTUBE_API_KEY: string = 'YOUR_YOUTUBE_API_KEY'; // Placeholder
export const VIMEO_API_KEY: string = 'YOUR_VIMEO_API_KEY'; // Placeholder

export const MOCK_USERS = [
  {
    id: 'user_123',
    name: 'Alice Smith',
    email: 'alice@example.com',
    balance: 15.50,
    isActive: true,
    isAdmin: false,
    preferences: ['comedy', 'tutorials'],
    password: 'password123'
  },
  {
    id: 'user_456',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    balance: 7.25,
    isActive: true,
    isAdmin: false,
    preferences: ['gaming', 'music'],
    password: 'password123'
  },
  {
    id: 'admin_789',
    name: 'Admin User',
    email: 'ad@cashviral.com', // Updated admin email
    balance: 0.00,
    isActive: true,
    isAdmin: true,
    preferences: [],
    password: 'a12' // Updated admin password
  },
];

export const MOCK_VIDEOS = [
  {
    id: 'v_youtube_intro',
    title: 'Introdução ao CASHVIRAL',
    thumbnail: 'https://picsum.photos/320/180?random=intro',
    duration: 180, // seconds
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=intro_cashviral', // Placeholder
    views: 500,
    averageWatchTime: 120,
    likes: 25,
    isActive: true,
  },
  {
    id: 'v_vimeo_example',
    title: 'Exemplo de Vídeo Vimeo',
    thumbnail: 'https://picsum.photos/320/180?random=vimeo',
    duration: 240,
    source: 'vimeo',
    url: 'https://vimeo.com/example_video_id', // Placeholder
    views: 300,
    averageWatchTime: 150,
    likes: 15,
    isActive: true,
  },
];

export const MOCK_ADMIN_DASHBOARD_DATA = {
  totalUsers: 1500,
  totalVideosWatched: 250000,
  totalPendingPayout: 1250.75,
  dailyGrowth: [
    { date: 'Seg', users: 10, videos: 500 },
    { date: 'Ter', users: 15, videos: 750 },
    { date: 'Qua', users: 12, videos: 600 },
    { date: 'Qui', users: 20, videos: 1000 },
    { date: 'Sex', users: 18, videos: 900 },
    { date: 'Sáb', users: 25, videos: 1200 },
    { date: 'Dom', users: 30, videos: 1500 },
  ],
  weeklyGrowth: [
    { week: 'Sem 1', users: 100, videos: 5000 },
    { week: 'Sem 2', users: 120, videos: 6000 },
    { week: 'Sem 3', users: 150, videos: 7500 },
    { week: 'Sem 4', users: 180, videos: 9000 },
  ],
  monthlyGrowth: [
    { month: 'Jan', users: 300, videos: 15000 },
    { month: 'Fev', users: 350, videos: 17500 },
    { month: 'Mar', users: 400, videos: 20000 },
  ],
  activeUsers: 850,
};

export const MOCK_WITHDRAWAL_REQUESTS = [
  {
    id: 'w_1',
    userId: 'user_123',
    userName: 'Alice Smith',
    amount: 10.00,
    method: 'PIX',
    status: 'pending',
    requestDate: '2024-07-20T10:00:00Z',
  },
  {
    id: 'w_2',
    userId: 'user_456',
    userName: 'Bob Johnson',
    amount: 5.00,
    method: 'MercadoPago',
    status: 'approved',
    requestDate: '2024-07-19T15:30:00Z',
  },
];

export const MOCK_INVITE_BONUS_CONFIG = {
  bonusPerInvite: 0.50,
  minInviteeWatchTime: 600, // 10 minutes
};

// Updated AD_PLACEMENT_OPTIONS to include Portuguese labels
export const AD_PLACEMENT_OPTIONS = [
  { value: 'video-feed', label: 'Feed de Vídeos' },
  { value: 'video-player-pre-roll', label: 'Player de Vídeo (Pré-vídeo)' },
  { value: 'video-player-mid-roll', label: 'Player de Vídeo (Meio do vídeo)' },
  { value: 'video-player-post-roll', label: 'Player de Vídeo (Pós-vídeo)' },
  { value: 'user-profile-sidebar', label: 'Barra Lateral do Perfil do Usuário' },
  { value: 'rewards-page-banner', label: 'Banner da Página de Recompensas' },
  { value: 'footer', label: 'Rodapé' },
  { value: 'header', label: 'Cabeçalho' },
  { value: 'global-pop-up', label: 'Pop-up Global' },
];

export const ADSENSE_MOCK_DATA = {
  adsenseId: 'ca-pub-8115686562988147', // Updated to match the AdSense client ID
  verificationCodes: ['<meta name="google-adsense-account" content="ca-pub-8115686562988147">'], // Example using the correct pub-ID
  adBlocks: [], // Revertido para array vazio
  revenueReports: [
    { date: '2024-07-01', revenue: 12.34, clicks: 120, impressions: 5000 },
    { date: '2024-07-02', revenue: 15.67, clicks: 150, impressions: 6000 },
    { date: '2024-07-03', revenue: 10.00, clicks: 90, impressions: 4500 },
  ],
};

export const MOCK_APP_SETTINGS = {
  appName: 'CASHVIRAL',
  appLogoUrl: 'https://picsum.photos/50/50?random=logo',
  privacyPolicyUrl: '#',
  termsOfServiceUrl: '#',
  youtubeApiKey: YOUTUBE_API_KEY,
  vimeoApiKey: VIMEO_API_KEY,
  geminiApiKey: GEMINI_API_KEY,
  // vimeoAccessToken: 'YOUR_VIMEO_ACCESS_TOKEN', // Removed as per request
  vimeoUserId: '250829792', // Added for Vimeo sync
};