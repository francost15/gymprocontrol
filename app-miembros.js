axios.defaults.baseURL = 'http://localhost:3000';

new Vue({
    el: '#app',
    data: {
        members: [],
        showForm: false,
        currentMember: {},
        isSubmitting: false,
        currentMemberName: '',
        searchQuery: '',
        showQRModal: false,
        currentQR: '',
        formTitle: '',
        formButton: '',
        showPaymentForm: false,
        paymentDetails: {
            IDMiembro: '',
            Monto: '',
            MetodoPago: 'Efectivo',
            ReferenciaPago: '',
            EstadoPago: 'Completado',
        }
    },
    computed: {
        filteredMembers() {
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                return this.members.filter(member =>
                    member.Nombre.toLowerCase().includes(query) ||
                    member.Apellidos.toLowerCase().includes(query)
                );
            }
            return this.members;
        }
    },
    methods: {
        addNewMember() {
            this.showForm = true;
            this.formTitle = 'Agregar Miembro';
            this.formButton = 'Agregar';
            this.currentMember = {
                EstadoMembresia: 'Activa' // Valor predeterminado para nuevos miembros
            };
        },
        editMember(member) {
            this.showForm = true;
            this.formTitle = 'Editar Miembro';
            this.formButton = 'Actualizar';
            this.currentMember = Object.assign({}, member);
            //Fechas tengan el formato adecuado para el input tipo fecha
            this.currentMember.FechaNacimiento = this.currentMember.FechaNacimiento ? this.currentMember.FechaNacimiento.split('T')[0] : '';
            this.currentMember.FechaInicio = this.currentMember.FechaInicio ? this.currentMember.FechaInicio.split('T')[0] : '';
            this.currentMember.FechaFin = this.currentMember.FechaFin ? this.currentMember.FechaFin.split('T')[0] : '';
        },
        submitForm() {
            this.isSubmitting = true; // Indicar que el envío ha comenzado
            let memberData = Object.assign({}, this.currentMember);
            // Convertir fechas al formato adecuado para la entrada de fecha
            memberData.FechaNacimiento = memberData.FechaNacimiento ? memberData.FechaNacimiento.split('T')[0] : '';
            memberData.FechaInicio = memberData.FechaInicio ? memberData.FechaInicio.split('T')[0] : '';
            memberData.FechaFin = memberData.FechaFin ? memberData.FechaFin.split('T')[0] : '';
            let apiEndpoint = this.formButton === 'Agregar' ? '/miembros' : `/miembros/${this.currentMember.IDMiembro}`;
            let method = this.formButton === 'Agregar' ? axios.post : axios.put;
        
            method(apiEndpoint, memberData)
                .then(() => {
                    Swal.fire(
                        '¡Éxito!',
                        `El miembro ha sido ${this.formButton === 'Agregar' ? 'agregado' : 'actualizado'} con éxito.`,
                        'success'
                    );
                    this.fetchMembers(); // Recargar la lista de miembros
                    this.currentMember = {}; // Limpiar el formulario para la próxima entrada
                    this.showForm = false; // Cerrar el formulario
                    this.isSubmitting = false; // Indicar que el envío ha terminado
                })
                .catch(error => {
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al procesar la solicitud.',
                        'error'
                    );
                    console.error("Error:", error);
                    this.isSubmitting = false; // Indicar que el envío ha terminado incluso si hubo un error
                });
        },
        

        deleteMember(id) {
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
                    axios.delete(`/miembros/${id}`)
                        .then(() => {
                            Swal.fire(
                                'Eliminado!',
                                'El miembro ha sido eliminado.',
                                'success'
                            );
                            this.fetchMembers();
                        })
                        .catch(error => {
                            Swal.fire(
                                'Error!',
                                'Hubo un problema al eliminar el miembro.',
                                'error'
                            );
                            console.error("Error:", error);
                        });
                }
            });
        },
        downloadMembersReport() {
            window.location.href = 'http://localhost:3000/download-members-report';
          },
          downloadMembersPDFReport() {
            window.location.href = 'http://localhost:3000/download-members-pdf-report';
        },
        async generateQR(member) {
            try {
                const response = await axios.get(`http://localhost:3000/generate-qr/${member.IDMiembro}`);
                this.currentQR = response.data.qrCode;
                this.currentMemberName = member.Nombre; 
                this.showQRModal = true;
            } catch (error) {
                Swal.fire(
                    'Error',
                    'No se pudo generar el código QR. al parecer tu membresia no esta activa',
                    'error'
                );
                console.error('Error al generar el código QR:', error);
            }
        },
          calculateMembershipCostAndEndDate() {
            let startDate = new Date(this.currentMember.FechaInicio);
            let endDate = new Date(startDate);
    
            switch (this.currentMember.DuracionMembresia) {
                case '1dia':
                    this.currentMember.FechaFin = this.currentMember.FechaInicio;
                    this.currentMember.Costo = 50;
                    break;
                case '1mes':
                    endDate.setMonth(startDate.getMonth() + 1);
                    this.currentMember.Costo = 250;
                    break;
                case '3meses':
                    endDate.setMonth(startDate.getMonth() + 3);
                    this.currentMember.Costo = 500;
            }
            if (this.currentMember.DuracionMembresia !== '1dia') {
                this.currentMember.FechaFin = endDate.toISOString().split('T')[0];
            }
        },
        
        fetchMembers() {
            axios.get('/miembros')
                .then(response => {
                    this.members = response.data.map(member => {
                        // Formatea las fechas correctamente para la visualización
                        member.FechaNacimiento = member.FechaNacimiento ? member.FechaNacimiento.split('T')[0] : '';
                        member.FechaInicio = member.FechaInicio ? member.FechaInicio.split('T')[0] : '';
                        member.FechaFin = member.FechaFin ? member.FechaFin.split('T')[0] : '';
                        return member;
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Ocurrió un error al obtener los miembros. Por favor inténtalo de nuevo.");
                });
        },
    },
    mounted() {
        this.fetchMembers();
    }
});