import { cmsService } from './cmsService';
import type { Ticket } from '../types';

const EMAIL_PROXY_URL = import.meta.env.VITE_EMAIL_PROXY_URL || '';

export const emailService = {
  /**
   * Envia e-mails de notificação após a criação de um novo chamado.
   * Dispara um e-mail para o administrador do site e um e-mail de confirmação para o cliente (se o contato for um e-mail).
   */
  async sendNewTicketNotification(ticket: Ticket): Promise<void> {
    if (!EMAIL_PROXY_URL) {
      console.warn('Notificação de e-mail não enviada: VITE_EMAIL_PROXY_URL não configurada.');
      return;
    }

    try {
      const settings = await cmsService.getById('global_settings') as any;
      const adminEmail = settings?.email || 'san98@outlook.com.br';


      const response = await fetch(EMAIL_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'new_ticket',
          ticket,
          adminEmail
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no servidor proxy de e-mail: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Falha ao enviar notificação de novo chamado:', error);
    }
  },

  /**
   * Envia e-mail de notificação para o cliente quando o status de um chamado é alterado.
   */
  async sendTicketStatusUpdateNotification(ticket: Ticket): Promise<void> {
    if (!EMAIL_PROXY_URL) {
      return;
    }

    // Se o contato do cliente não for um e-mail válido, não tenta enviar
    if (!ticket.customerContact || !ticket.customerContact.includes('@')) {
      return;
    }

    try {
      const response = await fetch(EMAIL_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'status_update',
          ticket
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no servidor proxy de e-mail: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Falha ao enviar notificação de atualização de status:', error);
    }
  }
};
