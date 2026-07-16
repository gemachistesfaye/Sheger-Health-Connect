import { logger } from './logger';

const WS_URL = process.env.WS_INTERNAL_URL || 'http://localhost:5001';
const INTERNAL_SECRET = process.env.WS_INTERNAL_SECRET || 'super-secret-internal-key-123';

/**
 * Emits an event to a Socket.io room via the dedicated WebSocket microservice.
 */
export const emitToSocket = async (room: string, event: string, payload: any): Promise<boolean> => {
  try {
    const response = await fetch(`${WS_URL}/internal/emit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_SECRET}`
      },
      body: JSON.stringify({ room, event, payload })
    });

    if (!response.ok) {
      logger.error({ status: response.status, room, event }, 'Failed to emit to WebSocket service');
      return false;
    }

    return true;
  } catch (error: any) {
    logger.error({ error: error.message, room, event }, 'Error communicating with WebSocket service');
    return false;
  }
};
