const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.use(cors());
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');
// Middleware para parsing de JSON
app.use(express.json());
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict', // Puede cambiarlo a 'none' si es necesario y configurar `secure: true`
  }
}));
// Conexión a base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gymprocontrol'
});

db.connect((err) => {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Ruta raiz del servidor backend de GymProControl');
});
// Ruta para inicio de sesión de empleados
app.post('/register', (req, res) => {
    const { Username, Password, Role, EmployeeID } = req.body;
    bcrypt.hash(Password, 10, (err, hash) => {
        if (err) {
            res.status(500).send('Error al cifrar la contraseña');
        } else {
            db.query('INSERT INTO UserAccounts (Username, PasswordHash, Role, EmployeeID) VALUES (?, ?, ?, ?)', [Username, hash, Role, EmployeeID], (err, result) => {
                if (err) {
                    res.status(500).send('Error al crear la cuenta de usuario');
                } else {
                    res.send({ message: 'Cuenta de usuario creada exitosamente', userID: result.insertId });
                }
            });
        }
    });
});


// Ruta de inicio de sesión
// Dentro de tu ruta de login en el servidor
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      console.error('Error de login: Faltan credenciales');
      return res.status(400).json({ success: false, message: 'Faltan el usuario o la contraseña' });
    }
    db.query('SELECT * FROM UserAccounts WHERE Username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        } else if (results.length > 0) {
            // Compara la contraseña proporcionada con el hash almacenado
            bcrypt.compare(password, results[0].PasswordHash, (err, result) => {
                if (result) {
                    // Si las contraseñas coinciden
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.json({ success: true, message: 'Inicio de sesión exitoso' });
                } else {
                    // Si las contraseñas no coinciden
                    res.json({ success: false, message: 'Contraseña incorrecta' });
                }
            });
        } else {
            // Si no se encuentra el usuario
            res.json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

app.get('/download-members-report', (req, res) => {
    // Asumiendo que tienes una función que genera un CSV y lo guarda en el sistema de archivos
    generateMembersCsvReport().then(filePath => {
        res.download(filePath, 'members_report.csv');
    }).catch(error => {
        console.error('Error al generar el informe de miembros:', error);
        res.status(500).send('Error al generar el informe');
    });
});

// Ruta para generar y descargar informes de inventario en CSV
app.get('/download-inventory-report', (req, res) => {
    // Similar a la función anterior, pero para inventario
    generateInventoryCsvReport().then(filePath => {
        res.download(filePath, 'inventory_report.csv');
    }).catch(error => {
        console.error('Error al generar el informe de inventario:', error);
        res.status(500).send('Error al generar el informe');
    });
});


function generateMembersCsvReport() {
    return new Promise((resolve, reject) => {
        const csvWriter = createCsvWriter({
            path: 'members_report.csv', // Puedes cambiar la ruta según necesites
            header: [
                { id: 'IDMiembro', title: 'IDMiembro' },
                { id: 'Nombre', title: 'Nombre' },
                { id: 'Apellidos', title: 'Apellidos' },
                { id: 'FechaNacimiento', title: 'FechaNacimiento' },
                { id: 'FechaInicio', title: 'FechaInicio' },
                { id: 'FechaFin', title: 'FechaFin' },
                { id: 'ContactoEmergencia', title: 'ContactoEmergencia' },
                { id: 'Direccion', title: 'Direccion' },
                { id: 'Telefono', title: 'Telefono' },
                { id: 'Email', title: 'Email' },
                { id: 'EstadoMembresia', title: 'EstadoMembresia' },
            ]
            
        });

        // Ejecuta una consulta para obtener todos los miembros
        db.query('SELECT * FROM Miembros', (err, members) => {
            if (err) {
                return reject(err);
            }

            // Escribe los datos en CSV
            csvWriter
                .writeRecords(members)
                .then(() => resolve('members_report.csv'))
                .catch(reject);
        });
    });
}

function generateInventoryCsvReport() {
    return new Promise((resolve, reject) => {
        const csvWriter = createCsvWriter({
            path: 'inventory_report.csv', // Puedes cambiar la ruta según necesites
            header: [
                { id: 'IDEquipo', title: 'IDEquipo' },
                { id: 'NombreEquipo', title: 'NombreEquipo' },
                { id: 'Tipo', title: 'Tipo' },
                { id: 'Cantidad', title: 'Cantidad' },
                { id: 'Estado', title: 'Estado' },
                { id: 'Ubicacion', title: 'Ubicacion' },
                { id: 'FechaCompra', title: 'FechaCompra' },
                { id: 'Proveedor', title: 'Proveedor' },
                { id: 'Costo', title: 'Costo' },
                { id: 'FechaUltimoMantenimiento', title: 'FechaUltimoMantenimiento' },
                { id: 'Observaciones', title: 'Observaciones' },
                { id: 'MantenimientoProgramado', title: 'MantenimientoProgramado' },
                { id: 'IDArea', title: 'IDArea' },
            ]            
        });

        // Ejecuta una consulta para obtener todo el inventario
        db.query('SELECT * FROM InventarioEquipos', (err, equipments) => {
            if (err) {
                return reject(err);
            }

            // Escribe los datos en CSV
            csvWriter
                .writeRecords(equipments)
                .then(() => resolve('inventory_report.csv'))
                .catch(reject);
        });
    });
}
function generateInventoryPdfReport(db) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Encabezados y ancho de las columnas
        const headers = [
            { id: 'IDEquipo', title: 'IDEquipo', width: 70 },
            { id: 'NombreEquipo', title: 'NombreEquipo', width: 120 },
            { id: 'Tipo', title: 'Tipo', width: 100 },
            { id: 'Cantidad', title: 'Cantidad', width: 80 },
            { id: 'Estado', title: 'Estado', width: 80 },
            { id: 'Ubicacion', title: 'Ubicacion', width: 100 },
            { id: 'FechaCompra', title: 'FechaCompra', width: 100 },
            { id: 'Proveedor', title: 'Proveedor', width: 100 },
            { id: 'Costo', title: 'Costo', width: 70 },
            { id: 'FechaUltimoMantenimiento', title: 'FechaUltimoMantenimiento', width: 120 },
            { id: 'Observaciones', title: 'Observaciones', width: 110 },
            { id: 'MantenimientoProgramado', title: 'MantenimientoProgramado', width: 130 },
            { id: 'IDArea', title: 'IDArea', width: 60 },
        ];

        // Dibujar la imagen y el título
        doc.image('Logo app.jpeg', 50, 20, { width: 50 });
        doc.fontSize(18).text('Informe de Inventario', 150, 25);

        // Dibujar los encabezados de la tabla
        let y = 80;
        let x = 50;
        headers.forEach(header => {
            doc.fontSize(10).text(header.title, x, y, { width: header.width, align: 'center' });
            x += header.width;
        });

        // Agregar línea horizontal después de los encabezados
        y += 20;
        doc.moveTo(50, y).lineTo(750, y).stroke();

        // Obtener los datos de la base de datos y llenar la tabla
        db.query('SELECT * FROM InventarioEquipos', (err, equipments) => {
            if (err) {
                doc.end();
                return reject(err);
            }

            y += 10; // Espacio después de la línea del encabezado

            equipments.forEach(equipment => {
                x = 50; // Restablecer posición x para la primera columna
                headers.forEach(header => {
                    let text = '';
                    if(equipment[header.id]) {
                        if(header.id === 'FechaCompra') {
                            // Formatear la fecha
                            text = new Date(equipment[header.id]).toLocaleDateString('es-MX', { timeZone: 'UTC' });
                        } else {
                            text = equipment[header.id].toString();
                        }
                    }
                    doc.fontSize(10).text(text, x, y, { width: header.width, align: 'center' });
                    x += header.width; // Mover x a la siguiente columna
                });
                y += 20; // Mover y a la siguiente fila

                // Agregar una nueva línea horizontal después de cada fila
                doc.moveTo(50, y).lineTo(750, y).stroke();

                // Comprobar si es necesario agregar una nueva página
                if (y > 550) {
                    doc.addPage();
                    y = 50; // Margen superior para nuevas páginas
                }
            });

            doc.end();
        });
    });
}


  

