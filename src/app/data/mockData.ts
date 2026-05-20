export interface Listing {
  id: string;
  title: string;
  price: number;
  area: number;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  images: string[];
  amenities: string[];
  roomType: 'studio' | 'shared' | 'apartment' | 'house';
  status: 'available' | 'rented' | 'pending';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  landlordId: string;
  landlordName: string;
  description: string;
  utilities: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    parking: boolean;
    aircon: boolean;
  };
  createdAt: string;
}

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Phòng trọ cao cấp gần trường ĐH Bách Khoa',
    price: 4500000,
    area: 25,
    address: {
      street: '123 Lý Thường Kiệt',
      ward: 'Phường 7',
      district: 'Quận 10',
      city: 'TP. Hồ Chí Minh'
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    amenities: ['Gác lửng', 'WC riêng', 'Ban công', 'Bếp riêng'],
    roomType: 'studio',
    status: 'available',
    approvalStatus: 'approved',
    landlordId: 'l1',
    landlordName: 'Nguyễn Văn A',
    description: 'Phòng mới xây, đầy đủ tiện nghi, an ninh 24/7, gần trường học và chợ.',
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: true,
      aircon: true
    },
    createdAt: '2026-05-01'
  },
  {
    id: '2',
    title: 'Căn hộ mini 1 phòng ngủ đầy đủ nội thất',
    price: 6000000,
    area: 30,
    address: {
      street: '456 Nguyễn Thị Minh Khai',
      ward: 'Phường Đa Kao',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh'
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    ],
    amenities: ['Máy lạnh', 'Tủ lạnh', 'Máy giặt', 'Giường'],
    roomType: 'apartment',
    status: 'available',
    approvalStatus: 'approved',
    landlordId: 'l2',
    landlordName: 'Trần Thị B',
    description: 'Căn hộ mới 100%, view đẹp, gần trung tâm thành phố.',
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: true,
      aircon: true
    },
    createdAt: '2026-05-05'
  },
  {
    id: '3',
    title: 'Phòng ở ghép cho sinh viên - giá rẻ',
    price: 2000000,
    area: 15,
    address: {
      street: '789 Lê Văn Việt',
      ward: 'Tăng Nhơn Phú A',
      district: 'Quận 9',
      city: 'TP. Hồ Chí Minh'
    },
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ],
    amenities: ['Giường tầng', 'Tủ cá nhân', 'WC chung'],
    roomType: 'shared',
    status: 'available',
    approvalStatus: 'approved',
    landlordId: 'l1',
    landlordName: 'Nguyễn Văn A',
    description: 'Phòng sạch sẽ, an toàn, thích hợp cho sinh viên.',
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: false,
      aircon: false
    },
    createdAt: '2026-05-10'
  },
  {
    id: '4',
    title: 'Nhà nguyên căn 2 tầng cho thuê',
    price: 12000000,
    area: 80,
    address: {
      street: '321 Võ Văn Ngân',
      ward: 'Linh Chiểu',
      district: 'Thủ Đức',
      city: 'TP. Hồ Chí Minh'
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    amenities: ['2 phòng ngủ', 'Sân thượng', 'Garage', 'Bếp rộng'],
    roomType: 'house',
    status: 'available',
    approvalStatus: 'approved',
    landlordId: 'l3',
    landlordName: 'Lê Văn C',
    description: 'Nhà mới, khu dân cư an ninh, gần chợ và trường học.',
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: true,
      aircon: true
    },
    createdAt: '2026-05-12'
  },
  {
    id: '5',
    title: 'Phòng trọ có gác lửng - khu vực Bình Thạnh',
    price: 3500000,
    area: 20,
    address: {
      street: '88 Điện Biên Phủ',
      ward: 'Phường 25',
      district: 'Bình Thạnh',
      city: 'TP. Hồ Chí Minh'
    },
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'
    ],
    amenities: ['Gác lửng', 'WC riêng', 'Cửa sổ lớn'],
    roomType: 'studio',
    status: 'available',
    approvalStatus: 'pending',
    landlordId: 'l2',
    landlordName: 'Trần Thị B',
    description: 'Phòng thoáng mát, yên tĩnh, thích hợp cho người đi làm.',
    utilities: {
      electricity: true,
      water: true,
      internet: true,
      parking: false,
      aircon: true
    },
    createdAt: '2026-05-18'
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'landlord' | 'admin';
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: 'l1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    role: 'landlord'
  },
  {
    id: 'l2',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0902345678',
    role: 'landlord'
  },
  {
    id: 'l3',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0903456789',
    role: 'landlord'
  }
];

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  listingId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const mockMessages: Message[] = [
  {
    id: 'm1',
    fromId: 't1',
    toId: 'l1',
    listingId: '1',
    content: 'Xin chào, phòng này còn trống không ạ?',
    timestamp: '2026-05-19T10:30:00',
    read: true
  },
  {
    id: 'm2',
    fromId: 'l1',
    toId: 't1',
    listingId: '1',
    content: 'Dạ còn ạ. Bạn có thể đến xem phòng vào cuối tuần không?',
    timestamp: '2026-05-19T11:00:00',
    read: false
  }
];
