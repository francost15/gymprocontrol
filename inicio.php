<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GymProControl</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">

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
<!-- Botón de Logout en la parte inferior de la sidebar -->
<div class="absolute bottom-0 mb-4 w-full flex justify-center">
    <a href="index.php" class="text-white text-lg font-bold py-2 px-6 bg-red-600 hover:bg-red-700 rounded-full transition-all ease-in-out duration-300">
        <i class="fas fa-sign-out-alt"></i> Salir
    </a>
</div>
</div>

<div id="app" class="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg ml-72">
<div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Inicio rapido</h1>
    </div>

    <div class="flex justify-center">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
                <div class="text-gray-600">Miembros</div>
                <div class="text-3xl text-blue-500">{{ stats.members }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
                <div class="text-gray-600">Reservas</div>
                <div class="text-3xl text-green-500">{{ stats.reservations }}</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
                <div class="text-gray-600">Equipos</div>
                <div class="text-3xl text-red-500">{{ stats.equipment }}</div>
            </div>
            <!-- Más tarjetas de estadísticas si es necesario -->
        </div>
    </div>
    <!-- Dentro de tu archivo HTML o componente Vue donde quieras mostrar los mensajes -->
    <div v-if="membershipMessages.length > 0">
    <h2>Mensajes de Estado de Membresía</h2>
    <ul>
        <li v-for="message in membershipMessages" :key="message.IDMiembro" style="color: red; text-decoration: underline;">
            {{ message.mensajeEstadoMembresia }}
        </li>
    </ul>
</div>
<!-- Agrega esto en tu archivo HTML o plantilla de Vue donde quieras mostrar los mensajes -->
<div v-if="reservationMessages.length > 0">
    <h2>Mensajes de Estado de Reservaciones</h2>
    <ul>
        <li v-for="message in reservationMessages" :key="message.IDReservacion" class="reservation-cancelled">
            {{ message.mensajeEstadoReservacion }}
        </li>
    </ul>
</div>


</div>
<!-- Incluye Vue y Axios si aún no lo has hecho -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>

<!-- Incluye tu script de Vue -->
<script src="app-inicio.js"></script>
</body>
</html>