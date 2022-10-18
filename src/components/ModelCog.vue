<script lang="ts">
import { defineComponent } from 'vue';
import { renderModel } from './render';
export default defineComponent(
  {
    name: 'ModelCog',
    methods: {
      init(){
        renderModel();
      }
    },
    mounted () {
      this.init();
    }
  }
);
</script>