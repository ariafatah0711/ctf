<template>
  <nav class="w-full rounded-md py-2 px-3">
    <ol class="list-reset flex overflow-x-auto whitespace-nowrap max-w-full">
      <li
        v-for="(breadcrumb, index) in fullBreadcrumbs"
        :key="index"
        class="text-neutral-400 flex items-center max-w-[8rem] truncate"
      >
        <!-- Tombol Back Khusus -->
        <button
          v-if="breadcrumb.href === '__back__'"
          @click="goBack"
          :title="breadcrumb.name"
          class="text-blue-600 truncate inline-block overflow-hidden whitespace-nowrap max-w-[8rem] transition duration-150 ease-in-out hover:text-blue-500 focus:text-blue-400 active:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:text-blue-300 dark:active:text-blue-500"
        >
          {{ breadcrumb.name }}
        </button>

        <!-- Normal Link -->
        <router-link
          v-else-if="breadcrumb.href"
          :to="breadcrumb.href"
          :title="breadcrumb.name"
          class="text-blue-600 truncate inline-block overflow-hidden whitespace-nowrap max-w-[8rem] transition duration-150 ease-in-out hover:text-blue-500 focus:text-blue-400 active:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:text-blue-300 dark:active:text-blue-500"
        >
          {{ breadcrumb.name }}
        </router-link>

        <!-- Text biasa kalau bukan link -->
        <span
          v-else
          :title="breadcrumb.name"
          class="text-neutral-500 truncate inline-block overflow-hidden whitespace-nowrap max-w-[8rem]"
        >
          {{ breadcrumb.name }}
        </span>

        <span v-if="index < fullBreadcrumbs.length - 1" class="mx-2 text-neutral-400">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  extraItems: {
    type: Array,
    default: () => [],
  },
  extraPosition: {
    type: [String, Number],
    default: 'end', // bisa: 'start', 'end', atau number (index)
  },
  removeIndex: {
    type: Number,
    default: -1, // Default -1 means no path is removed
  },
});

const route = useRoute();
const router = useRouter();
const breadcrumbs = ref([]);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const generateBreadcrumbs = () => {
  const pathArray = route.path.split('/').filter(Boolean);

  // Hapus path tertentu jika removeIndex >= 0
  if (props.removeIndex >= 0 && props.removeIndex < pathArray.length) {
    pathArray.splice(props.removeIndex, 1); // Hapus path berdasarkan index
  }

  breadcrumbs.value = pathArray.map((path, index) => {
    const href = '/' + pathArray.slice(0, index + 1).join('/');
    return {
      name: capitalize(decodeURIComponent(path)),
      href: index < pathArray.length - 1 ? href : null,
    };
  });
};

// Fitur goBack
const goBack = () => {
  router.back();
};

watch(() => route.fullPath, generateBreadcrumbs, { immediate: true });

const fullBreadcrumbs = computed(() => {
  const base = [...breadcrumbs.value];
  const extra = props.extraItems;

  if (props.extraPosition === 'start') {
    return [...extra, ...base];
  }

  if (props.extraPosition === 'end') {
    return [...base, ...extra];
  }

  if (typeof props.extraPosition === 'number') {
    const idx = Math.max(0, Math.min(props.extraPosition, base.length));
    return [...base.slice(0, idx), ...extra, ...base.slice(idx)];
  }

  return base;
});
</script>