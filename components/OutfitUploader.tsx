'use client';

import { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { analyzeImageColors, calculateColorHarmony, calculateContrast, generateStyleSuggestions, DominantColor } from '@/lib/colorAnalysis';

interface OutfitUploaderProps {
  onAnalysisComplete: (data: {
    imageUrl: string;
    colors: DominantColor[];
    harmony: string;
    contrast: string;
    suggestions: string;
    score: number;
  }) => void;
}

export default function OutfitUploader({ onAnalysisComplete }: OutfitUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageUrl = canvas.toDataURL('image/jpeg');
        setPreview(imageUrl);
        stopCamera();
        analyzeImage(imageUrl);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = async (imageUrl: string) => {
    setAnalyzing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const colors = analyzeImageColors(imageData);
        const harmony = calculateColorHarmony(colors);
        const contrast = calculateContrast(colors);
        const suggestions = generateStyleSuggestions(colors, harmony, contrast);

        const score = calculateScore(harmony, contrast, colors);

        setTimeout(() => {
          onAnalysisComplete({
            imageUrl,
            colors,
            harmony,
            contrast,
            suggestions,
            score
          });
          setAnalyzing(false);
        }, 1500);
      }
    };
    img.src = imageUrl;
  };

  const calculateScore = (harmony: string, contrast: string, colors: DominantColor[]): number => {
    let score = 5;

    if (harmony === 'complementary' || harmony === 'analogous') score += 2;
    if (harmony === 'triadic') score += 1;

    if (contrast === 'medium') score += 2;
    if (contrast === 'high') score += 1;

    if (colors.length >= 2 && colors.length <= 4) score += 1;

    return Math.min(10, Math.max(1, score));
  };

  return (
    <Card className="p-8 bg-gray-800/50 border-gray-700">
      {!cameraActive ? (
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
            dragActive
              ? 'border-purple-500 bg-purple-500/10'
              : preview
              ? 'border-green-500'
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Outfit preview"
                className="w-full h-96 object-contain rounded-lg"
              />
              {analyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg backdrop-blur-sm">
                  <div className="text-center text-white">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 animate-pulse text-purple-400" />
                    <p className="text-lg font-medium">Analyzing your outfit...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-medium text-white mb-2">
                Upload your outfit photo
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Drag and drop or click to browse
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <ImageIcon className="w-5 h-5" />
                  Choose File
                </Button>
                <Button
                  onClick={startCamera}
                  size="lg"
                  variant="outline"
                  className="gap-2 border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover rounded-lg bg-black"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={capturePhoto}
              size="lg"
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="w-5 h-5" />
              Capture
            </Button>
            <Button
              onClick={stopCamera}
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {preview && !analyzing && (
        <Button
          onClick={() => {
            setPreview(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          variant="outline"
          className="w-full mt-4 border-purple-500 text-purple-400 hover:bg-purple-500/10"
        >
          Upload Different Photo
        </Button>
      )}
    </Card>
  );
}
