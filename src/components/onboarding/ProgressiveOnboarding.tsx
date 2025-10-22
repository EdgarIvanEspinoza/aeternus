import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from '@heroui/react';

// Definición de cada paso del onboarding
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenido a Aeternus Alpha',
    content: 'Gracias por unirte a la versión alpha de Aeternus. Estamos emocionados de tenerte aquí. Vamos a mostrarte cómo funciona la plataforma.',
    image: '/assets/onboarding/welcome.png',
  },
  {
    id: 'chat',
    title: 'Conversación con IA',
    content: 'Nuestro sistema de IA está diseñado para mantener conversaciones naturales y profundas. Puedes hablar sobre cualquier tema y la IA responderá de manera coherente.',
    image: '/assets/onboarding/chat.png',
  },
  {
    id: 'memory',
    title: 'Memoria Contextual',
    content: 'La IA recordará tu conversación anterior, lo que te permite tener conversaciones continuas y significativas a lo largo del tiempo.',
    image: '/assets/onboarding/memory.png',
  },
  {
    id: 'feedback',
    title: 'Tu Opinión Importa',
    content: 'Como usuario alpha, tu feedback es invaluable. Usa el botón de feedback en cualquier momento para compartir tus ideas y reportar problemas.',
    image: '/assets/onboarding/feedback.png',
  },
];

// Clave para guardar el progreso del onboarding en localStorage
const ONBOARDING_STORAGE_KEY = 'aeternus-onboarding-progress';

export default function ProgressiveOnboarding() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Solo iniciar si hay un usuario autenticado
    if (user) {
      // Verificar si el usuario ha completado el onboarding
      const storedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      const isCompleted = storedProgress === 'completed';
      
      // Abrir el modal si el onboarding no está completo
      if (!isCompleted) {
        setIsOpen(true);
      }
    }
  }, [user]);
  
  // Escuchar evento personalizado para mostrar el onboarding manualmente
  useEffect(() => {
    const handleShowOnboarding = () => {
      setCurrentStep(0); // Reiniciar al primer paso
      setIsOpen(true); // Mostrar el modal
    };
    
    window.addEventListener('show-onboarding', handleShowOnboarding);
    
    return () => {
      window.removeEventListener('show-onboarding', handleShowOnboarding);
    };
  }, []);

  const handleNextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar como completado y cerrar
      completeOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'completed');
    setIsOpen(false);
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  // No mostrar nada si no hay sesión
  if (!user) {
    return null;
  }

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={setIsOpen} // Permitimos cerrar con el botón X
      backdrop="blur"
      size="2xl" 
      className="max-h-[90vh]"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">
            {currentStepData.title}
          </h2>
        </ModalHeader>
        
        <ModalBody className="text-base max-h-[60vh] overflow-y-auto">
          {/* Indicador de progreso */}
          <div className="flex justify-center mb-6">
            {ONBOARDING_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`h-2 w-16 mx-1 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Imagen ilustrativa */}
          {currentStepData.image && (
            <div className="mb-6 flex justify-center">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.title} 
                className="max-h-64 rounded-lg"
              />
            </div>
          )}

          {/* Contenido del paso */}
          <p className="text-gray-300 mb-8 text-center">
            {currentStepData.content}
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="flex justify-between w-full">
            <div>
              {currentStep > 0 ? (
                <Button
                  variant="flat"
                  onPress={handlePrevStep}
                  className="text-gray-400"
                >
                  Anterior
                </Button>
              ) : (
                <Button
                  variant="flat"
                  onPress={skipOnboarding}
                  className="text-gray-400"
                >
                  Saltar
                </Button>
              )}
            </div>
            <Button
              color="primary"
              variant="solid"
              onPress={handleNextStep}
            >
              {currentStep < ONBOARDING_STEPS.length - 1 ? 'Siguiente' : 'Comenzar'}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}