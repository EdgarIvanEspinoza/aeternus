'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { isAdminUser } from '@config/admin-access';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from '@heroui/react';
import { Eye, CheckCircle } from 'lucide-react';

type Feedback = {
  id: string;
  type: string;
  content: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  adminNotes?: string;
};

export default function FeedbacksPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading2, setIsLoading2] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    // Redirigir si no es admin
    if (!isLoading && (!user || !isAdminUser(user.email as string))) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading2(true);
        let url = `/api/admin/feedbacks?page=${page}`;
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.feedbacks);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setIsLoading2(false);
      }
    };

    if (user && isAdminUser(user.email as string)) {
      fetchFeedbacks();
    }
  }, [user, page, statusFilter]);

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.adminNotes || '');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedFeedback) return;

    try {
      const res = await fetch('/api/admin/feedbacks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedFeedback.id,
          status,
          adminNotes,
        }),
      });

      if (res.ok) {
        // Actualizar el estado local
        setFeedbacks(prevFeedbacks =>
          prevFeedbacks.map(f =>
            f.id === selectedFeedback.id ? { 
              ...f, 
              status: status as 'pending' | 'reviewed' | 'resolved',
              adminNotes 
            } : f
          )
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewed': return 'primary';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return 'Error';
      case 'suggestion': return 'Sugerencia';
      case 'experience': return 'Experiencia';
      case 'content': return 'Contenido';
      case 'other': return 'Otro';
      default: return type;
    }
  };

  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAdminUser(user.email as string)) {
    return null; // No renderizamos nada, el useEffect redirigirá
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feedback de Usuarios</h1>
        <div className="flex gap-4">
          <Button 
            variant="flat" 
            color="primary"
            onClick={() => router.push('/admin')}
          >
            Dashboard
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                {statusFilter ? `Filtro: ${statusFilter}` : 'Filtrar'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por estado"
              onAction={(key) => setStatusFilter(key === 'all' ? null : key.toString())}
            >
              <DropdownItem key="all">Todos</DropdownItem>
              <DropdownItem key="pending">Pendientes</DropdownItem>
              <DropdownItem key="reviewed">Revisados</DropdownItem>
              <DropdownItem key="resolved">Resueltos</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <Table aria-label="Tabla de feedbacks">
        <TableHeader>
          <TableColumn>Usuario</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Contenido</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading2}
          loadingContent="Cargando feedbacks..."
          emptyContent="No se encontraron feedbacks"
        >
          {feedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.userEmail}</TableCell>
              <TableCell>
                {getTypeLabel(feedback.type)}
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{feedback.content}</div>
              </TableCell>
              <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip color={getStatusColor(feedback.status)} variant="flat">
                  {feedback.status === 'pending' ? 'Pendiente' : 
                   feedback.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                </Chip>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => handleViewFeedback(feedback)}
                >
                  <Eye size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-8">
        <Pagination
          total={totalPages}
          initialPage={1}
          page={page}
          onChange={setPage}
        />
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="2xl">
        <ModalContent>
          {selectedFeedback && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl">Detalles de Feedback</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{selectedFeedback.userEmail}</span>
                  <Chip color={getStatusColor(selectedFeedback.status)} variant="flat">
                    {selectedFeedback.status === 'pending' ? 'Pendiente' : 
                    selectedFeedback.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Tipo</h4>
                    <p>{getTypeLabel(selectedFeedback.type)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Contenido</h4>
                    <p className="whitespace-pre-wrap bg-gray-800/30 p-3 rounded">
                      {selectedFeedback.content}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Fecha</h4>
                    <p>{new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Notas administrativas</h4>
                    <Textarea
                      placeholder="Añade notas sobre este feedback"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="flat"
                    onPress={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <div className="flex gap-2">
                    {selectedFeedback.status !== 'reviewed' && (
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => handleUpdateStatus('reviewed')}
                      >
                        Marcar como revisado
                      </Button>
                    )}
                    {selectedFeedback.status !== 'resolved' && (
                      <Button
                        color="success"
                        startContent={<CheckCircle size={18} />}
                        onPress={() => handleUpdateStatus('resolved')}
                      >
                        Resolver
                      </Button>
                    )}
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}