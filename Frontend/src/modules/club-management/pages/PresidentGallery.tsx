import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Badge, 
  Button, 
  useApp, 
  GalleryAlbum, 
  GalleryMediaItem 
} from '../../common';
import { CreateAlbumModal } from '../components/CreateAlbumModal';
import { UploadMediaModal } from '../components/UploadMediaModal';
import { MediaLightboxModal } from '../components/MediaLightboxModal';
import { 
  FolderPlus, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Layers, 
  Search, 
  Filter, 
  Calendar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PresidentGallery: React.FC = () => {
  const { 
    galleryAlbums, 
    galleryMediaItems, 
    clubs, 
    events, 
    deleteGalleryAlbum, 
    deleteGalleryMedia, 
    restoreGalleryMedia, 
    currentRole 
  } = useApp();

  // Tab & Filter states
  const [activeTab, setActiveTab] = useState<'albums' | 'media' | 'trash'>('albums');
  const [selectedClubId, setSelectedClubId] = useState<string>('All');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'All' | 'image' | 'video'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState<GalleryAlbum | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDefaultAlbumId, setUploadDefaultAlbumId] = useState<string | undefined>(undefined);

  const [selectedLightboxMedia, setSelectedLightboxMedia] = useState<GalleryMediaItem | null>(null);

  // Active items
  const activeMediaItems = galleryMediaItems.filter(m => !m.isDeleted);
  const deletedMediaItems = galleryMediaItems.filter(m => m.isDeleted);

  // Filtered albums
  const filteredAlbums = galleryAlbums.filter(a => {
    const matchesClub = selectedClubId === 'All' ? true : a.clubId === selectedClubId;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClub && matchesSearch;
  });

  // Filtered active media grid
  const filteredMedia = activeMediaItems.filter(m => {
    const matchesClub = selectedClubId === 'All' ? true : m.clubId === selectedClubId;
    const matchesAlbum = selectedAlbumId === 'All' ? true : m.albumId === selectedAlbumId;
    const matchesType = mediaTypeFilter === 'All' ? true : m.type === mediaTypeFilter;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.caption && m.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesClub && matchesAlbum && matchesType && matchesSearch;
  });

  const handleOpenCreateAlbum = () => {
    setAlbumToEdit(null);
    setIsAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (album: GalleryAlbum) => {
    setAlbumToEdit(album);
    setIsAlbumModalOpen(true);
  };

  const handleOpenUploadMedia = (albumId?: string) => {
    setUploadDefaultAlbumId(albumId);
    setIsUploadModalOpen(true);
  };

  const handleNavigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedLightboxMedia) return;
    const currentIndex = filteredMedia.findIndex(m => m.id === selectedLightboxMedia.id);
    if (currentIndex === -1) return;

    if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
      setSelectedLightboxMedia(filteredMedia[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % filteredMedia.length;
      setSelectedLightboxMedia(filteredMedia[nextIndex]);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Media Gallery & Event Albums
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curate photo albums, embed event video recaps, manage cover media, and showcase team memories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenCreateAlbum}
            className="flex items-center gap-1.5 font-bold text-xs"
          >
            <FolderPlus className="h-4 w-4 text-purple-500" /> Create Album
          </Button>

          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleOpenUploadMedia()}
            className="flex items-center gap-1.5 font-bold shadow-md shadow-purple-500/10 bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="h-4 w-4" /> Upload Media
          </Button>
        </div>
      </div>

      {/* Tabs & Search Controls Bar */}
      <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] space-y-3 shadow-sm">
        {/* Mode Tabs */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'albums'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Layers className="h-4 w-4" /> Albums ({galleryAlbums.length})
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'media'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="h-4 w-4" /> All Media ({activeMediaItems.length})
            </button>

            <button
              onClick={() => setActiveTab('trash')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === 'trash'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Trash2 className="h-4 w-4" /> Trash Bin ({deletedMediaItems.length})
            </button>
          </div>

          {/* Club selector filter */}
          <select
            value={selectedClubId}
            onChange={e => setSelectedClubId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Clubs</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search & Type Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search albums or media titles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {activeTab === 'media' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Media Type:</span>
              <select
                value={mediaTypeFilter}
                onChange={e => setMediaTypeFilter(e.target.value as 'All' | 'image' | 'video')}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Types</option>
                <option value="image">Photos Only</option>
                <option value="video">Videos Only</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Rendering depending on Active Tab */}
      {activeTab === 'albums' && (
        <div className="space-y-4">
          {filteredAlbums.length === 0 ? (
            <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/50">
              <CardBody className="py-8 space-y-3">
                <Layers className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Gallery Albums Found</h3>
                <p className="text-xs text-slate-400">Create your first album to organize photos and video recaps.</p>
                <Button variant="primary" size="sm" onClick={handleOpenCreateAlbum} className="mt-2 bg-purple-600 font-bold">
                  <FolderPlus className="h-4 w-4 mr-1" /> Create Album
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map(album => {
                const clubObj = clubs.find(c => c.id === album.clubId);
                const albumMedia = galleryMediaItems.filter(m => m.albumId === album.id && !m.isDeleted);

                return (
                  <Card key={album.id} hoverable={true} className="flex flex-col h-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] overflow-hidden">
                    {/* Cover image header */}
                    <div className="h-44 relative bg-slate-900 overflow-hidden group">
                      <img src={album.coverImage} alt={album.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <Badge variant="neutral" className="bg-black/50 text-white backdrop-blur-md border-transparent py-0.5 px-2 text-[10px]">
                          {albumMedia.length} Media
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">{clubObj?.name}</span>
                        <h3 className="text-sm font-bold font-display truncate">{album.title}</h3>
                      </div>
                    </div>

                    <CardBody className="p-4 space-y-3 flex-grow">
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {album.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Created {album.createdDate}</span>
                        {album.eventId && <span className="text-purple-600 dark:text-purple-400 font-bold">Event Album</span>}
                      </div>
                    </CardBody>

                    <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold flex items-center gap-1"
                        onClick={() => { setSelectedAlbumId(album.id); setActiveTab('media'); }}
                      >
                        <Eye className="h-3.5 w-3.5" /> View Media ({albumMedia.length})
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          title="Upload to Album"
                          onClick={() => handleOpenUploadMedia(album.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-600 dark:text-purple-400 cursor-pointer"
                        >
                          <Upload className="h-3.5 w-3.5" />
                        </button>

                        <button
                          title="Edit Album"
                          onClick={() => handleOpenEditAlbum(album)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          title="Delete Album"
                          onClick={() => deleteGalleryAlbum(album.id)}
                          className="p-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Media Grid View */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          {filteredMedia.length === 0 ? (
            <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/50">
              <CardBody className="py-8 space-y-3">
                <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Media Uploaded</h3>
                <p className="text-xs text-slate-400">Upload photos or video embed links to display in this gallery view.</p>
                <Button variant="primary" size="sm" onClick={() => handleOpenUploadMedia()} className="mt-2 bg-purple-600 font-bold">
                  <Upload className="h-4 w-4 mr-1" /> Upload Media
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedLightboxMedia(item)}
                  className="group relative h-48 md:h-56 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={item.type === 'video' ? (item.thumbnail || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&q=80') : item.url}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Type Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant={item.type === 'video' ? 'accent' : 'primary'} className="py-0.5 px-2 text-[9px] font-bold shadow-sm">
                      {item.type === 'video' ? <><Video className="h-3 w-3 mr-1" /> Video</> : <><ImageIcon className="h-3 w-3 mr-1" /> Photo</>}
                    </Badge>
                  </div>

                  {/* Title & info overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-xs font-bold font-display truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-300 truncate mt-0.5">{item.uploadedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trash Bin View */}
      {activeTab === 'trash' && (
        <div className="space-y-4">
          {deletedMediaItems.length === 0 ? (
            <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/50">
              <CardBody className="py-8 space-y-2">
                <Trash2 className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trash Bin is Empty</h3>
                <p className="text-xs text-slate-400">Deleted photos or videos will appear here for easy single-click restoration.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {deletedMediaItems.map(item => (
                <div key={item.id} className="relative h-48 rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/40 bg-slate-900 shadow-sm">
                  <img
                    src={item.type === 'video' ? (item.thumbnail || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop&q=80') : item.url}
                    alt={item.title}
                    className="h-full w-full object-cover grayscale opacity-70"
                  />
                  <div className="absolute inset-0 bg-slate-950/60" />

                  <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                    <Badge variant="danger" className="self-start py-0.5 px-2 text-[9px] font-bold">
                      Deleted
                    </Badge>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold truncate">{item.title}</h4>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs font-bold py-1 flex items-center justify-center gap-1.5"
                        onClick={() => restoreGalleryMedia(item.id)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Restore Media
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Album Modal */}
      <CreateAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        albumToEdit={albumToEdit}
      />

      {/* Upload Media Modal */}
      <UploadMediaModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultAlbumId={uploadDefaultAlbumId}
      />

      {/* Lightbox Modal */}
      <MediaLightboxModal
        isOpen={!!selectedLightboxMedia}
        onClose={() => setSelectedLightboxMedia(null)}
        media={selectedLightboxMedia}
        playlist={filteredMedia}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
};
