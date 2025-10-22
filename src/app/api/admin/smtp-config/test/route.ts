import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '@config/admin-access';
import { sendMail } from '@utils/mail';

// Ruta para probar la configuración SMTP
export async function POST(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { host, port, secure, user, password, fromEmail } = await req.json();

    // Guardar temporalmente las variables de entorno originales
    const originalEnv = {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_SECURE: process.env.SMTP_SECURE,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASSWORD: process.env.SMTP_PASSWORD,
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    };

    // Configurar temporalmente las variables de entorno con los valores de prueba
    process.env.SMTP_HOST = host;
    process.env.SMTP_PORT = port;
    process.env.SMTP_SECURE = secure;
    process.env.SMTP_USER = user;
    process.env.SMTP_PASSWORD = password;
    process.env.SMTP_FROM_EMAIL = fromEmail || 'noreply@aeternus.ai';

    // Enviar correo de prueba
    const testEmail = session.user.email;
    await sendMail({
      to: testEmail,
      subject: 'Prueba de configuración SMTP de Aeternus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366F1; margin-bottom: 20px;">Prueba de configuración SMTP</h2>
          <p>Este es un correo de prueba para verificar la configuración SMTP de Aeternus.</p>
          <p>Si estás recibiendo este correo, la configuración SMTP funciona correctamente.</p>
          <p>Configuración utilizada:</p>
          <ul>
            <li>Host: ${host}</li>
            <li>Puerto: ${port}</li>
            <li>Seguro: ${secure === 'true' ? 'Sí' : 'No'}</li>
            <li>Usuario: ${user}</li>
            <li>Remitente: ${fromEmail || 'noreply@aeternus.ai'}</li>
          </ul>
        </div>
      `,
    });

    // Restaurar las variables de entorno originales
    process.env.SMTP_HOST = originalEnv.SMTP_HOST;
    process.env.SMTP_PORT = originalEnv.SMTP_PORT;
    process.env.SMTP_SECURE = originalEnv.SMTP_SECURE;
    process.env.SMTP_USER = originalEnv.SMTP_USER;
    process.env.SMTP_PASSWORD = originalEnv.SMTP_PASSWORD;
    process.env.SMTP_FROM_EMAIL = originalEnv.SMTP_FROM_EMAIL;

    return NextResponse.json({ 
      success: true, 
      message: `Email de prueba enviado a ${testEmail}` 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending test email:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email', 
      details: errorMessage 
    }, { status: 500 });
  }
}