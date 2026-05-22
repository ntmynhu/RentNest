import api from './api';

export const reportService = {
  // UC12: Báo cáo vi phạm
  async create(payload: {
    reportedItemType: 'LISTING' | 'PROFILE';
    reportedItemId: number;
    reason: string;
    description?: string;
    contactEmail?: string;
  }) {
    const { data } = await api.post('/reports', payload);
    return data.metaData;
  },
};
