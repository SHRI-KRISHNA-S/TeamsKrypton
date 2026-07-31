import React, { useState } from 'react';
import { Briefcase, Calendar, Award, Bookmark, BookmarkCheck, Search, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Button, Badge, useApp } from '../../common';

export const OpportunityModule: React.FC = () => {
  const { opportunities, toggleBookmarkOpportunity, applyOpportunity } = useApp();
  const [selectedTab, setSelectedTab] = useState<'All' | 'Hackathon' | 'Competition' | 'Internship' | 'Workshop' | 'Recruitment'>('All');
  const [search, setSearch] = useState('');

  const filteredOpps = opportunities.filter(opp => {
    const matchesTab = selectedTab === 'All' ? true : opp.type === selectedTab;
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                          opp.organizer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Title */}
      <div>
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-900 dark:text-white font-sans">Campus & External Opportunities</h1>
        <p className="text-xs text-slate-400 mt-1">Explore hackathons, summer internships, bootcamps, and core placements.</p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 border-b border-slate-100 dark:border-slate-800/80">
        {(['All', 'Hackathon', 'Competition', 'Internship', 'Workshop', 'Recruitment'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedTab === tab
                ? 'bg-primary text-white shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-[#0E1322] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/60'
            }`}
          >
            {tab === 'All' ? 'All Opportunities' : tab}
          </button>
        ))}
      </div>

      {/* Search and stats bar */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md">
        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          placeholder="Filter opportunities..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Opportunities Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpps.map(opp => (
          <Card key={opp.id} hoverable={true} className="flex flex-col h-full relative">
            <CardHeader className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <Badge variant="primary">{opp.type}</Badge>
                <h3 className="text-xs font-bold font-display text-slate-900 dark:text-white leading-snug">{opp.title}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Organized by: {opp.organizer}</p>
              </div>
              <button 
                onClick={() => toggleBookmarkOpportunity(opp.id)}
                className="text-slate-400 hover:text-indigo-500 transition-colors p-1"
              >
                {opp.isBookmarked ? <BookmarkCheck className="h-5 w-5 text-indigo-500" /> : <Bookmark className="h-5 w-5" />}
              </button>
            </CardHeader>
            <CardBody className="space-y-4 flex-grow text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <p className="line-clamp-3">{opp.description}</p>
              
              <div className="space-y-2 border-t border-slate-50 dark:border-slate-800/40 pt-3 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Apply before: {opp.deadline}</div>
                <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Eligibility: {opp.eligibility}</div>
              </div>
            </CardBody>
            <CardFooter>
              <Button 
                variant={opp.isApplied ? 'outline' : 'primary'} 
                size="sm" 
                className="w-full text-xs font-bold"
                onClick={() => applyOpportunity(opp.id)}
              >
                {opp.isApplied ? 'Applied' : 'Apply Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
