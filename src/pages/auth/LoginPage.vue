<template>
  <div
    style="background-color: #f2f2f2"
    class="fullscreen bg-orange1 text-white column items-center justify-center"
  >
    <q-toolbar
      style="
        position: fixed;
        top: 0px;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 99999;
      "
      class="q-pt-md q-pb-md text-dark"
      ><q-btn
        v-if="step === 2"
        flat
        round
        dense
        @click="voltar"
        size="md"
        icon="arrow_back"
      ></q-btn>
      <q-btn
        flat
        @click="goToStore"
        dense
        size="md"
        icon="store"
        class="q-mr-sm"
        label="ver loja"
      ></q-btn>
    </q-toolbar>

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

    <div v-if="step === 1">
      <q-card-section>
        <div class="text-h4 text-blue-12 text-bold text-center">Bem Vindo</div>
        <div class="text-h5 text-blue-5 text-bold text-center">
          Entre na sua conta
        </div>
      </q-card-section>
      <q-card-section>
        <q-form
          :style="$q.screen.lt.md ? 'width: 90vw' : 'width: 300px'"
          @submit.prevent="login"
        >
          <q-input
            filled
            v-model="form.email"
            label="Email"
            type="text"
            required
            prepend-icon="email"
            class="q-mt-md full-width"
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
          <div class="text-center q-mt-sm">
            <q-btn
              flat
              label="Esqueceu a senha?"
              color="blue-5"
              @click="showResetPass(2)"
              :disable="registering"
            />
          </div>
          <q-btn
            type="submit"
            label="Entrar"
            color="blue-12"
            :disable="registering"
            class="full-width q-mt-md"
          >
            <q-spinner-hourglass v-if="registering" color="white" size="24px" />
          </q-btn>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center text-blue-5">
        <div>
          Não tem uma conta?
          <q-btn
            flat
            label="Criar conta"
            color="primary"
            @click="goToRegister"
          />
        </div>
      </q-card-section>
    </div>

    <div v-if="step === 2">
      <div class="text-blue-5 text-bold text-center">
        Digite o numero que usou para criar a conta
      </div>
      <!-- <div class="text-blue-5 text-bold text-center">
        Escolha como deseja receber o código
      </div> -->
      <!-- <q-option-group
        v-model="form.method"
        :options="[
          { label: 'WhatsApp', value: 'whatsapp' },
          { label: 'Email', value: 'email' },
        ]"
        type="radio"
        inline
        label="Escolha como deseja receber o código:"
        class="q-mb-md text-dark"
      /> -->

      <q-form @submit.prevent="forgotPasswordOtp">
        <!-- Campo WhatsApp -->
        <q-input
          v-if="form.method === 'whatsapp'"
          filled
          v-model="form.email"
          label="Número do WhatsApp"
          type="tel"
          required
          class="full-width q-mt-md"
        >
          <template v-slot:prepend> +258 </template>
        </q-input>

        <!-- Campo Email -->
        <q-input
          v-if="form.method === 'email'"
          filled
          v-model="form.email"
          label="Email"
          type="email"
          required
          class="full-width q-mt-md"
        />

        <q-btn
          type="submit"
          label="obter código de recuperação"
          color="blue-12"
          :disable="processing"
          class="full-width q-mt-md"
        >
          <q-spinner-hourglass v-if="processing" color="white" size="24px" />
        </q-btn>
      </q-form>
    </div>

    <div v-if="step === 3">
      <div class="text-blue-5 text-bold text-center">
        Digite o código de verificação enviado para seu numero
      </div>

      <q-form @submit.prevent="forgotPasswordVerify">
        <!-- Campo Email -->
        <q-input
          filled
          v-model="form.otp"
          label="código"
          type="number"
          required
          class="full-width q-mt-md"
        />

        <q-btn
          type="submit"
          label="verificar o código de recuperação"
          color="blue-12"
          :disable="processing"
          class="full-width q-mt-md"
        >
          <q-spinner-hourglass v-if="processing" color="white" size="24px" />
        </q-btn>
      </q-form>
    </div>

    <div v-if="step === 4">
      <div class="text-blue-5 text-bold text-center">
        Digite a sua nova senha.
      </div>

      <q-form @submit.prevent="forgotPasswordReset">
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
          v-model="form.newPassword"
          label="Confirme a senha"
          type="password"
          required
          prepend-icon="lock"
          class="q-mt-md"
        />

        <q-btn
          type="submit"
          label="guardar nova senha"
          color="blue-12"
          :disable="processing"
          class="full-width q-mt-md"
        >
          <q-spinner-hourglass v-if="processing" color="white" size="24px" />
        </q-btn>
      </q-form>
    </div>
  </div>
