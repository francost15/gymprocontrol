<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Reservas - GymProControl</title>
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
        <h1 class="text-2xl font-semibold">Lista de Reservas</h1>
    </div>

    <!-- Botón de Agregar -->
    <div class="mb-4">
        <button @click="addNewReservation" class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded">Agregar Reserva</button>
    </div>
    <div class="mb-4">
  <input type="text" v-model="searchQuery" class="mt-1 p-2 w-full border rounded-md" placeholder="Buscar por nombre...">
</div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
    <table class="min-w-full bg-white divide-y divide-gray-200">
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[50px]">ID Reservacion</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Id miembro</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Fecha y hora</th>
                <th class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Tipo de reservacion</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Comentarios</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Estado Reservacion</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Area</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Equipo</th>
                <th class="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-150">
  <tr v-for="reservation in filteredReservations">
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.IDReservacion }}</td>    
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.IDMiembro }}</td>
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.FechaHoraReservacion }}</td>
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.TipoReservacion }}</td>
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.Comentarios }}</td>
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ reservation.EstadoReservacion }}</td>
    <td class="px-1 py-1 whitespace-nowrap text-sm">{{ findAreaName(reservation.IDArea) }}</td>
<td class="px-1 py-1 whitespace-nowrap text-sm">{{ findEquipmentName(reservation.IDEquipo) }}</td>

    <td class="px-2 py-1 whitespace-nowrap text-center align-middle text-sm font-medium">
      <button @click="editReservation(reservation)" class="text-indigo-600 hover:text-indigo-900">
          <i class="fas fa-edit"></i>
      </button>
      <button @click="deleteReservation(reservation.IDReservacion)" class="text-red-600 hover:text-red-900 ml-2">
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
                    <label for="IDMiembro" class="block text-sm font-medium text-gray-700">Miembro</label>
                    <select v-model="newReservation.IDMiembro" id="IDMiembro">
                    <option v-for="member in members" :key="member.IDMiembro" :value="member.IDMiembro">{{ member.IDMiembro }} - {{ member.Nombre }} </option>
                    </select>
        </div>
                <div class="mb-4">
                    <label for="FechaHoraReservacion" class="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                    <input v-model="newReservation.FechaHoraReservacion" type="datetime-local" id="FechaHoraReservacion" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>
                
                <div class="mb-4">
                    <label for="TipoReservacion" class="block text-sm font-medium text-gray-700">Tipo de Reservación</label>
                    <select v-model="newReservation.TipoReservacion" id="TipoReservacion" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="personal">Personal</option>
                        <option value="evento">Evento</option>
                        <!-- Más opciones si son necesarias -->
                    </select>
                </div>
                
                <div class="mb-4">
                    <label for="Comentarios" class="block text-sm font-medium text-gray-700">Comentarios</label>
                    <textarea v-model="newReservation.Comentarios" id="Comentarios" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                </div>

                <div class="mb-4">
                    <label for="EstadoReservacion" class="block text-sm font-medium text-gray-700">Estado de Reservacion</label>
                    <select v-model="newReservation.EstadoReservacion" id="EstadoReservacion" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="Activa">Activa</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                </div>
                <!-- Campo para seleccionar área -->
<!-- Campo para seleccionar área -->
<div class="mb-4">
  <label for="IDArea" class="block text-sm font-medium text-gray-700">Área</label>
  <select v-model="newReservation.IDArea" id="IDArea" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
    <option v-for="area in areas" :key="area.IDArea" :value="area.IDArea">{{ area.NombreArea }}</option>
  </select>
</div>

<!-- Campo para seleccionar equipo -->
<div class="mb-4">
  <label for="IDEquipo" class="block text-sm font-medium text-gray-700">Equipo</label>
  <select v-model="newReservation.IDEquipo" id="IDEquipo" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
    <option v-for="equipo in equipos" :key="equipo.IDEquipo" :value="equipo.IDEquipo">{{ equipo.NombreEquipo }}</option>
  </select>
</div>

        <!-- Botones de acción -->
        <div class="flex justify-end mt-4">
          <button @click="showForm = false" class="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-l">
            Cancelar
          </button>
          <button @click="submitForm" class="bg-gray-600 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-r">
            {{ formButton }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

</div>

   

<!-- Incluir tu archivo app.js -->
<script src="app-reservas.js"></script>
</body>

</html>