app.get('/download-inventory-pdf-report', (req, res) => {
    generateInventoryPdfReport(db) // Paso la conexión a la base de datos como argumento
        .then(buffer => {
            const fileName = 'inventory_report.pdf';
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(buffer); // Enviamos el buffer del PDF directamente como respuesta
        })
        .catch(error => {
            console.error('Error al generar el informe de inventario en PDF:', error);
            res.status(500).send('Error al generar el informe en PDF');
        });
});

function generateMembersPdfReport(db) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Encabezados y ancho de las columnas para los miembros
        const headers = [
            { id: 'IDMiembro', title: 'ID', width: 50 },
            { id: 'Nombre', title: 'Nombre', width: 100 },
            { id: 'Apellidos', title: 'Apellidos', width: 100 },
            { id: 'FechaNacimiento', title: 'Fecha Nacimiento', width: 90 },
            { id: 'FechaInicio', title: 'Fecha Inicio', width: 90 },
            { id: 'FechaFin', title: 'Fecha Fin', width: 90 },
            { id: 'ContactoEmergencia', title: 'Contacto Emergencia', width: 110 },
            { id: 'Direccion', title: 'Dirección', width: 110 },
            { id: 'Telefono', title: 'Teléfono', width: 80 },
            { id: 'Email', title: 'Email', width: 110 },
            { id: 'EstadoMembresia', title: 'Estado Membresía', width: 90 },
        ];

        // Dibujar la imagen y el título
        doc.image('Logo app.jpeg', 50, 20, { width: 50 });
        doc.fontSize(18).text('Informe de Miembros', 150, 25);

        // Dibujar los encabezados de la tabla
        let y = 80;
        let x = 50;
        headers.forEach(header => {
            doc.fontSize(10).text(header.title, x, y, { width: header.width, align: 'center' });
            x += header.width;
        });

        // Agregar línea horizontal después de los encabezados
        y += 20;
        doc.moveTo(50, y).lineTo(750, y).stroke();

        // Ejecutar la consulta a la base de datos para obtener todos los miembros
        db.query('SELECT * FROM Miembros', (err, members) => {
            if (err) {
                doc.end();
                return reject(err);
            }

            y += 10; // Espacio después de la línea del encabezado

            members.forEach(member => {
                x = 50; // Restablecer posición x para la primera columna
                headers.forEach(header => {
                    let text = member[header.id] ? member[header.id].toString() : 'N/A';
                    // Ajuste para la fecha, en caso de ser necesario
                    if (header.id.includes('Fecha') && member[header.id]) {
                        text = new Date(member[header.id]).toLocaleDateString('es-MX', { timeZone: 'UTC' });
                    }
                    doc.fontSize(10).text(text, x, y + 5, { width: header.width, align: 'center' }); // Añadir un pequeño padding vertical
                    x += header.width; // Mover x a la siguiente columna
                });
                y += 30; // Aumentar el espacio vertical entre filas
            
                // Agregar una nueva línea horizontal después de cada fila
                doc.moveTo(50, y).lineTo(750, y).stroke();
            
                // Comprobar si es necesario agregar una nueva página
                if (y > 550) {
                    doc.addPage();
                    y = 50; // Margen superior para nuevas páginas
                }
            });

            doc.end();
        });
    });
}

