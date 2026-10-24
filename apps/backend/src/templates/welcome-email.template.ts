// File: src/templates/welcome-email.template.ts
// Module responsible for backend functionality.

// Exported function welcomeEmailTemplate.
export const welcomeEmailTemplate = (nombre: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
    .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido a AgroMarket! 🌾</h1>
    </div>
    <div class="content">
      <h2>Hola, ${nombre}</h2>
      <p>Es un gusto tenerte con nosotros. Ya puedes empezar a publicar tus lotes de ganado o buscar las mejores ofertas en todo el país.</p>
      <p>En AgroMarket conectamos directamente al campo con los compradores, sin complicaciones.</p>
      <center>
        <a href="https://agro-marketplace-client.vercel.app/login" class="button">Ir a mi cuenta</a>
      </center>
    </div>
    <div class="footer">
      <p>© 2026 AgroMarket Venezuela.</p>
      <p>Si no te registraste en nuestra app, ignora este correo.</p>
    </div>
  </div>
</body>
</html>
`;