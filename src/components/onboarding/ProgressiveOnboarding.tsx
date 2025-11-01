import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from '@heroui/react';
import Image from 'next/image';

// Definition of each onboarding step
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Aeternus Alpha',
    content: 'Thank you for joining the Aeternus Alpha. We\'re excited to have you here. Let us show you how the platform works.',
    image: '/assets/lequi_avatar.webp',
  },
  {
    id: 'chat',
    title: 'AI Conversation',
    content: 'Our AI is designed to hold natural, meaningful conversations. You can talk about any topic and the AI will respond coherently.',
    image: '/assets/lequi_avatar.webp',
  },
  {
    id: 'memory',
    title: 'Contextual Memory',
    content: 'The AI remembers prior conversations so you can have continuous, meaningful interactions over time.',
    image: '/assets/lequi_avatar.webp',
  },
  {
    id: 'feedback',
    title: 'Your Feedback Matters',
    content: 'As an alpha user, your feedback is invaluable. Use the feedback button anytime to share ideas or report issues.',
    image: '/assets/lequi_avatar.webp',
  },
];

// Clave para guardar el progreso del onboarding en localStorage
const ONBOARDING_STORAGE_KEY = 'aeternus-onboarding-progress';

export default function ProgressiveOnboarding() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Only start if there's an authenticated user
    if (user) {
      // Check whether the user completed onboarding
      const storedProgress = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      const isCompleted = storedProgress === 'completed';
      
      // Open the modal if onboarding isn't complete
      if (!isCompleted) {
        setIsOpen(true);
      }
    }
  }, [user]);
  
  // Escuchar evento personalizado para mostrar el onboarding manualmente
  useEffect(() => {
    const handleShowOnboarding = () => {
      setCurrentStep(0); // Reset to first step
      setIsOpen(true); // Show the modal
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
          {/* Progress indicator */}
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

          {/* Illustrative image */}
          {currentStepData.image && (
            <div className="mb-6 flex justify-center">
              <Image 
                src={currentStepData.image} 
                alt={currentStepData.title} 
                className="max-h-64 rounded-lg"
                width={300}
                height={300}
              />
            </div>
          )}

          {/* Step content */}
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
                  Previous
                </Button>
              ) : (
                <Button
                  variant="flat"
                  onPress={skipOnboarding}
                  className="text-gray-400"
                >
                  Skip
                </Button>
              )}
            </div>
            <Button
              color="primary"
              variant="solid"
              onPress={handleNextStep}
            >
              {currentStep < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get started'}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}