app.get('/download-members-pdf-report', (req, res) => {
    // Pasamos la conexión a la base de datos a la función
    generateMembersPdfReport(db).then(pdfData => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=members_report.pdf',
        });
        res.end(pdfData);
    }).catch(error => {
        console.error('Error al generar el informe de miembros:', error);
        res.status(500).send('Error al generar el informe de miembros.');
    });
});




// Rutas CRUD para Miembros:
function checkAndUpdateMembershipStatus() {
    return new Promise((resolve, reject) => {
        // Obtener la fecha de ayer para marcar las membresías que debían vencerse hasta ayer como vencidas
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayDateString = yesterdayDate.toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

        // Obtener la fecha de hoy para marcar las membresías que vencen hoy o después como activas
        const todayDate = new Date();
        const todayDateString = todayDate.toISOString().slice(0, 10); // Formato 'YYYY-MM-DD'

        // Actualización de membresías vencidas
        const updateExpiredQuery = `
            UPDATE Miembros
            SET EstadoMembresia = 'Vencida'
            WHERE FechaFin <= ? AND EstadoMembresia != 'Vencida'
        `;

        // Actualización de membresías activas
        const updateActiveQuery = `
            UPDATE Miembros
            SET EstadoMembresia = 'Activa'
            WHERE FechaFin > ? AND EstadoMembresia != 'Activa'
        `;

        // Ejecutar actualización de membresías vencidas
        db.query(updateExpiredQuery, [yesterdayDateString], (err, expiredResult) => {
            if (err) {
                console.error('Error al actualizar las membresías vencidas:', err);
                return reject(err);
            }
            console.log(`Membresías vencidas actualizadas: ${expiredResult.affectedRows}`);

            // Ejecutar actualización de membresías activas
            db.query(updateActiveQuery, [todayDateString], (err, activeResult) => {
                if (err) {
                    console.error('Error al actualizar las membresías activas:', err);
                    return reject(err);
                }
                console.log(`Membresías activas actualizadas: ${activeResult.affectedRows}`);
                resolve();
            });
        });
    });
}

