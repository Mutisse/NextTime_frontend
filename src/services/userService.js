import { users, userEvents, userTickets, userMatches } from '../mocks/userData.js'

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

export const userService = {
  // Obter todos os utilizadores
  async getUsers() {
    await simulateLatency()
    return [...users]
  },

  // Obter utilizador por ID
  async getUserById(id) {
    await simulateLatency()
    const user = users.find(u => u.id === id)
    if (!user) throw new Error('Utilizador não encontrado')
    return { ...user }
  },

  // Obter utilizador atual (simula sessão)
  async getCurrentUser() {
    await simulateLatency()
    // Simula utilizador logado (ID 1)
    const currentUser = users.find(u => u.id === 1)
    return { ...currentUser }
  },

  // Atualizar perfil do utilizador
  async updateUserProfile(userId, updates) {
    await simulateLatency()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('Utilizador não encontrado')
    users[userIndex] = { ...users[userIndex], ...updates }
    return { ...users[userIndex] }
  },

  // Tornar-se promotor (pagando taxa)
  async upgradeToPromoter(userId, paymentData) {
    await simulateLatency(800)
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) throw new Error('Utilizador não encontrado')

    // Taxa de promotor: 500 MZN
    const PROMOTER_FEE = 500

    if (paymentData.paymentMethod === 'mpesa' || paymentData.paymentMethod === 'card') {
      users[userIndex].isPromoter = true
      users[userIndex].promoterSince = new Date().toISOString()
      users[userIndex].promoterFeePaid = PROMOTER_FEE
      return { success: true, user: { ...users[userIndex] }, fee: PROMOTER_FEE }
    }
    throw new Error('Pagamento falhou')
  },

  // Obter eventos criados pelo utilizador (como promotor)
  async getMyCreatedEvents(userId) {
    await simulateLatency()
    return [...userEvents.filter(e => e.creatorId === userId)]
  },

  // Obter eventos onde o utilizador está inscrito
  async getMyRegisteredEvents(userId) {
    await simulateLatency()
    const registrations = userTickets.filter(t => t.userId === userId)
    return registrations
  },

  // Inscrever-se num evento
  async registerForEvent(userId, eventId, paymentData = null) {
    await simulateLatency()

    const event = await import('./eventService.js').then(m => m.eventService.getEventById(eventId))

    // Verificar se já está inscrito
    const alreadyRegistered = userTickets.some(t => t.userId === userId && t.eventId === eventId)
    if (alreadyRegistered) throw new Error('Já está inscrito neste evento')

    // Verificar lotação
    const registeredCount = userTickets.filter(t => t.eventId === eventId).length
    if (registeredCount >= event.limiteParticipantes) throw new Error('Evento esgotado')

    const ticket = {
      id: userTickets.length + 1,
      userId,
      eventId,
      status: paymentData ? 'paid' : 'pending',
      paymentMethod: paymentData?.paymentMethod || null,
      amount: event.tipo === 'pago' ? (event.preco || 100) : 0,
      registeredAt: new Date().toISOString(),
      qrCode: `TICKET_${userId}_${eventId}_${Date.now()}`
    }

    userTickets.push(ticket)
    return ticket
  },

  // Pagar bilhete
  async payTicket(ticketId, paymentData) {
    await simulateLatency()
    const ticketIndex = userTickets.findIndex(t => t.id === ticketId)
    if (ticketIndex === -1) throw new Error('Bilhete não encontrado')

    userTickets[ticketIndex].status = 'paid'
    userTickets[ticketIndex].paidAt = new Date().toISOString()
    userTickets[ticketIndex].paymentMethod = paymentData.paymentMethod

    return userTickets[ticketIndex]
  },

  // Criar novo evento (qualquer utilizador pode)
  async createEvent(eventData) {
    await simulateLatency()
    const newEvent = {
      id: Date.now(),
      ...eventData,
      status: 'ativo',
      createdAt: new Date().toISOString(),
      participantes: 0
    }

    // Salvar no array de eventos do utilizador
    userEvents.push(newEvent)

    // Também adicionar ao eventoService global (simulação)
    const { eventService } = await import('./eventService.js')
    const allEvents = await eventService.getEvents()
    allEvents.push(newEvent)

    return newEvent
  },

  // Atualizar evento
  async updateEvent(eventId, updates) {
    await simulateLatency()
    const eventIndex = userEvents.findIndex(e => e.id === eventId)
    if (eventIndex === -1) throw new Error('Evento não encontrado')
    userEvents[eventIndex] = { ...userEvents[eventIndex], ...updates }
    return userEvents[eventIndex]
  },

  // Cancelar evento
  async cancelEvent(eventId) {
    await simulateLatency()
    const eventIndex = userEvents.findIndex(e => e.id === eventId)
    if (eventIndex === -1) throw new Error('Evento não encontrado')
    userEvents[eventIndex].status = 'cancelado'
    return userEvents[eventIndex]
  },

  // Pedir match com outro utilizador (mesma cidade/utm)
  async requestMatch(userId, targetUserId, eventId) {
    await simulateLatency()

    // Verificar se já existe match
    const existingMatch = userMatches.find(m =>
      (m.userId === userId && m.targetUserId === targetUserId && m.eventId === eventId) ||
      (m.userId === targetUserId && m.targetUserId === userId && m.eventId === eventId)
    )

    if (existingMatch) {
      if (existingMatch.status === 'pending') throw new Error('Pedido de match já enviado')
      if (existingMatch.status === 'accepted') return existingMatch
    }

    const newMatch = {
      id: userMatches.length + 1,
      userId,
      targetUserId,
      eventId,
      status: 'pending',
      requestedAt: new Date().toISOString()
    }

    userMatches.push(newMatch)
    return newMatch
  },

  // Aceitar match
  async acceptMatch(matchId) {
    await simulateLatency()
    const matchIndex = userMatches.findIndex(m => m.id === matchId)
    if (matchIndex === -1) throw new Error('Match não encontrado')
    userMatches[matchIndex].status = 'accepted'
    userMatches[matchIndex].acceptedAt = new Date().toISOString()
    return userMatches[matchIndex]
  },

  // Obter matches do utilizador
  async getUserMatches(userId) {
    await simulateLatency()
    return userMatches.filter(m => m.userId === userId || m.targetUserId === userId)
  }
}
