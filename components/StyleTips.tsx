'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, StyleTip, ColorPalette } from '@/lib/supabase';
import { hexToRgb, rgbToHex } from '@/lib/colorAnalysis';

export default function StyleTips() {
  const [styleTips, setStyleTips] = useState<StyleTip[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStyleData();
  }, []);

  const fetchStyleData = async () => {
    try {
      const [tipsResult, palettesResult] = await Promise.all([
        supabase.from('style_tips').select('*').order('category'),
        supabase.from('color_palettes').select('*')
      ]);

      if (tipsResult.data) setStyleTips(tipsResult.data);
      if (palettesResult.data) setColorPalettes(palettesResult.data);
    } catch (error) {
      console.error('Error fetching style data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedTips = styleTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, StyleTip[]>);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="py-12 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse text-purple-500" />
          <p className="text-gray-400">Loading style tips...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Fashion Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger 
                value="tips"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                Style Tips
              </TabsTrigger>
              <TabsTrigger 
                value="palettes"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                Color Palettes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tips" className="space-y-6 mt-6">
              {Object.entries(groupedTips).map(([category, tips]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize text-sm border-gray-700 text-gray-300">
                      {category}
                    </Badge>
                  </div>
                  {tips.map((tip) => (
                    <Card key={tip.id} className="bg-gray-800/30 border-gray-700 border-l-4 border-l-purple-500">
                      <CardHeader>
                        <CardTitle className="text-lg text-white">{tip.title}</CardTitle>
                        <p className="text-sm text-gray-400">{tip.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {tip.tips.map((tipItem, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <ChevronRight className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{tipItem.tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="palettes" className="space-y-6 mt-6">
              {colorPalettes.map((palette) => (
                <Card key={palette.id} className="overflow-hidden bg-gray-800/30 border-gray-700">
                  <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-800/50 border-b border-gray-700">
                    <CardTitle className="text-lg text-white">{palette.name}</CardTitle>
                    <p className="text-sm text-gray-400">{palette.description}</p>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {palette.example_colors.map((example, index) => (
                        <div key={index}>
                          <p className="text-sm font-medium text-gray-300 mb-2">
                            {example.name}
                          </p>
                          <div className="flex gap-2">
                            {example.colors.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="flex-1 h-20 rounded-lg border border-gray-700 transition-transform hover:scale-105"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-sm font-medium text-gray-300 mb-1">
                        Works Well With:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {palette.works_well_with.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
