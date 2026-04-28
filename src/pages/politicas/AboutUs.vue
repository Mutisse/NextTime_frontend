<template>
  <q-layout>
    <HeaderC />
    <div class="flex flex-center q-mt-md q-mb-md">
      <q-card class="q-pa-md" style="max-width: 800px; width: 100%">
        <q-card-section>
          <h6 class="">Sobre Nós</h6>
          <p class="">
            Bem-vindo ao KLC Market, sua plataforma de compras online dedicada a
            oferecer uma experiência de compra única e conveniente. Aqui, você
            pode explorar uma vasta seleção de produtos de qualidade, tudo com a
            comodidade do pagamento na entrega. Nossa missão é tornar suas
            compras mais simples, seguras e acessíveis.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <h6>Nossa Missão</h6>
          <p>
            No KLC Market, nossa missão é conectar compradores e vendedores
            locais, facilitando a compra e entrega de produtos de qualidade de
            forma rápida e segura. Queremos criar uma comunidade onde todos
            possam encontrar o que precisam, de maneira prática e confiável.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <h6>Nossos Valores</h6>
          <ul class="list-style">
            <li>
              <strong>Confiança</strong>: Construir relacionamentos sólidos e
              duradouros.
            </li>
            <li>
              <strong>Transparência</strong>: Manter uma comunicação clara e
              honesta.
            </li>
            <li>
              <strong>Inovação</strong>: Buscar constantemente melhorias e
              soluções criativas.
            </li>
          </ul>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="false">
          <h6>Estatísticas Fictícias</h6>
          <ul class="list-style">
            <li>
              <strong>+50.000 produtos</strong> disponíveis em nossa plataforma.
            </li>
            <li><strong>+10.000 usuários ativos</strong> registrados.</li>
            <li>
              <strong>95% de satisfação do cliente</strong> com base em
              feedbacks.
            </li>
            <li><strong>+1.500 entregas</strong> realizadas mensalmente.</li>
          </ul>
        </q-card-section>

        <q-separator v-if="false" />

        <q-card-section>
          <h6>Por que Escolher o KLC Market?</h6>
          <ul class="list-style">
            <li>
              <strong>Pagamento na entrega</strong>: Sinta-se seguro ao pagar
              somente quando seu pedido chegar.
            </li>
            <li>
              <strong>Variedade de produtos</strong>: Encontre tudo o que você
              precisa em um só lugar.
            </li>
            <li>
              <strong>Suporte ao cliente</strong>: Nossa equipe está pronta para
              ajudá-lo a qualquer momento.
            </li>
          </ul>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <h6>Nossa História</h6>
          <p>
            O KLC Market foi fundado com a visão de transformar a experiência de
            compra online. Desde nossa fundação, temos trabalhado arduamente
            para evoluir e expandir, sempre com o compromisso de servir nossa
            comunidade. Acreditamos que a compra local deve ser fácil e
            acessível, e continuaremos a nos dedicar a essa missão.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <h6>Entre em Contato Conosco</h6>
          <p>
            Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de
            assistência, entre em contato conosco:
          </p>
          <ul>
            <li><strong>Telefone</strong>:87 370 3909</li>
            <li v-if="false"><strong>E-mail</strong>: suporte@klcmarket.com</li>
          </ul>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <p class="">
            Agradecemos por escolher o KLC Market! Estamos ansiosos para
            atendê-lo e fazer parte de sua experiência de compras.
          </p>
        </q-card-section>
      </q-card>
    </div>
    <FooterC />
  </q-layout>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";
export default {
  components: {
    HeaderC,
    FooterC,
  },
  name: "AboutUs",
};
</script>

<style scoped>
h6 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

h6 {
  font-size: 1.8em;
  margin-top: 20px;
}

.list-style {
  list-style-type: disc;
  margin-left: 20px;
}

.q-separator {
  margin: 20px 0;
}

.q-card {
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
