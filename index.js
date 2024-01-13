import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

//conexión a la base de datos MongoDB
conectarDB();

//Configurar CORS
// const whitelist = [process.env.FRONTEND_URL];
const whitelist = [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!whitelist.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      //No está permitido su acceso de conexión
      callback(new Error('Error de CORS.'));
    }
  },
};
//permito el ingreso al dominio
app.use(cors(corsOptions));

//Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on('connection', (socket) => {
  console.log('Conectado a socket.io');

  //Defino los eventos de socket.io
  // socket.on('prueba', (nombre) => {
  //   console.log('Mi nombre es: ', nombre);
  // });
  socket.on('abrir proyecto', (proyectoId) => {
    socket.join(proyectoId);
    //socket.emit('respuesta', { nombre: 'Juan' });
  });

  socket.on('abrir proyectos', (room) => {
    socket.join(room);
  });

  //nuevo proyecto tiene que actualizar el listado de Proyecto
  socket.on('nuevo proyecto', (proyecto) => {
    socket.to('listarProyectos').emit('submit proyecto', proyecto);
  });

  socket.on('eliminar proyecto', (proyecto) => {
    socket.to('listarProyectos').emit('submit proyecto', proyecto);
  });

  socket.on('editar proyecto', (proyecto) => {
    socket.to('listarProyectos').emit('submit proyecto', proyecto);
  });

  socket.on('nueva tarea', (tarea) => {
    socket.to(tarea.proyecto).emit('tarea agregada', tarea);
  });

  socket.on('eliminar tarea', (tarea) => {
    socket.to(tarea.proyecto).emit('tarea eliminada', tarea);
  });

  socket.on('actualizar tarea', (tarea) => {
    socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea);
  });

  socket.on('cambiar estado', (tarea) => {
    socket.to(tarea.proyecto._id).emit('nuevo estado', tarea);
  });
});
