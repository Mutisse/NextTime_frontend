<template>
  <q-card flat bordered class="guest-card" @click="$emit('click')">
    <q-card-section horizontal>
      <q-card-section class="col-3 flex flex-center">
        <q-avatar size="72px">
          <img :src="guest.foto" />
        </q-avatar>
      </q-card-section>
      <q-card-section class="col-9">
        <div class="text-subtitle1">{{ guest.nome }}</div>
        <div class="text-caption text-grey">{{ guest.tipo }}</div>
        <div class="q-mt-sm">
          <q-chip size="sm" dense v-for="tag in guest.tags.slice(0,2)" :key="tag">{{ tag }}</q-chip>
        </div>
        <div class="row q-mt-xs">
          <q-icon name="star" color="amber" size="16px" />
          <span class="text-caption">Popularidade: {{ guest.popularidade }}/100</span>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({ guest: Object })
defineEmits(['click'])
</script>

<style scoped>
.guest-card {
  cursor: pointer;
  transition: all 0.2s;
}
.guest-card:hover {
  background: #f5f5f5;
}
</style>
