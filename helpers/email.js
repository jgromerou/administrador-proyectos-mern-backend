import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  // const transport = nodemailer.createTransport({
  //   host: 'smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: '58febc4714da65',
  //     pass: '66e3d6b46f23d0',
  //   },
  // });

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información del email

  const info = await transport.sendMail({
    from: '"Administrador de Proyectos" <cuentas@c.com>',
    to: email,
    subject: 'Administrador de Proyectos - Comprueba tu cuenta',
    text: 'Comprueba tu cuenta',
    html: `<p>Hola: ${nombre} Comprueba tu cuenta</p>
      <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguente enlace</p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Información del email

  const info = await transport.sendMail({
    from: '"Administrador de Proyectos" <cuentas@c.com>',
    to: email,
    subject: 'Reestablece Tu Password',
    text: 'Reestablece Tu Password',
    html: `<p>Hola: ${nombre} Reestablece Tu Password</p>
      <p>Sigue el siguiente enlace para generar un nuevo password:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `,
  });
};
