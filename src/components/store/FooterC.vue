<template>
  <footer class="footer-custom">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Sobre Nós</h3>
          <p>Plataforma de marketplace para eventos e serviços, conectando prestadores a clientes.</p>
        </div>
        
        <div class="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            <li><a href="#" @click.prevent="$router.push('/')">Início</a></li>
            <li><a href="#" @click.prevent="$router.push('/events')">Eventos</a></li>
            <li><a href="#" @click.prevent="$router.push('/services')">Serviços</a></li>
            <li><a href="#" @click.prevent="$router.push('/contact')">Contato</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Políticas</h3>
          <ul>
            <li><a href="#" @click.prevent="$router.push('/privacy')">Privacidade</a></li>
            <li><a href="#" @click.prevent="$router.push('/terms')">Termos de Uso</a></li>
            <li><a href="#" @click.prevent="$router.push('/faq')">FAQ</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Redes Sociais</h3>
          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">📷</a>
            <a href="#" class="social-link">🐦</a>
            <a href="#" class="social-link">💼</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 KLC Market. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-custom {
  background: #1e293b;
  color: #e2e8f0;
  padding: 3rem 0 1rem 0;
  margin-top: 3rem;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  line-height: 1.6;
  font-size: 0.875rem;
  color: #94a3b8;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #6366f1;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #6366f1;
  transform: translateY(-3px);
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
  font-size: 0.75rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>
