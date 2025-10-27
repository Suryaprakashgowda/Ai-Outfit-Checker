'use client';

import { useState, useEffect } from 'react';
import { History, Heart, Trash2, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase, OutfitAnalysis } from '@/lib/supabase';
import { rgbToHex } from '@/lib/colorAnalysis';

interface OutfitHistoryProps {
  onSelectOutfit?: (outfit: OutfitAnalysis) => void;
}

export default function OutfitHistory({ onSelectOutfit }: OutfitHistoryProps) {
  const [outfits, setOutfits] = useState<OutfitAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    fetchOutfits();
  }, [filter]);

  const fetchOutfits = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('outfit_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (filter === 'favorites') {
        query = query.eq('is_favorite', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setOutfits(data);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('outfit_analyses')
        .update({ is_favorite: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchOutfits();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteOutfit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outfit analysis?')) return;

    try {
      const { error } = await supabase
        .from('outfit_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchOutfits();
    } catch (error) {
      console.error('Error deleting outfit:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="py-12 text-center">
          <History className="w-8 h-8 mx-auto mb-2 animate-pulse text-purple-500" />
          <p className="text-gray-400">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <History className="w-6 h-6 text-purple-400" />
            Your Outfit History
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
            >
              All
            </Button>
            <Button
              variant={filter === 'favorites' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('favorites')}
              className={filter === 'favorites' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}
            >
              Favorites
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {outfits.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">
              {filter === 'favorites'
                ? 'No favorite outfits yet'
                : 'No outfit history yet. Upload your first outfit to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {outfits.map((outfit) => (
              <Card
                key={outfit.id}
                className="overflow-hidden hover:ring-1 hover:ring-purple-500/50 transition-all cursor-pointer bg-gray-800/50 border-gray-700"
                onClick={() => onSelectOutfit?.(outfit)}
              >
                <div className="relative">
                  <img
                    src={outfit.image_url}
                    alt="Outfit"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="icon"
                      variant={outfit.is_favorite ? 'default' : 'secondary'}
                      className={`h-8 w-8 ${outfit.is_favorite ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(outfit.id!, outfit.is_favorite);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          outfit.is_favorite ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOutfit(outfit.id!);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {outfit.dominant_colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-gray-900 shadow-md"
                        style={{
                          backgroundColor: rgbToHex(color.r, color.g, color.b)
                        }}
                      />
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-lg text-white">
                        {outfit.overall_score}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {outfit.created_at && formatDate(outfit.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">
                      {outfit.style_analysis.colorHarmony}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {outfit.style_analysis.contrast} contrast
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
