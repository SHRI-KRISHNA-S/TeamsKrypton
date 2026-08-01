import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  UserPlus, 
  Award, 
  Calendar, 
  Sparkles, 
  Briefcase, 
  BookOpen, 
  Clock, 
  ShieldAlert,
  CheckCircle,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { Card, CardBody, Button, Badge, useApp } from '../../common';
import { getLevelDetails } from '../../campus-leaderboard/config/pointsConfig';

export const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { 
    userProfiles, 
    campusPosts, 
    currentRole, 
    suspendUser, 
    likeCampusPost 
  } = useApp();

  const [isFollowed, setIsFollowed] = useState(false);

  // Find target profile
  const profile = userProfiles.find(p => p.id === userId);

  if (!profile) {
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">User Profile Not Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">The profile you are looking for does not exist or has been removed.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Dynamic ranking and level calculations
  const isFaculty = profile.role === 'Faculty Coordinator';
  
  const sortedStudents = [...userProfiles]
    .filter(p => p.role !== 'Faculty Coordinator')
    .sort((a, b) => b.apPoints - a.apPoints);

  const overallRank = sortedStudents.findIndex(p => p.id === profile.id) + 1;

  const primaryClub = profile.joinedClubs[0] || 'Coding Club';
  const clubStudents = sortedStudents.filter(p => p.joinedClubs.includes(primaryClub));
  const clubRank = clubStudents.findIndex(p => p.id === profile.id) + 1;

  const levelInfo = getLevelDetails(profile.apPoints);
  
  const getNextLevelTarget = (ap: number) => {
    if (ap < 200) return { name: 'Contributor', max: 200, min: 0 };
    if (ap < 500) return { name: 'Leader', max: 500, min: 200 };
    if (ap < 900) return { name: 'Champion', max: 900, min: 500 };
    if (ap < 1500) return { name: 'Legend', max: 1500, min: 900 };
    return { name: 'Maxed', max: 1500, min: 1500 };
  };
  const nextTarget = getNextLevelTarget(profile.apPoints);
  const progressPercent = nextTarget.max !== nextTarget.min 
    ? Math.min(100, Math.max(0, ((profile.apPoints - nextTarget.min) / (nextTarget.max - nextTarget.min)) * 100))
    : 100;

  // Filter posts created by this user
  const userPosts = campusPosts.filter(post => post.userId === profile.id);

  const handleMessage = () => {
    alert(`Starting private direct message thread with ${profile.name} (UI implementation placeholder)`);
  };

  const handleSuspend = () => {
    if(confirm(`Are you sure you want to ${profile.isSuspended ? 'unsuspend' : 'suspend'} this user's account?`)) {
      suspendUser(profile.id);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/campus-connect')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </button>

      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1322] shadow-sm overflow-hidden max-w-4xl mx-auto">
        {/* Banner Cover */}
        <div className="h-32 md:h-44 bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 relative">
          {profile.isSuspended && (
            <div className="absolute inset-0 bg-red-650/40 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-600 text-white font-extrabold text-xs uppercase px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <ShieldAlert className="h-4.5 w-4.5" /> Account Suspended by Admin
              </span>
            </div>
          )}
        </div>

        {/* Profile Card Body */}
        <div className="p-6 md:p-8 -mt-12 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="h-24 w-24 md:h-32 md:w-32 rounded-3xl object-cover border-4 border-white dark:border-[#0E1322] shadow-md flex-shrink-0"
            />
            <div className="space-y-1.5 md:mb-2">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold font-display text-slate-900 dark:text-white leading-tight">{profile.name}</h1>
                <Badge variant="primary" className="text-[10px] py-0 px-2 font-bold">{profile.role}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{profile.department} • {profile.academicYear}</p>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 font-bold">{profile.club}</p>
            </div>
          </div>

          {/* Connect Buttons */}
          <div className="flex flex-wrap gap-2.5 justify-center md:mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1.5 text-xs font-bold border-indigo-200 text-indigo-500 dark:border-slate-800 dark:text-slate-300"
              onClick={handleMessage}
            >
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
            <Button 
              variant={isFollowed ? 'outline' : 'primary'} 
              size="sm" 
              className="flex items-center gap-1.5 text-xs font-bold"
              onClick={() => setIsFollowed(!isFollowed)}
            >
              <UserPlus className="h-4 w-4" /> {isFollowed ? 'Following' : 'Follow'}
            </Button>

            {/* Moderation Controls for Admin/SuperAdmin */}
            {(currentRole === 'admin' || currentRole === 'superadmin') && (
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  profile.isSuspended 
                    ? 'border-emerald-250 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' 
                    : 'border-red-250 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                }`}
                onClick={handleSuspend}
              >
                <ShieldAlert className="h-4 w-4" /> {profile.isSuspended ? 'Reinstate User' : 'Suspend User'}
              </Button>
            )}
          </div>
        </div>

        {/* Leaderboard stats Dashboard at the top */}
        {!isFaculty && profile && (
          <div className="border-t border-slate-100 dark:border-slate-850 px-6 py-5 md:px-8 bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Activity Points */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Activity Points (AP)</span>
                <span className="text-xl font-extrabold text-indigo-650 dark:text-indigo-400 font-display mt-1">{profile.apPoints} AP</span>
              </div>

              {/* Current Level */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Current Level</span>
                <div className="mt-1">
                  <Badge variant="primary" className="text-xs font-bold py-0.5 px-2 bg-indigo-50 border-indigo-100 text-indigo-650 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400">
                    {levelInfo.name}
                  </Badge>
                </div>
              </div>

              {/* Overall Rank */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Overall Rank</span>
                <span className="text-xl font-extrabold text-slate-850 dark:text-white font-display mt-1">
                  #{overallRank} <span className="text-[10px] text-slate-400 font-semibold">of {sortedStudents.length}</span>
                </span>
              </div>

              {/* Club Rank */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Club Rank</span>
                <span className="text-xl font-extrabold text-slate-850 dark:text-white font-display mt-1">
                  #{clubRank} <span className="text-[10px] text-slate-400 font-semibold">in {primaryClub.split(' ')[0]}</span>
                </span>
              </div>

            </div>

            {/* Next Level Progress */}
            {nextTarget.name !== 'Maxed' && (
              <div className="space-y-1.5 border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1322] p-4 rounded-2xl">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Next Level Progress: {profile.apPoints} / {nextTarget.max} AP</span>
                  <span>{progressPercent.toFixed(0)}% to {nextTarget.name}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Info Details Tabs / Sections */}
        <div className="border-t border-slate-100 dark:border-slate-850 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Bio & Skills */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bio */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" /> Biography
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-medium">
                {profile.bio}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-400" /> Skills & Expertises
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <Badge key={`${skill}-${idx}`} variant="neutral" className="text-[10px] py-1 px-2.5 font-bold border-slate-150/60 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-400" /> Recent Activity
              </h3>
              <div className="space-y-4.5">
                {userPosts.length === 0 ? (
                  <div className="text-[11px] text-slate-400 font-semibold p-4 text-center">
                    This user hasn't posted anything on Campus Connect yet.
                  </div>
                ) : (
                  userPosts.map(post => (
                    <Card key={post.id} className="border border-slate-100 dark:border-slate-850/60 bg-slate-50/10 dark:bg-slate-950/20">
                      <CardBody className="p-4 space-y-3">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Published {post.timestamp}
                          </span>
                        </div>
                        <p 
                          className="text-xs text-slate-650 dark:text-slate-350 line-clamp-3 cursor-pointer"
                          onClick={() => navigate(`/campus-connect/post/${post.id}`)}
                        >
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.likes} Likes</span>
                          <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.comments.length} Comments</span>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Experience, Clubs, Certificates */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Joined Clubs */}
            <Card hoverable={false} className="border border-slate-100 dark:border-slate-850/60 bg-slate-50/5 dark:bg-[#0E1322]/30">
              <CardBody className="p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" /> Joined Clubs
                </h4>
                <div className="space-y-2">
                  {profile.joinedClubs.map((club, idx) => (
                    <div key={`${club}-${idx}`} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{club}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Upcoming Events */}
            {profile.upcomingEvents.length > 0 && (
              <Card hoverable={false} className="border border-slate-100 dark:border-slate-850/60 bg-slate-50/5 dark:bg-[#0E1322]/30">
                <CardBody className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" /> Attending Events
                  </h4>
                  <div className="space-y-2">
                    {profile.upcomingEvents.map((evt, idx) => (
                      <div key={`${evt}-${idx}`} className="text-xs font-semibold text-slate-655 dark:text-slate-350 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                        <span>{evt}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Certificates */}
            {profile.certificates.length > 0 && (
              <Card hoverable={false} className="border border-slate-100 dark:border-slate-850/60 bg-slate-50/5 dark:bg-[#0E1322]/30">
                <CardBody className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" /> Certificates
                  </h4>
                  <div className="space-y-2.5">
                    {profile.certificates.map((cert, idx) => (
                      <div key={`${cert}-${idx}`} className="flex items-center gap-2 text-xs font-semibold text-slate-655 dark:text-slate-350">
                        <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Achievements */}
            {profile.achievements.length > 0 && (
              <Card hoverable={false} className="border border-slate-100 dark:border-slate-850/60 bg-slate-50/5 dark:bg-[#0E1322]/30">
                <CardBody className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500" /> Achievements
                  </h4>
                  <div className="space-y-2">
                    {profile.achievements.map((ach, idx) => (
                      <div key={`${ach}-${idx}`} className="text-xs font-semibold text-slate-655 dark:text-slate-350 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
