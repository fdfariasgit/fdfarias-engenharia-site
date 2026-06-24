import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Equipment } from '../types';

const COLLECTION_NAME = 'equipment';

export const equipmentService = {
  // Buscar todos os equipamentos ativos (público)
  async getAll(): Promise<Equipment[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs
      .map(doc => {
        const item = { id: doc.id, ...doc.data() } as Equipment;
        if (item.name && item.name.toUpperCase().includes('HERA Z20') && (!item.pdfUrl || item.pdfUrl === '#')) {
          item.pdfUrl = '/Catalogo_HERA_Z20_Portugues.pdf';
        }
        return item;
      })
      .filter(item => item.status !== 'deleted');
  },

  // Buscar todos os equipamentos inclusive deletados (admin)
  async getAllAdmin(): Promise<Equipment[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => {
      const item = { id: doc.id, ...doc.data() } as Equipment;
      if (item.name && item.name.toUpperCase().includes('HERA Z20') && (!item.pdfUrl || item.pdfUrl === '#')) {
        item.pdfUrl = '/Catalogo_HERA_Z20_Portugues.pdf';
      }
      return item;
    });
  },

  // Buscar equipamento por ID
  async getById(id: string): Promise<Equipment | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const item = { id: docSnap.id, ...docSnap.data() } as Equipment;
      if (item.name && item.name.toUpperCase().includes('HERA Z20') && (!item.pdfUrl || item.pdfUrl === '#')) {
        item.pdfUrl = '/Catalogo_HERA_Z20_Portugues.pdf';
      }
      return item;
    }
    return null;
  },

  // Buscar equipamentos ativos por categoria
  async getByCategory(category: string): Promise<Equipment[]> {
    const q = query(collection(db, COLLECTION_NAME), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => {
        const item = { id: doc.id, ...doc.data() } as Equipment;
        if (item.name && item.name.toUpperCase().includes('HERA Z20') && (!item.pdfUrl || item.pdfUrl === '#')) {
          item.pdfUrl = '/Catalogo_HERA_Z20_Portugues.pdf';
        }
        return item;
      })
      .filter(item => item.status !== 'deleted');
  },

  // Adicionar novo equipamento
  async add(equipment: Omit<Equipment, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...equipment,
      status: 'active'
    });
    return docRef.id;
  },

  // Atualizar equipamento existente
  async update(id: string, data: Partial<Equipment>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Excluir equipamento definitivamente
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
