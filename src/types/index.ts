import type { ElementType } from "react";

export type Category = string;
export type Brand = string;

export interface TaxonomyItem {
  id: string;
  name: string;
  type: 'category' | 'brand';
  createdAt?: string;
}

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  category: Category;
  tagline?: string;
  description: string;
  pdfUrl?: string;
  imageUrl: string;
  gallery?: string[];
  status?: 'active' | 'deleted';
  deletedAt?: string;
}

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  features: string[];
}

export type TicketStatus = 'open' | 'in_progress' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  customerName: string;
  customerContact: string;
  equipmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsContent {
  id: string; // e.g. 'home_banner', 'about_page'
  title?: string;
  text?: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface SiteSettings extends CmsContent {
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  corporateName?: string;
  tradeName?: string;
  cnpj?: string;
}