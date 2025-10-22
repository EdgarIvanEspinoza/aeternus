import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '@config/admin-access';
import { prisma } from '@lib/prisma';

export async function GET(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener parámetros de consulta (paginación)
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status') || undefined;

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Construir where según filtros
    const where = status ? { status } : {};

    // Obtener feedbacks de la base de datos con paginación
    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.feedback.count({ where }),
    ]);

    // Calcular total de páginas
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error getting feedbacks:', error);

    // Proporcionar datos de muestra en caso de error
    const sampleFeedbacks = [
      {
        id: 'error1',
        type: 'experience',
        content: 'Este es un ejemplo de feedback (modo de recuperación de errores)',
        userId: 'system',
        userEmail: 'sistema@aeternus.ai',
        createdAt: new Date().toISOString(),
        status: 'pending',
      },
    ];

    return NextResponse.json({
      feedbacks: sampleFeedbacks,
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      _note: 'Usando datos de muestra debido a problemas con la base de datos',
    });
  }
}

// Actualizar estado de un feedback (ej: pending → reviewed → resolved)
export async function PUT(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener datos del cuerpo de la petición
    const { id, status, adminNotes } = await req.json();

    // Validar datos
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    // Actualizar en la base de datos
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || null,
      },
    });

    return NextResponse.json({
      feedback: updatedFeedback,
      message: 'Feedback actualizado correctamente',
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update feedback',
      },
      { status: 500 }
    );
  }
}
