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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link 
              href="/admin/feedbacks" 
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Ver Feedbacks
            </Link>
            <Link 
              href="/admin/invitations" 
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Gestionar Invitaciones
            </Link>
            <Link 
              href="/admin/smtp-config" 
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Config. SMTP
            </Link>
            <Link 
              href="/chat" 
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Ir al Chat
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