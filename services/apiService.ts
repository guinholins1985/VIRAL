import { User, Video, RewardTransaction, WithdrawalRequest, AdminDashboardData, AdsenseConfig, AppSettings, RewardConfig, VimeoVideoMetadata } from '../types';
import { MOCK_USERS, MOCK_VIDEOS, MOCK_ADMIN_DASHBOARD_DATA, MOCK_WITHDRAWAL_REQUESTS, ADSENSE_MOCK_DATA, MOCK_APP_SETTINGS, REWARD_PER_VIDEO, MIN_WATCH_TIME_SECONDS, VIDEOS_PER_PAGE } from '../constants';

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
    preferences: [], // Re-enabled
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

// Renamed from getVideos to getAllVideos for clarity (used by admin for full list)
export const getAllVideos = async (): Promise<Video[]> => {
  await delay(300);
  const videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  return videos;
};

// New function for paginated video fetching (used by App for infinite scroll)
// Added isInitialLoad parameter for optimization
export const getPaginatedVideos = async (offset: number, limit: number, isInitialLoad: boolean = false): Promise<{ videos: Video[], total: number }> => {
  await delay(isInitialLoad ? 50 : 300); // Faster delay for initial load, longer for subsequent
  const allVideos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');
  const activeVideos = allVideos.filter(video => video.isActive);
  const paginatedVideos = activeVideos.slice(offset, offset + limit);
  return { videos: paginatedVideos, total: activeVideos.length };
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
    // Simulate average watch time increase based on minWatchTime for reward, capped by video duration
    videos[videoIndex].averageWatchTime = Math.min(videos[videoIndex].averageWatchTime + minWatchTime, videos[videoIndex].duration); 

    localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
    localStorage.setItem(localStorageVideosKey, JSON.stringify(videos));
    // Important: Update currentUser in localStorage to reflect new balance immediately for global state consistency
    localStorage.setItem(localStorageKey, JSON.stringify(users[userIndex])); 
    return users[userIndex];
  }
  return null;
};

// Re-enabled updateUserPreferences
export const updateUserPreferences = async (userId: string, preferences: string[]): Promise<User | null> => {
  await delay(200);
  let users: User[] = JSON.parse(localStorage.getItem(localStorageUsersKey) || '[]');
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].preferences = preferences;
    localStorage.setItem(localStorageUsersKey, JSON.stringify(users));
    
    // Also update currentUser in localStorage if it's the current active user
    const currentUserString = localStorage.getItem(localStorageKey);
    if (currentUserString) {
      const currentLoggedInUser: User = JSON.parse(currentUserString);
      if (currentLoggedInUser.id === userId) {
        localStorage.setItem(localStorageKey, JSON.stringify(users[userIndex]));
      }
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
    
    // Update currentUser in localStorage if the currently logged-in user's data was modified
    const currentUserString = localStorage.getItem(localStorageKey);
    if (currentUserString) {
      const currentLoggedInUser: User = JSON.parse(currentUserString);
      if (currentLoggedInUser.id === updatedUser.id) {
        localStorage.setItem(localStorageKey, JSON.stringify(users[index]));
      }
    }
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
  // If the deleted user was the currently logged-in user, clear session
  if (localStorage.getItem(localStorageKey) && JSON.parse(localStorage.getItem(localStorageKey)!).id === userId) {
    localStorage.removeItem(localStorageKey);
  }
  return users.length < initialLength;
};

