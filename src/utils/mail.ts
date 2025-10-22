import nodemailer from 'nodemailer';

type EmailParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: EmailParams) {
  try {
    // Verificar que las variables de entorno necesarias están definidas
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('Missing SMTP configuration:', {
        host: smtpHost ? 'defined' : 'missing',
        user: smtpUser ? 'defined' : 'missing',
        password: smtpPassword ? 'defined' : 'missing',
      });
      throw new Error('Missing SMTP configuration. Please check your environment variables.');
    }

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Verificar la conexión con el servidor SMTP
    await transporter.verify().catch((error: Error) => {
      console.error('SMTP verification failed:', error);
      throw new Error(`SMTP connection failed: ${error.message}`);
    });

    // Enviar correo
    const info = await transporter.sendMail({
      from: `"Aeternus" <${process.env.SMTP_FROM_EMAIL || 'noreply@aeternus.ai'}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}
