import setup from './core/setup'

setup({
  mounted() {
    window.axios.get('/api/test')
  },
  methods: {
    helloWorld() {
      alert('Hello World!')
    }
  }
})
