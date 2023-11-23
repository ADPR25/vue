<template>
  <div>
    <form @submit.prevent="onSubmit">
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title>
          <va-input
            color="#ff842b"
            v-model="estadoPrestamo"
            class="mb-4"
            type="string"
            :label="t('Estado Prestamo')"
            :error="!!estadoPrestamoErrors.length"
            :error-messages="estadoPrestamoErrors"
          />
        </va-card-title>
        <va-card-content>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="my-0" type="submit">{{ t('Crear estado prestamo') }}</va-button>
          </div>
        </va-card-content>
      </va-card>
    </form>
    <br />
    <form>
      <va-card>
        <va-card-title></va-card-title>
        <va-card-content class="overflow-auto">
          <table class="va-table va-table--striped va-table--hoverable w-full">
            <thead>
              <tr>
                <th style="color: #ff842b">Descripción</th>
                <th style="color: #ff842b">Editar</th>
                <th style="color: #ff842b">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(estadoPrestamo, index) in estadosPrestamos" :key="index">
                <td>{{ estadoPrestamo.descripcion }}</td>
                <td>
                  <i
                    class="va-icon material-icons"
                    aria-hidden="true"
                    notranslate=""
                    style="font-size: 30px; height: 30px; line-height: 30px"
                    @click="editarEstadoPrestamo(estadoPrestamo)"
                  >
                    edit
                  </i>
                </td>
                <td @click="eliminarEstadoPrestamo(estadoPrestamo.id)">
                  <i
                    class="va-icon material-icons"
                    aria-hidden="true"
                    notranslate=""
                    style="font-size: 30px; height: 30px; line-height: 30px"
                  >
                    delete
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
        </va-card-content>
      </va-card>
    </form>
    <va-modal
      v-model="showEditarModal"
      size="small"
      :title="t('modal.editarTitulo')"
      :ok-text="t('modal.confirm')"
      :cancel-text="t('modal.cancel')"
      @ok="confirmarEdicion"
    >
      <va-input v-model="valorEditar" :label="t('estadoPrestamo')" />
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Crear_estado, obtener_estados, eliminar, editar } from './estado_p' // Asegúrate de importar el módulo correcto

  const { t } = useI18n()

  interface EstadoPrestamo {
    id: number
    descripcion: string
  }

  const estadoPrestamo = ref('')
  const estadoPrestamoErrors = ref<string[]>([])
  const estadosPrestamos = ref<EstadoPrestamo[]>([])
  const contador = ref(1)

  const showEditarModal = ref(false)
  const valorEditar = ref('')
  const selectedEstadoPrestamoId = ref<number | null>(null)

  const formReady = computed(() => !estadoPrestamoErrors.value.length)

  async function onSubmit() {
    estadoPrestamoErrors.value = estadoPrestamo.value ? [] : ['El estadoPrestamo es obligatorio']
    if (formReady.value) {
      const estadoPrestamoData: EstadoPrestamo = {
        descripcion: estadoPrestamo.value,
        id: 0,
      }
      try {
        const response = await Crear_estado(estadoPrestamoData)
        if (response) {
          estadoPrestamo.value = ''
          contador.value++
          estadosPrestamos.value = await obtener_estados()
        }
      } catch (error) {
        console.error('Error al crear el estado prestamo:', error)
        estadoPrestamoErrors.value = ['No fue posible crear el estado prestamo']
      }
    }
  }

  onMounted(async () => {
    try {
      estadosPrestamos.value = await obtener_estados()
    } catch (error) {
      console.error('Error al obtener estados prestamo:', error)
    }
  })

  async function eliminarEstadoPrestamo(id: number) {
    const confirmarEliminacion = confirm('¿Estás seguro que deseas eliminar este estado prestamo?')

    if (confirmarEliminacion) {
      try {
        await eliminar(id)
        estadosPrestamos.value = estadosPrestamos.value.filter((e) => e.id !== id)
      } catch (error) {
        console.error('Error al eliminar el estado prestamo:', error)
      }
    }
  }

  function editarEstadoPrestamo(estadoPrestamo: EstadoPrestamo) {
    showEditarModal.value = true
    valorEditar.value = estadoPrestamo.descripcion
    selectedEstadoPrestamoId.value = estadoPrestamo.id
  }

  async function confirmarEdicion() {
    if (selectedEstadoPrestamoId.value !== null) {
      const estadoPrestamoData: EstadoPrestamo = {
        id: selectedEstadoPrestamoId.value,
        descripcion: valorEditar.value,
      }

      try {
        await editar(selectedEstadoPrestamoId.value, estadoPrestamoData)
        estadosPrestamos.value = estadosPrestamos.value.map((e) =>
          e.id === selectedEstadoPrestamoId.value ? { ...e, descripcion: valorEditar.value } : e,
        )
      } catch (error) {
        console.error('Error al editar el estadoPrestamo:', error)
      }

      showEditarModal.value = false
      valorEditar.value = ''
      selectedEstadoPrestamoId.value = null
    } else {
      console.error('No se ha seleccionado ningún ID para editar.')
    }
  }
</script>
