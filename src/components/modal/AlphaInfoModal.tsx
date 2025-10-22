'use client';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from '@heroui/react';

interface AlphaInfoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlphaInfoModal({ isOpen, onOpenChange }: AlphaInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="3xl" className="max-h-[90vh]">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Bienvenido a la Alpha de Aeternus AI</h2>
        </ModalHeader>
        <ModalBody className="text-base max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <p>
              Gracias por participar en la prueba Alpha de Aeternus AI. Antes de empezar, queremos
              compartir contigo algunas reglas básicas e información importante:
            </p>
            
            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800">
              <h3 className="font-bold text-lg mb-2">Sobre esta experiencia</h3>
              <p className="mb-3">
                Esta es una experiencia conversacional que busca revivir de cierta manera la esencia de
                <strong> Lequi (Lazar Schwartzman)</strong>. La intención es ofrecerte una conversación 
                natural y significativa, como si estuvieras hablando con él.
              </p>
              <p>
                Te invitamos a disfrutar de esta experiencia y recordar que, aunque basada en su esencia,
                estás interactuando con una inteligencia artificial entrenada para reflejar sus características.
              </p>
            </div>
            
            <h3 className="font-bold text-lg">Recuerda que:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Esta es una prueba Alpha, por lo que podrías encontrar comportamientos inesperados.</li>
              <li>Estás interactuando con una IA entrenada para emular conversaciones naturales.</li>
              <li>Todas las conversaciones serán grabadas con fines de mejora del sistema.</li>
              <li>Tu feedback es extremadamente valioso para mejorar esta experiencia.</li>
            </ul>
            
            <h3 className="font-bold text-lg mt-4">Posibles escenarios que puedes explorar:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conversaciones sobre filosofía, espiritualidad y propósito de vida</li>
              <li>Discusiones sobre eventos actuales y su significado más profundo</li>
              <li>Reflexiones sobre relaciones humanas y conexiones personales</li>
              <li>Exploración de preguntas existenciales y búsqueda de sentido</li>
              <li>Compartir recuerdos y experiencias para obtener una nueva perspectiva</li>
            </ul>
            
            <div className="bg-zinc-800/50 p-4 rounded-lg mt-4">
              <p className="italic">
                &ldquo;La idea es que tengas una conversación natural, como lo harías con un amigo que te 
                conoce profundamente y que tiene una perspectiva única sobre la vida.&rdquo;
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            variant="solid" 
            onPress={() => onOpenChange(false)}
          >
            Entendido, comenzar conversación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}