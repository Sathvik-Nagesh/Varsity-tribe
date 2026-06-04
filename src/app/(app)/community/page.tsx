'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { 
  IconArrowUp, 
  IconArrowDown, 
  IconMessageCircle, 
  IconShare, 
  IconBookmark,
  IconPlus,
  IconTrendingUp,
  IconUsers,
  IconX,
  IconSparkles
} from '@tabler/icons-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageLayout } from "@/components/layout/PageLayout";
import { TopicChip } from '@/components/discover/TopicChip';
import { Breadcrumbs } from '@/components/ui';
import { FINANCIAL_TOPICS, TRENDING_TOPICS, type FinancialTopic } from '@/services/topicsDB';

export default function CommunityPage() {
  const { posts, upvotePost, downvotePost } = useCommunityStore();
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [activeTopic, setActiveTopic] = useState<FinancialTopic | null>(null);

  const getSortedPosts = useCommunityStore((s: any) => s.getSortedPosts);
  const allPosts = getSortedPosts ? getSortedPosts(sortBy) : posts;

  // Filter posts by active topic community tags
  const sortedPosts = useMemo(() => {
    if (!activeTopic) return allPosts;
    return allPosts?.filter((post: any) =>
      post.tags?.some((tag: string) =>
        activeTopic.communityTags.some(
          (ct) => ct.toLowerCase() === tag.toLowerCase()
        )
      )
    );
  }, [allPosts, activeTopic]);

  function handleTopicClick(topic: FinancialTopic) {
    setActiveTopic((prev) => (prev?.id === topic.id ? null : topic));
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageLayout>
        <Container >
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Community' }]} className="pl-4 sm:pl-6 lg:pl-8 max-w-7xl mx-auto" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-6 min-w-0">
              {/* Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex space-x-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200 overflow-x-auto shadow-sm">
                  {['hot', 'new', 'top'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSortBy(tab as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                        sortBy === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors shrink-0">
                  <IconPlus size={20} />
                  <span className="font-medium">Create Post</span>
                </button>
              </div>

              {/* Active topic filter pill */}
              {activeTopic && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200"
                >
                  <span className="text-sm font-semibold text-blue-800">
                    {activeTopic.emoji} Filtered by: {activeTopic.label}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    ({sortedPosts?.length ?? 0} posts)
                  </span>
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="ml-auto text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <IconX size={16} />
                  </button>
                </motion.div>
              )}

              {/* Feed */}
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {sortedPosts?.map((post: any) => (
                  <motion.div 
                    key={post.id} 
                    variants={item}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 transition-all border border-zinc-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-row space-x-3 sm:space-x-4">
                      {/* Voting Column */}
                      <div className="flex flex-col items-center space-y-1 shrink-0">
                        <button onClick={() => upvotePost(post.id)} className="p-1.5 text-zinc-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <IconArrowUp size={20} />
                        </button>
                        <span className="text-sm font-bold text-zinc-700">{post.upvotes - (post.downvotes || 0)}</span>
                        <button onClick={() => downvotePost(post.id)} className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <IconArrowDown size={20} />
                        </button>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/community/${post.id}`} className="block focus:outline-none">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs sm:text-sm font-bold text-white shrink-0">
                              {post.authorName?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 truncate">{post.authorName}</p>
                              <p className="text-xs text-zinc-500 shrink-0 sm:before:content-['·'] sm:before:mr-2">{post.timeAgo || '2h ago'}</p>
                            </div>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2 leading-tight break-words">{post.title}</h3>
                          <p className="text-sm text-zinc-600 line-clamp-3 mb-3 leading-relaxed break-words">{post.content}</p>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag: string) => (
                                <span key={tag} className="px-2 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-600">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 sm:space-x-6 text-zinc-500 mt-2">
                          <Link href={`/community/${post.id}`} className="flex items-center space-x-1.5 hover:text-blue-600 hover:bg-blue-50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                            <IconMessageCircle size={18} className="sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium">{post.commentsCount || post.comments?.length || 0}</span>
                          </Link>
                          <button className="flex items-center space-x-1.5 hover:text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors">
                            <IconShare size={18} className="sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Share</span>
                          </button>
                          <button className="flex items-center space-x-1.5 hover:text-yellow-600 hover:bg-yellow-50 p-1.5 rounded-lg transition-colors">
                            <IconBookmark size={18} className="sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Save</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!sortedPosts || sortedPosts.length === 0) && (
                  <div className="text-center py-16 px-4 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                      <IconMessageCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">No posts yet</h3>
                    <p className="text-zinc-500 mb-6 max-w-sm">Every great conversation starts with a single post. Share your ideas, ask questions, and grow your wealth of knowledge with the tribe!</p>
                    <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors shrink-0 font-medium">
                      <IconPlus size={20} />
                      <span>Start a Discussion</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 hidden lg:block min-w-0">
              {/* Community Stats */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                  <IconUsers className="mr-2 text-blue-500" size={24} />
                  Community Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                    <span className="text-sm text-zinc-500">Total Members</span>
                    <span className="text-sm font-bold text-zinc-900">12,453</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                    <span className="text-sm text-zinc-500">Online Now</span>
                    <span className="text-sm font-bold text-green-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                      1,204
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Posts Today</span>
                    <span className="text-sm font-bold text-zinc-900">342</span>
                  </div>
                </div>
              </div>

              {/* Financial Topic Discovery */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-1 flex items-center gap-2">
                  <IconSparkles className="text-purple-500" size={20} />
                  Explore Topics
                </h3>
                <p className="text-xs text-zinc-500 mb-4">Filter discussions by financial topic</p>

                {/* Trending topics first */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">🔥 Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_TOPICS.slice(0, 4).map((topic, idx) => (
                      <TopicChip
                        key={topic.id}
                        topic={topic}
                        selected={activeTopic?.id === topic.id}
                        size="sm"
                        onClick={handleTopicClick}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>

                {/* All topics */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">All Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {FINANCIAL_TOPICS.filter(t => !TRENDING_TOPICS.slice(0, 4).find(tt => tt.id === t.id)).map((topic, idx) => (
                      <TopicChip
                        key={topic.id}
                        topic={topic}
                        selected={activeTopic?.id === topic.id}
                        size="sm"
                        showCount={false}
                        onClick={handleTopicClick}
                        index={idx + 4}
                      />
                    ))}
                  </div>
                </div>

                {activeTopic && (
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    <IconX size={12} /> Clear filter
                  </button>
                )}
              </div>

              {/* What people are discussing */}
              <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                  <IconTrendingUp className="mr-2 text-purple-500" size={24} />
                  Most Discussed
                </h3>
                <div className="space-y-3">
                  {FINANCIAL_TOPICS.sort((a, b) => b.discussionCount - a.discussionCount).slice(0, 5).map((topic, idx) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicClick(topic)}
                      className="w-full flex items-center gap-3 text-left hover:bg-zinc-50 rounded-lg p-1.5 -mx-1.5 transition-colors"
                    >
                      <span className="text-xs font-black text-zinc-300 w-4 text-center">{idx + 1}</span>
                      <span className="text-base">{topic.emoji}</span>
                      <span className="text-sm font-medium text-zinc-700 flex-1 truncate">{topic.label}</span>
                      <span className="text-xs text-zinc-400 font-medium shrink-0">{topic.discussionCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageLayout>
    );
}
