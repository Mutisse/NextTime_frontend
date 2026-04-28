<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-white text-black">
      <q-toolbar class="row items-center no-wrap">
        <q-toolbar-title class="text-primary text-h6" @click="$router.push('/')" style="cursor: pointer">
          EventHub Pro
        </q-toolbar-title>
        <div class="row q-gutter-sm items-center">
          <q-btn flat label="Find Events" />
          <q-btn flat label="Create Events" />
          <q-btn flat label="Help Center" />
          <q-btn flat label="Find my tickets" />
          <q-btn flat label="Sign in" outline color="primary" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="bg-grey-2 column items-center justify-start q-pa-md">
        <div class="full-width" style="max-width: 400px">
          <!-- Título Events -->
          <div class="text-h5 text-weight-bold q-mb-md">Events</div>

          <!-- Today -->
          <div class="text-subtitle1 text-weight-medium q-mt-md q-mb-sm">Today</div>

          <!-- Card do evento Beach Party -->
          <q-card class="q-mb-md" flat bordered>
            <q-card-section>
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">Beach Party</div>
                  <div class="text-caption text-grey-7">8:30 pm – 11:00 pm</div>
                </div>
                <div class="column items-end">
                  <div class="text-caption text-grey-7">+12 Attending</div>
                  <q-btn flat dense rounded color="primary" label="Join" class="q-mt-xs" />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Upcoming -->
          <div class="text-subtitle1 text-weight-medium q-mt-lg q-mb-sm">Upcoming</div>

          <!-- Card Live Concert -->
          <q-card class="q-mb-md" flat bordered>
            <q-card-section>
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">Live Concert</div>
                  <div class="text-caption text-grey-7">8:30 pm – 11:00 pm</div>
                </div>
                <div class="text-caption text-grey-7">+12</div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Card Food & Drink -->
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">Food & Drink</div>
                  <div class="text-caption text-grey-7">8:30 pm – 11:00 pm</div>
                </div>
                <div class="text-caption text-grey-7">+12</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
</style>
