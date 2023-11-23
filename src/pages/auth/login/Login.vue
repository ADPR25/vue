<template>
  <form @submit.prevent="onsubmit">
    <va-input color="#ff842b" v-model="cedula" class="mb-4" type="number" :label="t('cedula')"
      :error="!!cedulaErrors.length" :error-messages="cedulaErrors" />

    <va-input color="#ff842b" v-model="password" class="mb-4" type="password" :label="t('password')"
      :error="!!passwordErrors.length" :error-messages="passwordErrors" />

    <div class="flex justify-center mt-4">
      <va-button color="#ff842b" class="my-0" type="submit">{{ t('auth.login') }}</va-button>
    </div>
  </form>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Login } from "./login";

const { t } = useI18n();


const cedula = ref('');
const password = ref('');
const keepLoggedIn = ref(false);
const cedulaErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);
const router = useRouter();

const formReady = computed(() => !cedulaErrors.value.length && !passwordErrors.value.length);

async function onsubmit() {
  cedulaErrors.value = cedula.value ? [] : ['Cedula is required'];
  passwordErrors.value = password.value ? [] : ['Password is required'];

  if (formReady.value) {
    const usuario = {
      cedula: parseInt(cedula.value),
      contrasena: password.value,
    };


    try {
      const response = await Login(usuario);
      const userData = await response.json();

      if (response.ok && Object.keys(userData).length > 0) {
        localStorage.setItem('usuario', JSON.stringify(userData));
        router.push({ name: 'dashboard' });
      } else {
      }
    } catch (error) {
    }
  }
}


</script>
