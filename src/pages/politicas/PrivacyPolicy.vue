<template>
  <q-layout>
    <HeaderC />
      <!-- Toolbar -->
  <div>
    <q-toolbar
      style="
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      "
      class="bg-white q-pt-md q-pb-md"
    >
      <q-btn
        flat
        round
        dense
        size="md"
        icon="arrow_back"
        class="q-mr-sm"
        @click="voltar"
      ></q-btn>
      <div style="flex: 1; text-align: center">
        <q-toolbar-title>
          <div class="text-h41 text-primary q-mb-md">Política de Devolução</div>
        </q-toolbar-title>
      </div>
      <div style="width: 56px"></div>
      <!-- Placeholder to balance the space -->
    </q-toolbar>
  </div>
  <div class="flex flex-center q-mt-md q-mb-md">
    <q-card style="max-width: 800px; width: 100%;">
      <q-card-section>
        <h6>Política de Privacidade</h6>
        <p>Atualizado em 14/10/2024</p>

        <section id="coleta-de-informacoes">
          <h6>1. Coleta de Informações</h6>
          <p>Coletamos informações pessoais identificáveis quando você se registra em nosso site, faz um pedido ou interage conosco de outras formas. As informações podem incluir, mas não se limitam a:</p>
          <ul>
            <li>Nome</li>
            <li>Endereço de e-mail</li>
            <li>Endereço de entrega</li>
            <li>Número de telefone</li>
          </ul>
          <h6>1.1. Coleta de Informações</h6>
          Para vender na KLC Market, qualquer pessoa ou empresa deve possuir um Bilhete de Identidade (BI) e um comprovativo de residência válido. Os comprovativos de residência aceitos incluem:
          <ul>
            <li>Conta de água ou eletricidade</li>
              <li>Extrato bancário recente com endereço</li>
                <li>Contrato de aluguel ou escritura de imóvel</li>
                  <li>Documento oficial de órgão governamental que inclua o endereço. Declaração do Bairro.</li></ul>
        </section>

        <q-separator />

        <section id="uso-das-informacoes">
          <h6>2. Uso das Informações</h6>
          <p>As informações que coletamos podem ser usadas para:</p>
          <ul>
            <li>Processar suas transações</li>
            <li>Melhorar o atendimento ao cliente</li>
            <li>Enviar e-mails periódicos sobre seu pedido ou outros produtos e serviços</li>
          </ul>
        </section>

        <q-separator />

        <section id="protecao-das-informacoes">
          <h6>3. Proteção das Informações</h6>
          <p>Implementamos uma variedade de medidas de segurança para manter a segurança de suas informações pessoais. Essas medidas incluem a criptografia e o uso de firewalls.</p>
        </section>

        <q-separator />

        <section id="compartilhamento-de-informacoes">
          <h6>4. Compartilhamento de Informações</h6>
          <p>Não vendemos, trocamos ou transferimos suas informações pessoais a terceiros sem o seu consentimento, exceto para fornecer os serviços que você solicitou, como a entrega de produtos.</p>
        </section>

        <q-separator />

        <section id="cookies">
          <h6>5. Cookies</h6>
          <p>Utilizamos cookies para melhorar a sua experiência no nosso site. Os cookies são pequenos arquivos que um site transfere para o disco rígido do seu computador. Você pode optar por desativar os cookies nas configurações do seu navegador.</p>
        </section>

        <q-separator />

        <section id="direitos-do-usuario">
          <h6>6. Direitos do Usuário</h6>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Se você desejar fazer isso, entre em contato conosco conforme indicado abaixo.</p>
        </section>

        <q-separator />

        <section id="alteracoes-na-politica">
          <h6>7. Alterações na Política de Privacidade</h6>
          <p>Reservamo-nos o direito de modificar esta Política de Privacidade a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. É sua responsabilidade revisar esta política periodicamente.</p>
        </section>

        <q-separator />

        <section id="contato">
          <h6>8. Contato</h6>
          <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do número <strong>877140136</strong> .</p>
        </section>

      </q-card-section>
    </q-card>
  </div>
  <FooterC/>
  </q-layout>
</template>

<script>
import HeaderC from "components/store/HeaderC.vue";
import FooterC from "components/store/FooterC.vue";
export default {
  components: {
    HeaderC,FooterC
  },
  name: 'PrivacyPolicy'
}
</script>

<style scoped>
h6 {
  margin-bottom: 20px;
}

h6 {
  margin-top: 20px;
}

q-separator {
  margin: 20px 0;
}
</style>
