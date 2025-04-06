<template>
    <button 
      :class="[baseClasses, colorClasses[color]]" 
      @click="onClick"
    >
      <component :is="icon" class="w-5 h-5 text-white" />
      <span v-if="alwaysShowLabel" class="ml-2">{{ label }}</span>
      <span v-else class="ml-2 hidden sm:inline">{{ label }}</span>
    </button>
</template> 
  
<script>
  export default {
    props: {
      onClick: Function,
      icon: [Object, Function, String],
      label: String,
      color: {
        type: String,
        default: 'blue',
        validator: (value) =>
          ['blue', 'green', 'red', 'gray', 'yellow', 'purple'].includes(value),
      },
      alwaysShowLabel: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      baseClasses() {
        return 'text-white px-3 py-1.5 rounded cursor-pointer flex items-center gap-2';
      },
      colorClasses() {
        return {
          gray: 'bg-gray-500 hover:bg-gray-600',
          blue: 'bg-blue-500 hover:bg-blue-600',
          green: 'bg-green-500 hover:bg-green-600',
          yellow: 'bg-yellow-500 hover:bg-yellow-600',
          purple: 'bg-purple-500 hover:bg-purple-600',
          red: 'bg-red-500 hover:bg-red-600',
        };
      },
    },
  };
</script>   