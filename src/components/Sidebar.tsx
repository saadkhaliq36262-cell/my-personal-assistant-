'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Check,
  BookOpen,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';
import { ConversationSession, ActiveNavTab } from '@/types';
import { PRACTICE_TOPICS } from '@/lib/constants';

interface SidebarProps {
  conversations: ConversationSession[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
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
  onRenameConversation,
  isOpenMobile,
  onCloseMobile,
  onSelectTab,
}) => {
  // Menu state for three-dot dropdown
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.conv-dropdown-menu') && !target.closest('.conv-menu-trigger')) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

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

  const startEditing = (conv: ConversationSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingId(conv.id);
    setEditTitleText(conv.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitleText.trim()) {
      onRenameConversation(id, editTitleText.trim());
    }
    setEditingId(null);
    setEditTitleText('');
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditTitleText('');
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteConversation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
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
          <span>+ New Chat</span>
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
          <div className="px-4 py-12 text-center text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2.5 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-700">No conversations yet</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-[200px] mx-auto">
              Start a new conversation to begin practicing English.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isEditing = conv.id === editingId;
            const isMenuOpen = conv.id === openMenuId;
            const topicIcon = getTopicIcon(conv.topic);

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isEditing) {
                    onSelectConversation(conv.id);
                    onCloseMobile();
                  }
                }}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-50/95 text-indigo-950 font-semibold border border-indigo-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                }`}
              >
                {/* Left icon & title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <span className="text-base shrink-0">{topicIcon}</span>

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveRename(conv.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 min-w-0 flex-1"
                    >
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        className="w-full bg-white border border-indigo-300 rounded px-2 py-0.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-1 rounded text-slate-400 hover:bg-slate-100"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium leading-tight text-slate-800">
                        {conv.title || 'New Conversation'}
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {formatTimeAgo(conv.updatedAt || conv.createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Three-dot menu button */}
                {!isEditing && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : conv.id);
                      }}
                      className={`conv-menu-trigger p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-all ${
                        isMenuOpen ? 'opacity-100 bg-slate-200/70' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      title="Options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Dropdown Menu (Rename, Delete) */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="conv-dropdown-menu absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-200 z-30 py-1 text-xs animate-fadeIn"
                      >
                        <button
                          type="button"
                          onClick={(e) => startEditing(conv, e)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-400" />
                          <span>Rename</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            setDeleteConfirmId(conv.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
        >
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Delete this conversation?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              This will permanently remove this chat from your practice history. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
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
