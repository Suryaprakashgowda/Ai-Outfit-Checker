import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface OutfitAnalysis {
  id?: string;
  user_id?: string;
  image_url: string;
  dominant_colors: { r: number; g: number; b: number; percentage: number }[];
  style_analysis: {
    colorHarmony: string;
    contrast: string;
    versatility: string;
    seasonality: string;
  };
  suggestions: string;
  overall_score: number;
  is_favorite: boolean;
  created_at?: string;
}

export interface StyleTip {
  id: string;
  category: string;
  title: string;
  description: string;
  tips: { tip: string }[];
  created_at: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  example_colors: { name: string; colors: string[] }[];
  works_well_with: string[];
  created_at: string;
}
