'use client';

import React from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
  Clock,
  BookOpen,
  BarChart3,
  Layers,
} from 'lucide-react';
import { ConversationSession, ActiveNavTab } from '@/types';
import { PRACTICE_TOPICS } from '@/lib/constants';

interface SidebarProps {
  conversations: ConversationSession[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSelectTab?: (tab: ActiveNavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpenMobile,
  onCloseMobile,
  onSelectTab,
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTopicIcon = (topicId?: string) => {
    const found = PRACTICE_TOPICS.find((t) => t.id === topicId);
    return found?.icon || '💬';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* 1. Header / New Chat Action */}
      <div className="p-4 border-b border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900">Chat History</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* + New Chat Button (Prominent, ChatGPT/Gemini style) */}
        <button
          onClick={() => {
            onNewChat();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span>New Chat</span>
        </button>
      </div>

      {/* 2. Recent Chats Section Header */}
      <div className="px-4 pt-3.5 pb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Recent Chats
        </span>
        {conversations.length > 0 && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {conversations.length}
          </span>
        )}
      </div>

      {/* 3. Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-600">No previous chats yet</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Start practicing to build your conversational history!
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const topicIcon = getTopicIcon(conv.topic);

            return (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  onCloseMobile();
                }}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-950 font-semibold border border-indigo-200/80 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-base shrink-0">{topicIcon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium leading-tight">
                      {conv.title || 'English Practice'}
                    </p>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatTimeAgo(conv.updatedAt || conv.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Delete Button on Hover or Active */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this chat history?')) {
                      onDeleteConversation(conv.id, e);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-all shrink-0"
                  title="Delete conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Quick Links */}
      {onSelectTab && (
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 space-y-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => {
              onSelectTab('vocabulary');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors text-left"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Vocabulary Notebook</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('progress');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition-colors text-left"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Progress Dashboard</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Docked Sidebar (Always visible on left of chat interface) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-slate-200/90 bg-white shadow-xs self-stretch min-h-[calc(100vh-61px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-over with overlay backdrop) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-out Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out animate-slideIn">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
