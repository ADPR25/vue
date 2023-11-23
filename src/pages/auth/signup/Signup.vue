<template>
  <form @submit.prevent="onsubmit">
    <va-input color="#ff842b" v-model="cedula" class="mb-4" type="number" :label="t('cedula')" :error="!!cedulaErrors.length"
      :error-messages="cedulaErrors" />

    <va-input color="#ff842b" class="mb-4" type="string" v-model="nombre" :label="t('nombre')" :error="!!nombreErrors.length"
      :error-messages="nombreErrors" />

    <va-input color="#ff842b" class="mb-4" type="string" v-model="apellidos" :label="t('apellidos')" :error="!!apellidosErrors.length"
      :error-messages="apellidosErrors" />

    <va-input color="#ff842b" class="mb-4" type="number" v-model="telefono" :label="t('telefono')" :error="!!passwordErrors.length"
      :error-messages="passwordErrors" />

    <va-input color="#ff842b" class="mb-4" type="string" v-model="email" :label="t('email')" :error="!!passwordErrors.length"
      :error-messages="passwordErrors" />

    <va-input color="#ff842b" class="mb-4" type="password" v-model="password" :label="t('contraseña')" :error="!!passwordErrors.length"
      :error-messages="passwordErrors" />

    <va-select color="#ff842b" v-model="simpleSelectModel" :label="t('rol')" text-by="descripcion" track-by="id"
      :options="simpleOptions" />

    <div class="flex justify-center mt-4">
      <va-button color="#ff842b" class="my-0" @click="onsubmit">{{ t('crear cuenta') }}</va-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { obtenerRol } from './obtenerRol';
import { Singup } from './singup';

const { t } = useI18n();

const email = ref('');
const password = ref('');
const telefono = ref('');

const emailErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);
const cedulaErrors = ref<string[]>([]);
const nombreErrors = ref<string[]>([]);
const apellidosErrors = ref<string[]>([]);
const apellidos = ref('');
const cedula = ref('');
const nombre = ref('');

const formReady = computed(() => !cedulaErrors.value.length && !passwordErrors.value.length && !nombreErrors.value.length);

const simpleOptions = ref([]);
const simpleSelectModel = ref('');

onMounted(async () => {
  try {
    const roles = await obtenerRol();
    simpleOptions.value = roles;
  } catch (error) {
    console.error('Error al obtener roles');
  }
});

async function onsubmit() {
  if (!formReady.value) return;

  try {
    const usuario = {
      cedula: parseInt(cedula.value),
      nombre: nombre.value,
      apellidos: apellidos.value,
      telefono: parseInt(telefono.value),
      email: email.value,
      rol: simpleSelectModel.value,
      estado: 'activo',
      contrasena: password.value,
    };

    await Singup(usuario);
    console.log('usuario enviado al backend:', usuario);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
}
</script>
