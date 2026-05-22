import api from './api';

export interface Payment {
  id: number;
  contractId: number;
  tenantId: number;
  landlordId: number;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  note: string | null;
  tenant?: { id: number; name: string; email: string; phone: string };
  contract?: { id: number; startDate: string; endDate: string };
}

export const paymentService = {
  // UC10: Xem danh sách thanh toán (Tenant + Landlord)
  async getAll(status?: string): Promise<{ payments: Payment[]; summary: Record<string, number> }> {
    const { data } = await api.get('/payments', { params: { status } });
    return data.metaData;
  },

  // Chủ nhà đánh dấu đã thanh toán
  async markAsPaid(id: number, paidDate: string) {
    const { data } = await api.patch(`/payments/${id}/paid`, { paidDate });
    return data.metaData as Payment;
  },
};
