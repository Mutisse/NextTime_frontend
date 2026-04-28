<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h1 class="text-h4 text-primary">Perfil da Loja</h1>
        <p class="text-subtitle1">Gerencie as informações da sua loja</p>
      </div>
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4 text-center">
            <q-avatar size="120px" class="q-mb-md">
              <img :src="storeProfile.logo || 'https://via.placeholder.com/120'" alt="Logo da Loja">
            </q-avatar>
            <q-btn outline color="primary" label="Alterar Logo" @click="changeLogo" />
          </div>

          <div class="col-12 col-md-8">
            <q-input
              v-model="storeProfile.name"
              label="Nome da Loja"
              outlined
              class="q-mb-md"
            />
            <q-input
              v-model="storeProfile.description"
              label="Descrição"
              type="textarea"
              outlined
              class="q-mb-md"
            />
            <q-input
              v-model="storeProfile.phone"
              label="Telefone"
              outlined
              class="q-mb-md"
            />
            <q-input
              v-model="storeProfile.email"
              label="Email"
              type="email"
              outlined
              class="q-mb-md"
            />
            <q-input
              v-model="storeProfile.address"
              label="Endereço"
              outlined
              class="q-mb-md"
            />

            <div class="row q-mt-md">
              <div class="col">
                <q-btn color="primary" label="Salvar Alterações" @click="saveProfile" />
                <q-btn flat label="Cancelar" @click="cancelEdit" class="q-ml-sm" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <h2 class="text-h6">Horário de Funcionamento</h2>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6" v-for="(day, index) in weekDays" :key="index">
            <div class="row items-center">
              <div class="col-4">{{ day.name }}</div>
              <div class="col-8">
                <q-input v-model="day.open" label="Abertura" outlined dense />
                <q-input v-model="day.close" label="Fechamento" outlined dense class="q-mt-sm" />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-btn color="primary" label="Salvar Horário" @click="saveSchedule" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const storeProfile = reactive({
  name: 'Minha Loja',
  description: 'Descrição da minha loja...',
  phone: '+258 84 123 4567',
  email: 'loja@exemplo.com',
  address: 'Maputo, Moçambique',
  logo: ''
})

const weekDays = ref([
  { name: 'Segunda-feira', open: '09:00', close: '18:00' },
  { name: 'Terça-feira', open: '09:00', close: '18:00' },
  { name: 'Quarta-feira', open: '09:00', close: '18:00' },
  { name: 'Quinta-feira', open: '09:00', close: '18:00' },
  { name: 'Sexta-feira', open: '09:00', close: '18:00' },
  { name: 'Sábado', open: '10:00', close: '16:00' },
  { name: 'Domingo', open: 'Fechado', close: 'Fechado' }
])

const changeLogo = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de upload de logo em desenvolvimento'
  })
}

const saveProfile = () => {
  $q.notify({
    type: 'positive',
    message: 'Perfil salvo com sucesso!'
  })
}

const cancelEdit = () => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja cancelar as alterações?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'warning',
      message: 'Alterações canceladas'
    })
  })
}

const saveSchedule = () => {
  $q.notify({
    type: 'positive',
    message: 'Horário salvo com sucesso!'
  })
}
</script>

<style scoped>
.text-h4 {
  font-size: 1.75rem;
  font-weight: 600;
}
</style>
