import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Ticket } from '../types';
import { emailService } from './emailService';

const TICKETS_COLLECTION = 'tickets';

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    try {
      const q = query(collection(db, TICKETS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Ticket | null> {
    try {
      const docRef = doc(db, TICKETS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Ticket;
      }
      return null;
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw error;
    }
  },

  async create(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, TICKETS_COLLECTION), {
        ...data,
        createdAt: now,
        updatedAt: now
      });

      // Dispara a notificação de e-mail em segundo plano
      const newTicket: Ticket = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now
      };
      emailService.sendNewTicketNotification(newTicket).catch(err => {
        console.error('Erro ao enviar e-mail de novo chamado:', err);
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Omit<Ticket, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, TICKETS_COLLECTION, id);

      // Verifica se o status foi modificado para disparar a notificação
      let shouldNotifyStatusUpdate = false;
      let ticketToNotify: Ticket | null = null;

      if (data.status !== undefined) {
        const currentTicket = await this.getById(id);
        if (currentTicket && currentTicket.status !== data.status) {
          shouldNotifyStatusUpdate = true;
          ticketToNotify = {
            ...currentTicket,
            ...data,
            updatedAt: new Date().toISOString()
          } as Ticket;
        }
      }

      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });

      // Se o status mudou, envia a notificação por e-mail em segundo plano
      if (shouldNotifyStatusUpdate && ticketToNotify) {
        emailService.sendTicketStatusUpdateNotification(ticketToNotify).catch(err => {
          console.error('Erro ao enviar e-mail de alteração de status:', err);
        });
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, TICKETS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }
};
