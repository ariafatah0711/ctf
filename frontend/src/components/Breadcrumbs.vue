<template>
    <nav class="w-full rounded-md py-2 px-3">
      <ol class="list-reset flex overflow-x-auto whitespace-nowrap max-w-full">
        <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          class="text-neutral-400 flex items-center max-w-[8rem] truncate"
        >
          <router-link
            v-if="breadcrumb.href" :to="breadcrumb.href" :title="breadcrumb.name"
            class="text-blue-600 truncate inline-block overflow-hidden whitespace-nowrap max-w-[8rem] transition duration-150 ease-in-out hover:text-blue-500 focus:text-blue-400 active:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 dark:focus:text-blue-300 dark:active:text-blue-500"
          >
            {{ breadcrumb.name }}
          </router-link>

          <span
            v-else
            :title="breadcrumb.name"
            class="text-neutral-500 truncate inline-block overflow-hidden whitespace-nowrap max-w-[8rem]"
          >
            {{ breadcrumb.name }}
          </span>

          <span v-if="index < breadcrumbs.length - 1" class="mx-2 text-neutral-400">/</span>
        </li>
      </ol>
    </nav>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const breadcrumbs = ref([]);
    
    const generateBreadcrumbs = () => {
      // Filter out empty strings and split path
      const pathArray = route.path.split('/').filter(Boolean);
  
      // Memastikan breadcrumbs hanya terdiri dari nama dan href
      breadcrumbs.value = pathArray.map((path, index) => {
        const href = '/' + pathArray.slice(0, index + 1).join('/');
        return {
          name: capitalize(path),
          href: index < pathArray.length - 1 ? href : null, // Last item will not be a link
        };
      });
    };
    
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    
    onMounted(() => {
      generateBreadcrumbs();
    });
  </script>