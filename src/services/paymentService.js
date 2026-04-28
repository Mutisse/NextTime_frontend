const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 300))

export const paymentService = {
  // Processar pagamento via M-Pesa
  async processMpesaPayment(phoneNumber, amount, description) {
    await simulateLatency()

    // Validação simples de número M-Pesa (Moçambique: 84, 85, 86)
    const mpesaRegex = /^(84|85|86)\d{7}$/
    if (!mpesaRegex.test(phoneNumber)) {
      throw new Error('Número de M-Pesa inválido')
    }

    // Simular sucesso do pagamento
    const success = Math.random() > 0.05 // 95% de sucesso

    if (success) {
      return {
        success: true,
        transactionId: `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        amount,
        phoneNumber,
        description,
        timestamp: new Date().toISOString()
      }
    } else {
      throw new Error('Falha no processamento do pagamento M-Pesa')
    }
  },

  // Processar pagamento via Cartão de Crédito
  async processCardPayment(cardData, amount, description) {
    await simulateLatency()

    // Validação básica do cartão
    if (!cardData.number || !cardData.expiry || !cardData.cvv) {
      throw new Error('Dados do cartão incompletos')
    }

    // Simular sucesso do pagamento
    const success = Math.random() > 0.03 // 97% de sucesso

    if (success) {
      return {
        success: true,
        transactionId: `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        amount,
        last4: cardData.number.slice(-4),
        description,
        timestamp: new Date().toISOString()
      }
    } else {
      throw new Error('Falha no processamento do pagamento com cartão')
    }
  },

  // Obter métodos de pagamento disponíveis
  async getPaymentMethods() {
    await simulateLatency()
    return [
      { id: 'mpesa', name: 'M-Pesa', icon: '📱', available: true },
      { id: 'card', name: 'Cartão de Crédito/Débito', icon: '💳', available: true },
      { id: 'bank_transfer', name: 'Transferência Bancária', icon: '🏦', available: false }
    ]
  },

  // Simular taxa de promotor
  async getPromoterFee() {
    await simulateLatency()
    return {
      amount: 500,
      currency: 'MZN',
      description: 'Taxa única para tornar-se promotor na plataforma',
      benefits: [
        'Publicar eventos ilimitados',
        'Destaque nos resultados de busca',
        'Estatísticas avançadas',
        'Suporte prioritário'
      ]
    }
  }
}
