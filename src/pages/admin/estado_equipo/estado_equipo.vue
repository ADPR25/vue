<template>
  <div>
    <form @submit.prevent="onSubmit">
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title>
          <va-input
            color="#ff842b"
            v-model="estadoEquipo"
            class="mb-4"
            type="string"
            :label="t('Estado Equipo')"
            :error="!!estadoEquipoErrors.length"
            :error-messages="estadoEquipoErrors"
          />
        </va-card-title>
        <va-card-content>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="my-0" type="submit">{{ t('crear estado equipo') }}</va-button>
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
              <tr v-for="(estadoEquipo, index) in estadosEquipos" :key="index">
                <td>{{ estadoEquipo.descripcion }}</td>
                <td>
                  <i
                    class="va-icon material-icons"
                    aria-hidden="true"
                    notranslate=""
                    style="font-size: 30px; height: 30px; line-height: 30px"
                    @click="editarEstadoEquipo(estadoEquipo)"
                  >
                    edit
                  </i>
                </td>
                <td @click="eliminarEstadoEquipo(estadoEquipo.id)">
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
      <va-input v-model="valorEditar" :label="t('estadoEquipo')" />
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Crear_estado, obtener_estados, eliminar, editar } from './estado_e'

  const { t } = useI18n()

  interface EstadoEquipo {
    id: number
    descripcion: string
  }

  const estadoEquipo = ref('')
  const estadoEquipoErrors = ref<string[]>([])
  const estadosEquipos = ref<EstadoEquipo[]>([])
  const contador = ref(1)

  const showEditarModal = ref(false)
  const valorEditar = ref('')
  const selectedEstadoEquipoId = ref<number | null>(null)

  const formReady = computed(() => !estadoEquipoErrors.value.length)

  async function onSubmit() {
    estadoEquipoErrors.value = estadoEquipo.value ? [] : ['El estadoEquipo es obligatorio']
    if (formReady.value) {
      const estadoEquipoData: EstadoEquipo = {
        descripcion: estadoEquipo.value,
        id: 0,
      }
      try {
        const response = await Crear_estado(estadoEquipoData)
        if (response) {
          estadoEquipo.value = ''
          contador.value++
          estadosEquipos.value = await obtener_estados()
        }
      } catch (error) {
        console.error('Error al crear el estadoEquipo:', error)
        estadoEquipoErrors.value = ['No fue posible crear el estadoEquipo']
      }
    }
  }

  onMounted(async () => {
    try {
      estadosEquipos.value = await obtener_estados()
    } catch (error) {
      console.error('Error al obtener estadosEquipos:', error)
    }
  })

  async function eliminarEstadoEquipo(id: number) {
    const confirmarEliminacion = confirm('¿Estás seguro que deseas eliminar este estadoEquipo?')

    if (confirmarEliminacion) {
      try {
        await eliminar(id)
        estadosEquipos.value = estadosEquipos.value.filter((e) => e.id !== id)
      } catch (error) {
        console.error('Error al eliminar el estadoEquipo:', error)
      }
    }
  }

  function editarEstadoEquipo(estadoEquipo: EstadoEquipo) {
    showEditarModal.value = true
    valorEditar.value = estadoEquipo.descripcion
    selectedEstadoEquipoId.value = estadoEquipo.id
  }

  async function confirmarEdicion() {
    if (selectedEstadoEquipoId.value !== null) {
      const estadoEquipoData: EstadoEquipo = {
        id: selectedEstadoEquipoId.value,
        descripcion: valorEditar.value,
      }

      try {
        await editar(selectedEstadoEquipoId.value, estadoEquipoData)
        estadosEquipos.value = estadosEquipos.value.map((e) =>
          e.id === selectedEstadoEquipoId.value ? { ...e, descripcion: valorEditar.value } : e,
        )
      } catch (error) {
        console.error('Error al editar el estadoEquipo:', error)
      }

      showEditarModal.value = false
      valorEditar.value = ''
      selectedEstadoEquipoId.value = null
    } else {
      console.error('No se ha seleccionado ningún ID para editar.')
    }
  }
</script>
