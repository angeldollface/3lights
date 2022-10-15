<script>
import { renderModel } from './render.js';
export default {
  name: 'ModelCog',
  data () {
    return {}
  },
  methods: {
    init(){
      renderModel();
    }
  },
  mounted () {
      this.init();
  }
}
</script>