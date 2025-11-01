'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Select, SelectItem } from '@heroui/react';
import { useUser } from '@auth0/nextjs-auth0/client';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug or technical issue' },
  { value: 'suggestion', label: 'Improvement suggestion' },
  { value: 'experience', label: 'User experience' },
  { value: 'content', label: 'AI content or responses' },
  { value: 'other', label: 'Other' }
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
              <h3 className="text-xl font-bold mb-2">Thank you!</h3>
              <p>Your feedback is very valuable to improve Aeternus.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Share your feedback</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                  <Select 
                  label="Feedback type" 
                  placeholder="Select a category"
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
                  label="Your comments"
                  placeholder="Describe your experience, issue, or suggestion..."
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
                  Send feedback
                </Button>
                
                <p className="text-xs text-gray-400 mt-2">
                  Your feedback helps us improve Aeternus for all users.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}