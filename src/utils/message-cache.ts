import { Message } from '@ai-sdk/react';

// Clave para almacenar mensajes en localStorage
const MESSAGES_CACHE_KEY = 'aeternus-messages-cache';
const CACHE_EXPIRY_KEY = 'aeternus-cache-expiry';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

// Interfaz para el objeto de caché
interface MessageCache {
  conversationId: string;
  messages: Message[];
  timestamp: number;
}

/**
 * Guarda los mensajes en caché local
 */
export const cacheMessages = (conversationId: string, messages: Message[]): void => {
  try {
    const cache: MessageCache = {
      conversationId,
      messages,
      timestamp: Date.now(),
    };

    localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(cache));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  } catch (error) {
    console.error('Error caching messages:', error);
  }
};

/**
 * Recupera los mensajes de la caché si están disponibles y no han expirado
 */
export const getCachedMessages = (conversationId: string): Message[] | null => {
  try {
    // Verificar si la caché ha expirado
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiryTime || parseInt(expiryTime) < Date.now()) {
      localStorage.removeItem(MESSAGES_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      return null;
    }

    const cacheStr = localStorage.getItem(MESSAGES_CACHE_KEY);
    if (!cacheStr) return null;

    const cache: MessageCache = JSON.parse(cacheStr);

    // Verificar que sea la misma conversación
    if (cache.conversationId !== conversationId) return null;

    return cache.messages;
  } catch (error) {
    console.error('Error retrieving cached messages:', error);
    return null;
  }
};

/**
 * Limpia la caché de mensajes
 */
export const clearMessageCache = (): void => {
  localStorage.removeItem(MESSAGES_CACHE_KEY);
  localStorage.removeItem(CACHE_EXPIRY_KEY);
};

/**
 * Actualiza la caché con un nuevo mensaje
 */
export const updateCacheWithMessage = (conversationId: string, message: Message): void => {
  try {
    const cachedMessages = getCachedMessages(conversationId);
    if (cachedMessages) {
      // Verificar si el mensaje ya existe en la caché
      const messageExists = cachedMessages.some((m) => m.id === message.id);
      if (!messageExists) {
        cacheMessages(conversationId, [...cachedMessages, message]);
      }
    }
  } catch (error) {
    console.error('Error updating message cache:', error);
  }
};
