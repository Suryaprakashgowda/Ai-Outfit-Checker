export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface DominantColor extends ColorRGB {
  percentage: number;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function getColorName(r: number, g: number, b: number): string {
  const hsl = rgbToHsl(r, g, b);
  const { h, s, l } = hsl;

  if (l > 90) return 'White';
  if (l < 10) return 'Black';
  if (s < 10) return l > 50 ? 'Light Gray' : 'Dark Gray';

  if (h >= 0 && h < 15) return 'Red';
  if (h >= 15 && h < 45) return 'Orange';
  if (h >= 45 && h < 65) return 'Yellow';
  if (h >= 65 && h < 150) return 'Green';
  if (h >= 150 && h < 190) return 'Cyan';
  if (h >= 190 && h < 260) return 'Blue';
  if (h >= 260 && h < 290) return 'Purple';
  if (h >= 290 && h < 330) return 'Magenta';
  return 'Pink';
}

export function analyzeImageColors(imageData: ImageData): DominantColor[] {
  const pixels = imageData.data;
  const colorMap = new Map<string, number>();
  const step = 4;

  for (let i = 0; i < pixels.length; i += step * 4) {
    const r = Math.floor(pixels[i] / 32) * 32;
    const g = Math.floor(pixels[i + 1] / 32) * 32;
    const b = Math.floor(pixels[i + 2] / 32) * 32;

    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 15 && g < 15 && b < 15) continue;

    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalCount = sortedColors.reduce((sum, [, count]) => sum + count, 0);

  return sortedColors.map(([rgb, count]) => {
    const [r, g, b] = rgb.split(',').map(Number);
    return {
      r,
      g,
      b,
      percentage: Math.round((count / totalCount) * 100)
    };
  });
}

export function calculateColorHarmony(colors: DominantColor[]): string {
  if (colors.length < 2) return 'monochromatic';

  const hues = colors.map(c => rgbToHsl(c.r, c.g, c.b).h);

  const hueDiffs = [];
  for (let i = 0; i < hues.length - 1; i++) {
    const diff = Math.abs(hues[i] - hues[i + 1]);
    hueDiffs.push(Math.min(diff, 360 - diff));
  }

  const avgDiff = hueDiffs.reduce((a, b) => a + b, 0) / hueDiffs.length;

  if (avgDiff < 30) return 'analogous';
  if (avgDiff > 150 && avgDiff < 210) return 'complementary';
  if (avgDiff > 100 && avgDiff < 140) return 'triadic';
  return 'mixed';
}

export function calculateContrast(colors: DominantColor[]): 'high' | 'medium' | 'low' {
  if (colors.length < 2) return 'low';

  const luminances = colors.map(c => {
    const { l } = rgbToHsl(c.r, c.g, c.b);
    return l;
  });

  const maxLum = Math.max(...luminances);
  const minLum = Math.min(...luminances);
  const contrastRatio = maxLum - minLum;

  if (contrastRatio > 60) return 'high';
  if (contrastRatio > 30) return 'medium';
  return 'low';
}

export function generateStyleSuggestions(
  colors: DominantColor[],
  harmony: string,
  contrast: string
): string {
  const suggestions: string[] = [];

  if (harmony === 'complementary') {
    suggestions.push('Your outfit has bold, complementary colors that create visual impact.');
  } else if (harmony === 'analogous') {
    suggestions.push('Your color scheme is harmonious and pleasing to the eye.');
  } else if (harmony === 'monochromatic') {
    suggestions.push('Your monochromatic palette creates a sophisticated, elegant look.');
  }

  if (contrast === 'high') {
    suggestions.push('The high contrast makes a strong statement. Consider adding a neutral piece to balance it out.');
  } else if (contrast === 'low') {
    suggestions.push('Add a pop of contrasting color with accessories to create more visual interest.');
  }

  const colorNames = colors.map(c => getColorName(c.r, c.g, c.b));
  const colorSet = new Set(colorNames);
  const uniqueColors = Array.from(colorSet);

  if (uniqueColors.length > 3) {
    suggestions.push('Try limiting to 3 main colors for a more cohesive look.');
  }

  return suggestions.join(' ');
}
