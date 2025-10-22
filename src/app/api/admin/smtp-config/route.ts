import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '@config/admin-access';
import fs from 'fs/promises';
import path from 'path';

// Ruta para guardar la configuración SMTP
export async function POST(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { host, port, secure, user, password, fromEmail } = await req.json();

    // Validar los datos recibidos
    if (!host || !user || !password) {
      return NextResponse.json(
        {
          error: 'Missing required SMTP configuration fields',
        },
        { status: 400 }
      );
    }

    // Crear contenido para el archivo .env.local
    const envContent = `# SMTP Configuration
SMTP_HOST="${host}"
SMTP_PORT="${port}"
SMTP_SECURE="${secure}"
SMTP_USER="${user}"
SMTP_PASSWORD="${password}"
${fromEmail ? `SMTP_FROM_EMAIL="${fromEmail}"` : ''}
`;

    // Guardar la configuración en un archivo .env.local
    // En producción, esto debería usar variables de entorno del sistema o un almacén seguro
    const envPath = path.join(process.cwd(), '.env.local');
    await fs.writeFile(envPath, envContent);

    return NextResponse.json({
      success: true,
      message: 'SMTP configuration saved successfully',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error saving SMTP configuration:', error);
    return NextResponse.json(
      {
        error: 'Failed to save SMTP configuration',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
