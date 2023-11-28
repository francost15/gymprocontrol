<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Miembros - GymProControl</title>
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
        <img src="Logo app.jpeg" alt="Logo" class="rounded-full w-32 h-32 mb-4"> 
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
        <h1 class="text-2xl font-semibold">Lista de Miembros</h1>
    </div>

<!-- Botón de Agregar -->
<div class="mb-4">
<button @click="addNewMember" class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded">Agregar Miembro</button>
<button @click="downloadMembersReport" class="bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded">Descargar Informe de Miembros (CSV)</button>
<button @click="downloadMembersPDFReport" class="bg-green-700 hover:bg-green-900 text-white font-semibold py-2 px-4 rounded">Descargar Informe de Miembros (PDF)</button>
  </div>

<!-- Campo de búsqueda -->
<div class="mb-4">
  <input type="text" v-model="searchQuery" class="mt-1 p-2 w-full border rounded-md" placeholder="Buscar por nombre o apellidos...">
</div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
    <table class="min-w-full bg-white divide-y divide-gray-200">
        <thead class="bg-gray-800 text-white">
            <tr>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[50px]">ID</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Nombre</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">Apellidos</th>
                <th class="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Fecha Nacimiento</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Fecha Inicio</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Fecha Fin</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Contacto Emergencia</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Direccion</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Telefono</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Email</th>
                <th class="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Estado</th>
                <th class="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-150">
            <tr v-for="member in filteredMembers" :key="member.IDMiembro">
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.IDMiembro }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm" >{{ member.Nombre }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm" >{{ member.Apellidos }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.FechaNacimiento }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.FechaInicio }} </td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.FechaFin }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.ContactoEmergencia }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.Direccion }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.Telefono }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.Email }}</td>
                <td class="px-1 py-1 whitespace-nowrap text-sm">{{ member.EstadoMembresia }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-center align-middle text-sm font-medium">
    <button @click="editMember(member)" class="text-indigo-600 hover:text-indigo-900">
        <i class="fas fa-edit"></i>
    </button>
    <button @click="deleteMember(member.IDMiembro)" class="text-red-600 hover:text-red-900 ml-2">
        <i class="fas fa-trash-alt"></i>
    </button>
    <button @click="generateQR(member)" class="text-gray-600 hover:text-blue-900 ml-2">
    <i class="fas fa-qrcode"></i>
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
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="nombre" v-model="currentMember.Nombre" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el nombre">
        </div>
        <div class="mb-4">
            <label for="apellido" class="block text-sm font-medium text-gray-700">Apellidos:</label>
            <input type="text" id="apellido" v-model="currentMember.Apellidos" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce los apellidos">
        </div>
    
        <div class="mb-4">
        <label for="FechaNacimiento" class="block text-sm font-medium text-gray-700">Fecha Nacimiento:</label>
        <input type="date" id="FechaNacimiento" v-model="currentMember.FechaNacimiento" class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">

    </div>
    <div class="mb-4">
  <label for="DuracionMembresia" class="block text-sm font-medium text-gray-700">Duración de Membresía:</label>
  <select id="DuracionMembresia" v-model="currentMember.DuracionMembresia" @change="calculateMembershipCostAndEndDate" class="mt-1 p-2 w-full border rounded-md">
    <option value="">Selecciona una duración</option>
    <option value="1dia">1 Dia</option>
    <option value="1mes">1 Mes</option>
    <option value="3meses">3 Meses</option>
  </select>
</div>

<div class="mb-4">
    <label for="Costo" class="block text-sm font-medium text-gray-700">Costo:</label>
    <div class="flex items-center mt-1">
        <span class="text-green-500 mr-2">$</span>
        <input type="text" id="Costo" v-model="currentMember.Costo" class="p-2 w-full border rounded-md" readonly>
    </div>
</div>

    <div class="mb-4">
        <label for="FechaInicio" class="block text-sm font-medium text-gray-700">Fecha Inicio:</label>
        <input type="date" id="FechaInicio" v-model="currentMember.FechaInicio" class="mt-1 p-2 w-full border rounded-md">
    </div>
    
    <div class="mb-4">
        <label for="FechaFin" class="block text-sm font-medium text-gray-700">Fecha Fin:</label>
        <input type="date" id="FechaFin" v-model="currentMember.FechaFin" class="mt-1 p-2 w-full border rounded-md">
    </div>
        <div class="mb-4">
            <label for="ContactoEmergencia" class="block text-sm font-medium text-gray-700">Contacto Emergencia:</label>
            <input type="text" id="ContactoEmergencia" v-model="currentMember.ContactoEmergencia" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el contacto de emergencia">
        </div>
    
        <div class="mb-4">
            <label for="Direccion" class="block text-sm font-medium text-gray-700">Dirección:</label>
            <input type="text" id="Direccion" v-model="currentMember.Direccion" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce la dirección">
        </div>
    
        <div class="mb-4">
            <label for="Telefono" class="block text-sm font-medium text-gray-700">Teléfono:</label>
            <input type="text" id="Telefono" v-model="currentMember.Telefono" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el teléfono">
        </div>
    
        <div class="mb-4">
            <label for="Email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" id="Email" v-model="currentMember.Email" class="mt-1 p-2 w-full border rounded-md" placeholder="Introduce el email">
        </div>
        <!-- Campo de Estado de Membresía -->
<div class="mb-4">
    <label for="EstadoMembresia" class="block text-sm font-medium text-gray-700">Estado de Membresía:</label>
    <select id="EstadoMembresia" v-model="currentMember.EstadoMembresia" class="mt-1 p-2 w-full border rounded-md">
        <option value="Activa">Activa</option>
        <option value="Inactiva">Inactiva</option>
        <option value="Vencida">Vencida</option>
    </select>
</div>

        <!-- Botones de acción -->
        <div class="flex justify-end mt-4">
          <button @click="showForm = false" class="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-l">
            Cancelar
          </button>
          <button
    @click="submitForm"
    :disabled="isSubmitting"
    class="bg-gray-600 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-r"
>
    {{ formButton }}
</button>

        </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal para el código QR -->
<div v-if="showQRModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
  <div class="flex items-center justify-center min-h-screen">
    <div class="bg-white p-5 rounded shadow-lg w-1/3">
    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4 text-center">Bienvenido, {{ currentMemberName }}</h3>
      <div class="flex justify-center">
        <img :src="currentQR" alt="Código QR del miembro" class="qr-code-img" />
      </div>
      <div class="mt-4 text-center">
        <button @click="showQRModal = false" class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</div>

</div>

   

<!-- Incluir tu archivo app.js -->
<script src="app-miembros.js"></script>
</body>

</html>