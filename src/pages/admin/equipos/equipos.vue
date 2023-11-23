<template>
  <div>
    <form @submit.prevent="onSubmit" v-if="!showEditarModal">
      <va-card class="col-span-10 sm:col-span-10">
        <va-card-title></va-card-title>
        <va-card-content>
          <va-select color="#ff842b" v-model="tipo" :label="t('tipo de equipo')" text-by="descripcion" track-by="id"
            :options="tipo_e" />
        </va-card-content>1
        <va-card-content>
          <va-select color="#ff842b" v-model="estado" :label="t('estado del equipo')" text-by="descripcion" track-by="id"
            :options="estado_e" />
        </va-card-content>
        <va-card-content>
          <va-input color="#ff842b" v-model="serial" type="string" :label="t('serial')" :error="!!serialErrors.length"
            :error-messages="serialErrors" />
        </va-card-content>
        <va-card-content>
          <va-input color="#ff842b" v-model="codigo" type="string" :label="t('codigo')" :error="!!codigoErrors.length"
            :error-messages="codigoErrors" />
        </va-card-content>
        <va-card-content>
          <va-input color="#ff842b" v-model="referencia" type="string" :label="t('referencia')"
            :error="!!referenciaErrors.length" :error-messages="referenciaErrors" />
        </va-card-content>
        <va-card-content>
          <div class="flex justify-center mt-4">
            <va-button color="#ff842b" class="my-0" type="submit">{{ t('crear equipo') }}</va-button>
          </div>
        </va-card-content>
      </va-card>
    </form>

    <va-card>
      <va-card-title></va-card-title>
      <va-card-content class="overflow-auto">
        <table class="va-table va-table--striped va-table--hoverable w-full">
          <thead>
            <tr>
              <th style="color: #ff842b;">Serial</th>
              <th style="color: #ff842b;">Tipo</th>
              <th style="color: #ff842b;">Estado</th>
              <th style="color: #ff842b;">Editar</th>
              <th style="color: #ff842b;">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(equipo, index) in equipos" :key="index">
              <td>{{ equipo.serial }}</td>
              <td>{{ equipo.tipo?.descripcion }}</td>
              <td>{{ equipo.estado?.descripcion }}</td>
              <td>
                <i class="va-icon material-icons" aria-hidden="true" notranslate=""
                  style="font-size: 30px; height: 30px; line-height: 30px;" @click="abrirModalEdicion(equipo)">
                  edit
                </i>
              </td>
              <td @click="eliminarEquipo(equipo.serial)">
                <i class="va-icon material-icons" aria-hidden="true" notranslate=""
                  style="font-size: 30px; height: 30px; line-height: 30px;">
                  delete
                </i>
              </td>
            </tr>
          </tbody>
        </table>
      </va-card-content>
    </va-card>

    <va-modal v-model="showEditarModal" size="small" :ok-text="t('modal.confirm')" @ok="confirmarEdicion"
    :cancel-text="t('modal.cancel')">
      <va-input class="mb-4" color="#ff842b" v-model="serialEditar" :label="t('serial')" readonly />
    <va-select class="mb-4" color="#ff842b" v-model="tipoEditar" :label="t('tipo de equipo')" text-by="descripcion"
      track-by="id" :options="tipo_e" />
    <va-select class="mb-4" color="#ff842b" v-model="estadoEditar" :label="t('estado del equipo')" text-by="descripcion"
      track-by="id" :options="estado_e" />
    <va-input class="mb-4" color="#ff842b" v-model="codigoEditar" :label="t('codigo')" />
    <va-input class="mb-4" color="#ff842b" v-model="referenciaEditar" :label="t('referencia')" />
  </va-modal>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { obtenertipoequipo, obtenerestadoequipos, Crear, obtener, eliminar, editar } from './equipos';

async function confirmarEdicion() {
  if (serialEditar.value !== '') {
    const equipoData: Equipo = {
      serial: serialEditar.value,
      referencia: referenciaEditar.value,
      codigo: codigoEditar.value,
      tipo: tipoEditar.value,
      estado: estadoEditar.value,
    };

    try {
      await editar(serialEditar.value, equipoData);
      equipos.value = equipos.value.map((e) =>
        e.serial === serialEditar.value ? { ...e, ...equipoData } : e
      );
      location.reload();
    } catch (error) {
      console.error('Error al editar el equipo:', error);
    }

    showEditarModal.value = false;
    limpiarDatosEdicion();
  } else {
    console.error('No se ha seleccionado ningún serial para editar.');
  }
}


function limpiarDatosEdicion() {
  tipoEditar.value = '';
  estadoEditar.value = '';
  serialEditar.value = '';
  codigoEditar.value = '';
  referenciaEditar.value = '';
}

async function onSubmit() {
  if (!formReady.value) return;

  try {
    const equipo_c = {
      tipo: tipo.value,
      serial: serial.value,
      codigo: codigo.value,
      estado: estado.value,
      referencia: referencia.value,
    };

    await Crear(equipo_c);
    equipos.value.push(equipo_c);

    
      tipo.value = ''
      serial.value = ''
      codigo.value = ''
      estado.value = ''
      referencia.value = ''


  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
}

onMounted(async () => {
  try {
    const tipo_equipo = await obtenertipoequipo();
    tipo_e.value = tipo_equipo;
  } catch (error) {
    console.error('Error al obtener tipos de equipo:', error);
  }
});

onMounted(async () => {
  try {
    const estado_equipos = await obtenerestadoequipos();
    estado_e.value = estado_equipos;
  } catch (error) {
    console.error('Error al obtener estados de equipo:', error);
  }
});

onMounted(async () => {
  try {
    const equiposData = await obtener();
    equipos.value = equiposData;
  } catch (error) {
    console.error('Error al obtener equipos:', error);
  }
});

async function eliminarEquipo(serial: string) {
  const confirmarEliminacion = confirm('¿Estás seguro que deseas eliminar este equipo?');

  if (confirmarEliminacion) {
    try {
      await eliminar(serial);
      equipos.value = equipos.value.filter(e => e.serial !== serial);
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
    }
  }
}

function abrirModalEdicion(equipo: Equipo) {
  showEditarModal.value = true;
  tipoEditar.value = equipo.tipo?.id.toString() || '';
  estadoEditar.value = equipo.estado?.id.toString() || '';
  serialEditar.value = equipo.serial;
  codigoEditar.value = equipo.codigo;
  referenciaEditar.value = equipo.referencia;
}

const { t } = useI18n();

interface Equipo {
  codigo: string;
  referencia: string;
  serial: string;
  tipo: { id: number; descripcion: string } | null;
  estado: { id: number; descripcion: string } | null;
}

const tipo_e = ref([]);
const estado_e = ref([]);

const showEditarModal = ref(false);
const tipoEditar = ref('');
const estadoEditar = ref('');
const serialEditar = ref('');
const codigoEditar = ref('');
const referenciaEditar = ref('');

const tipo = ref('');
const estado = ref('');
const serial = ref('');
const codigo = ref('');
const referencia = ref('');

const serialErrors = ref<string[]>([]);
const codigoErrors = ref<string[]>([]);
const referenciaErrors = ref<string[]>([]);
const equipos = ref<Equipo[]>([]);

const formReady = computed(() => !serialErrors.value.length && !codigoErrors.value.length && !referenciaErrors.value.length);
</script>
