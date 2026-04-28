import { guests } from '../mocks/data.js'

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 900 + 300))

export const guestService = {
  async getGuests() {
    await simulateLatency()
    return [...guests]
  },

  async getGuestById(id) {
    await simulateLatency()
    const guest = guests.find(g => g.id === id)
    if (!guest) throw new Error('Convidado não encontrado')
    return { ...guest }
  },

  async searchGuests(query) {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    const filtered = guests.filter(guest =>
      guest.nome.toLowerCase().includes(lowerQuery) ||
      guest.tipo.toLowerCase().includes(lowerQuery) ||
      guest.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    return [...filtered]
  }
}
