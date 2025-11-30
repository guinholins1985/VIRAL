import React, { useState, useEffect } from 'react';
import { Video } from '../../types';
import { getAllVideos, addVideo, updateVideoData, deleteVideo } from '../../services/apiService';
import LoadingSpinner from '../shared/LoadingSpinner';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Modal from '../shared/Modal';
import { PlusCircleIcon, PencilIcon, TrashIcon, PlayIcon, PauseIcon, EyeIcon } from '../icons/HeroIcons';

interface VideoManagementProps {
  refreshVideos: () => Promise<void>; // New prop: callback to trigger global video list refresh
}

const VideoManagement: React.FC<VideoManagementProps> = ({ refreshVideos }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<Video> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Use getAllVideos to get the full list for admin panel
      const fetchedVideos = await getAllVideos(); 
      setVideos(fetchedVideos);
    } catch (err) {
      setError('Falha ao buscar vídeos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideoClick = () => {
    setCurrentVideo({
      title: '',
      url: '',
      thumbnail: '',
      duration: 0,
      source: 'vimeo', // Default source changed from 'youtube' to 'vimeo'
      isActive: true,
    });
    setShowAddModal(true);
  };

  const handleEditVideoClick = (video: Video) => {
    setCurrentVideo({ ...video });
    setShowEditModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentVideo) {
      const { name, value, type } = e.target;
      setCurrentVideo({
        ...currentVideo,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSaveVideo = async () => {
    // Ensure all required fields are filled and source is valid
    if (currentVideo && currentVideo.title && currentVideo.url && currentVideo.thumbnail && currentVideo.duration !== undefined && currentVideo.source && (currentVideo.source === 'vimeo' || currentVideo.source === 'internal')) {
      setLoading(true);
      try {
        if (currentVideo.id) { // Editing existing video
          await updateVideoData(currentVideo as Video);
        } else { // Adding new video
          await addVideo(currentVideo as Omit<Video, 'id' | 'views' | 'averageWatchTime' | 'likes'> & { source: 'vimeo' | 'internal' });
        }
        setShowAddModal(false);
        setShowEditModal(false);
        setCurrentVideo(null);
        fetchVideos(); // Refresh admin's local list
        await refreshVideos(); // Trigger global video list refresh
      } catch (err) {
        setError('Falha ao salvar vídeo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Por favor, preencha todos os campos obrigatórios e selecione uma fonte válida (Vimeo ou Interno).');
    }
  };

  const handleToggleActive = async (video: Video) => {
    setLoading(true);
    try {
      await updateVideoData({ ...video, isActive: !video.isActive });
      fetchVideos(); // Refresh admin's local list
      await refreshVideos(); // Trigger global video list refresh
    } catch (err) {
      setError('Falha ao alterar o status do vídeo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    setShowDeleteModal(true);
  };

  const handleDeleteVideo = async () => {
    if (videoToDelete) {
      setLoading(true);
      try {
        await deleteVideo(videoToDelete);
        fetchVideos(); // Refresh admin's local list
        await refreshVideos(); // Trigger global video list refresh
        setShowDeleteModal(false);
        setVideoToDelete(null);
      } catch (err) {
        setError('Falha ao excluir vídeo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-white">Carregando vídeos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-white text-center lg:text-left">Gerenciar Vídeos</h2>
        <Button onClick={handleAddVideoClick} variant="primary">
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Adicionar Vídeo
        </Button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Miniatura</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fonte</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duração (s)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Visualizações</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {videos.map((video) => (
              <tr key={video.id} className="hover:bg-gray-700 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={video.thumbnail} alt={video.title} className="h-10 w-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white max-w-xs truncate">{video.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{video.source}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{video.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex items-center">
                    <EyeIcon className="h-4 w-4 mr-1" /> {video.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${video.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {video.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditVideoClick(video)} title="Editar">
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleActive(video)} title={video.isActive ? 'Desativar' : 'Ativar'}>
                      {video.isActive ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => confirmDelete(video.id)} title="Excluir">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); setCurrentVideo(null); setError(null); }}
        title={showAddModal ? 'Adicionar Novo Vídeo' : 'Editar Vídeo'}
        onConfirm={handleSaveVideo}
        confirmText="Salvar Vídeo"
      >
        <Input label="Título" id="video-title" name="title" value={currentVideo?.title || ''} onChange={handleChange} error={error ? 'Campo obrigatório' : undefined} />
        <Input label="URL do Vídeo" id="video-url" name="url" value={currentVideo?.url || ''} onChange={handleChange} error={error ? 'Campo obrigatório' : undefined} />
        <Input label="URL da Miniatura" id="video-thumbnail" name="thumbnail" value={currentVideo?.thumbnail || ''} onChange={handleChange} error={error ? 'Campo obrigatório' : undefined} />
        <Input label="Duração (segundos)" id="video-duration" name="duration" type="number" value={currentVideo?.duration || 0} onChange={handleChange} error={error ? 'Campo obrigatório' : undefined} />
        <div className="mb-4">
          <label htmlFor="video-source" className="block text-gray-300 text-sm font-bold mb-2">
            Fonte
          </label>
          <select
            id="video-source"
            name="source"
            value={currentVideo?.source || 'vimeo'} // Default to 'vimeo'
            onChange={handleChange}
            className="shadow border border-gray-600 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
          >
            <option value="vimeo">Vimeo</option>
            <option value="internal">Interno</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="video-active" className="flex items-center text-gray-300 text-sm font-bold mb-2">
            <input
              type="checkbox"
              id="video-active"
              name="isActive"
              checked={currentVideo?.isActive || false}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-600 bg-gray-700"
            />
            Ativo
          </label>
        </div>
        {loading && <LoadingSpinner size="sm" className="mx-auto" />}
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        onConfirm={handleDeleteVideo}
        confirmText="Excluir"
        cancelText="Cancelar"
      >
        <p className="text-gray-300">Tem certeza de que deseja excluir este vídeo? Esta ação é irreversível.</p>
      </Modal>
    </div>
  );
};

export default VideoManagement;