// Utilizadores do sistema
export const users = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    telefone: '+258 84 123 4567',
    cidade: 'Maputo',
    dataNascimento: '1990-05-15',
    isPromoter: true,
    promoterSince: '2025-01-10',
    promoterFeePaid: 500,
    bio: 'Amante de música e eventos culturais',
    interesses: ['música', 'arte', 'tecnologia'],
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    telefone: '+258 82 987 6543',
    cidade: 'Matola',
    dataNascimento: '1995-08-22',
    isPromoter: false,
    bio: 'Exploradora de novas experiências',
    interesses: ['gastronomia', 'viagens', 'fotografia'],
    createdAt: '2024-02-15'
  },
  {
    id: 3,
    nome: 'Carlos Alberto',
    email: 'carlos@email.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    telefone: '+258 85 456 7890',
    cidade: 'Beira',
    dataNascimento: '1988-11-30',
    isPromoter: true,
    promoterSince: '2025-02-20',
    promoterFeePaid: 500,
    bio: 'Produtor de eventos e festivais',
    interesses: ['música eletrónica', 'produção', 'networking'],
    createdAt: '2024-01-20'
  }
]

// Eventos criados pelos utilizadores
export const userEvents = [
  {
    id: 101,
    titulo: 'Festa da Primavera',
    descricao: 'Celebração da chegada da primavera com muita música e diversão',
    categoryId: 2,
    dataHora: '2025-09-20T20:00:00',
    localizacao: 'Maputo, Marginal',
    cidade: 'Maputo',
    coordenadas: { lat: -25.9692, lng: 32.5732 },
    imagem: 'https://picsum.photos/id/29/800/400',
    limiteParticipantes: 500,
    tipo: 'pago',
    preco: 250,
    guestIds: [1, 3],
    tags: ['festa', 'música', 'verão'],
    status: 'ativo',
    creatorId: 1,
    isPromoted: true,
    idadeMinima: 18,
    requiresAgeVerification: true,
    createdAt: '2025-08-01'
  },
  {
    id: 102,
    titulo: 'Workshop de Fotografia',
    descricao: 'Aprenda técnicas avançadas de fotografia com profissionais',
    categoryId: 4,
    dataHora: '2025-10-05T09:00:00',
    localizacao: 'Maputo, Centro Cultural',
    cidade: 'Maputo',
    coordenadas: { lat: -25.9692, lng: 32.5732 },
    imagem: 'https://picsum.photos/id/96/800/400',
    limiteParticipantes: 30,
    tipo: 'pago',
    preco: 500,
    guestIds: [],
    tags: ['fotografia', 'aprendizagem', 'arte'],
    status: 'ativo',
    creatorId: 1,
    isPromoted: false,
    idadeMinima: 16,
    requiresAgeVerification: false,
    createdAt: '2025-08-10'
  }
]

// Bilhetes/inscrições dos utilizadores
export const userTickets = [
  {
    id: 1,
    userId: 1,
    eventId: 2,
    status: 'paid',
    paymentMethod: 'mpesa',
    amount: 0,
    registeredAt: '2025-08-15T10:30:00',
    paidAt: '2025-08-15T10:30:00',
    qrCode: 'TICKET_1_2_123456'
  },
  {
    id: 2,
    userId: 1,
    eventId: 3,
    status: 'paid',
    paymentMethod: 'card',
    amount: 100,
    registeredAt: '2025-08-16T14:20:00',
    paidAt: '2025-08-16T14:25:00',
    qrCode: 'TICKET_1_3_123457'
  },
  {
    id: 3,
    userId: 2,
    eventId: 101,
    status: 'pending',
    paymentMethod: null,
    amount: 250,
    registeredAt: '2025-08-20T09:00:00',
    qrCode: 'TICKET_2_101_123458'
  }
]

// Matches entre utilizadores
export const userMatches = [
  {
    id: 1,
    userId: 1,
    targetUserId: 2,
    eventId: 101,
    status: 'accepted',
    requestedAt: '2025-08-18T15:30:00',
    acceptedAt: '2025-08-18T16:00:00'
  },
  {
    id: 2,
    userId: 1,
    targetUserId: 3,
    eventId: 2,
    status: 'pending',
    requestedAt: '2025-08-19T11:00:00'
  }
]
