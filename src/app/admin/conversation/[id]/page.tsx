'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdminUser } from '../../../../config/admin-access';

interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface ConversationData {
  id: string;
  user: User | null;
  messages: Message[];
  messageCount: number;
  startedAt: string;
  lastMessageAt: string;
}

const ConversationPage = ({ params }: { params: { id: string } }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user is admin
      if (!isAdminUser(user.email)) {
        router.push('/unauthorized');
        return;
      }
      
      fetchConversation();
    } else if (!isLoading && !user) {
      // Redirect to login if not logged in
      router.push('/api/auth/login');
    }
  }, [isLoading, user, router]);

  const fetchConversation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/conversation?conversationId=${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      
      const data = await response.json();
      setConversation(data.conversation);
    } catch (err) {
      setError('Error loading conversation. Please try again later.');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 mb-2 inline-block">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Conversation</h1>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/chat" 
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Go to Chat
            </Link>
            <a 
              href="/api/auth/logout?returnTo=/"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Logout
            </a>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="loader">
                <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
              </div>
            </div>
          ) : !conversation ? (
            <div className="text-center py-10 text-gray-400">
              Conversation not found
            </div>
          ) : (
            <>
              {/* User info */}
              <div className="mb-8 p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  {conversation.user?.picture && (
                    <img 
                      src={conversation.user.picture} 
                      alt={conversation.user.name || 'User'} 
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{conversation.user?.name || conversation.user?.email || 'Unknown User'}</h2>
                    <p className="text-gray-400">{conversation.user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400">Started:</span> {formatDate(conversation.startedAt)}
                  </div>
                  <div>
                    <span className="text-gray-400">Last message:</span> {formatDate(conversation.lastMessageAt)}
                  </div>
                  <div>
                    <span className="text-gray-400">Message count:</span> {conversation.messageCount}
                  </div>
                  <div>
                    <span className="text-gray-400">Conversation ID:</span> {conversation.id}
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <h3 className="text-xl font-semibold mb-4">Messages</h3>
              <div className="space-y-4">
                {conversation.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-indigo-900/20 border border-indigo-800/50'
                        : message.role === 'assistant'
                        ? 'bg-emerald-900/20 border border-emerald-800/50'
                        : 'bg-zinc-800/30 border border-zinc-700/50 text-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">
                        {message.role === 'user' 
                          ? conversation.user?.name || conversation.user?.email || 'User' 
                          : message.role === 'assistant' 
                          ? 'Aeternus AI' 
                          : 'System'}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(message.createdAt)}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;