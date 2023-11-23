<template>
  <div class="profile-dropdown-wrapper">
    <va-dropdown v-model="isShown" class="profile-dropdown" stick-to-edges :offset="[13, 0]">
      <template #anchor>
        <span class="profile-dropdown__anchor">
          <slot></slot>
          <va-icon color="#ff842b" class="px-2" :name="isShown ? 'angle_up' : 'angle_down'" />
        </span>
      </template>
      <va-dropdown-content class="profile-dropdown__content">
        <va-list-item v-for="option in options" :key="option.name" class="p-2">
          <!-- Check if the option is 'logout' and call the logout method -->
          <div v-if="option.name === 'logout'" @click="logout" class="profile-dropdown__item">
            {{ t(`user.${option.name}`) }}
          </div>
          <!-- For other options, use router-link -->
          <router-link v-else :to="{ name: option.redirectTo }" class="profile-dropdown__item">
            {{ t(`user.${option.name}`) }}
          </router-link>
        </va-list-item>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useColors } from 'vuestic-ui'
import { useRouter } from 'vue-router';

const { t } = useI18n()
const { colors } = useColors()
const router = useRouter();

withDefaults(
  defineProps<{
    options?: { name: string; redirectTo: string }[]
  }>(),
  {
    options: () => [
      {
        name: 'logout',
        redirectTo: 'login',
      },
    ],
  },
)

const isShown = ref(false)

function logout() {
  localStorage.removeItem('usuario');
  router.push({ name: 'login' });
}
</script>

<style lang="scss" scoped>
.profile-dropdown {
  cursor: pointer;

  &__anchor {
    display: inline-block;
  }

  &__item {
    display: block;
    color: var(--va-gray);

    &:hover,
    &:active {
      color: var(--va-primary);
    }
  }
}
</style>
