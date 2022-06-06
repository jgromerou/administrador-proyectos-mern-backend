import express from 'express';
const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from '../controllers/usuarioControllers.js';

import checkAuth from '../middleware/checkAuth.js';

//Autenticación, Registro y Confimación de Usuarios
router.post('/', registrar); // Registrar un nuevo Usuario
router.post('/login', autenticar); //Loguear un Usuario
router.get('/confirmar/:token', confirmar); //Confirmar una cuenta con el token
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', checkAuth, perfil);

export default router;
