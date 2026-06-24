import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CmsContent } from '../types';

const CMS_COLLECTION = 'cms';

export const cmsService = {
  async getAll(): Promise<CmsContent[]> {
    try {
      const querySnapshot = await getDocs(collection(db, CMS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CmsContent[];
    } catch (error) {
      console.error('Error getting all cms content:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<CmsContent | null> {
    try {
      const docRef = doc(db, CMS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CmsContent;
      }
      return null;
    } catch (error) {
      console.error(`Error getting cms content for ${id}:`, error);
      throw error;
    }
  },

  async setContent(id: string, data: Omit<CmsContent, 'id' | 'updatedAt'>): Promise<void> {
    try {
      const docRef = doc(db, CMS_COLLECTION, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error(`Error setting cms content for ${id}:`, error);
      throw error;
    }
  }
};
