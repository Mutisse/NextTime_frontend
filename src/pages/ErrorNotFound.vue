<template>
  <q-layout>
    <!-- Cabeçalho da página -->
    <HeaderC />

    <!-- Conteúdo principal da página de erro -->
    <div class="error-container">
      <!-- Fundo com gradiente moderno -->
      <div class="error-background"></div>

      <!-- Conteúdo principal -->
      <div class="error-content">
        <!-- Código do erro com animação -->
        <div class="error-code-wrapper">
          <span class="error-digit">4</span>
          <span class="error-digit">0</span>
          <span class="error-digit">4</span>
        </div>

        <!-- Mensagem principal -->
        <div class="error-title">
          <h2>Oops! Página não encontrada</h2>
        </div>

        <!-- Descrição -->
        <div class="error-description">
          <p>A página que você está procurando pode ter sido removida,</p>
          <p>teve o nome alterado ou está temporariamente indisponível.</p>
        </div>

        <!-- Botões de ação -->
        <div class="action-buttons">
          <q-btn
            class="btn-primary"
            unelevated
            to="/"
            label="Voltar ao Início"
            no-caps
          >
            <template v-slot:default>
              <span>🏠</span>
              <span>Voltar ao Início</span>
            </template>
          </q-btn>

          <q-btn
            class="btn-secondary"
            outline
            @click="goToShop"
            label="Explorar Eventos"
            no-caps
          >
            <template v-slot:default>
              <span>🎉</span>
              <span>Explorar Eventos</span>
            </template>
          </q-btn>
        </div>

        <!-- Links úteis -->
        <div class="helpful-links">
          <span class="links-title">Ou acesse:</span>
          <div class="links-grid">
            <a href="#" class="help-link" @click.prevent="goToHome">🏠 Início</a>
            <a href="#" class="help-link" @click.prevent="goToEvents">📅 Eventos</a>
            <a href="#" class="help-link" @click.prevent="goToPromotions">🎉 Promoções</a>
            <a href="#" class="help-link" @click.prevent="goToContact">📞 Contato</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé da página -->
    <FooterC />
  </q-layout>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";

export default {
  name: "ErrorNotFound",
  components: {
    HeaderC,
    FooterC,
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    },
    goToEvents() {
      this.$router.push('/events');
    },
    goToPromotions() {
      this.$router.push('/promotions');
    },
    goToContact() {
      this.$router.push('/contact');
    },
    goToShop() {
      this.$router.push('/events');
    }
  }
};
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Fundo com gradiente moderno */
.error-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0.08;
  z-index: 0;
}

.error-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), rgba(0, 0, 0, 0) 70%);
}

.error-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
}

/* Código de erro */
.error-code-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.error-digit {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-digit:nth-child(2) {
  animation-delay: 0.2s;
}

.error-digit:nth-child(3) {
  animation-delay: 0.4s;
}

/* Título */
.error-title h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
}

/* Descrição */
.error-description p {
  font-size: 1rem;
  color: #64748b;
  margin: 4px 0;
}

/* Botões de ação */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 40px 0 32px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 12px 28px;
  border-radius: 40px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  border-color: #667eea;
  color: #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Links úteis */
.helpful-links {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.links-title {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 12px;
}

.links-grid {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.help-link {
  color: #475569;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.help-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

/* Responsivo */
@media (max-width: 768px) {
  .error-digit {
    font-size: 70px;
    gap: 10px;
  }

  .error-title h2 {
    font-size: 1.5rem;
  }

  .error-description p {
    font-size: 0.9rem;
  }

  .action-buttons {
    gap: 12px;
  }

  .btn-primary, .btn-secondary {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .links-grid {
    gap: 12px;
  }

  .help-link {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 40px 16px;
  }

  .error-digit {
    font-size: 50px;
    gap: 8px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .links-grid {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
