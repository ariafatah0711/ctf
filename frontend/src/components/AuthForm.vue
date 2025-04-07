<!-- components/AuthForm.vue -->
<template>
    <form @submit.prevent="onSubmit" class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow space-y-6 w-full">
      <h2 class="text-2xl font-bold text-center dark:text-white">{{ title }}</h2>
  
      <div v-for="field in fields" :key="field.name">
        <label :for="field.name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ field.label }}</label>
        <input
          v-model="model[field.name]"
          :type="field.type"
          :id="field.name"
          :disabled="field.disabled || false"
          :autocomplete="field.name === 'password' ? 'current-password' : 'email'"
          :class="`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none dark:bg-gray-700 dark:text-white ${resolvedFieldRing}`"
          required
        />
      </div>
  
      <slot name="extra" />
  
      <button
        type="submit"
        :disabled="loading"
        :class="`text-white font-medium py-2 px-4 w-full rounded transition ${resolvedButtonColor}`"
      >
        {{ loading ? loadingText : submitText }}
      </button>
  
      <slot name="footer" />
  
      <p v-if="error" class="text-center text-red-600 mt-2">{{ error }}</p>
      <p v-if="success" class="text-center text-green-600 mt-2">{{ success }}</p>
    </form>
</template>
  
<script setup lang="ts">
  import { ref, props, computed } from 'vue';

  const props = defineProps<{
    title: string;
    fields: { name: string; label: string; type: string; disabled?: boolean }[];
    model: any;
    loading: boolean;
    loadingText: string;
    submitText: string;
    error?: string;
    success?: string;
    onSubmit: () => void;
    fieldClass?: string
    submitClass?: string;
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  }>();

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  const resolvedButtonColor = computed(() => {
    return props.submitClass || colorMap[props.color || 'blue'];
  });

  const fieldRingMap: Record<string, string> = {
    blue: 'focus:ring-2 focus:ring-blue-500',
    green: 'focus:ring-2 focus:ring-green-500',
    red: 'focus:ring-2 focus:ring-red-500',
    yellow: 'focus:ring-2 focus:ring-yellow-500',
    purple: 'focus:ring-2 focus:ring-purple-500',
  };

  const resolvedFieldRing = computed(() => {
    return props.fieldClass || `focus:ring-2 focus:ring-${props.color || 'blue'}-500`;
  });
</script>