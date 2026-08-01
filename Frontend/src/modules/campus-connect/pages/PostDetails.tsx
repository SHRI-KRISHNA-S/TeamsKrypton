import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark, 
  Clock, 
  Calendar, 
  Tag, 
  Send 
} from 'lucide-react';
import { Card, CardBody, Button, Badge, useApp } from '../../common';

export const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { 
    campusPosts, 
    likeCampusPost, 
    saveCampusPost, 
    addCampusComment, 
    currentRole,
    userProfiles
  } = useApp();

  const [commentText, setCommentText] = useState('');

  // Find target post
  const post = campusPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="space-y-6 animate-slide-up">
        <button 
          onClick={() => navigate('/campus-connect')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Feed
        </button>
        <Card className="p-8 text-center border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]/40 rounded-2xl">
          <CardBody className="py-8 flex flex-col items-center justify-center space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Not Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">The post you are trying to view does not exist or has been deleted.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCampusComment(post.id, commentText);
    setCommentText('');
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

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Main Post Card */}
        <Card hoverable={false} className="border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322]">
          <CardBody className="p-6 space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-3">
              <img 
                src={post.avatar} 
                alt={post.author} 
                className="h-11 w-11 rounded-xl object-cover border border-slate-50 dark:border-slate-800 cursor-pointer"
                onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 
                    className="text-xs font-extrabold text-slate-900 dark:text-white hover:text-primary cursor-pointer"
                    onClick={() => navigate(`/campus-connect/profile/${post.userId}`)}
                  >
                    {post.author}
                  </h3>
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

            {/* Post Content */}
            <div className="space-y-4">
              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                {post.content}
              </p>
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post Attachment" 
                  className="rounded-xl w-full object-cover border border-slate-50 dark:border-slate-800 shadow-sm max-h-96" 
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
            <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => likeCampusPost(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
                    post.hasLiked 
                      ? 'text-primary dark:text-indigo-400' 
                      : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <ThumbsUp className={`h-4.5 w-4.5 ${post.hasLiked ? 'fill-indigo-500/20' : ''}`} />
                  <span>Like ({post.likes})</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-450">
                  <MessageCircle className="h-4.5 w-4.5" />
                  <span>Comments ({post.comments.length})</span>
                </div>
              </div>

              <button 
                onClick={() => saveCampusPost(post.id)}
                className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors ${
                  post.isSaved 
                    ? 'text-emerald-500' 
                    : 'text-slate-450 hover:text-slate-600'
                }`}
              >
                <Bookmark className={`h-4.5 w-4.5 ${post.isSaved ? 'fill-emerald-500/20 text-emerald-500' : ''}`} />
                <span>{post.isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Discussions
          </h4>

          {/* Add Comment Input Form */}
          <Card hoverable={false} className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322]">
            <CardBody className="p-4">
              <form onSubmit={handleCommentSubmit} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Share your thoughts or answer questions..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none w-full"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm" 
                  className="px-4 flex items-center justify-center"
                >
                  <Send className="h-4.5 w-4.5" />
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Comments List */}
          <div className="space-y-3.5">
            {post.comments.length === 0 ? (
              <div className="text-center p-6 text-xs text-slate-400 font-medium">
                No comments yet. Be the first to start the discussion!
              </div>
            ) : (
              post.comments.map(comment => {
                // Find if commenter is suspended
                const commProfile = userProfiles.find(u => u.id === comment.userId);
                if (commProfile?.isSuspended) return null;

                return (
                  <Card key={comment.id} hoverable={false} className="border border-slate-100 dark:border-slate-850 bg-slate-50/10 dark:bg-[#0E1322]/20">
                    <CardBody className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={comment.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80'} 
                            alt={comment.author} 
                            className="h-7 w-7 rounded-lg object-cover cursor-pointer"
                            onClick={() => navigate(`/campus-connect/profile/${comment.userId}`)}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 
                                className="text-[11px] font-bold text-slate-900 dark:text-white hover:text-primary cursor-pointer"
                                onClick={() => navigate(`/campus-connect/profile/${comment.userId}`)}
                              >
                                {comment.author}
                              </h5>
                              <Badge variant="neutral" className="text-[8px] py-0 px-1 font-bold scale-90">{comment.role}</Badge>
                            </div>
                            <p className="text-[8px] text-slate-400 font-semibold">{comment.department} • {comment.timestamp}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium whitespace-pre-wrap pl-9">
                        {comment.content}
                      </p>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
