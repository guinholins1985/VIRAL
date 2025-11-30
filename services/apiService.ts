import { User, Video, RewardTransaction, WithdrawalRequest, AdminDashboardData, AdsenseConfig, AppSettings, RewardConfig, VimeoVideoMetadata } from '../types';
import { MOCK_USERS, MOCK_VIDEOS, MOCK_ADMIN_DASHBOARD_DATA, MOCK_WITHDRAWAL_REQUESTS, ADSENSE_MOCK_DATA, MOCK_APP_SETTINGS, REWARD_PER_VIDEO, MIN_WATCH_TIME_SECONDS } from '../constants';

const localStorageKey = 'currentUser';
const localStorageUsersKey = 'allUsers';
const localStorageVideosKey = 'allVideos';
const localStorageWithdrawalsKey = 'allWithdrawals';
const localStorageRewardConfigKey = 'rewardConfig';
const localStorageAdsenseConfigKey = 'adsenseConfig';
const localStorageAppSettingsKey = 'appSettings'; // Moved declaration here

// Initialize mock data in localStorage if not present
if (!localStorage.getItem(localStorageUsersKey)) {
  localStorage.setItem(localStorageUsersKey, JSON.stringify(MOCK_USERS));
}
if (!localStorage.getItem(localStorageVideosKey)) {
  localStorage.setItem(localStorageVideosKey, JSON.stringify(MOCK_VIDEOS));
}
if (!localStorage.getItem(localStorageWithdrawalsKey)) {
  localStorage.setItem(localStorageWithdrawalsKey, JSON.stringify(MOCK_WITHDRAWAL_REQUESTS));
}
if (!localStorage.getItem(localStorageRewardConfigKey)) {
  localStorage.setItem(localStorageRewardConfigKey, JSON.stringify({
    rewardPerVideo: REWARD_PER_VIDEO,
    minWatchTimeSeconds: MIN_WATCH_TIME_SECONDS,
  }));
}
if (!localStorage.getItem(localStorageAdsenseConfigKey)) {
  localStorage.setItem(localStorageAdsenseConfigKey, JSON.stringify(ADSENSE_MOCK_DATA));
}
if (!localStorage.getItem(localStorageAppSettingsKey)) {
  localStorage.setItem(localStorageAppSettingsKey, JSON.stringify(MOCK_APP_SETTINGS));
}


const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getCurrentUser = async (): Promise<User | null> => {
  await delay(200);
  const userString = localStorage.getItem(localStorageKey);
  if (userString) {
    return JSON.parse(userString) as User;
  }
  return null;
};

export const login = async (emailOrUsername: string, password: string): Promise<User | null> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  
  // Try to find user by exact email match
  let user = users.find((u) => u.email === emailOrUsername && u.password === password);

  // If not found by email, try to find by username part of the email
  if (!user) {
    user = users.find((u) => {
      const usernamePart = u.email.split('@')[0];
      return usernamePart === emailOrUsername && u.password === password;
    });
  }

  if (user && user.isActive) {
    localStorage.setItem(localStorageKey, JSON.stringify(user));
    return user;
  }
  return null;
};

export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  if (users.some((u) => u.email === email)) {
    return null; // User already exists
  }
  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    balance: 0,
    isActive: true,
    isAdmin: false,
    preferences: [],
  };
  users.push(newUser);
  localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
  localStorage.setItem(localStorageKey, JSON.stringify(newUser));
  return newUser;
};

export const logout = async (): Promise<void> => {
  await delay(100);
  localStorage.removeItem(localStorageKey);
};

export const getVideos = async (): Promise<Video[]> => {
  await delay(300);
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  return videos.filter(video => video.isActive);
};

export const getVideoById = async (id: string): Promise<Video | null> => {
  await delay(100);
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  return videos.find(video => video.id === id) || null;
};

export const addVideoReward = async (userId: string, videoId: string): Promise<User | null> => {
  await delay(300);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const rewardConfig: RewardConfig = JSON.parse(localStorage.getItem(localStorageRewardConfigKey) || '{}');
  const rewardAmount = rewardConfig.rewardPerVideo; // Use from config
  const minWatchTime = rewardConfig.minWatchTimeSeconds; // Use from config

  const userIndex = users.findIndex((u) => u.id === userId);
  const videoIndex = videos.findIndex((v) => v.id === videoId);

  if (userIndex !== -1 && videoIndex !== -1) {
    users[userIndex].balance = parseFloat((users[userIndex].balance + rewardAmount).toFixed(2));
    videos[videoIndex].views += 1; // Simulate view count increase
    videos[videoIndex].averageWatchTime = Math.min(videos[videoIndex].averageWatchTime + 5, videos[videoIndex].duration); // Simulate watch time increase

    localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
    localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
    localStorage.setItem(localStorageKey, JSON.stringify(users[userIndex])); // Update current user in local storage
    return users[userIndex];
  }
  return null;
};

