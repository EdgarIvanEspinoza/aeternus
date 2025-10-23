import React, { useEffect, useRef, useCallback, useState } from 'react';
import ChatInputComponent from './ChatInput/ChatInput';
import ChatHook from '../../hook/chat.hook';
import { useImpersonation } from '../../context/ImpersonationContext';
import { ChatMessage } from './ChatMessage/ChatMessage';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getNameAndFamilyFromUser, getNameFromUser } from '@utils/main.utils';
import { AlphaInfoModal } from '@components/modal/AlphaInfoModal';
import { ConversationDebugBadge } from './ConversationDebugBadge';

export const Chat = ({
  jacquesMode,
  adminMode,
}: {
  jacquesMode: boolean;
  adminMode: boolean;
}): React.ReactElement => {
  const { user } = useUser();
  const { impersonatedUser } = useImpersonation();
  const effectiveName = impersonatedUser?.name || (jacquesMode ? 'Jacques' : getNameFromUser(user));
  const { messages, input, handleInputChange, handleSubmit, loading } = ChatHook(effectiveName);
  const [showAlphaModal, setShowAlphaModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef(true); // whether we should keep following bottom

  // Mostrar modal de información de Alpha al inicio - ahora se muestra siempre
  useEffect(() => {
    // Mostrar el modal siempre que se cargue el componente
    setShowAlphaModal(true);
  }, []);

  // Función para cerrar modal - ya no guarda estado en localStorage
  const handleAlphaModalClose = (open: boolean) => {
    setShowAlphaModal(open);
    // Ya no guardamos en localStorage para que se muestre cada vez
  };

  // Exponer la función para uso directo desde componentes hijos como ChatInput
  const scrollToBottom = useCallback((smooth: boolean = false) => {
    // Forzar siempre al fondo, sin excepciones
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      // Doble scroll para mejor resultado
      el.scrollTo({ top: 999999, behavior: 'auto' }); // Primero forzado
      setTimeout(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
      }, 10); // Segundo ajustado
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      }, 10);
    }
  }, []);

  // Initial scroll - super agresivo al cargar con múltiples intentos
  useEffect(() => {
    // Scroll inmediato
    scrollToBottom(false);
    
    // Programar múltiples intentos para asegurar que siempre baje
    // incluso si hay problemas de sincronización o tiempo de carga
    const timers = [50, 100, 200, 400, 800, 1500, 3000].map(delay => 
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 999999;
        }
        scrollToBottom(false);
      }, delay)
    );
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [scrollToBottom]);

  // Listen to manual scroll to toggle autoScrollRef
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const nearBottom = distanceFromBottom < 80;
      if (nearBottom && !autoScrollRef.current) {
        autoScrollRef.current = true;
      } else if (!nearBottom && autoScrollRef.current) {
        autoScrollRef.current = false;
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Observe size changes (streaming new tokens) - SIEMPRE scroll para respuestas de IA
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const content = el.firstElementChild as HTMLElement | null;
    if (!content) return;
    
    let prevHeight = content.offsetHeight;
    const ro = new ResizeObserver(() => {
      const currentHeight = content.offsetHeight;
      
      // Si el contenido está creciendo, forzar scroll SIEMPRE
      // Este es el caso cuando la IA está generando respuesta
      if (currentHeight > prevHeight) {
        if (el.scrollHeight - el.scrollTop - el.clientHeight > 100) {
          // Si el usuario está demasiado lejos, no usamos smooth
          el.scrollTop = el.scrollHeight;
        } else {
          // Si está cerca, usamos smooth
          scrollToBottom(true);
        }
        
        // Para mayor seguridad, programar un segundo intento
        setTimeout(() => scrollToBottom(true), 100);
      } 
      // Otro cambio de tamaño
      else if (autoScrollRef.current) {
        scrollToBottom(true);
      }
      
      prevHeight = currentHeight;
    });
    
    ro.observe(content);
    return () => ro.disconnect();
  }, [messages, scrollToBottom]);

  // React to messages array changes - SIEMPRE scroll tras nuevos mensajes con repetición
  useEffect(() => {
    if (messages.length > 0) {
      // Siempre scroll al último mensaje
      const lastMessage = messages[messages.length - 1];
      const isUserMessage = lastMessage?.role === 'user';
      const isAssistantMessage = lastMessage?.role === 'assistant';
      
      // Múltiples intentos para garantizar que siempre baje
      const scrollDown = (smooth: boolean) => {
        scrollToBottom(smooth);
        // Programar múltiples intentos adicionales
        const delays = [50, 150, 300, 600];
        delays.forEach(delay => 
          setTimeout(() => scrollToBottom(smooth), delay)
        );
      };
      
      if (isUserMessage) {
        // Para mensajes de usuario: inmediato y repetido
        scrollDown(false);
      } 
      else if (isAssistantMessage) {
        // Para respuestas completas: suave y repetido
        scrollDown(true);
      }
    }
  }, [messages, scrollToBottom]);

  return (
    <>
      <div className="relative flex-1 w-full flex flex-col items-center">
        {impersonatedUser && (
          <div className="absolute top-2 left-4 z-30 bg-pink-600/20 border border-pink-500/40 text-pink-200 text-[11px] px-2 py-1 rounded">
            Impersonando: {impersonatedUser.name || impersonatedUser.email}
          </div>
        )}
        <ConversationDebugBadge />
        {loading ? (
          <div className="flex items-center justify-center flex-1 h-full w-full">
            <div className="loader">
              <l-quantum size="45" speed="1.75" color="#ec4899"></l-quantum>
            </div>
          </div>
        ) : (
          <div ref={scrollContainerRef} className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700/50 pt-16" data-chat-scroll-container>
            <div className="mx-auto w-[80%] pt-6 pb-40 flex flex-col">
              {messages
                .filter((msg) => (adminMode ? true : msg.role !== 'system'))
                .map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    role={message.role}
                    username={jacquesMode ? 'Jacques Schwartzman' : (impersonatedUser?.name || getNameAndFamilyFromUser(user))}
                    impersonating={!!impersonatedUser}
                  />
                ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        {/* Input spacer to avoid last message hidden behind fixed bar */}
        <div className="pointer-events-none h-0" />
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/80 to-black/0 backdrop-blur-sm border-t border-zinc-800/60">
          <div className="mx-auto w-[80%] py-4">
            <ChatInputComponent disabled={loading} scrollToBottom={scrollToBottom} {...{ handleSubmit, input, handleInputChange }} />
          </div>
        </div>
      </div>
      
      {/* Modal informativo para usuarios de Alpha */}
      <AlphaInfoModal isOpen={showAlphaModal} onOpenChange={handleAlphaModalClose} />
    </>
  );
};
