import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark, 
  BookmarkCheck,
  Share2,
  FileText
} from 'lucide-react';
import { Card, CardBody, Button, Badge, useApp } from '../../common';

export const MyPosts: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    campusPosts, 
    likeCampusPost, 
    saveCampusPost, 
    currentRole,
    userProfiles 
  } = useApp();

  const activeTabParam = searchParams.get('tab') === 'saved' ? 'saved' : 'posts';
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>(activeTabParam);

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  const currentUserId = currentRole === 'student' ? 'user-student' : currentRole === 'president' ? 'user-president' : 'user-faculty';

  // Filter posts
  const myPosts = campusPosts.filter(post => post.userId === currentUserId);
  const savedPosts = campusPosts.filter(post => post.isSaved);

  const postsToShow = activeTab === 'posts' ? myPosts : savedPosts;

  const handleTabChange = (tab: 'posts' | 'saved') => {
    setSearchParams({ tab });
    setActiveTab(tab);
  };

  const handleShare = (postTitle: string) => {
    alert(`Share Link generated for: "${postTitle}"`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back button */}
      <button 
        onClick={() => navigate('/campus-connect')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            Personal Space
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review your posted topics and bookmarks in one place.</p>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleTabChange('posts')}
            className={`py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'posts'
                ? 'border-primary text-primary dark:text-indigo-400'
                : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            My Published Posts ({myPosts.length})
          </button>
          <button
            onClick={() => handleTabChange('saved')}
            className={`py-3 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'border-primary text-primary dark:text-indigo-400'
                : 'border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Saved Bookmarks ({savedPosts.length})
          </button>
        </div>

        {/* Posts rendering */}
        <div className="space-y-4">
          {postsToShow.length === 0 ? (
            <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/40 rounded-2xl">
              <CardBody className="flex flex-col items-center justify-center space-y-3 py-8">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400 dark:text-slate-500">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeTab === 'posts' ? 'No Posts Published' : 'No Bookmarks Saved'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {activeTab === 'posts' 
                    ? "You haven't written any Campus Connect posts yet. Tap 'Create Post' to start collaborating."
                    : "You haven't bookmarked any discussions yet. Click the bookmark icon on feed cards to save them here."}
                </p>
                {activeTab === 'posts' && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => navigate('/campus-connect/create')}
                    className="mt-2 font-bold"
                  >
                    Create Post
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            postsToShow.map(post => (
              <Card key={post.id} hoverable={true} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] overflow-hidden">
                <CardBody className="p-5 space-y-4">
                  
                  {/* Header Author Info */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="h-9 w-9 rounded-xl object-cover cursor-pointer"
                      onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 
                          className="text-xs font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer"
                          onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
                        >
                          {post.author}
                        </h4>
                        {post.clubBadge && (
                          <Badge variant="accent" className="text-[8px] py-0 px-1 bg-indigo-50/50 text-indigo-500 border-indigo-100/50 dark:bg-indigo-950/20 dark:border-indigo-900/30">
                            {post.clubBadge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                        <span>{post.department}</span>
                        <span>•</span>
                        <Badge variant="neutral" className="text-[8px] py-0 px-1 font-bold">{post.roleBadge}</Badge>
                        <span>•</span>
                        <Clock className="h-2.5 w-2.5 text-slate-400" />
                        <span>{post.timestamp}</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div 
                    className="space-y-3 cursor-pointer"
                    onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                  >
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Attachment" 
                        className="rounded-xl max-h-60 w-full object-cover border border-slate-50 dark:border-slate-800" 
                      />
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.eventTag && (
                      <Badge variant="primary" className="bg-indigo-50 border-indigo-100 text-indigo-650 text-[8px] py-0.5 px-2 dark:bg-indigo-950/30 dark:border-indigo-900/30 dark:text-indigo-400 flex items-center gap-1 font-bold">
                        <Calendar className="h-3 w-3" /> Event: {post.eventTag}
                      </Badge>
                    )}
                    {post.clubTag && (
                      <Badge variant="neutral" className="text-[8px] py-0.5 px-2 flex items-center gap-1 font-bold">
                        <Tag className="h-3 w-3" /> Club: {post.clubTag}
                      </Badge>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => likeCampusPost(post.id)}
                        className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                          post.hasLiked 
                            ? 'text-primary dark:text-indigo-400' 
                            : 'text-slate-450 hover:text-slate-600'
                        }`}
                      >
                        <ThumbsUp className={`h-4.5 w-4.5 ${post.hasLiked ? 'fill-indigo-500/20' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button 
                        onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-450 hover:text-slate-600 cursor-pointer"
                      >
                        <MessageCircle className="h-4.5 w-4.5" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleShare(post.content)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-450 hover:text-slate-600 cursor-pointer"
                      >
                        <Share2 className="h-4.5 w-4.5" />
                      </button>

                      <button 
                        onClick={() => saveCampusPost(post.id)}
                        className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                          post.isSaved 
                            ? 'text-emerald-500' 
                            : 'text-slate-450 hover:text-slate-600'
                        }`}
                      >
                        {post.isSaved ? <BookmarkCheck className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/20" /> : <Bookmark className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                </CardBody>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