export const updateUserPreferences = async (userId: string, preferences: string[]): Promise<User | null> => {
  await delay(200);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].preferences = preferences;
    localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
    if (users[userIndex].id === (JSON.parse(localStorage.getItem(localStorageKey) || '{}') as User).id) {
        localStorage.setItem(localStorageKey, JSON.stringify(users[userIndex]));
    }
    return users[userIndex];
  }
  return null;
};


// Admin Panel APIs
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const withdrawals: WithdrawalRequest[] = JSON.parse(localStorage.getItem(localStorageWithdrawalsKey) || '[]');

  const totalUsers = users.length;
  const totalVideosWatched = videos.reduce((sum, v) => sum + v.views, 0);
  const totalPendingPayout = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
  const activeUsers = users.filter(u => u.isActive).length;

  return {
    ...MOCK_ADMIN_DASHBOARD_DATA, // Use mock data for graphs
    totalUsers,
    totalVideosWatched,
    totalPendingPayout,
    activeUsers,
  };
};

export const getAllUsers = async (): Promise<User[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
};

export const updateUserData = async (updatedUser: User): Promise<User | null> => {
  await delay(300);
  let users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser }; // Merge existing with updated
    localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  await delay(300);
  let users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId);
  localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
  return users.length < initialLength;
};

export const getAllVideos = async (): Promise<Video[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
};

export const addVideo = async (video: Omit<Video, 'id' | 'views' | 'averageWatchTime' | 'likes'>): Promise<Video> => {
  await delay(300);
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const newVideo: Video = {
    id: `v_${Date.now()}`,
    views: 0,
    averageWatchTime: 0,
    likes: 0,
    ...video,
  };
  videos.push(newVideo);
  localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
  return newVideo;
};

export const updateVideoData = async (updatedVideo: Video): Promise<Video | null> => {
  await delay(300);
  let videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const index = videos.findIndex(v => v.id === updatedVideo.id);
  if (index !== -1) {
    videos[index] = { ...videos[index], ...updatedVideo };
    localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
    return videos[index];
  }
  return null;
};

export const deleteVideo = async (videoId: string): Promise<boolean> => {
  await delay(300);
  let videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const initialLength = videos.length;
  videos = videos.filter(v => v.id !== videoId);
  localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
  return videos.length < initialLength;
};

export const getRewardConfig = async (): Promise<RewardConfig> => {
  await delay(200);
  return JSON.parse(localStorage.getItem(localStorageRewardConfigKey) || '{}');
};

export const updateRewardConfig = async (config: RewardConfig): Promise<void> => {
  await delay(200);
  localStorage.setItem(localStorageRewardConfigKey, JSON.stringify(config));
};

export const getWithdrawalRequests = async (): Promise<WithdrawalRequest[]> => {
  await delay(300);
  return JSON.parse(localStorage.getItem(localStorageWithdrawalsKey) || '[]');
};

export const updateWithdrawalRequestStatus = async (requestId: string, status: 'approved' | 'rejected'): Promise<WithdrawalRequest | null> => {
  await delay(300);
  let withdrawals: WithdrawalRequest[] = JSON.parse(localStorage.getItem(localStorageWithdrawalsKey) || '[]');
  const index = withdrawals.findIndex(w => w.id === requestId);
  if (index !== -1) {
    withdrawals[index].status = status;
    withdrawals[index].processedDate = new Date().toISOString();

    if (status === 'approved') {
        // Deduct from user's balance
        const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
        const userIndex = users.findIndex(u => u.id === withdrawals[index].userId);
        if (userIndex !== -1) {
            users[userIndex].balance -= withdrawals[index].amount;
            localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
        }
    }

    localStorage.setItem(localStorageWithdrawalsKey, JSON.stringify(withdrawals));
    return withdrawals[index];
  }
  return null;
};

export const createWithdrawalRequest = async (userId: string, amount: number, method: WithdrawalRequest['method']): Promise<WithdrawalRequest> => {
  await delay(300);
  const users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const user = users.find(u => u.id === userId);
  if (!user || user.balance < amount) {
    throw new Error('Saldo insuficiente ou usuário não encontrado.');
  }

  let withdrawals: WithdrawalRequest[] = JSON.parse(localStorage.getItem(localStorageWithdrawalsKey) || '[]');
  const newRequest: WithdrawalRequest = {
    id: `w_${Date.now()}`,
    userId: userId,
    userName: user.name,
    amount: amount,
    method: method,
    status: 'pending',
    requestDate: new Date().toISOString(),
  };
  withdrawals.push(newRequest);
  localStorage.setItem(localStorageWithdrawalsKey, JSON.stringify(withdrawals));
  return newRequest;
};

export const getAdsenseConfig = async (): Promise<AdsenseConfig> => {
  await delay(200);
  return JSON.parse(localStorage.getItem(localStorageAdsenseConfigKey) || '{}');
};

