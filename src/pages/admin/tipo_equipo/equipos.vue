<template>
  <div>
    <form @submit.prevent="onSubmit">
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title>
          <va-input
            color="#ff842b"
            v-model="equipo"
            class="mb-4"
            type="string"
            :label="t('equipo')"
            :error="!!equipoErrors.length"
            :error-messages="equipoErrors"
          />
        </va-card-title>
        <va-card-content>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="my-0" type="submit">{{ t('crear tipo equipo') }}</va-button>
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
              <tr v-for="(equipo, index) in equipos" :key="index">
                <td>{{ equipo.descripcion }}</td>
                <td>
                  <i
                    class="va-icon material-icons"
                    aria-hidden="true"
                    notranslate=""
                    style="font-size: 30px; height: 30px; line-height: 30px"
                    @click="editarEquipo(equipo)"
                  >
                    edit
                  </i>
                </td>
                <td @click="eliminarEquipo(equipo.id)">
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
      <va-input v-model="valorEditar" :label="t('equipo')" />
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Crear_rol, obtenerRol, eliminar, editar } from './t_equipos'

  const { t } = useI18n()

  interface Equipo {
    id: number
    descripcion: string
  }

  const equipo = ref('')
  const equipoErrors = ref<string[]>([])
  const equipos = ref<Equipo[]>([])
  const contador = ref(1)

  const showEditarModal = ref(false)
  const valorEditar = ref('')
  const selectedEquipoId = ref<number | null>(null)

  const formReady = computed(() => !equipoErrors.value.length)

  async function onSubmit() {
    equipoErrors.value = equipo.value ? [] : ['El equipo es obligatorio']
    if (formReady.value) {
      const equipoData: Equipo = {
        descripcion: equipo.value,
        id: 0,
      }
      try {
        const response = await Crear_rol(equipoData)
        if (response) {
          equipo.value = ''
          contador.value++
          equipos.value = await obtenerRol()
        }
      } catch (error) {
        console.error('Error al crear el equipo:', error)
        equipoErrors.value = ['No fue posible crear el equipo']
      }
    }
  }

  onMounted(async () => {
    try {
      equipos.value = await obtenerRol()
    } catch (error) {
      console.error('Error al obtener equipos:', error)
    }
  })

  async function eliminarEquipo(id: number) {
    const confirmarEliminacion = confirm('¿Estás seguro que deseas eliminar este equipo?')

    if (confirmarEliminacion) {
      try {
        await eliminar(id)
        equipos.value = equipos.value.filter((e) => e.id !== id)
      } catch (error) {
        console.error('Error al eliminar el equipo:', error)
      }
    }
  }

  function editarEquipo(equipo: Equipo) {
    showEditarModal.value = true
    valorEditar.value = equipo.descripcion
    selectedEquipoId.value = equipo.id
  }

  async function confirmarEdicion() {
    if (selectedEquipoId.value !== null) {
      const equipoData: Equipo = {
        id: selectedEquipoId.value,
        descripcion: valorEditar.value,
      }

      try {
        await editar(selectedEquipoId.value, equipoData)
        equipos.value = equipos.value.map((e) =>
          e.id === selectedEquipoId.value ? { ...e, descripcion: valorEditar.value } : e,
        )
      } catch (error) {
        console.error('Error al editar el equipo:', error)
      }

      showEditarModal.value = false
      valorEditar.value = ''
      selectedEquipoId.value = null
    } else {
      console.error('No se ha seleccionado ningún ID para editar.')
    }
  }
</script>
