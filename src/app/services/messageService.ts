import api from './api';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: number;
  conversationId: number;
  fromUserId: number;
  content: string;
  isRead: boolean;
  status: 'SENT' | 'READ';
  createdAt: string;
}

export interface Conversation {
  id: number;
  tenantId: number;
  landlordId: number;
  listingId: number | null;
  tenant: { id: number; fullName: string; avatar: string | null };
  landlord: { id: number; fullName: string; avatar: string | null };
  listing: { id: number; title: string } | null;
  messages: Message[];
}

// Singleton Socket.IO instance
let socket: Socket | null = null;

export const messageService = {
  // Kết nối WebSocket
  connectSocket(userId: number) {
    if (!socket) {
      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
        query: { userId: String(userId) },
        withCredentials: true,
      });
    }
    return socket;
  },

  disconnectSocket() {
    socket?.disconnect();
    socket = null;
  },

  getSocket() {
    return socket;
  },

  // Lấy danh sách conversations
  async getConversations(): Promise<Conversation[]> {
    const { data } = await api.get('/messages/conversations');
    return data.metaData;
  },

  // Lấy tin nhắn trong một conversation
  async getMessages(conversationId: number): Promise<Message[]> {
    const { data } = await api.get(`/messages/conversations/${conversationId}`);
    return data.metaData;
  },

  // UC6: Tenant nhắn tin cho Landlord
  async sendToLandlord(landlordId: number, content: string, listingId?: number) {
    const { data } = await api.post(`/messages/landlord/${landlordId}`, { content, listingId });
    return data.metaData;
  },

  // UC14: Landlord nhắn tin cho Tenant
  async sendToTenant(tenantId: number, content: string) {
    const { data } = await api.post(`/messages/tenant/${tenantId}`, { content });
    return data.metaData;
  },
};
