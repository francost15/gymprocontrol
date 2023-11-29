axios.defaults.baseURL = 'http://localhost:3000';
new Vue({
  el: '#app',
  data: {
    user: {
      username: '',
      password: ''
    },
    loginError: ''
  },
  methods: {
    login() {
      this.loginError = '';
      axios.post('/login', {
        username: this.user.username,
        password: this.user.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        // Asegúrate de que la respuesta del servidor es la esperada
        if (response.data.success) {
          // Si el inicio de sesión es exitoso, redirige
          window.location.href = '/control/inicio.html'; // Ruta absoluta
        } else {
          // Si la respuesta del servidor indica un fallo
          this.loginError = response.data.message || 'Inicio de sesión fallido.';
        }
      })
      .catch(error => {
        if (error.response) {
          // El servidor respondió con un estado fuera del rango 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          this.loginError = error.response.data.message || 'Error al procesar la respuesta.';
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta del servidor
          console.log(error.request);
          this.loginError = 'No se recibió respuesta del servidor.';
        } else {
          // Algo ocurrió al configurar la petición que provocó un error
          console.log('Error', error.message);
          this.loginError = 'Error al configurar la petición.';
        }
        console.error(error.config);
      });
    }
  }
});
