'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdminUser } from '../../config/admin-access';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface Conversation {
  conversationId: string;
  userId: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  user: User | null;
  sampleUserMessage: string | null;
  sampleAIMessage: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user is admin
      if (!isAdminUser(user.email)) {
        router.push('/unauthorized');
        return;
      }
      
      fetchConversations();
    } else if (!isLoading && !user) {
      // Redirect to login if not logged in
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  const fetchConversations = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/conversations?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data.conversations);
      setPagination(data.pagination);
    } catch (err) {
      setError('Error loading conversations. Please try again later.');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchConversations(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const truncateText = (text: string | null, maxLength = 100) => {
    if (!text) return 'No content';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="loader">
          <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-400 max-w-md">
              Panel de supervisión y gestión. Visualiza conversaciones recientes y accede a herramientas administrativas.
            </p>
          </div>
          <div className="inline-flex flex-wrap gap-3">
            <Link
              href="/admin/feedbacks"
              className="group relative px-4 py-2 rounded-md border border-indigo-600/50 bg-gradient-to-r from-indigo-600/20 to-indigo-500/10 hover:from-indigo-600/30 hover:to-indigo-500/20 transition-colors overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl transition-opacity" />
              <span className="relative flex items-center gap-2 text-indigo-300 group-hover:text-indigo-200 text-sm font-medium">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="opacity-80"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12l9-5-9-5-9 5 9 5z"/></svg>
                Feedbacks
              </span>
            </Link>
            <Link
              href="/admin/invitations"
              className="group relative px-4 py-2 rounded-md border border-pink-600/50 bg-gradient-to-r from-pink-600/20 to-pink-500/10 hover:from-pink-600/30 hover:to-pink-500/20 transition-colors overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-pink-600 to-fuchsia-600 blur-xl transition-opacity" />
              <span className="relative flex items-center gap-2 text-pink-300 group-hover:text-pink-200 text-sm font-medium">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="opacity-80"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
                Invitaciones
              </span>
            </Link>
            <Link
              href="/admin/smtp-config"
              className="group relative px-4 py-2 rounded-md border border-purple-600/50 bg-gradient-to-r from-purple-600/20 to-purple-500/10 hover:from-purple-600/30 hover:to-purple-500/20 transition-colors overflow-hidden"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 to-indigo-600 blur-xl transition-opacity" />
              <span className="relative flex items-center gap-2 text-purple-300 group-hover:text-purple-200 text-sm font-medium">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="opacity-80"><path d="M12 2l7 4v6c0 5-3.5 9.74-7 10-3.5-.26-7-5-7-10V6l7-4z"/></svg>
                SMTP
              </span>
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="loader">
                <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
              </div>
            </div>
          ) : (
            <>
              {conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No conversations found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-zinc-700">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Started</th>
                        <th className="pb-3">Last Message</th>
                        <th className="pb-3">Messages</th>
                        <th className="pb-3">Sample</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversations.map((conversation) => (
                        <tr key={conversation.conversationId} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {conversation.user?.picture && (
                                <img 
                                  src={conversation.user.picture} 
                                  alt={conversation.user.name || 'User'} 
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              <div>
                                <div>{conversation.user?.name || conversation.user?.email || 'Unknown'}</div>
                                <div className="text-sm text-gray-400">{conversation.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            {formatDate(conversation.startedAt)}
                          </td>
                          <td className="py-4">
                            {formatDate(conversation.lastMessageAt)}
                          </td>
                          <td className="py-4">
                            {conversation.messageCount}
                          </td>
                          <td className="py-4 max-w-xs">
                            <div className="text-sm text-gray-300 mb-1">
                              <span className="font-semibold">User:</span> {truncateText(conversation.sampleUserMessage)}
                            </div>
                            <div className="text-sm text-gray-400">
                              <span className="font-semibold">AI:</span> {truncateText(conversation.sampleAIMessage)}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <Link 
                              href={`/admin/conversation/${conversation.conversationId}`} 
                              className="px-3 py-1 bg-indigo-900/50 hover:bg-indigo-800/50 rounded text-sm transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md ${
                        pagination.page === page
                          ? 'bg-indigo-800 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;