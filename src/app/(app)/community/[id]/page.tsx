'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { motion } from 'framer-motion';
import { 
  IconArrowUp, 
  IconArrowDown, 
  IconMessageCircle, 
  IconShare, 
  IconBookmark,
  IconArrowLeft,
  IconSend
} from '@tabler/icons-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumbs } from '@/components/ui';

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const getPost = useCommunityStore((s: any) => s.getPost);
  const upvotePost = useCommunityStore((s: any) => s.upvotePost);
  const downvotePost = useCommunityStore((s: any) => s.downvotePost);
  
  const post = getPost ? getPost(id) : null;
  const [commentText, setCommentText] = useState('');

  if (!post) {
    return (
      <Container >
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Community', href: '/community' }, { label: 'Post' }]} className="mb-8" />
          <div className="glass-strong rounded-2xl p-12 text-center text-zinc-500 border border-white/5">
            Post not found or loading...
          </div>
        </div>
      </Container>
    );
  }

  return (
    <PageLayout>
        <Container >
          <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-w-0">
            <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Community', href: '/community' }, { label: 'Post' }]} className="mb-6" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 mb-8"
            >
              <div className="flex flex-row space-x-4 sm:space-x-6">
                {/* Voting Column */}
                <div className="flex flex-col items-center space-y-1 sm:space-y-2 shrink-0">
                  <button onClick={() => upvotePost(post.id)} className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-500 rounded-xl hover:bg-gray-100 transition-colors">
                    <IconArrowUp size={24} />
                  </button>
                  <span className="text-base sm:text-lg font-bold text-gray-900">{post.upvotes - (post.downvotes || 0)}</span>
                  <button onClick={() => downvotePost(post.id)} className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 rounded-xl hover:bg-gray-100 transition-colors">
                    <IconArrowDown size={24} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {post.authorName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{post.authorName}</p>
                      <p className="text-xs text-gray-500 shrink-0 sm:before:content-['·'] sm:before:mr-2">{post.timeAgo || '2 hours ago'}</p>
                    </div>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 break-words leading-tight">{post.title}</h1>
                  <div className="prose prose-invert max-w-none text-sm sm:text-base text-gray-900 mb-6 whitespace-pre-wrap break-words leading-relaxed">
                    {post.content}
                  </div>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-medium text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 sm:space-x-6 text-gray-500 border-t border-gray-100 pt-4 mt-6">
                    <button className="flex items-center space-x-1.5 hover:text-blue-500 hover:bg-blue-50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                      <IconMessageCircle size={20} />
                      <span className="text-sm font-medium">{post.comments?.length || post.commentsCount || 0} Comments</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-green-500 hover:bg-green-50 p-1.5 rounded-lg transition-colors">
                      <IconShare size={20} />
                      <span className="text-sm font-medium hidden sm:inline">Share</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-yellow-500 hover:bg-yellow-50 p-1.5 rounded-lg transition-colors">
                      <IconBookmark size={20} />
                      <span className="text-sm font-medium hidden sm:inline">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <div className="space-y-6 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Comments</h3>
              
              {/* Add Comment */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-start space-x-3 sm:space-x-4 border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 relative min-w-0">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-12 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                  />
                  <button className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!commentText.trim()}>
                    <IconSend size={18} />
                  </button>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {post.comments?.map((comment: any, idx: number) => (
                  <motion.div 
                    key={comment.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
                        {comment.authorName?.charAt(0) || 'C'}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{comment.authorName}</p>
                        <p className="text-xs text-gray-500 shrink-0 sm:before:content-['·'] sm:before:mr-2">{comment.timeAgo || '1 hour ago'}</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-900 sm:ml-10 break-words leading-relaxed">{comment.content}</p>
                  </motion.div>
                ))}
                {(!post.comments || post.comments.length === 0) && (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-2xl border border-gray-200">
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </PageLayout>
    );
}
