import { categories } from '../mocks/data.js'

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 900 + 300))

export const categoryService = {
  async getCategories() {
    await simulateLatency()
    return [...categories]
  },

  async getCategoryById(id) {
    await simulateLatency()
    const category = categories.find(c => c.id === id)
    if (!category) throw new Error('Categoria não encontrada')
    return { ...category }
  }
}