</template>

<script>
import apiMethods from "src/router/api.js";
import store from "src/store/index.js";

export default {
  name: "LoginPage",
  data() {
    return {
      step: 1, // Controle de etapas: 1 = login e OTP, 2 = outros recuperacao
      form: {
        email: "",
        password: "",
        phone: "",
        method: "whatsapp",
        password: "",
        newPassword: "",
      },
      registering: false,
      processing: false,
    };
  },
  computed: {
    getUserComputed() {
      return store.state.user;
    },
  },
  methods: {
    getUser() {
      return store.getters.user;
    },
    voltar() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    showResetPass(step) {
      this.step = step;
    },
    setUser(value) {
      store.commit("setUser", value);
    },
    async login() {
      if (this.validateForm()) {
        try {
          this.registering = true;
          const userData = {
            email: this.form.email,
            password: this.form.password,
          };
          let response = await apiMethods.login(userData);
          localStorage.setItem("token", response.data.token);
          response = await apiMethods.getUser();
          this.setUser(response.data.user);

          if (response.data.user.scope === "entregador") {
            this.$router.push("/show-packs");
            return;
          }
          if (response.data.user.scope === "admin") {
            this.$router.push("/admin");
            return;
          }
          if (response.data.user.scope === "empresa") {
            this.$router.push("/s");
            return;
          }
          if (window.history.length > 1) {
            this.$router.go(-1);
          } else {
            this.$router.push("/");
          }
          localStorage.setItem("cart", JSON.stringify([]));
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          if (error.response && error.response.status === 401) {
            this.$q.notify({
              color: "red",
              textColor: "white",
              icon: "report_problem",
              message:
                "Credenciais inválidas. Verifique seu email e senha e tente novamente.",
            });
          } else {
            this.$q.notify({
              color: "red",
              textColor: "white",
              icon: "report_problem",
              message: "Erro ao fazer login. Por favor, tente novamente.",
            });
          }
        } finally {
          this.registering = false;
        }
      }
    },
    async forgotPasswordOtp() {
      if (!this.form.email) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Por favor, insira seu email antes de recuperar a senha.",
        });
        return;
      }

      try {
        this.registering = true;
        const response = await apiMethods.forgotPasswordOtp({
          email: this.form.email,
          method: this.form.method,
        });
        // response.log(response);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message:
            "Um email com instruções para redefinir sua senha foi enviado!",
        });

        this.step = 3;
      } catch (error) {
        console.error("Erro ao solicitar recuperação de senha:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message:
            error.response?.data?.message ||
            "Erro ao processar a solicitação. Tente novamente.",
        });
      } finally {
        this.registering = false;
      }
    },
    async forgotPasswordVerify() {
      if (!this.form.email) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Por favor, insira seu email antes de recuperar a senha.",
        });
        return;
      }

      try {
        this.registering = true;
        const response = await apiMethods.forgotPasswordVerify({
          otp: this.form.otp,
          number: this.form.email,
        });
        // response.log(response);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message:
            "Codigo valido!",
        });

        this.step = 4;
      } catch (error) {
        console.error("Erro ao solicitar recuperação de senha:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message:
            error.response?.data?.message ||
            "Erro ao processar a solicitação. Tente novamente.",
        });
      } finally {
        this.registering = false;
      }
    },
    async forgotPasswordReset() {
      console.log(this.form)
      if (!this.form.password || !this.form.newPassword) {
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message: "Por favor, insira a nova senha.",
        });
        return;
      }
      if (!this.validateForm2()) {
        return;
      }

      try {
        this.registering = true;
        const response = await apiMethods.forgotPasswordReset({
          number: this.form.email,
          method: this.form.method,
          password: this.form.password,
          newPassword: this.form.newPassword,
        });
        // response.log(response);
        this.$q.notify({
          color: "green",
          textColor: "white",
          icon: "cloud_done",
          message:
            "Senha recuperada com sucesso, agra pode aceder o sitema!",
        });

        this.step = 1;
      } catch (error) {
        console.error("Erro ao solicitar recuperação de senha:", error);
        this.$q.notify({
          color: "red",
          textColor: "white",
          icon: "report_problem",
          message:
            error.response?.data?.message ||
            "Erro ao processar a solicitação. Tente novamente.",
        });
      } finally {
        this.registering = false;
      }
    },
    validateForm() {
      return this.form.email && this.form.password;
    },

    validateForm2() {
      // Verificar se as senhas coincidem
      if (this.form.password !== this.form.newPassword) {
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
    clearForm() {
      this.form.email = "";
      this.form.password = "";
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToStore() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.bg-orange {
  background-color: #ff8a00;
}
</style>
