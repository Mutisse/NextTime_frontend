<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h1 class="text-h4 text-primary">Lista de Pacotes</h1>
        <p class="text-subtitle1">Todos os pacotes disponíveis</p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Novo Pacote" @click="createPackage" />
      </div>
    </div>

    <q-table
      :rows="packages"
      :columns="columns"
      row-key="id"
      :loading="loading"
      bordered
      flat
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round dense icon="edit" color="info" @click="editPackage(props.row.id)" />
          <q-btn flat round dense icon="delete" color="negative" @click="deletePackage(props.row.id)" />
          <q-btn flat round dense icon="visibility" color="primary" @click="viewPackage(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const loading = ref(false)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const packages = ref([
  { id: 1, name: 'Pacote Básico', description: 'Ideal para pequenos negócios', price: '500 MZN', status: 'Ativo' },
  { id: 2, name: 'Pacote Profissional', description: 'Para negócios em crescimento', price: '1.000 MZN', status: 'Ativo' },
  { id: 3, name: 'Pacote Empresarial', description: 'Solução completa', price: '2.500 MZN', status: 'Inativo' }
])

const createPackage = () => {
  router.push('/package/create')
}

const editPackage = (id) => {
  router.push(`/package/edit/${id}`)
}

const viewPackage = (id) => {
  router.push(`/package/${id}`)
}

const deletePackage = (id) => {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem certeza que deseja excluir este pacote?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({
      type: 'positive',
      message: 'Pacote excluído com sucesso!'
    })
  })
}
</script>

<style scoped>
.text-h4 {
  font-size: 1.75rem;
  font-weight: 600;
}
</style>