// Updated addVideo to enforce source type
export const addVideo = async (video: Omit<Video, 'id' | 'views' | 'averageWatchTime' | 'likes'> & { source: 'vimeo' | 'internal' }): Promise<Video> => {
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
             // Also update currentUser in localStorage if the affected user is the currently logged-in user
            const currentUserString = localStorage.getItem(localStorageKey);
            if (currentUserString) {
              const currentLoggedInUser: User = JSON.parse(currentUserString);
              if (currentLoggedInUser.id === users[userIndex].id) {
                localStorage.setItem(localStorageKey, JSON.stringify(users[userIndex]));
              }
            }
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

/**
 * Helper function para simular a geração de uma lista consistente de vídeos Vimeo
 * para um dado ID de usuário.
 * Esta função simula a "extração de todos os vídeos" de uma conta Vimeo.
 * Gera entre 50 e 60 vídeos mockados únicos.
 * @param userId O ID do usuário Vimeo para o qual gerar vídeos.
 * @returns Uma lista de vídeos mockados.
 */
const generateMockVimeoVideosForUser = (userId: string): Video[] => {
  const seed = parseInt(userId) || 12345; // Usar userId como seed para geração consistente
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Gerador pseudo-aleatório simples para resultados consistentes baseados no seed
  let s = seed;
  const seededRandom = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const numVideos = rand(50, 60); // Gerar entre 50 e 60 vídeos para simular "todos os vídeos"
  const videos: Video[] = [];
  for (let i = 1; i <= numVideos; i++) {
    const videoVimeoId = `${Math.floor(seededRandom() * 900000000) + 100000000}`; // ID aleatório de 9 dígitos estilo Vimeo
    videos.push({
      id: `v_vimeo_sync_${userId}_${videoVimeoId}`,
      title: `Vimeo de ${userId}: Vídeo Automatizado #${i}`,
      thumbnail: `https://i.vimeocdn.com/video/${videoVimeoId}_295x166.jpg`, // Formato de thumbnail mock do Vimeo
      duration: rand(120, 600), // 2-10 minutos
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

/**
 * Simula a sincronização automática de uma conta Vimeo.
 * Esta função "extrai todos os vídeos da conta sincronizada Vimeo" e os "salva todos"
 * sobrescrevendo completamente a lista existente de vídeos no sistema com os vídeos Vimeo mockados.
 * Isso garante que APENAS os vídeos da conta Vimeo sincronizada estejam presentes.
 * @param vimeoUserId O ID do usuário Vimeo.
 * @returns Uma promessa que resolve para true se a sincronização for bem-sucedida.
 */
export const syncVimeoAccount = async (vimeoUserId?: string): Promise<boolean> => {
  await delay(500); // Reduced delay for faster perceived sync
  console.log('Tentando sincronizar conta Vimeo (automático) com ID de usuário:', vimeoUserId);

  if (!vimeoUserId) {
    console.error('Falha na sincronização da conta Vimeo (mock): ID de usuário Vimeo não fornecido.');
    throw new Error('ID de usuário Vimeo não fornecido.');
  }

  const newVimeoVideos = generateMockVimeoVideosForUser(vimeoUserId);

  // Sobrescreve a lista COMPLETA de vídeos no localStorage SOMENTE com os vídeos Vimeo recém-gerados.
  // Isso atende ao requisito "exclui definitivamente videos do youtube, ... adiciona apenas videos da conta vimeo"
  localStorage.setItem(localStorageVideosKey, JSON.stringify(newVimeoVideos));
  
  console.log(`Conta Vimeo para o usuário ${vimeoUserId} sincronizada (automática) com sucesso (mock)! ${newVimeoVideos.length} vídeos adicionados.`);
  return true;
};

/**
 * Simula a busca de metadados de vídeos de um usuário Vimeo para pré-visualização.
 * Esta função também "extrai todos os vídeos" da conta sincronizada (mockados).
 * @param vimeoUserId O ID do usuário Vimeo.
 * @returns Uma promessa que resolve para uma lista de metadados de vídeos Vimeo.
 */
export const fetchVimeoUserVideos = async (vimeoUserId: string): Promise<VimeoVideoMetadata[]> => {
  await delay(300); // Reduced delay for faster perceived fetch
  console.log('Buscando vídeos Vimeo para pré-visualização com ID de usuário:', vimeoUserId);

  if (!vimeoUserId) {
    console.error('Falha ao buscar vídeos Vimeo (mock): ID de usuário Vimeo não fornecido.');
    throw new Error('ID de usuário Vimeo não fornecido.');
  }

  const mockVideos = generateMockVimeoVideosForUser(vimeoUserId); // Usar o mesmo gerador para consistência
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

/**
 * Adiciona um único vídeo Vimeo manualmente à lista de vídeos.
 * Aplica a política de exclusividade "apenas vídeos Vimeo", filtrando outros tipos de vídeo.
 * @param videoMetadata Metadados do vídeo Vimeo a ser adicionado.
 * @returns Uma promessa que resolve para o vídeo adicionado.
 */
export const addSingleVimeoVideo = async (videoMetadata: VimeoVideoMetadata): Promise<Video> => {
  await delay(500); // Simula chamada de API
  console.log('Adicionando vídeo Vimeo manualmente:', videoMetadata.title);

  let videos: Video[] = JSON.parse(localStorage.getItem(localStorageVideosKey) || '[]');

  // Aplica a política "apenas Vimeo": filtra todos os vídeos que NÃO são Vimeo.
  // Isso atende ao requisito "exclui definitivamente videos do youtube, ... adiciona apenas videos da conta vimeo"
  videos = videos.filter(v => v.source === 'vimeo'); // Mantém apenas vídeos Vimeo existentes

  // Previne adição de duplicatas
  if (videos.some(v => v.url === videoMetadata.url)) {
    console.warn(`Vídeo ${videoMetadata.title} já existe. Não foi adicionado novamente.`);
    throw new Error(`Vídeo "${videoMetadata.title}" já existe na lista.`);
  }

  const newVideo: Video = {
    id: `v_${Date.now()}_${videoMetadata.id}`, // Garante ID único
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