app.post('/pagos', (req, res) => {
    const { IDMiembro, Monto, MetodoPago, ReferenciaPago } = req.body;
  
    // Validaciones básicas (ajustar según tus requerimientos)
    if (!IDMiembro || !Monto || !MetodoPago) {
      return res.status(400).send('Datos de pago incompletos.');
    }
  
    const newPaymentQuery = `
      INSERT INTO Pagos (IDMiembro, FechaPago, Monto, MetodoPago, ReferenciaPago, EstadoPago)
      VALUES (?, NOW(), ?, ?, ?, 'Completado')
    `;
  
    db.query(newPaymentQuery, [IDMiembro, Monto, MetodoPago, ReferenciaPago], (err, result) => {
      if (err) {
        console.error('Error al registrar el pago:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Pago registrado con éxito', id: result.insertId });
    });
  });
  
  
// GET todos los miembros con la actualización de estado de membresía
app.get('/miembros', (req, res) => {
    // Aquí se asume que ya has ejecutado la función checkAndUpdateMembershipStatus
    db.query('SELECT * FROM Miembros', (err, members) => {
      if (err) {
        console.error('Error al obtener los miembros:', err);
        return res.status(500).send('Error al obtener los miembros.');
      } else {
        // Opcionalmente, puedes formatear las fechas aquí si es necesario
        const membersWithFormattedDates = members.map(member => {
          if (member.FechaFin) {
            member.FechaFinFormatted = new Date(member.FechaFin).toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
          }
          return member;
        });
        res.json(membersWithFormattedDates);
      }
    });
  });
  


// GET un miembro específico por ID
app.get('/miembros/:id', (req, res) => {
    db.query('SELECT * FROM Miembros WHERE IDMiembro = ?', [req.params.id], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});
// POST para agregar miembros, se verifica correo 
app.post('/miembros', (req, res) => {
    let { Nombre, Apellidos, FechaNacimiento, FechaInicio, DuracionMembresia, ContactoEmergencia, Direccion, Telefono, Email } = req.body;
    let FechaFin, Costo;

    // Calcular la fecha fin y el costo basado en la duración de la membresía
    switch (DuracionMembresia) {
        case '1dia':
            FechaFin = new Date(FechaInicio);
            Costo = 50;
            break;
        case '1mes':
            FechaFin = new Date(FechaInicio);
            FechaFin.setMonth(FechaFin.getMonth() + 1);
            Costo = 250;
            break;
        case '3meses':
            FechaFin = new Date(FechaInicio);
            FechaFin.setMonth(FechaFin.getMonth() + 3);
            Costo = 500;
            break;
        default:
            return res.status(400).send('Duración de membresía no válida.');
    }

    // Convertir la fecha a formato MySQL
    FechaFin = FechaFin.toISOString().slice(0, 19).replace('T', ' ');

    // Verificar si el email ya está registrado
    db.query('SELECT * FROM Miembros WHERE Email = ?', [Email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar el email' });
        }
        if (result.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        } else {
            // Insertar el nuevo miembro si el email no está registrado
            const query = `
                INSERT INTO Miembros (Nombre, Apellidos, FechaNacimiento, FechaInicio, FechaFin, ContactoEmergencia, Direccion, Telefono, Email, EstadoMembresia, Costo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Activa', ?)
            `;
            db.query(query, [Nombre, Apellidos, FechaNacimiento, FechaInicio, FechaFin, ContactoEmergencia, Direccion, Telefono, Email, Costo], (err, results) => {
                if (err) {
                    console.error('Error al agregar miembro:', err);
                    return res.status(500).send('Error al agregar el miembro.');
                }
                return res.status(201).json({ message: 'Miembro agregado con éxito', id: results.insertId });
            });
        }
    });
});

