import { useState } from 'react';
import { Send, Image as ImageIcon, Paperclip, MoreVertical, Search } from 'lucide-react';
import { mockMessages, mockUsers, mockListings } from '../data/mockData';

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  listingId?: string;
  listingTitle?: string;
}

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const conversations: Conversation[] = [
    {
      id: 'conv1',
      userId: 'l1',
      userName: 'Nguyễn Văn A',
      lastMessage: 'Dạ còn ạ. Bạn có thể đến xem phòng vào cuối tuần không?',
      timestamp: '2026-05-19T11:00:00',
      unread: true,
      listingId: '1',
      listingTitle: 'Phòng trọ cao cấp gần trường ĐH Bách Khoa'
    },
    {
      id: 'conv2',
      userId: 'l2',
      userName: 'Trần Thị B',
      lastMessage: 'Phòng còn trống, bạn quan tâm có thể liên hệ trực tiếp',
      timestamp: '2026-05-18T14:30:00',
      unread: false,
      listingId: '2',
      listingTitle: 'Căn hộ mini 1 phòng ngủ đầy đủ nội thất'
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = mockMessages.filter(m =>
    (m.fromId === 't1' && m.toId === selectedConv?.userId) ||
    (m.fromId === selectedConv?.userId && m.toId === 't1')
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    console.log('Sending message:', messageText);
    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tin nhắn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 border-b border-border hover:bg-accent transition-colors text-left ${
                    selectedConversation === conversation.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">
                        {conversation.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold truncate">{conversation.userName}</span>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      {conversation.listingTitle && (
                        <div className="text-xs text-muted-foreground mb-1 truncate">
                          {conversation.listingTitle}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {conversations.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {selectedConv.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{selectedConv.userName}</div>
                      {selectedConv.listingTitle && (
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {selectedConv.listingTitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map(message => {
                    const isFromMe = message.fromId === 't1';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl ${
                            isFromMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className={`text-xs mt-1 block ${
                            isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {currentMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Bắt đầu cuộc trò chuyện</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex items-end gap-3">
                    <button
                      type="button"
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        rows={1}
                        className="w-full px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Send className="w-5 h-5" />
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
