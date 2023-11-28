// app-inicio.js
axios.defaults.baseURL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
        membershipMessages: [], // Aquí almacenarás los mensajes de los estados de la membresía
        reservationMessages: [], // Aquí almacenarás los mensajes de los estados de las reservaciones
        stats: {
            members: 0,
            reservations: 0,
            equipment: 0
        },
        // Asegúrate de que cualquier otro dato necesario esté aquí
    },
    methods: {
        fetchStats() {
            // Obtener el total de miembros
            axios.get('/stats/members').then(response => {
                this.stats.members = response.data.total;
                // Después de obtener el total de miembros, verifica el estado de la membresía
                this.fetchMembershipMessages();
            }).catch(error => {
                console.error('Error fetching members stats:', error);
            });

            // Obtener el total de reservas activas
            axios.get('/stats/reservations').then(response => {
                this.stats.reservations = response.data.total;
                // Después de obtener el total de reservas, verifica el estado de las reservaciones
                this.fetchReservations();
            }).catch(error => {
                console.error('Error fetching reservations stats:', error);
            });

            // Obtener el total de equipos
            axios.get('/stats/equipment').then(response => {
                this.stats.equipment = response.data.total;
            }).catch(error => {
                console.error('Error fetching equipment stats:', error);
            });
        },
        fetchMembershipMessages() {
            axios.get('/miembros')
              .then(response => {
                this.membershipMessages = response.data.map(member => {
                  // Asegurándonos de que la propiedad FechaFin existe y es válida
                  const fechaFin = member.FechaFin ? new Date(member.FechaFin) : null;
                  const isMembershipExpired = fechaFin && fechaFin < new Date();
                  const fechaFinFormatted = fechaFin ? fechaFin.toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'Sin fecha';
          
                  return {
                    ...member,
                    mensajeEstadoMembresia: isMembershipExpired
                      ? `La membresía de ${member.Nombre} ${member.Apellidos} ha vencido el día ${fechaFinFormatted}`
                      : `La membresía de ${member.Nombre} ${member.Apellidos} está activa`
                  };
                }).filter(member => member.mensajeEstadoMembresia.includes('vencido'));
              })
              .catch(error => {
                console.error('Error fetching members for status messages:', error);
              });
          },
          
        fetchReservations() {
            axios.get('/reservaciones').then(response => {
                const reservations = response.data;
                this.reservationMessages = reservations.map(reservation => {
                    return {
                        ...reservation,
                        mensajeEstadoReservacion: reservation.EstadoReservacion === 'Cancelada' ? `La reservación de ${reservation.Nombre} ${reservation.Apellidos} ha sido cancelada` : `La reservación de ${reservation.Nombre} ${reservation.Apellidos} está activa`
                    };
                }).filter(reservation => reservation.mensajeEstadoReservacion.includes('cancelada'));
            }).catch(error => {
                console.error('Error fetching reservations for status messages:', error);
            });
        }        
    },
    mounted() {
        this.fetchStats(); // Se llama al método cuando la instancia se monta
        this.fetchReservations(); // Llama al método cuando la instancia se monta

    }
});
