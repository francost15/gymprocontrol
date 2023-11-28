<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventario - GymProControl</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <link rel="stylesheet" href="styles.css">

</head>

<body class="bg-gray-100">
    


 <!-- Sidebar -->
<div class="h-screen bg-gray-900 text-white w-64 fixed top-0 left-0 p-4">
<div class="flex justify-center">
        <img src="Logo app.jpeg" alt="Logo" class="rounded-full w-32 h-32 mb-4"> <!-- Asegúrate de usar la ruta correcta a tu imagen -->
    </div>
    <div class="mb-8 text-2xl font-semibold tracking-wider">GymProControl</div>
    <ul>
        <li><a href="inicio.php" class="block mt-4 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"><i class="fas fa-home"></i> Inicio</a></li>
        <li><a href="miembros.php" class="block mt-4 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"><i class="fas fa-users"></i> Miembros</a></li>
        <li><a href="reservas.php" class="block mt-4 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"><i class="fas fa-calendar-alt"></i> Reservas</a></li>
        <li><a href="inventario.php" class="block mt-4 px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"><i class="fas fa-dumbbell"></i> Inventario</a></li>
    </ul>
    <div class="absolute bottom-0 mb-4 w-full flex justify-center">
    <a href="index.php" class="text-white text-lg font-bold py-2 px-6 bg-red-600 hover:bg-red-700 rounded-full transition-all ease-in-out duration-300">
        <i class="fas fa-sign-out-alt"></i> Salir
    </a>
</div>
</div>


    <div id="app" class="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg ml-72">
    <!-- Título y Botón de Agregar -->
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Inventario</h1>
    </div>

<!-- Botón de Agregar -->
<div class="mb-4">
    <button @click="addNewEquipment" class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded">Añadir equipo</button>
    <button @click="downloadInventoryCSVReport"  class="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded">Descargar Informe de Inventario (CSV)</button>
    <button @click="downloadInventoryPDFReport" class="bg-green-700 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded">Descargar Informe de Inventario (PDF)</button>

</div>
<!-- Campo de búsqueda -->
<div class="mb-4">
  <input type="text" v-model="searchQuery" class="mt-1 p-2 w-full border rounded-md" placeholder="Buscar por nombre o tipo">
</div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
    <table class="min-w-full bg-white divide-y divide-gray-200">
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[50px]">ID Equipo</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Nombre</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Tipo</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">Cantidad</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Estado</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Ubicación</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Fecha Compra</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Proveedor</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Costo</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Fecha Últ. Mant.</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Observaciones</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Mantenimiento Programado</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Area</th>
                <th class="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-150">
            <tr v-for="equipment in filteredEquipments" :key="equipment.IDEquipo">
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.IDEquipo }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.NombreEquipo }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Tipo }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Cantidad }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Estado }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Ubicacion }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.FechaCompra }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Proveedor }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Costo }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.FechaUltimoMantenimiento }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.Observaciones }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ equipment.MantenimientoProgramado }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ findAreaName(equipment.IDArea) || 'No asignado' }}</td>


           
                <td class="px-2 py-1 whitespace-nowrap text-center align-middle text-sm font-medium">
                    <button @click="editEquipment(equipment)" class="text-indigo-600 hover:text-indigo-900">
                    <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteEquipment(equipment.IDEquipo)" class="text-red-600 hover:text-red-900 ml-2">
                    <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-5 rounded shadow-lg w-1/2">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">{{ formTitle }}</h3>
      <form @submit.prevent="submitForm">
        <!-- Aquí van todos los campos de tu formulario -->
        <div class="mb-4">
            <label for="nombreEquipo" class="block text-sm font-medium text-gray-700">Nombre del Equipo:</label>
            <input type="text" id="nombreEquipo" v-model="currentEquipment.NombreEquipo" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el nombre del equipo">
        </div>
        <div class="mb-4">
            <label for="tipo" class="block text-sm font-medium text-gray-700">Tipo:</label>
            <select v-model="currentEquipment.Tipo" id="Tipo" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="Pecho">Para Pecho</option>
                        <option value="Pierna">Para Pierna</option>
                        <option value="Espalda">Para Espalda</option>
                        <option value="Biceps">Para Biceps</option>
                        <option value="Hombro">Para Hombro</option>  
                        <option value="Triceps">Para Triceps</option>          
                    </select>      
                  </div>
        <div class="mb-4">
            <label for="cantidad" class="block text-sm font-medium text-gray-700">Cantidad:</label>
            <input type="number" id="cantidad" v-model="currentEquipment.Cantidad" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce la cantidad">
        </div>
       
        
        <div class="mb-4">
                    <label for="estado" class= "block text-sm font-medium text-gray-700">Estado</label>
                    <select v-model="currentEquipment.Estado" id="Estado" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="Nuevo">Nuevo</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Necesita reparacion">Necesita reparacion</option>
                        <option value="Fuera">Fuera</option>          
                    </select>
                </div>
        <div class="mb-4">
            <label for="ubicacion" class="block text-sm font-medium text-gray-700">Ubicación:</label>
            <input type="text" id="ubicacion" v-model="currentEquipment.Ubicacion" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce la ubicación del equipo">
        </div>
        <div class="mb-4">
            <label for="fechaCompra" class="block text-sm font-medium text-gray-700">Fecha de Compra:</label>
            <input type="date" id="fechaCompra" v-model="currentEquipment.FechaCompra" class="mt-1 p-2 w-full border rounded-md">
        </div>
        <div class="mb-4">
            <label for="proveedor" class="block text-sm font-medium text-gray-700">Proveedor:</label>
            <input type="text" id="proveedor" v-model="currentEquipment.Proveedor" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el proveedor">
        </div>
        <div class="mb-4">
            <label for="costo" class="block text-sm font-medium text-gray-700">Costo:</label>
            <div class="flex items-center mt-1">
        <span class="text-green-500 mr-2">$</span>
            <input type="number" id="costo" v-model="currentEquipment.Costo" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el costo">
            </div>
        </div>
        <div class="mb-4">
            <label for="fechaUltMantenimiento" class="block text-sm font-medium text-gray-700">Fecha del Último Mantenimiento:</label>
            <input type="date" id="fechaUltMantenimiento" v-model="currentEquipment.FechaUltimoMantenimiento" class="mt-1 p-2 w-full border rounded-md">
        </div>
        <div class="mb-4">
            <label for="observaciones" class="block text-sm font-medium text-gray-700">Observaciones:</label>
            <textarea id="observaciones" v-model="currentEquipment.Observaciones" class="mt-1 p-2 w-full border rounded-md" placeholder="Añade alguna observación"></textarea>
        </div>
        <div class="mb-4">
            <label for="ManteniProgramado" class="block text-sm font-medium text-gray-700">Fecha del Mantenimiento Programado:</label>
            <input type="date" id="ManteniProgramado" v-model="currentEquipment.MantenimientoProgramado" class="mt-1 p-2 w-full border rounded-md">
        </div>
        <div class="mb-4">
  <label for="IDArea" class="block text-sm font-medium text-gray-700">Área</label>
  <select v-model="currentEquipment.IDArea" id="IDArea" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
    <option v-for="area in areas" :value="area.IDArea">{{ area.NombreArea }}</option>
  </select>
</div>

        <!-- Botones de acción -->
        <div class="flex justify-end mt-4">
          <button type="button" @click="showForm = false" class="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-l">
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-r">
            {{ formButton }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
</div>
    <script src="app-inventarios.js"></script>
</body>
</html>
