'use client';

import { Star, Palette, Lightbulb, TrendingUp, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { rgbToHex, getColorName, DominantColor } from '@/lib/colorAnalysis';

interface AnalysisResultsProps {
  imageUrl: string;
  colors: DominantColor[];
  harmony: string;
  contrast: string;
  suggestions: string;
  score: number;
  onSave?: () => void;
  onFavorite?: () => void;
}

export default function AnalysisResults({
  imageUrl,
  colors,
  harmony,
  contrast,
  suggestions,
  score,
  onSave,
  onFavorite
}: AnalysisResultsProps) {
  const getHarmonyLabel = (harmony: string) => {
    const labels: Record<string, string> = {
      complementary: 'Complementary',
      analogous: 'Analogous',
      monochromatic: 'Monochromatic',
      triadic: 'Triadic',
      mixed: 'Mixed'
    };
    return labels[harmony] || harmony;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Outstanding';
    if (score >= 7) return 'Excellent';
    if (score >= 5) return 'Good';
    if (score >= 3) return 'Fair';
    return 'Needs Work';
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Overall Style Score
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onFavorite}>
                <Heart className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                {score}/10
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {getScoreLabel(score)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-blue-600" />
            Color Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">Dominant Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-24 rounded-lg mb-2 shadow-md border-2 border-gray-200 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: rgbToHex(color.r, color.g, color.b)
                    }}
                  />
                  <p className="text-sm font-medium text-gray-700">
                    {getColorName(color.r, color.g, color.b)}
                  </p>
                  <p className="text-xs text-gray-500">{color.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">Color Harmony</p>
              <p className="text-2xl font-bold text-blue-700">
                {getHarmonyLabel(harmony)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">Contrast Level</p>
              <p className="text-2xl font-bold text-green-700 capitalize">
                {contrast}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Style Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <p className="text-gray-700 leading-relaxed">{suggestions}</p>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-gray-700">Quick Tips:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-600">
                  Use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-600">
                  Accessories are a great way to add pops of color without commitment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-600">
                  Consider the occasion and season when choosing your outfit
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
