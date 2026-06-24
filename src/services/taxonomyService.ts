import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TaxonomyItem } from '../types';

const TAXONOMY_COLLECTION = 'taxonomy';

const DEFAULT_BRANDS = [
  'Samsung',
  'GE Healthcare',
  'Philips',
  'Mindray',
  'Canon / Toshiba',
  'Siemens',
  'Sonosite',
  'Chison',
  'Edan'
];

const DEFAULT_CATEGORIES = [
  'Premium',
  'Intermediário',
  'Portátil',
  'Acessório',
  'Transdutor'
];

export const taxonomyService = {
  async getAll(): Promise<TaxonomyItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, TAXONOMY_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TaxonomyItem[];
    } catch (error) {
      console.error('Error getting taxonomy:', error);
      throw error;
    }
  },

  async getByType(type: 'category' | 'brand'): Promise<TaxonomyItem[]> {
    try {
      const q = query(collection(db, TAXONOMY_COLLECTION), where('type', '==', type));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TaxonomyItem[];
    } catch (error) {
      console.error(`Error getting taxonomy type ${type}:`, error);
      throw error;
    }
  },

  async add(data: Omit<TaxonomyItem, 'id' | 'createdAt'>): Promise<string> {
    try {
      const newRef = doc(collection(db, TAXONOMY_COLLECTION));
      await setDoc(newRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
      return newRef.id;
    } catch (error) {
      console.error('Error adding taxonomy item:', error);
      throw error;
    }
  },

  async update(id: string, name: string): Promise<void> {
    try {
      const docRef = doc(db, TAXONOMY_COLLECTION, id);
      await setDoc(docRef, { name }, { merge: true });
    } catch (error) {
      console.error('Error updating taxonomy item:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, TAXONOMY_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting taxonomy item:', error);
      throw error;
    }
  },

  // Inicializa o banco com dados padrão caso esteja vazio
  async initializeDefaults(): Promise<void> {
    try {
      const allItems = await this.getAll();
      if (allItems.length > 0) {
        return; // Já existem dados, não precisa inicializar
      }

      console.log('Inicializando banco de taxonomia com dados padrão...');

      const promises: Promise<string>[] = [];

      DEFAULT_BRANDS.forEach(name => {
        promises.push(this.add({ name, type: 'brand' }));
      });

      DEFAULT_CATEGORIES.forEach(name => {
        promises.push(this.add({ name, type: 'category' }));
      });

      await Promise.all(promises);
      console.log('Dados padrão inicializados com sucesso.');
    } catch (error) {
      console.error('Erro ao inicializar dados padrão:', error);
      throw error;
    }
  }
};