// PUT para actualizar un miembro por ID
app.put('/miembros/:id', (req, res) => {
  const { Nombre, Apellidos, FechaNacimiento, FechaInicio, FechaFin, ContactoEmergencia, Direccion, Telefono, Email, EstadoMembresia } = req.body;

  const query = `UPDATE Miembros SET Nombre = ?, Apellidos = ?, FechaNacimiento = ?, FechaInicio = ?, FechaFin = ?, ContactoEmergencia = ?, Direccion = ?, Telefono = ?, Email = ?,EstadoMembresia = ? WHERE IDMiembro = ?`;

  db.query(query, [Nombre, Apellidos, FechaNacimiento, FechaInicio, FechaFin, ContactoEmergencia, Direccion, Telefono, Email, EstadoMembresia, req.params.id], (err, result) => {
      if (err) throw err;
      res.send('Miembro actualizado con éxito.');
  });
});


// DELETE para eliminar un miembro por ID
app.delete('/miembros/:id', (req, res) => {
    db.query('DELETE FROM Miembros WHERE IDMiembro = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Miembro eliminado con éxito.');
    });
});

app.get('/generate-qr/:memberId', async (req, res) => {
    const memberId = req.params.memberId; // Obtienes el ID del miembro de la URL

    // Primero, verifica si el miembro tiene una membresía activa
    db.query('SELECT EstadoMembresia FROM Miembros WHERE IDMiembro = ?', [memberId], async (err, results) => {
        if (err) {
            // Maneja errores de la base de datos
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (results.length > 0 && results[0].EstadoMembresia === 'Activa') {
            // El miembro está activo, genera el código QR
            try {
                const qrCodeData = await QRCode.toDataURL(memberId);
                res.send({ qrCode: qrCodeData });
            } catch (error) {
                console.error('Error generating QR Code:', error);
                res.status(500).send('Error generating QR Code');
            }
        } else {
            // El miembro no está activo o no se encontró
            res.status(403).send('Membresía no activa o miembro no encontrado');
        }
    });
});


// Rutas CRUD para Reservaciones:
app.get('/reservaciones', (req, res) => {
    // Asumiendo que la tabla de reservaciones tiene una columna 'IDMiembro'
    // y que la tabla de miembros tiene las columnas 'Nombre' y 'Apellidos'
    const query = `
        SELECT 
            Reservaciones.*, 
            Miembros.Nombre, 
            Miembros.Apellidos 
        FROM 
            Reservaciones 
        INNER JOIN 
            Miembros ON Reservaciones.IDMiembro = Miembros.IDMiembro
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las reservaciones:', err);
            return res.status(500).json({ error: 'Error al obtener las reservaciones' });
        }

        // Aquí puedes construir tu lógica para añadir mensajes de estado a cada reservación
        const updatedResults = results.map(reservacion => {
            const nombreCompleto = reservacion.Nombre + ' ' + reservacion.Apellidos;
            return {
                ...reservacion,
                mensajeEstado: reservacion.EstadoReservacion === 'Cancelada'
                    ? `La reservación de ${nombreCompleto} ha sido cancelada`
                    : `La reservación de ${nombreCompleto} está activa`
            };
        });

        res.json(updatedResults);
    });
});

// Verificar si el equipo está disponible en el horario de la reservación
async function verificarDisponibilidadEquipo(IDEquipo, FechaHoraReservacion) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM Reservaciones WHERE IDEquipo = ? AND FechaHoraReservacion = ?', [IDEquipo, FechaHoraReservacion], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length === 0); // El equipo está disponible si no hay reservaciones existentes
            }
        });
    });
}

// Verificar si el área no supera la capacidad máxima con la nueva reservación
async function verificarCapacidadArea(IDArea, FechaHoraReservacion) {
    return new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) AS ReservacionesExistentes FROM Reservaciones WHERE IDArea = ? AND FechaHoraReservacion = ?', [IDArea, FechaHoraReservacion], (err, results) => {
            if (err) {
                reject(err);
            } else {
                db.query('SELECT CapacidadMaxima FROM areas WHERE IDArea = ?', [IDArea], (err, resultsArea) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0].ReservacionesExistentes < resultsArea[0].CapacidadMaxima);
                    }
                });
            }
        });
    });
}

app.post('/reservaciones', async (req, res) => {
    const { IDMiembro, FechaHoraReservacion, TipoReservacion, Comentarios, EstadoReservacion, IDArea, IDEquipo } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!IDMiembro || !FechaHoraReservacion || !TipoReservacion || !EstadoReservacion || !IDArea || !IDEquipo) {
        return res.status(400).json({ message: 'Faltan campos requeridos para la reservación.' });
    }

    try {
        const equipoDisponible = await verificarDisponibilidadEquipo(IDEquipo, FechaHoraReservacion);
        const areaNoSaturada = await verificarCapacidadArea(IDArea, FechaHoraReservacion);

        if (!equipoDisponible) {
            return res.status(400).json({ message: 'El equipo no está disponible en el horario seleccionado.' });
        }

        if (!areaNoSaturada) {
            return res.status(400).json({ message: 'El área ha alcanzado su capacidad máxima para el horario seleccionado.' });
        }

        db.query('INSERT INTO Reservaciones (IDMiembro, FechaHoraReservacion, TipoReservacion, Comentarios, EstadoReservacion, IDArea, IDEquipo) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [IDMiembro, FechaHoraReservacion, TipoReservacion, Comentarios, EstadoReservacion, IDArea, IDEquipo], 
        (err, result) => {
            if (err) {
                console.error('Error al crear la reservación:', err);
                return res.status(500).json({ message: 'Error al crear la reservación.', error: err.message });
            }
            res.status(201).json({ message: 'Reservación creada con éxito.', id: result.insertId });
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud.', error: error.message });
    }
});



app.put('/reservaciones/:id', async (req, res) => {
    const { IDMiembro, FechaHoraReservacion, TipoReservacion, Comentarios, EstadoReservacion, IDArea, IDEquipo } = req.body;

    try {
        // Asumiendo que tienes implementada la función verificarDisponibilidadEquipo
        const equipoDisponible = await verificarDisponibilidadEquipo(IDEquipo, FechaHoraReservacion);
        // Asumiendo que tienes implementada la función verificarCapacidadArea
        const areaNoSaturada = await verificarCapacidadArea(IDArea, FechaHoraReservacion);

        if (!equipoDisponible) {
            return res.status(400).json({ message: 'El equipo no está disponible en el horario seleccionado' });
        }

        if (!areaNoSaturada) {
            return res.status(400).json({ message: 'El área ya está saturada para el horario seleccionado' });
        }

        const query = 'UPDATE Reservaciones SET IDMiembro = ?, FechaHoraReservacion = ?, TipoReservacion = ?, Comentarios = ?, EstadoReservacion = ?, IDArea = ?, IDEquipo = ? WHERE IDReservacion = ?';
        db.query(query, [IDMiembro, FechaHoraReservacion, TipoReservacion, Comentarios, EstadoReservacion, IDArea, IDEquipo, req.params.id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al actualizar la reservación' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Reservación no encontrada' });
            }
            res.json({ message: 'Reservación actualizada con éxito' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la reservación' });
    }
});


app.delete('/reservaciones/:id', (req, res) => {
    db.query('DELETE FROM Reservaciones WHERE IDReservacion = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar la reservación' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }
        res.json({ message: 'Reservación eliminada con éxito' });
    });
});
// Rutas CRUD para Áreas:

// GET todas las áreas
app.get('/areas', (req, res) => {
    db.query('SELECT * FROM areas', (err, results) => {
        if (err) {
            console.error('Error al obtener las áreas:', err);
            return res.status(500).json({ error: 'Error al obtener las áreas' });
        }
        res.json(results);
    });
});

app.get('/check-area-capacity/:areaId/:fechaHora', async (req, res) => {
    const { areaId, fechaHora } = req.params;
    
    try {
      // Suponemos una capacidad máxima por área que debes definir.
      const capacidadMaxima = obtenerCapacidadMaximaPorArea(areaId);
      
      // Aquí debes ajustar la consulta para que coincida con tu estructura de base de datos.
      // Esta consulta debe contar el número de reservas activas para el área y fecha/hora dada.
      const consulta = `
        SELECT COUNT(*) AS reservasExistentes 
        FROM reservaciones 
        WHERE IDArea = ?
        AND FechaHoraReservacion = ?
        AND EstadoReservacion = 'Activa'`;
      
      // Esta es la parte donde se ejecuta la consulta real en tu base de datos.
      db.query(consulta, [areaId, new Date(fechaHora)], (err, results) => {
        if (err) {
          console.error('Error al verificar la capacidad del área:', err);
          return res.status(500).json({ success: false, message: 'Error en el servidor al verificar la capacidad del área' });
        }
  
        const reservasExistentes = results[0].reservasExistentes;
        const hayEspacio = reservasExistentes < capacidadMaxima;
        
        res.json({
          capacidadMaxima,
          reservasExistentes,
          hayEspacio,
          esSaturada: !hayEspacio // Indica si el área está saturada
        });
      });
    } catch (error) {
      console.error('Error en el catch al verificar la capacidad del área:', error);
      res.status(500).send('Error al verificar la capacidad del área');
    }
  });
  
// GET todos los equipos del inventario
app.get('/inventario-equipos', (req, res) => {
    db.query('SELECT * FROM InventarioEquipos', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// POST para agregar un nuevo equipo al inventario
app.post('/inventario-equipos', (req, res) => {
    const { NombreEquipo, Tipo, Cantidad, Estado, Ubicacion, FechaCompra, Proveedor, Costo, FechaUltimoMantenimiento, Observaciones, MantenimientoProgramado, IDArea } = req.body;
  
    const query = `INSERT INTO InventarioEquipos (NombreEquipo, Tipo, Cantidad, Estado, Ubicacion, FechaCompra, Proveedor, Costo, FechaUltimoMantenimiento, Observaciones, MantenimientoProgramado, IDArea) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [NombreEquipo, Tipo, Cantidad, Estado, Ubicacion, FechaCompra, Proveedor, Costo, FechaUltimoMantenimiento, Observaciones, MantenimientoProgramado, IDArea], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar el equipo al inventario' });
        }
        res.send({ message: 'Equipo agregado al inventario con éxito', id: results.insertId });
    });
});

