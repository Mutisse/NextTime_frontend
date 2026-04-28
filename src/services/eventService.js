import { events, guests } from '../mocks/data.js'

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 900 + 300))

export const eventService = {

  // Adicione dentro do objeto eventService:

async getEventsByCity(city) {
  await simulateLatency()
  return events.filter(e => e.cidade.toLowerCase() === city.toLowerCase())
},


  async getEvents() {
    await simulateLatency()
    return [...events]
  },

  async getEventById(id) {
    await simulateLatency()
    const event = events.find(e => e.id === id)
    if (!event) throw new Error('Evento não encontrado')
    return { ...event }
  },

  async getEventsByGuest(guestId) {
    await simulateLatency()
    const guestEvents = events.filter(event => event.guestIds.includes(guestId))
    return [...guestEvents]
  },

  async searchEvents(query) {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    const filtered = events.filter(event =>
      event.titulo.toLowerCase().includes(lowerQuery) ||
      event.descricao.toLowerCase().includes(lowerQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    return [...filtered]
  },

  async filterEvents(filters) {
    await simulateLatency()
    let filtered = [...events]

    if (filters.categoryId) {
      filtered = filtered.filter(e => e.categoryId === filters.categoryId)
    }
    if (filters.tipo && filters.tipo !== 'todos') {
      filtered = filtered.filter(e => e.tipo === filters.tipo)
    }
    if (filters.guestId) {
      filtered = filtered.filter(e => e.guestIds.includes(filters.guestId))
    }
    if (filters.localizacao) {
      const loc = filters.localizacao.toLowerCase()
      filtered = filtered.filter(e => e.localizacao.toLowerCase().includes(loc))
    }
    if (filters.dataInicio) {
      const startDate = new Date(filters.dataInicio)
      filtered = filtered.filter(e => new Date(e.dataHora) >= startDate)
    }
    if (filters.dataFim) {
      const endDate = new Date(filters.dataFim)
      filtered = filtered.filter(e => new Date(e.dataHora) <= endDate)
    }

    // No filterEvents, adicione:
if (filters.cidade) {
  filtered = filtered.filter(e => e.cidade.toLowerCase().includes(filters.cidade.toLowerCase()))
}
    return [...filtered]
  }
}
