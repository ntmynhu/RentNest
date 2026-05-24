import { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, AlertCircle, RefreshCw } from 'lucide-react';
import { messageService, Conversation, Message } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ASR-16: Retry helper – exponential backoff, up to maxRetries attempts
  const sendWithRetry = async (fn: () => Promise<Message>, maxRetries = 2): Promise<Message> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        if (attempt === maxRetries) throw err;
        // Wait 1s, then 2s before next attempt
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  };

  // Load conversations on mount + connect socket
  useEffect(() => {
    messageService.getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoadingConvs(false));

    if (user) {
      const sock = messageService.connectSocket(user.id);

      // Real-time: incoming new message
      sock.on('new_message', (msg: Message & { conversationId: number }) => {
        // If this message belongs to the currently open conversation, append it
        setMessages(prev => {
          if (selectedConvId === msg.conversationId) {
            return [...prev, msg];
          }
          return prev;
        });

        // Update lastMessage preview in sidebar
        setConversations(prev => prev.map(c =>
          c.id === msg.conversationId
            ? { ...c, messages: [msg] }
            : c
        ));
      });
    }

    return () => {
      messageService.disconnectSocket();
    };
  }, [user]);

  // Re-register new_message listener when selectedConvId changes
  useEffect(() => {
    const sock = messageService.getSocket();
    if (!sock) return;

    sock.off('new_message');
    sock.on('new_message', (msg: Message & { conversationId: number }) => {
      if (selectedConvId === msg.conversationId) {
        setMessages(prev => [...prev, msg]);
      }
      setConversations(prev => prev.map(c =>
        c.id === msg.conversationId ? { ...c, messages: [msg] } : c
      ));
    });
  }, [selectedConvId]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConvId) return;
    setLoadingMsgs(true);
    setMessages([]);
    messageService.getMessages(selectedConvId)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));

    // Join socket room for this conversation
    const sock = messageService.getSocket();
    sock?.emit('join_conversation', selectedConvId);
  }, [selectedConvId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConv = conversations.find(c => c.id === selectedConvId) ?? null;

  const getOtherUser = (conv: Conversation) => {
    if (!user) return null;
    return user.role === 'LANDLORD' ? conv.tenant : conv.landlord;
  };

  const getLastMessage = (conv: Conversation) =>
    conv.messages[conv.messages.length - 1]?.content ?? '';

  const filteredConvs = conversations.filter(c => {
    const other = getOtherUser(c);
    return !searchText || other?.fullName.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConv || !user || isSending) return;

    const text = messageText;
    setMessageText('');
    setSendError('');
    setIsSending(true);

    try {
      // ASR-16: Auto-retry up to 2 times with exponential backoff (1s, 2s)
      const newMsg = await sendWithRetry(() => {
        if (user.role === 'LANDLORD') {
          return messageService.sendToTenant(selectedConv.tenantId, text);
        } else {
          return messageService.sendToLandlord(selectedConv.landlordId, text, selectedConv.listingId ?? undefined);
        }
      });

      setMessages(prev => [...prev, newMsg]);
      setConversations(prev => prev.map(c =>
        c.id === selectedConvId ? { ...c, messages: [newMsg] } : c
      ));

      // Emit via socket for real-time delivery to the other side
      const sock = messageService.getSocket();
      sock?.emit('send_message', { conversationId: selectedConvId, content: text });
    } catch {
      // All retries failed – restore text + show error
      setMessageText(text);
      setSendError('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffH < 1) {
      const diffM = Math.floor((now.getTime() - date.getTime()) / 60000);
      return `${diffM} phút trước`;
    }
    if (diffH < 24) return `${diffH} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tin nhắn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar: conversation list */}
          <div className="lg:col-span-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-4 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />)}
                </div>
              ) : filteredConvs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Chưa có tin nhắn nào
                </div>
              ) : filteredConvs.map(conv => {
                const other = getOtherUser(conv);
                const lastMsg = getLastMessage(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full p-4 border-b border-border hover:bg-accent transition-colors text-left ${
                      selectedConvId === conv.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">
                          {other?.fullName?.charAt(0) ?? '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{other?.fullName ?? 'Người dùng'}</div>
                        {conv.listing && (
                          <div className="text-xs text-muted-foreground truncate">{conv.listing.title}</div>
                        )}
                        <p className="text-sm text-muted-foreground truncate">{lastMsg}</p>
                        {conv.messages[0] && (
                          <span className="text-xs text-muted-foreground">{formatTime(conv.messages[0].createdAt)}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {getOtherUser(selectedConv)?.fullName?.charAt(0) ?? '?'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {getOtherUser(selectedConv)?.fullName ?? 'Người dùng'}
                      </div>
                      {selectedConv.listing && (
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {selectedConv.listing.title}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMsgs ? (
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                          <div className="h-10 w-48 bg-muted/40 rounded-2xl animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Bắt đầu cuộc trò chuyện</p>
                    </div>
                  ) : messages.map(msg => {
                    const isFromMe = msg.fromUserId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-2 rounded-2xl ${
                          isFromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <span className={`text-xs mt-1 block ${
                            isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  {sendError && (
                    <div className="mb-2 flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{sendError}</span>
                      <button
                        type="button"
                        onClick={() => setSendError('')}
                        className="ml-auto text-xs underline hover:no-underline"
                      >
                        Đóng
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={messageText}
                        onChange={e => { setMessageText(e.target.value); setSendError(''); }}
                        placeholder="Nhập tin nhắn..."
                        rows={1}
                        disabled={isSending}
                        className="w-full px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-60"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!messageText.trim() || isSending}
                      className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      {isSending
                        ? <RefreshCw className="w-5 h-5 animate-spin" />
                        : <Send className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Chọn một cuộc trò chuyện</h3>
                  <p className="text-muted-foreground">
                    Chọn tin nhắn từ danh sách bên trái để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
