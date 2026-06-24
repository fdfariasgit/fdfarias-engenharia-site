import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { cmsService } from '../services/cmsService';
import type { SiteSettings } from '../types';

interface SiteConfigContextType {
  settings: SiteSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function SiteConfigProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getById('global_settings');
      setSettings(data as SiteSettings);
    } catch (error) {
      console.error('Failed to load global site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Update SEO attributes dynamically whenever settings change
  useEffect(() => {
    if (settings?.metaTitle) {
      document.title = settings.metaTitle;
    }
    
    if (settings?.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', settings.metaDescription);
    }
  }, [settings]);

  const contextValue = useMemo(() => ({
    settings,
    loading,
    refreshSettings: loadSettings
  }), [settings, loading]);

  return (
    <SiteConfigContext.Provider value={contextValue}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
