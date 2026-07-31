import React, { useState } from 'react';
import { Sparkles, ThumbsUp, MessageSquare, Share2, Send, Award, Heart, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';

export const ActivityFeed: React.FC = () => {
  const { activityFeed, likePost, addComment, currentRole } = useApp();

  // Local state for comment text inputs
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addComment(postId, text);
    // Clear comment input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShareClick = (author: string) => {
    alert(`Post shared to your external clipboard: "Check out this update from ${author} on ClubPortal!"`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-slide-up">
      {/* Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white">Campus Activity Feed</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">LinkedIn-style social updates, student accomplishments, and media snippets.</p>
      </div>

      {/* Write a Post placeholder box */}
      <Card hoverable={false} className="border-indigo-100 dark:border-indigo-900/40">
        <CardBody className="flex gap-4">
          <img 
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80" 
            alt="User avatar" 
            className="h-10 w-10 rounded-full object-cover border border-slate-100 dark:border-slate-800" 
          />
          <div className="flex-grow space-y-3">
            <input 
              type="text" 
              placeholder="Share a campus milestone or project update..." 
              className="w-full text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 outline-none focus:border-primary text-slate-800 dark:text-slate-200"
              onClick={() => alert('Posting is currently simulated. Write updates under proposed events or announcements.')}
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Simulated feed active</span>
              <Button size="sm" variant="primary" className="text-[10px] py-1 px-3">Publish Post</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Feed listing */}
      <div className="space-y-6">
        {activityFeed.map(post => (
          <Card key={post.id} hoverable={false}>
            {/* Header info */}
            <CardHeader className="flex justify-between items-start pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={post.avatar} 
                  alt={post.author} 
                  className="h-9 w-9 rounded-full object-cover border border-slate-100 dark:border-slate-800" 
                />
                <div>
                  <h3 className="text-xs font-bold text-slate-905 dark:text-slate-100 flex items-center gap-1.5">
                    {post.author}
                    {post.role.includes('Club') && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">{post.role} • {post.date}</span>
                </div>
              </div>
            </CardHeader>

            {/* Post Content */}
            <CardBody className="space-y-4 py-3">
              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-medium">
                {post.content}
              </p>
              {post.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-50 dark:border-slate-800">
                  <img src={post.image} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                </div>
              )}

              {/* Likes & Comments Count statistics */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-b border-slate-50 dark:border-slate-800/40 py-2 mt-3">
                <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> {post.likes} Likes</span>
                <span>{post.comments.length} Comments</span>
              </div>
            </CardBody>

            {/* Interactive triggers */}
            <CardFooter className="py-2.5 flex justify-between gap-1 text-[11px] font-bold text-slate-650 dark:text-slate-350 border-none">
              <button 
                onClick={() => likePost(post.id)}
                className={`flex-grow flex items-center justify-center gap-2 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 ${post.hasLiked ? 'text-rose-500 font-bold' : ''}`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </button>
              <button 
                onClick={() => document.getElementById(`cmt-inp-${post.id}`)?.focus()}
                className="flex-grow flex items-center justify-center gap-2 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </button>
              <button 
                onClick={() => handleShareClick(post.author)}
                className="flex-grow flex items-center justify-center gap-2 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </CardFooter>

            {/* Comments Lists section */}
            <div className="bg-slate-50/50 dark:bg-slate-900/20 p-4 border-t border-slate-50 dark:border-slate-800/60 space-y-4 rounded-b-2xl">
              {post.comments.map(c => (
                <div key={c.id} className="flex gap-3 text-xs">
                  <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    {c.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-50 dark:border-slate-800/80 flex-grow">
                    <div className="flex justify-between items-baseline font-semibold text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-750 dark:text-slate-250">{c.author}</span>
                      <span>{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{c.content}</p>
                  </div>
                </div>
              ))}

              {/* Add comment form input */}
              <div className="flex gap-3 items-center">
                <input 
                  id={`cmt-inp-${post.id}`}
                  type="text" 
                  placeholder="Write a comment..." 
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  className="w-full text-xs bg-white dark:bg-slate-900 p-2 px-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 outline-none focus:border-primary text-slate-800 dark:text-slate-200"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 !rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-primary"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
