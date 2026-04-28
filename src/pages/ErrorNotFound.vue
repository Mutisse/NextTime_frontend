<template>
  <q-layout>
    <!-- Cabeçalho da página -->
    <HeaderC />

    <!-- Conteúdo principal da página de erro -->
    <div class="full-heigth 100vh bg-light-green text-green-10 text-center q-pa-md flex flex-center column">
      <!-- Código do erro -->
      <div class="error-code" style="font-size: 10vh">
        404
      </div>

      <!-- Mensagem de erro -->
      <div class="text-h3 q-mt-md" style="opacity: .6">
        Oops... Página não encontrada!
      </div>

      <!-- Botão para voltar à página inicial -->
      <q-btn
        class="q-mt-xl q-px-lg q-py-md shadow-2 "
        outline=""
        color="green-7"
        text-color="white"
        unelevated
        to="/"
        label="Voltar ao Início"
        no-caps
      />
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
};
</script>

<style scoped>
.full-heigth{
  height: 100vh;
}

.error-code {
  font-weight: bold;
  color: #2e7d32; /* Cor verde escura */
}

.text-h3 {
  font-size: 2rem;
  font-weight: 500;
}

.q-btn {
  transition: background-color 0.3s ease;
}

.q-btn:hover {
  background-color: #1b5e20; /* Verde mais escuro ao passar o mouse */
}

.bg-light-green {
  background-color: #e8f5e9; /* Verde claro para o fundo */
}
</style>

roupas: [
{ src: '/src/assets/fotod de js realidade virtual/t1.png' }, // Substitua por URLs reais de PNGs transparentes
{ src: '/src/assets/fotod de js realidade virtual/Botões na frente Simples ocasional Camisa Masculina.jpg' },
],
