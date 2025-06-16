const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (to, name) => {
  const htmlContent = `
    <h2>¡Bienvenido a StudySwap, ${name}!</h2>
    <p>Gracias por unirte a nuestra comunidad de estudiantes y profesores que comparten y aprenden juntos.</p>
    <p>Ya puedes <strong>subir apuntes</strong>, <strong>explorar recursos</strong> y <strong>colaborar con otros estudiantes</strong>.</p>
    <p style="margin-top:20px;">📚 ¡Nos alegra tenerte con nosotros!</p>
    <br>
    <p>Conecta con estudiantes, comparte apuntes y mejora tu aprendizaje en <a href="https://studyswap-2ejx.onrender.com">StudySwap.com</a></p>
  `;

  return transporter.sendMail({
    from: `"StudySwap" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Bienvenido a StudySwap",
    html: htmlContent
  });
};

module.exports = { sendWelcomeEmail };
