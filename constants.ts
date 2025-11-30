// Replace with your actual Gemini API Key from environment variables
// For local development, you might set it in your .env file
export const GEMINI_API_KEY: string = process.env.API_KEY || 'YOUR_GEMINI_API_KEY';

export const REWARD_PER_VIDEO: number = 0.10; // Value in virtual currency
export const MIN_WATCH_TIME_SECONDS: number = 30; // Minimum time in seconds to watch a video for rewards
export const VIDEOS_PER_PAGE: number = 5; // Number of videos to load per page for infinite scroll

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
  // Removed all YouTube videos from initial mock data
  {
    id: 'v_vimeo_initial',
    title: 'Vimeo: Beautiful Nature Scene',
    thumbnail: 'https://i.vimeocdn.com/video/76979871_295x166.jpg', // Example Vimeo ID
    duration: 240,
    source: 'vimeo',
    url: 'https://vimeo.com/76979871', 
    views: 100,
    averageWatchTime: 100,
    likes: 10,
    isActive: true,
    category: 'nature',
  },
  {
    id: 'v_internal_tutorial',
    title: 'Tutorial Interno: Como Usar CASHVIRAL',
    thumbnail: 'https://picsum.photos/320/180?random=internal_tutorial',
    duration: 300,
    source: 'internal',
    url: 'https://cashviral.com/internal/tutorial-1',
    views: 50,
    averageWatchTime: 200,
    likes: 5,
    isActive: true,
    category: 'tutoriais',
  },
  // Adding 20 viral and funny videos
  {
    id: 'v_funny_cat_compilation_1',
    title: 'Gatos Engraçados: Compilação Viral #1',
    thumbnail: 'https://picsum.photos/320/180?random=cat1',
    duration: 180,
    source: 'vimeo',
    url: 'https://vimeo.com/811568656',
    views: 120000, averageWatchTime: 150, likes: 8000, isActive: true, category: 'humor',
  },
  {
    id: 'v_epic_fail_moment_2',
    title: 'Momentos Épicos de Falha (Viral)',
    thumbnail: 'https://picsum.photos/320/180?random=fail2',
    duration: 220,
    source: 'vimeo',
    url: 'https://vimeo.com/811568657',
    views: 95000, averageWatchTime: 180, likes: 6000, isActive: true, category: 'humor',
  },
  {
    id: 'v_baby_laugh_challenge_3',
    title: 'Desafio do Bebê Rindo: Impossível Não Rir',
    thumbnail: 'https://picsum.photos/320/180?random=baby3',
    duration: 150,
    source: 'vimeo',
    url: 'https://vimeo.com/811568658',
    views: 150000, averageWatchTime: 120, likes: 10000, isActive: true, category: 'humor',
  },
  {
    id: 'v_dog_talent_show_4',
    title: 'Show de Talentos Canino (Incrível e Engraçado)',
    thumbnail: 'https://picsum.photos/320/180?random=dog4',
    duration: 280,
    source: 'vimeo',
    url: 'https://vimeo.com/811568659',
    views: 80000, averageWatchTime: 200, likes: 4500, isActive: true, category: 'animais',
  },
  {
    id: 'v_prank_gone_wrong_5',
    title: 'Pegadinhas que Deram Errado (Risada Garantida)',
    thumbnail: 'https://picsum.photos/320/180?random=prank5',
    duration: 300,
    source: 'vimeo',
    url: 'https://vimeo.com/811568660',
    views: 110000, averageWatchTime: 250, likes: 7000, isActive: true, category: 'humor',
  },
  {
    id: 'v_funny_commercials_6',
    title: 'Comerciais Mais Engraçados do Mundo',
    thumbnail: 'https://picsum.photos/320/180?random=commercial6',
    duration: 210,
    source: 'vimeo',
    url: 'https://vimeo.com/811568661',
    views: 60000, averageWatchTime: 180, likes: 3000, isActive: true, category: 'humor',
  },
  {
    id: 'v_kids_say_funny_things_7',
    title: 'Crianças Dizendo Coisas Hilárias (Viral)',
    thumbnail: 'https://picsum.photos/320/180?random=kids7',
    duration: 190,
    source: 'vimeo',
    url: 'https://vimeo.com/811568662',
    views: 130000, averageWatchTime: 160, likes: 9000, isActive: true, category: 'humor',
  },
  {
    id: 'v_try_not_to_laugh_8',
    title: 'Tente Não Rir: Desafio Impossível!',
    thumbnail: 'https://picsum.photos/320/180?random=laugh8',
    duration: 320,
    source: 'vimeo',
    url: 'https://vimeo.com/811568663',
    views: 180000, averageWatchTime: 280, likes: 12000, isActive: true, category: 'desafio',
  },
  {
    id: 'v_animal_shenanigans_9',
    title: 'Travessuras de Animais Fofos e Engraçados',
    thumbnail: 'https://picsum.photos/320/180?random=animal9',
    duration: 250,
    source: 'vimeo',
    url: 'https://vimeo.com/811568664',
    views: 70000, averageWatchTime: 190, likes: 4000, isActive: true, category: 'animais',
  },
  {
    id: 'v_epic_sports_fails_10',
    title: 'Falhas Épicas no Esporte: Viralizou!',
    thumbnail: 'https://picsum.photos/320/180?random=sports10',
    duration: 200,
    source: 'vimeo',
    url: 'https://vimeo.com/811568665',
    views: 90000, averageWatchTime: 170, likes: 5500, isActive: true, category: 'esportes',
  },
  {
    id: 'v_cooking_disasters_11',
    title: 'Desastres na Cozinha Mais Engraçados',
    thumbnail: 'https://picsum.photos/320/180?random=cooking11',
    duration: 160,
    source: 'vimeo',
    url: 'https://vimeo.com/811568666',
    views: 40000, averageWatchTime: 100, likes: 2000, isActive: true, category: 'humor',
  },
  {
    id: 'v_ultimate_memes_comp_12',
    title: 'Melhores Memes de Todos os Tempos (Compilação)',
    thumbnail: 'https://picsum.photos/320/180?random=meme12',
    duration: 290,
    source: 'vimeo',
    url: 'https://vimeo.com/811568667',
    views: 160000, averageWatchTime: 250, likes: 11000, isActive: true, category: 'memes',
  },
  {
    id: 'v_hilarious_teachers_13',
    title: 'Professores Engraçados em Ação',
    thumbnail: 'https://picsum.photos/320/180?random=teacher13',
    duration: 170,
    source: 'vimeo',
    url: 'https://vimeo.com/811568668',
    views: 55000, averageWatchTime: 140, likes: 2800, isActive: true, category: 'humor',
  },
  {
    id: 'v_street_interview_jokes_14',
    title: 'Entrevistas de Rua Mais Engraçadas',
    thumbnail: 'https://picsum.photos/320/180?random=interview14',
    duration: 230,
    source: 'vimeo',
    url: 'https://vimeo.com/811568669',
    views: 75000, averageWatchTime: 190, likes: 4200, isActive: true, category: 'humor',
  },
  {
    id: 'v_extreme_challenges_15',
    title: 'Desafios Extremos (Você Acredita?)',
    thumbnail: 'https://picsum.photos/320/180?random=challenge15',
    duration: 350,
    source: 'vimeo',
    url: 'https://vimeo.com/811568670',
    views: 100000, averageWatchTime: 280, likes: 6500, isActive: true, category: 'desafio',
  },
  {
    id: 'v_pet_vs_owner_16',
    title: 'Animais de Estimação vs. Donos (Batalha Engraçada)',
    thumbnail: 'https://picsum.photos/320/180?random=pet16',
    duration: 260,
    source: 'vimeo',
    url: 'https://vimeo.com/811568671',
    views: 85000, averageWatchTime: 210, likes: 5000, isActive: true, category: 'animais',
  },
  {
    id: 'v_dance_battle_fails_17',
    title: 'Batalhas de Dança que Falharam Miseravelmente',
    thumbnail: 'https://picsum.photos/320/180?random=dance17',
    duration: 190,
    source: 'vimeo',
    url: 'https://vimeo.com/811568672',
    views: 65000, averageWatchTime: 160, likes: 3500, isActive: true, category: 'humor',
  },
  {
    id: 'v_reaction_videos_18',
    title: 'Reações Hilárias a Vídeos Virais',
    thumbnail: 'https://picsum.photos/320/180?random=reaction18',
    duration: 240,
    source: 'vimeo',
    url: 'https://vimeo.com/811568673',
    views: 72000, averageWatchTime: 180, likes: 4100, isActive: true, category: 'memes',
  },
  {
    id: 'v_magic_trick_fails_19',
    title: 'Truques de Mágica que Deram Errado',
    thumbnail: 'https://picsum.photos/320/180?random=magic19',
    duration: 170,
    source: 'vimeo',
    url: 'https://vimeo.com/811568674',
    views: 48000, averageWatchTime: 120, likes: 2500, isActive: true, category: 'humor',
  },
  {
    id: 'v_ultimate_compilation_20',
    title: 'A Compilação Mais Engraçada da Internet!',
    thumbnail: 'https://picsum.photos/320/180?random=compilation20',
    duration: 380,
    source: 'vimeo',
    url: 'https://vimeo.com/811568675',
    views: 200000, averageWatchTime: 300, likes: 15000, isActive: true, category: 'humor',
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
  vimeoApiKey: VIMEO_API_KEY,
  geminiApiKey: GEMINI_API_KEY,
  vimeoUserId: '250829792', // Added for Vimeo sync
};