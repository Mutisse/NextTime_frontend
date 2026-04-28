<template>
  <div
    style="background-color: #f2f2f2"
    class="fullscreen bg-orange1 text-white column items-center justify-center"
  >
    <q-card-section>
      <div class="text-h5 text-center">
        <img
          src="~assets/logo-klc-market1.png"
          alt="Logo"
          class="q-mb-md"
          style="width: 100px"
        />
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h5 text-center text-bold text-blue-12">Criar Conta</div>
    </q-card-section>

    <q-card-section>
      <!-- Etapa de envio e verificação de OTP -->
      <div v-if="step === 1">
        <q-form @submit.prevent="sendOtp">
          <q-input
            filled
            v-model="form.phone"
            label="Número do WhatsApp"
            type="tel"
            required
            prepend-icon="phone"
          >
            <template v-slot:prepend> +258 </template>
          </q-input>

          <q-btn
            type="submit"
            label="Enviar OTP"
            color="blue-12"
            :disable="processing"
            class="full-width q-mt-md"
          >
            <q-spinner-hourglass v-if="processing" color="white" size="24px" />
          </q-btn>
        </q-form>
      </div>

      <div v-if="step === 2">
        <q-form @submit.prevent="verifyOtp">
          <q-input
            filled
            v-model="form.otp"
            label="Seu código de verificação"
            type="tel"
            required
            prepend-icon="phone"
          >
          </q-input>

          <q-btn
            type="submit"
            label="Verificar código"
            color="blue-12"
            :disable="processing"
            class="full-width q-mt-md"
          >
            <q-spinner-hourglass v-if="processing" color="white" size="24px" />
          </q-btn>
          <q-card-section class="text-center text-green-5">
            <div @click="step = 1">Alterar numero!</div>
          </q-card-section>
        </q-form>
      </div>

      <!-- Etapa de preenchimento dos outros campos -->
      <div v-else-if="step === 3">
        <q-form @submit.prevent="register">
          <q-input
            filled
            v-model="form.name"
            label="Nome"
            required
            prepend-icon="person"
          />
          <q-input
            filled
            v-model="form.email"
            label="Email"
            type="email"
            required
            prepend-icon="email"
            class="q-mt-md"
          />
          <q-input
            filled
            v-model="form.password"
            label="Senha"
            type="password"
            required
            prepend-icon="lock"
            class="q-mt-md"
          />
          <q-input
            filled
            v-model="form.password_confirmation"
            label="Confirme a senha"
            type="password"
            required
            prepend-icon="lock"
            class="q-mt-md"
          />
          <q-checkbox
            v-model="form.terms"
            label="Li e concordo com os "
            required
            class="q-mt-md text-blue-5"
          />
          <span class="text-blue-5">
            <a href="/termos-de-servico" target="_blank">Termos & Condições</a>
          </span>

          <q-btn
            type="submit"
            label="Criar conta"
            color="blue-12"
            :disable="registering"
            class="full-width q-mt-md"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>
        </q-form>
      </div>
    </q-card-section>

    <q-card-section class="text-center text-blue-5">
      <div>
        Já tem uma conta?
        <q-btn flat label="Login" color="primary" @click="goToLogin" />
      </div>
    </q-card-section>
  </div>
</template>

<script>
import apiMethods from "src/router/api.js";

export default {
  name: "RegisterPage",
  data() {
    return {
      step: 1, // Controle de etapas: 1 = número e OTP, 2 = outros campos
      processing: false, // Controle de carregamento para envio de OTP
      registering: false, // Controle de carregamento para registro
      form: {
        phone: "",
        otp: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
      },
    };
  },
  methods: {
    async verifyOtp() {
      if (!this.form.phone) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "Por favor, insira um número válido!",
        });
        return;
      }

      try {
        this.processing = true;
        // Chama o método para enviar OTP
        // console.log(this.form.phone)
        const response = await apiMethods.verifyOtp({
          number: this.form.phone,
          otp: this.form.otp,
        });
        console.log(response);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "check",
          message: "OTP enviado com sucesso!",
        });

        // Passa para a próxima etapa após enviar o OTP
        this.step = 3;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "error",
          message: "Erro ao enviar OTP. Tente novamente!",
        });
      } finally {
        this.processing = false;
      }
    },
    async sendOtp() {
      if (!this.form.phone) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "Por favor, insira um número válido!",
        });
        return;
      }

      try {
        this.processing = true;
        // Chama o método para enviar OTP
        // console.log(this.form.phone)
        const response = await apiMethods.sendOtp({ number: this.form.phone });
        console.log(response);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "check",
          message: "OTP enviado com sucesso!",
        });

        // Passa para a próxima etapa após enviar o OTP
        this.step = 2;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "error",
          message: "Erro ao enviar OTP. Tente novamente!",
        });
      } finally {
        this.processing = false;
      }
    },
    async register() {
      if (this.validateForm()) {
        try {
          this.registering = true;

          const userData = {
            number: this.form.phone,
            name: this.form.name,
            email: this.form.email,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
          };

          const response = await apiMethods.register(userData);

          this.$q.notify({
            color: "green",
            textColor: "white",
            icon: "cloud_done",
            message: "Registro realizado com sucesso!",
          });

          this.registering = false;
          this.$router.push("/login");
          this.clearForm();
        } catch (error) {
          console.log(error);
          try {
            let erro = error.response.data.error.email;
            if (erro) {
              this.$q.notify({
                color: "red",
                textColor: "white",
                icon: "error",
                message:
                  "Houve um problema ao processar seu e-mail. Verifique as informações e tente novamente.",
              });
              this.registering = false;

              return;
            }
          } catch (error) {}
          try {
            let phone = error.response.data.phone;
            if (phone) {
              this.$q.notify({
                color: "red",
                textColor: "white",
                icon: "error",
                message: error.response.data.message,
              });
              this.registering = false;

              return;
            }
          } catch (error) {}

          this.$q.notify({
            color: "red",
            textColor: "white",
            icon: "error",
            message:
              "Ocorreu um erro ao tentar registrar o usuário. Por favor, tente novamente mais tarde.",
          });

          this.registering = false;
        }
      }
    },
    clearForm() {
      this.form.phone = "";
      this.form.name = "";
      this.form.email = "";
      this.form.password = "";
      this.form.password_confirmation = "";
      this.form.terms = false;
    },
    validateForm() {
      // Verificar se as senhas coincidem
      if (this.form.password !== this.form.password_confirmation) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message: "As senhas não coincidem!",
        });
        return false;
      }

      // Verificar a complexidade da senha (mínimo 6 caracteres, 1 maiúscula e 1 número)
      const passwordComplexity = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;
      if (!passwordComplexity.test(this.form.password)) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "warning",
          message:
            "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número!",
        });
        return false;
      }

      return true;
    },

    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.bg-orange {
  background-color: #ff8a00;
}
</style>
