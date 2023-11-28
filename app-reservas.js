axios.defaults.baseURL = 'http://localhost:3000';

new Vue({
  el: '#app',
  data: {
    isSubmitting: false,
    reservations: [],
    newReservation: { // Asegurándose de que todos los campos tienen valores predeterminados coherentes
      IDReservacion: '',
      IDMiembro: '', // Esto debe ser inicializado de acuerdo a tu lógica, si espera un ID, un string vacío podría no ser adecuado
      FechaHoraReservacion: '',
      TipoReservacion: '',
      Comentarios: '',
      EstadoReservacion: 'Activa',
      IDArea: '', // Asegúrate de que el valor por defecto aquí sea coherente con lo que espera tu backend
      IDEquipo: '',
    },
    members: [],
    areas: [],
    equipos: [],
    showForm: false,
    formTitle: '',
    formButton: '',
    isEditing: false,
    searchQuery: '',
    selectedArea: null, // Inicializa con null si no hay selección por defecto
    selectedEquipo: null,
  },
  computed: {
    filteredReservations() {
      let query = this.searchQuery.toLowerCase();
      return this.reservations.filter(reservation => {
        return (reservation.TipoReservacion ? reservation.TipoReservacion.toLowerCase().includes(query) : false) ||
               (reservation.Comentarios ? reservation.Comentarios.toLowerCase().includes(query) : false);
       });
    },
  },
  methods: {
    addNewReservation() {
            this.showForm = true;
            this.formTitle = 'Crear Reservación';
            this.formButton = 'Guardar';
            this.newReservation = {
                IDMiembro: '',
                FechaHoraReservacion: '',
                TipoReservacion: '',
                Comentarios: '',
                EstadoReservacion: 'Activa'
            };
            this.isEditing = false;
        },
        
        editReservation(reservation) {
            this.showForm = true;
            this.formTitle = 'Editar Reservación';
            this.formButton = 'Actualizar';
            this.newReservation = Object.assign({}, reservation);
            this.isEditing = true;
        },
        cancelForm() {
            this.showForm = false;
            this.isEditing = false;
            this.newReservation = {
                IDReservacion: '',
                IDMiembro: '',
                FechaHoraReservacion: '',
                TipoReservacion: '',
                Comentarios: '',
                EstadoReservacion: '',
            };
        },
        submitForm() {
          // Si ya se está procesando un formulario, no hacer nada.
          if (this.isSubmitting) {
            return;
          }
        
          // Ahora estamos procesando un formulario.
          this.isSubmitting = true;
        
          // Verifica que todos los campos requeridos están completos.
          if (!this.newReservation.IDMiembro || !this.newReservation.FechaHoraReservacion ||
              !this.newReservation.TipoReservacion || !this.newReservation.EstadoReservacion ||
              !this.newReservation.IDArea || !this.newReservation.IDEquipo) {
            Swal.fire({
              title: 'Error',
              text: 'Por favor, rellena todos los campos requeridos.',
              icon: 'error',
              confirmButtonText: 'Cerrar'
            });
            this.isSubmitting = false; // Restablece la bandera ya que el formulario no se envió.
            return; // Detiene la ejecución si hay campos requeridos vacíos.
          }
        
          // Convierte la fecha y hora de la reservación a ISO string si está presente.
          const formattedDate = this.newReservation.FechaHoraReservacion
            ? new Date(this.newReservation.FechaHoraReservacion).toISOString()
            : null;
        
          // Prepara los datos de la reservación para enviarlos.
          const reservationData = {
            ...this.newReservation,
            FechaHoraReservacion: formattedDate,
            IDArea: this.selectedArea || this.newReservation.IDArea,
            IDEquipo: this.selectedEquipo || this.newReservation.IDEquipo,
          };
        
          // Decide si se trata de una actualización o de una nueva creación.
          const apiAction = this.isEditing ? axios.put : axios.post;
          const apiUrl = this.isEditing ? `/reservaciones/${this.newReservation.IDReservacion}` : '/reservaciones';
        
          // Envía los datos al servidor.
          apiAction(apiUrl, reservationData)
            .then(() => {
              // Notifica al usuario del éxito.
              Swal.fire({
                title: 'Éxito',
                text: 'La reservación ha sido guardada con éxito.',
                icon: 'success',
                confirmButtonText: 'Genial'
              });
              this.loadReservations(); // Recarga las reservaciones.
              this.cancelForm(); // Cierra el formulario.
            })
            .catch(error => {
              // Notifica al usuario del error.
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al guardar la reservación.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
              });
              console.error("Error:", error);
            })
            .finally(() => {
              this.isSubmitting = false; // Reestablece el estado de envío.
            });
        },
                
    deleteReservation(IDReservacion) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2c2c2c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/reservaciones/${IDReservacion}`)
                    .then(() => {
                        Swal.fire(
                            'Eliminado!',
                            'La reservación ha sido eliminada.',
                            'success'
                        );
                        this.loadReservations();
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al eliminar la reservación.',
                            'error'
                        );
                        console.error("Error:", error);
                    });
            }
        })
    },
    checkMembershipStatus(member) {
      const today = new Date();
      const endDate = new Date(member.FechaFin);

      if (endDate < today) {
        member.EstadoMembresia = 'Vencida';
      }
    },
    updateMembershipStatus(member) {
      const today = new Date();
      const membershipEndDate = new Date(member.FechaFin);
      if (membershipEndDate < today && member.EstadoMembresia === 'Activa') {
        // Aquí podrías llamar a una API para actualizar el estado en el backend si es necesario
        member.EstadoMembresia = 'Vencida';
      }
    },
    findAreaName(areaId) {
      let area = this.areas.find(a => a.IDArea === areaId);
      return area ? area.NombreArea : 'No especificado';
    },
    findEquipmentName(equipmentId) {
      let equipo = this.equipos.find(e => e.IDEquipo === equipmentId);
      return equipo ? equipo.NombreEquipo : 'No especificado';
    },
    loadReservations() {
      this.isLoading = true; // Asegúrate de tener un data property llamado isLoading
      axios.get('/reservaciones')
        .then(response => {
          this.reservations = response.data.map(reservation => {
            reservation.FechaHoraReservacion = new Date(reservation.FechaHoraReservacion).toLocaleString();
            reservation.NombreArea = this.findAreaName(reservation.IDArea); // Agregando el nombre del área
            reservation.NombreEquipo = this.findEquipmentName(reservation.IDEquipo); // Agregando el nombre del equipo
            return reservation;
          });
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Ocurrió un error al obtener las reservaciones. Por favor inténtalo de nuevo.");
        })
        .finally(() => {
          this.isLoading = false; // Finaliza el indicador de carga
        });
    },
    loadMembers() {
      axios.get('/miembros')
        .then(response => {
          this.members = response.data;
          // Después de cargar los miembros, verifica el estado de la membresía de cada uno
          this.members.forEach(this.updateMembershipStatus);
        })
        .catch(error => {
          console.error("Error al cargar los miembros:", error);
          // Manejar el error adecuadamente, por ejemplo, mostrando un mensaje al usuario
        });
    },
    loadAreas() {
        axios.get('/areas')
          .then(response => {
            this.areas = response.data;
          })
          .catch(error => {
            console.error('Error al cargar las áreas:', error);
          });
      },
      loadEquipos() {
        axios.get('/inventario-equipos')
          .then(response => {
            this.equipos = response.data;
          })
          .catch(error => {
            console.error('Error al cargar los equipos:', error);
          });
        // Nota: No hay coma al final de este método porque es el último en el objeto `methods`
      } }, 
    mounted() {
      this.loadReservations();
      this.loadMembers();
      this.loadAreas();
      this.loadEquipos();
      // Ahora mounted está correctamente ubicado dentro del objeto Vue
    }
  });