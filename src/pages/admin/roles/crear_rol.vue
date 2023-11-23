<template>
  <div>
    <form @submit.prevent="onSubmit">
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title>
          <va-input
            color="#ff842b"
            v-model="rol"
            class="mb-4"
            type="string"
            :label="t('rol')"
            :error="!!rolErrors.length"
            :error-messages="rolErrors"
          />
        </va-card-title>
        <va-card-content>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="my-0" type="submit">{{ t('crear rol') }}</va-button>
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
              <tr v-for="(rol, index) in roles" :key="index">
                <td>{{ rol.descripcion }}</td>
                <td>
                  <i
                    class="va-icon material-icons"
                    aria-hidden="true"
                    notranslate=""
                    style="font-size: 30px; height: 30px; line-height: 30px"
                    @click="editarRol(rol)"
                  >
                    edit
                  </i>
                </td>
                <td @click="eliminarRol(rol.id)">
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
      <va-input v-model="valorEditar" :label="t('rol')" />
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Crear_rol, obtenerRol, eliminar, editar } from './ROL'

  const { t } = useI18n()

  interface Rol {
    id: number
    descripcion: string
  }

  const rol = ref('')
  const rolErrors = ref<string[]>([])
  const roles = ref<Rol[]>([])
  const contador = ref(1)

  const showEditarModal = ref(false)
  const valorEditar = ref('')
  const selectedRoleId = ref<number | null>(null)

  const formReady = computed(() => !rolErrors.value.length)

  async function onSubmit() {
    rolErrors.value = rol.value ? [] : ['El rol es obligatorio']
    if (formReady.value) {
      const rolData: Rol = {
        descripcion: rol.value,
        id: 0,
      }
      try {
        const response = await Crear_rol(rolData)
        if (response) {
          rol.value = ''
          contador.value++
          roles.value = await obtenerRol()
        }
      } catch (error) {
        console.error('Error al crear el rol:', error)
        rolErrors.value = ['No fue posible crear el rol']
      }
    }
  }

  onMounted(async () => {
    try {
      roles.value = await obtenerRol()
    } catch (error) {
      console.error('Error al obtener roles:', error)
    }
  })

  async function eliminarRol(id: number) {
    const confirmarEliminacion = confirm('¿Estás seguro que deseas eliminar este rol?')

    if (confirmarEliminacion) {
      try {
        await eliminar(id)
        roles.value = roles.value.filter((r) => r.id !== id)
      } catch (error) {
        console.error('Error al eliminar el rol:', error)
      }
    }
  }

  function editarRol(rol: Rol) {
    showEditarModal.value = true
    valorEditar.value = rol.descripcion
    selectedRoleId.value = rol.id
  }

  async function confirmarEdicion() {
    if (selectedRoleId.value !== null) {
      const rolData: Rol = {
        id: selectedRoleId.value,
        descripcion: valorEditar.value,
      }

      try {
        await editar(selectedRoleId.value, rolData)
        roles.value = roles.value.map((r) =>
          r.id === selectedRoleId.value ? { ...r, descripcion: valorEditar.value } : r,
        )
      } catch (error) {
        console.error('Error al editar el rol:', error)
      }

      showEditarModal.value = false
      valorEditar.value = ''
      selectedRoleId.value = null
    } else {
      console.error('No se ha seleccionado ningún ID para editar.')
    }
  }
</script>
