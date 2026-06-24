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
      return docRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Omit<Ticket, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, TICKETS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
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
