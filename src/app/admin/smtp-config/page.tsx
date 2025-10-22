import SmtpConfig from '@components/admin/SmtpConfig';

export default function SmtpConfigPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Configuración del Servidor SMTP</h1>
      <p className="text-gray-600 mb-4">
        Configure los parámetros del servidor SMTP para habilitar el envío de correos electrónicos, 
        incluyendo invitaciones y notificaciones.
      </p>
      <SmtpConfig />
    </div>
  );
}