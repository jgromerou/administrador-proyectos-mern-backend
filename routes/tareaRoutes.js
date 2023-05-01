import express from 'express';

import {
  //obtenerTareas,
  nuevaTarea,
  obtenerTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado,
} from '../controllers/tareaController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').post(checkAuth, nuevaTarea);

router
  .route('/:id')
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, editarTarea)
  .delete(checkAuth, eliminarTarea);

router.post('/estado/:id', checkAuth, cambiarEstado);

export default router;
