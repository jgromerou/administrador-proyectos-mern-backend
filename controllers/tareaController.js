import Tarea from '../models/Tarea.js';
import Proyecto from '../models/Proyecto.js';

/* const obtenerTareas = async (req, res) => {
  const proyectos = await Tarea.find().where('creador').equals(req.usuario);
  res.json(proyectos);
}; */

//crear una nueva tarea
const nuevaTarea = async (req, res) => {
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(
    proyecto.match(/^[0-9a-fA-F]{24}$/)
  );

  if (!existeProyecto) {
    const error = new Error('Proyecto no existe.');
    return res.status(404).json({ msg: error.message });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('No tiene los permisos para añadir las tareas.');
    return res.status(404).json({ msg: error.message });
  }
  /*  const tarea = new Tarea(req.body);
  tarea.creador = req.usuario._id;*/

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    //Almacenar el ID en el Proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

//obtener una tarea de un proyecto por id
const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id.match(/^[0-9a-fA-F]{24}$/)).populate(
    'proyecto'
  );

  if (!tarea) {
    const error = new Error('Tarea no encuntrada.');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};

const editarTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id.match(/^[0-9a-fA-F]{24}$/)).populate(
    'proyecto'
  );

  if (!tarea) {
    const error = new Error('Tarea no encuntrada.');
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id.match(/^[0-9a-fA-F]{24}$/)).populate(
    'proyecto'
  );
  //Tarea no encontrada
  if (!tarea) {
    const error = new Error('Tarea no encontrada.');
    return res.status(404).json({ msg: error.message });
  }

  //verifica si es el creador del proyecto
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(403).json({ msg: error.message });
  }

  //Elimina la tarea
  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);
    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
    res.json({ msg: 'La Tarea se eliminó correctamente' });
  } catch (error) {
    console.log(error);
  }
};
const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id.match(/^[0-9a-fA-F]{24}$/)).populate(
    'proyecto'
  );
  //Tarea no encontrada
  if (!tarea) {
    const error = new Error('Tarea no encontrada.');
    return res.status(404).json({ msg: error.message });
  }

  //verifica si es el creador del proyecto
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate('proyecto')
    .populate('completado');

  res.json(tareaAlmacenada);

  // //Elimina la tarea
  // try {
  //   await tarea.deleteOne();
  //   res.json({ msg: 'La Tarea se eliminó correctamente' });
  // } catch (error) {
  //   console.log(error);
  // }
};

// const cambiarEstado = async (req, res) => {
//   const { id } = req.params;
//   const tarea = await Tarea.findById(id.match(/^[0-9a-fA-F]{24}$/)).populate(
//     'proyecto'
//   );
//   //Tarea no encontrada
//   if (!tarea) {
//     const error = new Error('Tarea no encontrada.');
//     return res.status(404).json({ msg: error.message });
//   }

//   // verifica si es el creador o un colaborador del proyecto
//   if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
//     const error = new Error('Acción no válida.');
//     return res.status(403).json({ msg: error.message });
//   }
//   //Elimina la tarea
//   try {
//     //await tarea.deleteOne();
//     res.json({ msg: 'Se cambió el estado correctamente' });
//   } catch (error) {
//     console.log(error);
//   }
// };

export { nuevaTarea, obtenerTarea, editarTarea, eliminarTarea, cambiarEstado };
