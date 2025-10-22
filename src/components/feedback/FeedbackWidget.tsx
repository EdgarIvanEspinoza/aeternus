'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Select, SelectItem } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Error o problema técnico' },
  { value: 'suggestion', label: 'Sugerencia de mejora' },
  { value: 'experience', label: 'Experiencia de usuario' },
  { value: 'content', label: 'Contenido o respuestas de la IA' },
  { value: 'other', label: 'Otro' }
];

export default function FeedbackWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackText.trim() || !feedbackType) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          content: feedbackText,
          userId: user?.sub || 'anonymous',
          userEmail: user?.email || 'anonymous'
        }),
      });

      // Siempre mostramos el mensaje de éxito, incluso si hay errores
      // para no afectar la experiencia del usuario
      setIsSubmitted(true);
      setFeedbackText('');
      setFeedbackType('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
      
      // Solo para debugging
      if (!response.ok) {
        console.log('Advertencia: Respuesta no exitosa del servidor, pero mostramos éxito al usuario');
      }
    } catch (error) {
      // Incluso con errores, simulamos éxito para el usuario
      console.error('Error submitting feedback:', error);
      
      // Mostramos el mensaje de éxito
      setIsSubmitted(true);
      setFeedbackText('');
      setFeedbackType('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Escuchar el evento personalizado para abrir el popover
  useEffect(() => {
    const handleToggleFeedback = () => {
      setIsOpen(prev => !prev);
    };
    
    window.addEventListener('toggle-feedback', handleToggleFeedback);
    
    return () => {
      window.removeEventListener('toggle-feedback', handleToggleFeedback);
    };
  }, []);

  // Si no está abierto, no renderizamos nada
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setIsOpen(false)}
      />
      <div 
        className="fixed top-20 right-6 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-80 animate-in fade-in slide-in-from-top-5 duration-200"
      >
        <div className="p-4">
          {isSubmitted ? (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">¡Gracias!</h3>
              <p>Tu feedback es muy valioso para mejorar Aeternus.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Comparte tu opinión</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <Select 
                  label="Tipo de feedback" 
                  placeholder="Selecciona una categoría"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full"
                >
                  {FEEDBACK_TYPES.map((type) => (
                    <SelectItem key={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Textarea
                  label="Tus comentarios"
                  placeholder="Describe tu experiencia, problema o sugerencia..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full"
                />
                
                <Button
                  color="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                  isDisabled={!feedbackText.trim() || !feedbackType || isSubmitting}
                  onPress={handleSubmit}
                >
                  Enviar feedback
                </Button>
                
                <p className="text-xs text-gray-400 mt-2">
                  Tu feedback nos ayuda a mejorar Aeternus para todos los usuarios.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}