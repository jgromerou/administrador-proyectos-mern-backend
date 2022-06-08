import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';

//obtener proyectos del usuario logueado
const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario);
  res.json(proyectos);
};

//crear un nuevo proyecto
const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

//obtener un proyecto por id
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id.match(/^[0-9a-fA-F]{24}$/));
  console.log(proyecto);
  if (!proyecto) {
    const error = new Error('Proyecto no encuntrado.');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(401).json({ msg: error.message });
  }

  //Obtener las tareas del Proyecto
  //const tareas = await Tarea.find().where('proyecto').equals(proyecto);

  res.json(
    proyecto
    //tareas,
  );
};

//editar un proyecto por su id
const editarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id.match(/^[0-9a-fA-F]{24}$/));
  console.log(proyecto);
  if (!proyecto) {
    const error = new Error('Proyecto no encuntrado.');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(401).json({ msg: error.message });
  }
  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

//eliminar un proyecto por su id
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  const proyecto = await Proyecto.findById(id.match(/^[0-9a-fA-F]{24}$/));
  console.log(proyecto);
  if (!proyecto) {
    const error = new Error('Proyecto no encuntrado.');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida.');
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: `Proyecto eliminado ${id}` });
  } catch (error) {
    console.log(error);
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};

/* const obtenerTareas = async (req, res) => {
  const { id } = req.params;

  const existeProyecto = await Proyecto.findById(id);
  console.log(existeProyecto);
  if (!existeProyecto) {
    const error = new Error('Proyecto no encontrado.');
    return res.status(401).json({ msg: error.message });
  }

  //Tienes que ser el creador del proyecto o colaborador
  const tareas = await Tarea.find().where('proyecto').equals(id);

  res.json(tareas);
}; */

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
};
