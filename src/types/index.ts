import type { ElementType } from "react";

export type Category = 'premium' | 'intermediario' | 'portatil';

export interface EquipmentFeature {
  title: string;
  description: string;
  imageUrl?: string;
  disclaimer?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  imageUrl: string;
  gallery?: string[];
  diagnosticImages?: { url: string; caption?: string }[];
  highlights: string[];
  fullFeatures?: {
    imageQuality: EquipmentFeature[];
    aiEfficiency: EquipmentFeature[];
    ergonomics: EquipmentFeature[];
  };
}

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  features: string[];
}