'use client';

import { useState } from 'react';
import { Sparkles, BookOpen, History as HistoryIcon } from 'lucide-react';
import OutfitUploader from '@/components/OutfitUploader';
import AnalysisResults from '@/components/AnalysisResults';
import StyleTips from '@/components/StyleTips';
import OutfitHistory from '@/components/OutfitHistory';
import { Button } from '@/components/ui/button';
import { DressBetterLiveBetter } from '../dress-better-live-better/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, OutfitAnalysis } from '@/lib/supabase';
import { DominantColor } from '@/lib/colorAnalysis';
import { DashboardNav } from '@/components/dashboard-nav';

export default function Dashboard() {
  const [analysisData, setAnalysisData] = useState<{
    imageUrl: string;
    colors: DominantColor[];
    harmony: string;
    contrast: string;
    suggestions: string;
    score: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState('upload');

  const handleAnalysisComplete = async (data: {
    imageUrl: string;
    colors: DominantColor[];
    harmony: string;
    contrast: string;
    suggestions: string;
    score: number;
  }) => {
    setAnalysisData(data);

    let imageUrl = data.imageUrl;

    // If the incoming imageUrl is a data URL (from camera), upload to storage and use public URL
    if (imageUrl.startsWith('data:')) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const filename = `capture_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('outfit-images')
          .upload(filename, blob, { contentType: 'image/jpeg' });

        if (!uploadError && uploadData?.path) {
          const { data: urlData } = supabase.storage.from('outfit-images').getPublicUrl(uploadData.path);
          imageUrl = urlData.publicUrl;
        } else if (uploadError) {
          console.error('Storage upload error:', uploadError);
        }
      } catch (err) {
        console.error('Error uploading captured image:', err);
      }
    }

    const outfitData: Omit<OutfitAnalysis, 'id' | 'created_at'> = {
      image_url: imageUrl,
      dominant_colors: data.colors,
      style_analysis: {
        colorHarmony: data.harmony,
        contrast: data.contrast,
        versatility: 'medium',
        seasonality: 'all-season'
      },
      suggestions: data.suggestions,
      overall_score: data.score,
      is_favorite: false
    };

    try {
      await supabase.from('outfit_analyses').insert([outfitData]);
    } catch (error) {
      console.error('Error saving outfit analysis:', error);
    }
  };

  const handleFavorite = async () => {
    if (!analysisData) return;
    const { data } = await supabase
      .from('outfit_analyses')
      .select('*')
      .eq('image_url', analysisData.imageUrl)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      await supabase
        .from('outfit_analyses')
        .update({ is_favorite: !data.is_favorite })
        .eq('id', data.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get instant AI-powered feedback on your outfit choices with intelligent color
            analysis and personalized style recommendations
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-14 bg-gray-800/50">
            <TabsTrigger value="upload" className="text-lg gap-2 data-[state=active]:bg-purple-600 text-gray-300 data-[state=active]:text-white">
              <Sparkles className="w-5 h-5" />
              Analyze Outfit
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg gap-2 data-[state=active]:bg-purple-600 text-gray-300 data-[state=active]:text-white">
              <HistoryIcon className="w-5 h-5" />
              History
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-lg gap-2 data-[state=active]:bg-purple-600 text-gray-300 data-[state=active]:text-white">
              <BookOpen className="w-5 h-5" />
              Style Guide
            </TabsTrigger>
            <TabsTrigger value="dress" className="text-lg gap-2 data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white">
              <Sparkles className="w-5 h-5" />
              Dress Better
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <OutfitUploader onAnalysisComplete={handleAnalysisComplete} />
              </div>
              <div>
                {analysisData ? (
                  <AnalysisResults
                    imageUrl={analysisData.imageUrl}
                    colors={analysisData.colors}
                    harmony={analysisData.harmony}
                    contrast={analysisData.contrast}
                    suggestions={analysisData.suggestions}
                    score={analysisData.score}
                    onFavorite={handleFavorite}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4 p-12 bg-gray-800/50 rounded-xl border border-gray-700">
                      <Sparkles className="w-16 h-16 mx-auto text-purple-400" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Upload Your Outfit
                        </h3>
                        <p className="text-gray-300">
                          Get instant AI analysis with personalized style recommendations
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analysisData && (
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  onClick={() => {
                    setAnalysisData(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Analyze Another Outfit
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <OutfitHistory
              onSelectOutfit={(outfit) => {
                setAnalysisData({
                  imageUrl: outfit.image_url,
                  colors: outfit.dominant_colors,
                  harmony: outfit.style_analysis.colorHarmony,
                  contrast: outfit.style_analysis.contrast,
                  suggestions: outfit.suggestions,
                  score: outfit.overall_score
                });
                setActiveTab('upload');
              }}
            />
          </TabsContent>

          <TabsContent value="tips">
            <StyleTips />
          </TabsContent>

          <TabsContent value="dress">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              {/* Embedded Dress Better app inside dashboard (logged-in experience) */}
              <DressBetterLiveBetter embed />
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-gray-400 text-sm pb-8">
          <p>
            AI-powered outfit analysis with intelligent color theory and fashion expertise
          </p>
          <p className="mt-2">
            Built with Next.js and advanced color analysis algorithms
          </p>
        </footer>
      </div>
    </div>
  );
}