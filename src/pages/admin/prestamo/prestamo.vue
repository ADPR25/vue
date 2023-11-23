<template>
  <div>
    <form>
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title>Crear prestamo</va-card-title>
        <va-card-content>
          <div class="grid grid-cols-12 gap-6">
            <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
              <va-date-input v-model="dateInput.range" :label="'Fecha de prestamo'" mode="range" clearable />
            </div>
            <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
              <va-time-input :label="'Hora de prestamo'" v-model="dateInput.simple" />
            </div>
            <div class="flex md:col-span-4 sm:col-span-6 col-span-12">
              <va-time-input :label="'Hora de devolucion'" v-model="dateInput.simple2" />
            </div>
            <div class="flex md:col-span-6">
              <va-select
                v-model="tipo"
                :label="'tipo de equipo'"
                text-by="descripcion"
                track-by="id"
                :options="tipo_e"
              />
            </div>
            <div class="flex md:col-span-6">
              <va-input v-model="cantidad" :label="'Cantidad de equipo'" type="number" />
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="md:col-span-6">➕ </va-button>
          </div>
          <div class="grid grid-cols-12 gap-6">
            <va-button color="#ff842b" class="md:col-span-2" type="resect">Borrar </va-button>
            <va-button color="#ff842b" class="md:col-span-2" type="submit">Prestar </va-button>
          </div>
        </va-card-content>
      </va-card>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { obtenertipoequipo } from './prestamo'
  import { useI18n } from 'vue-i18n'
  const datePlusDay = (date: Date, days: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }
  const simpleSelectModel = ref('')
  const dateInput = ref({
    simple: new Date(),
    simple2: new Date(),
    range: { start: new Date(), end: datePlusDay(new Date(), 7) },
  })
  const { t } = useI18n()
  const tipo_e = ref([])
  const tipo = ref('')
  const cantidad = ref('')
  onMounted(async () => {
    try {
      const tipo_equipo = await obtenertipoequipo()
      tipo_e.value = tipo_equipo
    } catch (error) {
      console.error('Error al obtener tipos de equipo:', error)
    }
  })
</script>
