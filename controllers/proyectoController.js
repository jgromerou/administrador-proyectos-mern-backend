import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
import Usuario from '../models/Usuario.js';

//obtener proyectos del usuario logueado
const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario } },
      { creador: { $in: req.usuario } },
    ],
  }).select('-tareas');
  res.json(proyectos);
  //esto es sin el or
  // .where('creador')
  // .equals(req.usuario)
  //   .select('-tareas');
  // res.json(proyectos);
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

  const proyecto = await Proyecto.findById(id.match(/^[0-9a-fA-F]{24}$/))
    .populate({
      path: 'tareas',
      populate: { path: 'completado', select: 'nombre' },
    })
    .populate('colaboradores', 'nombre email');
  // .populate('tareas')
  // .populate('colaboradores', 'nombre email');

  if (!proyecto) {
    const error = new Error('Proyecto no encontrado.');
    return res.status(404).json({ msg: error.message });
  }

  if (
    proyecto.creador.toString() !== req.usuario._id.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
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

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    '-confirmado -createdAt -updatedAt -password -token -__v'
  );

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  } else {
    res.json(usuario);
  }
};

const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  if (!proyecto) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(404).json({ msg: error.message });
  }

  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    '-confirmado -createdAt -updatedAt -password -token -__v'
  );

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  //El colaborador no es admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error('El creador del proyecto no puede ser colaborador');
    return res.status(404).json({ msg: error.message });
  }

  //Revisar que no este ya agregado al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error('El usuario ya está en el Proyecto');
    return res.status(404).json({ msg: error.message });
  }

  //si todo esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: 'Colaborador agregado correctamente!' });
};

const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  if (!proyecto) {
    const error = new Error('Proyecto no encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Acción no válida');
    return res.status(404).json({ msg: error.message });
  }

  //si todo esta bien, se puede eliminar
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: 'Colaborador eliminado correctamente!' });
};

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
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
};