// PUT para actualizar un equipo del inventario por ID
app.put('/inventario-equipos/:id', (req, res) => {
    const { NombreEquipo, Tipo, Cantidad, Estado, Ubicacion, FechaCompra, Proveedor, Costo, FechaUltimoMantenimiento, Observaciones, MantenimientoProgramado, IDArea } = req.body;
  
    const query = `UPDATE InventarioEquipos SET NombreEquipo = ?, Tipo = ?, Cantidad = ?, Estado = ?, Ubicacion = ?, FechaCompra = ?, Proveedor = ?, Costo = ?, FechaUltimoMantenimiento = ?, Observaciones = ?, MantenimientoProgramado = ?, IDArea = ? WHERE IDEquipo = ?`;
  
    db.query(query, [NombreEquipo, Tipo, Cantidad, Estado, Ubicacion, FechaCompra, Proveedor, Costo, FechaUltimoMantenimiento, Observaciones, MantenimientoProgramado, IDArea, req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar el equipo en el inventario' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }
        res.send({ message: 'Equipo actualizado en el inventario con éxito' });
    });
});

// DELETE para eliminar un equipo del inventario por ID
app.delete('/inventario-equipos/:id', (req, res) => {
    db.query('DELETE FROM InventarioEquipos WHERE IDEquipo = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Equipo eliminado del inventario con éxito.');
    });
});
app.get('/stats/members', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Miembros', (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener total de miembros');
        } else {
            res.json({ total: results[0].total });
        }
    });
});

// Ruta para obtener el total de reservas activas
app.get('/stats/reservations', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM Reservaciones WHERE EstadoReservacion = "Activa"', (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener total de reservaciones activas');
        } else {
            res.json({ total: results[0].total });
        }
    });
});

// Ruta para obtener el total de equipos
app.get('/stats/equipment', (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM InventarioEquipos', (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener total de equipos');
        } else {
            res.json({ total: results[0].total });
        }
    });
});

// Middleware para manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send('No se pudo encontrar el recurso solicitado.');
});

// Middleware para manejo de errores 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});