// File: src/templates/otp-email.template.ts
// Module responsible for backend functionality.

// Exported function otpEmailTemplate.
export const otpEmailTemplate = (otp: string) => `
  <div style="font-family: sans-serif; color: #333; max-width: 400px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h2 style="color: #2e7d32;">AgroMarket 🌾</h2>
    <p>Usa el siguiente código para verificar tu cuenta. Este código expira en 15 minutos.</p>
    <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2e7d32; border-radius: 5px;">
      ${otp}
    </div>
    <p style="font-size: 12px; color: #888; margin-top: 20px;">
      Si no solicitaste este código, ignora este mensaje.
    </p>
  </div>
`;