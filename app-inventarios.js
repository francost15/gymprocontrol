axios.defaults.baseURL = 'http://localhost:3000';

new Vue({
    el: '#app',
    data: {
        equipments: [],
        showForm: false,
        currentEquipment: {},
        searchQuery: '',
        formTitle: '',
        areas: [],
        formButton: ''
    },
    computed: {
        filteredEquipments() {
            let query = this.searchQuery.toLowerCase();
            return this.equipments.filter(equipment => {
                return equipment.NombreEquipo.toLowerCase().includes(query) ||
                       equipment.Tipo.toLowerCase().includes(query);
            });
        }
    },
    methods: {
        addNewEquipment() {
            this.showForm = true;
            this.formTitle = 'Agregar Equipo';
            this.formButton = 'Agregar';
            this.currentEquipment = { Estado: 'Bueno', IDArea: '' }; 
        },
        editEquipment(equipment) {
            this.showForm = true;
            this.formTitle = 'Editar Equipo';
            this.formButton = 'Actualizar';
            this.currentEquipment = Object.assign({}, equipment);
            this.currentEquipment.FechaCompra = this.currentEquipment.FechaCompra ? this.currentEquipment.FechaCompra.split('T')[0] : '';
            this.currentEquipment.FechaUltimoMantenimiento = this.currentEquipment.FechaUltimoMantenimiento ? this.currentEquipment.FechaUltimoMantenimiento.split('T')[0] : '';
            this.currentEquipment.MantenimientoProgramado = this.currentEquipment.MantenimientoProgramado ? this.currentEquipment.MantenimientoProgramado.split('T')[0] : '';
        },
        submitForm() {
            let equipmentData = Object.assign({}, this.currentEquipment);
            const apiAction = equipmentData.IDEquipo ? axios.put : axios.post;
            const apiUrl = equipmentData.IDEquipo ? `/inventario-equipos/${equipmentData.IDEquipo}` : '/inventario-equipos';
            
            apiAction(apiUrl, equipmentData)
                .then(() => {
                    Swal.fire('Éxito', 'La operación se realizó con éxito', 'success');
                    this.fetchEquipments();
                    this.showForm = false;
                })
                .catch(error => {
                    console.error("Error:", error.response.data);
                    Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
                });
        },
        deleteEquipment(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2c2c2c',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/inventario-equipos/${id}`)
                        .then(() => {
                            Swal.fire('Eliminado', 'El equipo ha sido eliminado.', 'success');
                            this.fetchEquipments();
                        })
                        .catch(error => {
                            console.error("Error:", error.response.data);
                            Swal.fire('Error', 'Ocurrió un error al eliminar el equipo.', 'error');
                        });
                }
            });
        },
        downloadInventoryCSVReport() {
            window.location.href = 'http://localhost:3000/download-inventory-report';
        },
        downloadInventoryPDFReport() {
            window.location.href = 'http://localhost:3000/download-inventory-pdf-report';
        },
          
        findAreaName(areaId) {
            const area = this.areas.find(area => area.IDArea === areaId);
            return area ? area.NombreArea : null;
        },
        fetchAreas() {
            axios.get('/areas')
                .then(response => {
                    this.areas = response.data;
                })
                .catch(error => {
                    console.error('Error al cargar las áreas:', error);
                });
        },
        fetchEquipments() {
            axios.get('/inventario-equipos')
                .then(response => {
                    this.equipments = response.data.map(equipment => {
                        // Formatea las fechas correctamente para la visualización
                        equipment.FechaCompra = equipment.FechaCompra ? equipment.FechaCompra.split('T')[0] : '';
                        equipment.FechaUltimoMantenimiento = equipment.FechaUltimoMantenimiento ? equipment.FechaUltimoMantenimiento.split('T')[0] : '';
                        equipment.MantenimientoProgramado = equipment.MantenimientoProgramado ? equipment.MantenimientoProgramado.split('T')[0] : '';
                        equipment.Costo = equipment.Costo ? `$${equipment.Costo}` : '';

                        return equipment;
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire('Error', 'Ocurrió un error al obtener los equipos.', 'error');
                });
        }
    },
    mounted() {
        this.fetchEquipments();
        this.fetchAreas();
    }
});
