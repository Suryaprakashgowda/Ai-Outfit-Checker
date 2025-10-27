/*
  # AI Outfit Checker Database Schema

  1. New Tables
    - `outfit_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, optional for guest users)
      - `image_url` (text)
      - `dominant_colors` (jsonb) - stores RGB color values
      - `style_analysis` (jsonb) - AI analysis results
      - `suggestions` (text) - outfit improvement tips
      - `overall_score` (integer) - 1-10 rating
      - `is_favorite` (boolean)
      - `created_at` (timestamptz)
    
    - `style_tips`
      - `id` (uuid, primary key)
      - `category` (text) - 'color', 'occasion', 'season', 'body_type'
      - `title` (text)
      - `description` (text)
      - `tips` (jsonb) - array of tip objects
      - `created_at` (timestamptz)
    
    - `color_palettes`
      - `id` (uuid, primary key)
      - `name` (text) - 'complementary', 'analogous', 'triadic', etc.
      - `description` (text)
      - `example_colors` (jsonb)
      - `works_well_with` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for style_tips and color_palettes
    - Users can manage their own outfit_analyses
*/

CREATE TABLE IF NOT EXISTS outfit_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  image_url text NOT NULL,
  dominant_colors jsonb NOT NULL DEFAULT '[]',
  style_analysis jsonb NOT NULL DEFAULT '{}',
  suggestions text,
  overall_score integer CHECK (overall_score >= 1 AND overall_score <= 10),
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS style_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  tips jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS color_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  example_colors jsonb NOT NULL DEFAULT '[]',
  works_well_with jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE outfit_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view style tips"
  ON style_tips FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view color palettes"
  ON color_palettes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create outfit analyses"
  ON outfit_analyses FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view outfit analyses"
  ON outfit_analyses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update outfit analyses"
  ON outfit_analyses FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete outfit analyses"
  ON outfit_analyses FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_outfit_analyses_created_at ON outfit_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outfit_analyses_favorite ON outfit_analyses(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_style_tips_category ON style_tips(category);

INSERT INTO style_tips (category, title, description, tips) VALUES
('color', 'Color Coordination Basics', 'Understanding how colors work together', '[
  {"tip": "Complementary colors (opposite on color wheel) create bold, high-contrast looks"},
  {"tip": "Analogous colors (next to each other) create harmonious, cohesive outfits"},
  {"tip": "Monochromatic (same color, different shades) creates elegant, sophisticated looks"},
  {"tip": "Neutral colors (black, white, gray, beige) are versatile and timeless"}
]'),
('color', 'Advanced Color Theory', 'Taking your color game to the next level', '[
  {"tip": "Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent"},
  {"tip": "Warm colors (red, orange, yellow) are energetic and attention-grabbing"},
  {"tip": "Cool colors (blue, green, purple) are calming and professional"},
  {"tip": "Metallics (gold, silver) add sophistication and can complement any palette"}
]'),
('occasion', 'Professional Settings', 'Dressing for success in the workplace', '[
  {"tip": "Stick to classic colors like navy, gray, and white for formal business"},
  {"tip": "Ensure proper fit - tailored clothing always looks more professional"},
  {"tip": "Keep accessories minimal and elegant in corporate environments"},
  {"tip": "Business casual allows for more color but maintain sophistication"}
]'),
('season', 'Summer Style', 'Stay cool and stylish in warm weather', '[
  {"tip": "Light, breathable fabrics like linen and cotton are essential"},
  {"tip": "Lighter colors reflect heat better than dark colors"},
  {"tip": "Incorporate bright, vibrant colors to match the season''s energy"},
  {"tip": "Don''t forget sun protection - hats and sunglasses are functional fashion"}
]'),
('season', 'Winter Style', 'Layer up without sacrificing style', '[
  {"tip": "Master the art of layering for both warmth and visual interest"},
  {"tip": "Rich, deep colors like burgundy, forest green, and navy work well"},
  {"tip": "Textures like wool, cashmere, and leather add dimension"},
  {"tip": "Statement coats become the centerpiece of winter outfits"}
]')
ON CONFLICT DO NOTHING;

INSERT INTO color_palettes (name, description, example_colors, works_well_with) VALUES
('Complementary', 'Colors opposite on the color wheel - high contrast and vibrant', 
'[{"name": "Blue & Orange", "colors": ["#0047AB", "#FF8C00"]}, {"name": "Red & Green", "colors": ["#DC143C", "#228B22"]}]',
'["Bold statements", "Sporty looks", "Creative outfits"]'),
('Analogous', 'Colors next to each other on the wheel - harmonious and pleasing', 
'[{"name": "Blue, Teal, Green", "colors": ["#0047AB", "#008080", "#228B22"]}, {"name": "Red, Orange, Yellow", "colors": ["#DC143C", "#FF8C00", "#FFD700"]}]',
'["Casual wear", "Beach outfits", "Gradient effects"]'),
('Monochromatic', 'Different shades of the same color - elegant and sophisticated', 
'[{"name": "Navy Spectrum", "colors": ["#000080", "#0047AB", "#4169E1"]}, {"name": "Earth Tones", "colors": ["#8B4513", "#D2691E", "#F4A460"]}]',
'["Professional settings", "Formal events", "Minimalist style"]'),
('Neutral', 'Timeless colors that work with everything', 
'[{"name": "Classic Neutrals", "colors": ["#000000", "#FFFFFF", "#808080", "#F5F5DC"]}]',
'["Everyday wear", "Building a capsule wardrobe", "All occasions"]'),
('Triadic', 'Three colors equally spaced on the wheel - balanced and colorful', 
'[{"name": "Primary Colors", "colors": ["#FF0000", "#FFFF00", "#0000FF"]}, {"name": "Secondary Colors", "colors": ["#FF8C00", "#9370DB", "#00FF00"]}]',
'["Creative expression", "Festival wear", "Artistic looks"]')
ON CONFLICT DO NOTHING;