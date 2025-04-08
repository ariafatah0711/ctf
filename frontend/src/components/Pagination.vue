<template>
    <nav v-if="totalPages > 1" class="flex justify-center mt-8" aria-label="Page navigation">
      <ul class="inline-flex items-center space-x-2">
        <!-- Prev -->
        <li>
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-xl text-sm font-medium bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 
                   text-gray-800 dark:text-white disabled:opacity-50"
          >
            Prev
          </button>
        </li>
  
        <!-- Page Numbers -->
        <li v-for="n in totalPages" :key="n">
          <button
            @click="setPage(n)"
            :class="[ 
              'px-3 py-2 rounded-xl text-sm font-medium',
              currentPage === n
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
            ]"
          >
            {{ n }}
          </button>
        </li>
  
        <!-- Next -->
        <li>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-xl text-sm font-medium bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 
                   text-gray-800 dark:text-white disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
</template>

<script setup lang="ts">
  const props = defineProps<{
    currentPage: number;
    totalPages: number;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:page', value: number): void;
  }>();
  
  const nextPage = () => {
    if (props.currentPage < props.totalPages) {
      emit('update:page', props.currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (props.currentPage > 1) {
      emit('update:page', props.currentPage - 1);
    }
  };
  
  const setPage = (n: number) => {
    if (n !== props.currentPage) {
      emit('update:page', n);
    }
  };
</script>