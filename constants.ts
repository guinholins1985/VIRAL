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
    id: 'v_1',
    title: 'How to Learn React in 5 Minutes',
    thumbnail: 'https://picsum.photos/320/180?random=1',
    duration: 300, // seconds
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder, use a real YouTube link
    views: 1200,
    averageWatchTime: 180,
    likes: 50,
    isActive: true,
  },
  {
    id: 'v_2',
    title: 'Chill Lo-fi Beats for Study/Work',
    thumbnail: 'https://picsum.photos/320/180?random=2',
    duration: 7200,
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', // Placeholder
    views: 5000,
    averageWatchTime: 600,
    likes: 200,
    isActive: true,
  },
  {
    id: 'v_3',
    title: 'Amazing Nature Documentary Scene',
    thumbnail: 'https://picsum.photos/320/180?random=3',
    duration: 120,
    source: 'vimeo',
    url: 'https://vimeo.com/channels/staffpicks/87968434', // Placeholder
    views: 800,
    averageWatchTime: 90,
    likes: 30,
    isActive: true,
  },
  {
    id: 'v_4',
    title: 'Top 10 Gaming Moments of the Year',
    thumbnail: 'https://picsum.photos/320/180?random=4',
    duration: 600,
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=some_gaming_video', // Placeholder
    views: 2500,
    averageWatchTime: 300,
    likes: 150,
    isActive: true,
  },
  {
    id: 'v_5',
    title: 'Cooking Masterclass: Italian Pasta',
    thumbnail: 'https://picsum.photos/320/180?random=5',
    duration: 900,
    source: 'youtube',
    url: 'https://www.youtube.com/watch?v=some_cooking_video', // Placeholder
    views: 1800,
    averageWatchTime: 450,
    likes: 80,
    isActive: true,
  },
  {
    id: 'v_6',
    title: 'Abstract Art Process',
    thumbnail: 'https://picsum.photos/320/180?random=6',
    duration: 450,
    source: 'vimeo',
    url: 'https://vimeo.com/some_art_video', // Placeholder
    views: 400,
    averageWatchTime: 200,
    likes: 15,
    isActive: false, // Example of an inactive video
  },
  {
    id: 'v_vimeo_250829792', // Adjusted ID to match user's previous request context
    title: 'Vimeo: Beautiful Nature Scene',
    thumbnail: 'https://i.vimeocdn.com/video/784158406_1280x720.jpg', // Placeholder thumbnail for the given Vimeo ID
    duration: 180,
    source: 'vimeo',
    url: 'https://vimeo.com/250829792',
    views: 1500,
    averageWatchTime: 100,
    likes: 75,
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
  adBlocks: [
    // Reverted adBlocks to an empty array as the ad display logic is removed.
  ],
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
  vimeoAccessToken: 'YOUR_VIMEO_ACCESS_TOKEN', // Mock access token
  vimeoUserId: '250829792', // Added for Vimeo sync
};