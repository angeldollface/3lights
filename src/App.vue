<template>
  <ModelCog/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelCog from './components/ModelCog.vue';

export default defineComponent(
  {
    name: 'App',
    components: {
      ModelCog
    }
  }
);
</script>

<style lang="scss">
 @import './sass/universal';
</style>