export const updateAdsenseConfig = async (config: AdsenseConfig): Promise<void> => {
  await delay(200);
  localStorage.setItem(localStorageAdsenseConfigKey, JSON.stringify(config));
};

export const getAppSettings = async (): Promise<AppSettings> => {
  await delay(200);
  return JSON.parse(localStorage.getItem(localStorageAppSettingsKey) || '{}');
};

export const updateAppSettings = async (settings: AppSettings): Promise<void> => {
  await delay(200);
  localStorage.setItem(localStorageAppSettingsKey, JSON.stringify(settings));
};

// Helper function to generate a consistent set of mock Vimeo videos for a user
const generateMockVimeoVideosForUser = (userId: string): Video[] => {
  const seed = parseInt(userId) || 12345; // Use userId as a seed for consistent generation
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Use a simple pseudo-random generator for consistent results based on seed
  const seededRandom = (() => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })();

  const numVideos = rand(3, 5); // Generate between 3 and 5 videos
  const videos: Video[] = [];
  for (let i = 1; i <= numVideos; i++) {
    const videoVimeoId = `${Math.floor(seededRandom() * 900000000) + 100000000}`; // Random 9-digit Vimeo-like ID
    videos.push({
      id: `v_vimeo_sync_${userId}_${videoVimeoId}`,
      title: `Vimeo de ${userId}: Vídeo Automatizado #${i}`,
      thumbnail: `https://i.vimeocdn.com/video/${videoVimeoId}_295x166.jpg`, // Mock Vimeo thumbnail format
      duration: rand(120, 600), // 2-10 minutes
      source: 'vimeo',
      url: `https://vimeo.com/${videoVimeoId}`,
      views: rand(100, 5000),
      averageWatchTime: rand(50, 100),
      likes: rand(10, 200),
      isActive: true,
      uploadDate: new Date().toISOString(),
      category: 'Vimeo Sincronizado',
    });
  }
  return videos;
};

export const syncVimeoAccount = async (vimeoUserId?: string): Promise<boolean> => {
  await delay(1500); // Simulate API call
  console.log('Tentando sincronizar conta Vimeo (automático) com ID de usuário:', vimeoUserId);

  if (!vimeoUserId) {
    console.error('Falha na sincronização da conta Vimeo (mock): ID de usuário Vimeo não fornecido.');
    throw new Error('ID de usuário Vimeo não fornecido.');
  }

  const newVimeoVideos = generateMockVimeoVideosForUser(vimeoUserId);

  // Overwrite the entire video list in localStorage with ONLY the newly generated Vimeo videos
  localStorage.setItem(localStorageVideosKey, JSON.stringify(newVimeoVideos));
  
  console.log(`Conta Vimeo para o usuário ${vimeoUserId} sincronizada (automática) com sucesso (mock)! ${newVimeoVideos.length} vídeos adicionados.`);
  return true;
};

export const fetchVimeoUserVideos = async (vimeoUserId: string): Promise<VimeoVideoMetadata[]> => {
  await delay(1000); // Simulate API call
  console.log('Buscando vídeos Vimeo para pré-visualização com ID de usuário:', vimeoUserId);

  if (!vimeoUserId) {
    console.error('Falha ao buscar vídeos Vimeo (mock): ID de usuário Vimeo não fornecido.');
    throw new Error('ID de usuário Vimeo não fornecido.');
  }

  const mockVideos = generateMockVimeoVideosForUser(vimeoUserId); // Use the same generator for consistency
  const metadataList: VimeoVideoMetadata[] = mockVideos.map(v => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    duration: v.duration,
    url: v.url,
  }));

  console.log(`${metadataList.length} vídeos encontrados para pré-visualização para o usuário ${vimeoUserId} (mock).`);
  return metadataList;
};

export const addSingleVimeoVideo = async (videoMetadata: VimeoVideoMetadata): Promise<Video> => {
  await delay(500); // Simulate API call
  console.log('Adicionando vídeo Vimeo manualmente:', videoMetadata.title);

  let videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');

  // Prevent adding duplicates
  if (videos.some(v => v.url === videoMetadata.url)) {
    console.warn(`Vídeo ${videoMetadata.title} já existe. Não foi adicionado novamente.`);
    throw new Error(`Vídeo "${videoMetadata.title}" já existe na lista.`);
  }

  const newVideo: Video = {
    id: `v_${Date.now()}_${videoMetadata.id}`, // Ensure unique ID
    title: videoMetadata.title,
    thumbnail: videoMetadata.thumbnail,
    duration: videoMetadata.duration,
    source: 'vimeo',
    url: videoMetadata.url,
    views: 0,
    averageWatchTime: 0,
    likes: 0,
    isActive: true,
    uploadDate: new Date().toISOString(),
    category: 'Vimeo Adicionado Manualmente',
  };

  videos.push(newVideo);
  localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
  console.log(`Vídeo ${newVideo.title} adicionado manualmente com sucesso.`);
  return newVideo;
};