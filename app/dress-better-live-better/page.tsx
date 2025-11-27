"use client";

import React, { useState, useRef } from "react";
import { useAuth } from '@/lib/auth-context';
import { analyzeImageColors, calculateColorHarmony, calculateContrast, generateStyleSuggestions, DominantColor } from '@/lib/colorAnalysis';
import { supabase } from '@/lib/supabase';

// (Simple UI components copied from provided snippet to keep page self-contained)
const Button = ({ 
  children, 
  variant = "default", 
  size = "default",
  className = "",
  ...props 
}: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantClasses: Record<string,string> = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-purple-100 text-purple-900 hover:bg-purple-200",
    outline: "border border-indigo-300 bg-transparent hover:bg-indigo-50",
    ghost: "hover:bg-indigo-50 hover:text-indigo-900"
  };
  const sizeClasses: Record<string,string> = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md"
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Input = ({ className = "", placeholder, ariaLabel, id, ...props }: any) => (
  <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} id={id} placeholder={placeholder} aria-label={ariaLabel || placeholder || id} title={ariaLabel || placeholder || id || 'input'} {...props} />
);

const Label = ({ children, className = "", ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>
);

const Textarea = ({ className = "", ...props }: any) => (
  <textarea className={`flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const variantClasses: Record<string,string> = {
    default: "bg-indigo-100 text-indigo-800",
    secondary: "bg-purple-100 text-purple-800",
    outline: "border border-indigo-300 text-indigo-700"
  };
  return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`}>{children}</div>;
};

// small icons
const UserIcon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const UploadIcon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

const StarIcon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const HeartIcon = ({ className, filled }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

const CheckIcon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const PlusIcon = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

// Types
interface UserProfile {
  gender: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  skinType: string;
  bodyType: string;
  stylePreferences: string[];
  recommendationPreferences: string[];
}

interface OutfitAnalysis {
  image: string | null;
  score: number;
  styleCategory: string;
  confidence: number;
  suggestions: string[];
}

interface Recommendation {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  inWishlist: boolean;
}

export function DressBetterLiveBetter({ embed = false }: { embed?: boolean }) {
  const [activeTab, setActiveTab] = useState<"profile" | "upload" | "recommendations">("profile");
  const [profile, setProfile] = useState<UserProfile>({
    gender: "",
    age: null,
    height: null,
    weight: null,
    skinType: "",
    bodyType: "",
    stylePreferences: [],
    recommendationPreferences: []
  });

  const [analysis, setAnalysis] = useState<OutfitAnalysis>({
    image: null,
    score: 0,
    styleCategory: "",
    confidence: 0,
    suggestions: []
  });

  // auth context to attach user_id if available
  const authContext = useAuth();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // camera refs & state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // mock recommendations (same as snippet)
  const mockRecommendations: Recommendation[] = [
    { id: "1", category: "tops", name: "Classic White Shirt", description: "Versatile cotton shirt", price: 29.99, inWishlist: false },
    { id: "2", category: "bottoms", name: "Slim Fit Jeans", description: "Dark wash denim", price: 49.99, inWishlist: false },
    { id: "3", category: "dresses", name: "Summer Midi Dress", description: "Floral print dress", price: 39.99, inWishlist: false },
    { id: "4", category: "jackets", name: "Blazer", description: "Navy blue blazer", price: 89.99, inWishlist: false },
    { id: "5", category: "accessories", name: "Statement Necklace", description: "Gold chain necklace", price: 19.99, inWishlist: false },
    { id: "6", category: "footwear", name: "Sneakers", description: "White leather sneakers", price: 79.99, inWishlist: false },
    { id: "7", category: "fragrance", name: "Eau de Parfum", description: "Citrus floral scent", price: 59.99, inWishlist: false },
    { id: "8", category: "tops", name: "Striped T-Shirt", description: "Cotton blend tee", price: 24.99, inWishlist: false }
  ];

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Saves or upserts profile data into user_profiles table
  const saveProfileToDb = async () => {
    try {
      const payload: any = {
        gender: profile.gender || null,
        age: profile.age || null,
        height: profile.height || null,
        weight: profile.weight || null,
        skin_type: profile.skinType || null,
        body_type: profile.bodyType || null,
        style_preferences: profile.stylePreferences || [],
        recommendation_preferences: profile.recommendationPreferences || [],
        notes: ''
      };

      // If there's a logged-in user, attach user_id and perform upsert
      if (authContext?.user?.id) {
        payload.user_id = authContext.user.id;
        await supabase.from('user_profiles').upsert(payload, { onConflict: 'user_id' });
      } else {
        // Insert a guest profile record (no user_id)
        await supabase.from('user_profiles').insert(payload);
      }
    } catch (err) {
      console.error('Error saving profile', err);
    }
  };

  const toggleStylePreference = (preference: string) => {
    setProfile(prev => {
      const prefs = [...prev.stylePreferences];
      const index = prefs.indexOf(preference);
      if (index > -1) prefs.splice(index, 1);
      else prefs.push(preference);
      return { ...prev, stylePreferences: prefs };
    });
  };

  // helper: upload blob to storage and return public url
  const uploadFileToStorage = async (file: Blob, filename: string) => {
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('outfit-images')
        .upload(filename, file, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('outfit-images').getPublicUrl(uploadData.path);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error', err);
      return null;
    }
  };

  const createOutfitRecord = async (imageUrl: string, colors: DominantColor[], harmony: string, contrast: string, suggestions: string[], score: number) => {
    const outfitData = {
      image_url: imageUrl,
      dominant_colors: colors,
      style_analysis: {
        colorHarmony: harmony,
        contrast: contrast,
        versatility: 'medium',
        seasonality: 'all-season'
      },
      suggestions: suggestions.join('\n'),
      overall_score: score,
      is_favorite: false
    };

    try {
      await supabase.from('outfit_analyses').insert([outfitData]);
    } catch (err) {
      console.error('Error inserting outfit record', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;

        // create a blob from data url for upload
        const res = await fetch(dataUrl);
        const blob = await res.blob();

        const filename = `capture_${Date.now()}.jpg`;
        const imageUrl = await uploadFileToStorage(blob, filename);

        const generatedScore = Math.floor(Math.random() * 40) + 60;

          // analyze the image data and create real analysis
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const colors = analyzeImageColors(imageData);
            const harmony = calculateColorHarmony(colors);
            const contrast = calculateContrast(colors);
            const suggestionsArr = generateStyleSuggestions(colors, harmony, contrast).split('.').filter(Boolean).map(s => s.trim());

            const calculateScore = (harmony: string, contrast: string, colors: DominantColor[]): number => {
              let score = 5;
              if (harmony === 'complementary' || harmony === 'analogous') score += 2;
              if (harmony === 'triadic') score += 1;
              if (contrast === 'medium') score += 2;
              if (contrast === 'high') score += 1;
              if (colors.length >= 2 && colors.length <= 4) score += 1;
              return Math.min(10, Math.max(1, score));
            };

            const score = calculateScore(harmony, contrast, colors);

            setAnalysis({
              image: dataUrl,
              score,
              styleCategory: ["Casual", "Formal", "Business", "Streetwear"][Math.floor(Math.random() * 4)],
              confidence: Math.floor(Math.random() * 30) + 70,
              suggestions: suggestionsArr
            });

            // Save record to DB pointing to stored image URL (if upload succeeded)
            if (imageUrl) {
              createOutfitRecord(imageUrl, colors, harmony, contrast, suggestionsArr, score);
            }
          };
          img.src = dataUrl;

        setRecommendations(mockRecommendations);
        setActiveTab("recommendations");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]); };

  const toggleWishlist = (id: string) => setRecommendations(prev => prev.map(item => item.id === id ? { ...item, inWishlist: !item.inWishlist } : item));

  const isProfileComplete = () => profile.gender && profile.age && profile.height && profile.weight && profile.skinType && profile.bodyType && profile.stylePreferences.length > 0;

  // Camera functions
  const startCamera = async () => {
    try {
      // Use front camera on laptops (user) so clicking "Use Camera" opens the built-in webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error', err);
      alert('Unable to access camera — please check permissions.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const filename = `capture_${Date.now()}.jpg`;
      const storedUrl = await uploadFileToStorage(blob, filename);

      const generatedScore = Math.floor(Math.random() * 40) + 60;

      setAnalysis(prev => ({ ...prev, image: dataUrl, score: generatedScore, styleCategory: 'Captured' }));

      if (storedUrl) {
        // analyze captured image before saving
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          const canvas2 = document.createElement('canvas');
          canvas2.width = img.width;
          canvas2.height = img.height;
          const ctx2 = canvas2.getContext('2d');
          if (!ctx2) return;
          ctx2.drawImage(img, 0, 0);
          const imageData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

          const colors = analyzeImageColors(imageData2);
          const harmony = calculateColorHarmony(colors);
          const contrast = calculateContrast(colors);
          const suggestionsArr = generateStyleSuggestions(colors, harmony, contrast).split('.').filter(Boolean).map(s => s.trim());

          const calculateScore = (harmony: string, contrast: string, colors: DominantColor[]): number => {
            let score = 5;
            if (harmony === 'complementary' || harmony === 'analogous') score += 2;
            if (harmony === 'triadic') score += 1;
            if (contrast === 'medium') score += 2;
            if (contrast === 'high') score += 1;
            if (colors.length >= 2 && colors.length <= 4) score += 1;
            return Math.min(10, Math.max(1, score));
          };

          const score = calculateScore(harmony, contrast, colors);

          // update UI with analysis
          setAnalysis(prev => ({ ...prev, image: dataUrl, score, styleCategory: 'Captured', confidence: Math.floor(Math.random() * 30) + 70, suggestions: suggestionsArr }));

          // save DB record
          await createOutfitRecord(storedUrl, colors, harmony, contrast, suggestionsArr, score);
        };
        img.src = dataUrl;
      }

      setRecommendations(mockRecommendations);
      setActiveTab('recommendations');
    } catch (err) {
      console.error('Capture/upload failed', err);
    } finally {
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const innerContent = (
    <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">AI Out Fit Checker </h1>
          <p className="text-indigo-700 mt-2">Personalized outfit advisor for your best look</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Button variant={activeTab === "profile" ? "default" : "outline"} onClick={() => setActiveTab("profile")} className="flex items-center gap-2"><UserIcon className="w-4 h-4"/>Profile</Button>
          <Button variant={activeTab === "upload" ? "default" : "outline"} onClick={() => setActiveTab("upload")} disabled={!isProfileComplete()} className="flex items-center gap-2"><UploadIcon className="w-4 h-4"/>Upload Outfit</Button>
          <Button variant={activeTab === "recommendations" ? "default" : "outline"} onClick={() => setActiveTab("recommendations")} disabled={!analysis.image} className="flex items-center gap-2"><StarIcon className="w-4 h-4"/>Recommendations</Button>
        </div>

        {activeTab === 'profile' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5"/>Your Style Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select id="gender" aria-label="Select gender" title="Select gender" value={profile.gender} onChange={(e)=>handleProfileChange('gender', e.target.value)} className="w-full h-10 rounded-md border px-3">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" value={profile.age||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleProfileChange('age', e.target.value?parseInt(e.target.value):null)} placeholder="25" />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" value={profile.height||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleProfileChange('height', e.target.value?parseInt(e.target.value):null)} placeholder="170" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" value={profile.weight||''} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleProfileChange('weight', e.target.value?parseInt(e.target.value):null)} placeholder="65" />
                  </div>
                  <div>
                    <Label htmlFor="skinType">Skin Type</Label>
                    <select id="skinType" aria-label="Select skin type" title="Select skin type" value={profile.skinType} onChange={(e)=>handleProfileChange('skinType', e.target.value)} className="w-full h-10 rounded-md border px-3">
                      <option value="">Select skin type</option>
                      <option value="fair">Fair</option>
                      <option value="medium">Medium</option>
                      <option value="olive">Olive</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="bodyType">Body Type</Label>
                    <select id="bodyType" aria-label="Select body type" title="Select body type" value={profile.bodyType} onChange={(e)=>handleProfileChange('bodyType', e.target.value)} className="w-full h-10 rounded-md border px-3">
                      <option value="">Select body type</option>
                      <option value="hourglass">Hourglass</option>
                      <option value="pear">Pear</option>
                      <option value="apple">Apple</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="invertedTriangle">Inverted Triangle</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Style Preferences</h3>
                  <div>
                    <Label className="mb-2 block">Preferred Styles</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Casual','Formal','Business','Streetwear','Bohemian','Minimalist'].map(s=> (
                        <Button key={s} variant={profile.stylePreferences.includes(s)?'default':'outline'} onClick={()=>toggleStylePreference(s)} className="h-10">{s}</Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Recommendation Preferences</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <input id="budget" type="radio" name="rec" aria-label="Budget-friendly options" title="Budget-friendly options" checked={profile.recommendationPreferences[0]==='budget'} onChange={()=>handleProfileChange('recommendationPreferences',['budget'])} />
                        <Label htmlFor="budget">Budget-friendly options</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input id="premium" type="radio" name="rec" aria-label="Premium quality" title="Premium quality" checked={profile.recommendationPreferences[0]==='premium'} onChange={()=>handleProfileChange('recommendationPreferences',['premium'])} />
                        <Label htmlFor="premium">Premium quality</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input id="sustainable" type="radio" name="rec" aria-label="Sustainable brands" title="Sustainable brands" checked={profile.recommendationPreferences[0]==='sustainable'} onChange={()=>handleProfileChange('recommendationPreferences',['sustainable'])} />
                        <Label htmlFor="sustainable">Sustainable brands</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" placeholder="Any specific style goals or concerns?" className="h-24" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={async () => { await saveProfileToDb(); setActiveTab('upload'); }} disabled={!isProfileComplete()} className="flex items-center gap-2"><UploadIcon className="w-4 h-4"/>Upload Outfit</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'upload' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UploadIcon className="w-5 h-5"/>Upload Your Outfit</CardTitle>
            </CardHeader>
            <CardContent>
              {!cameraActive ? (
                <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={()=>fileInputRef.current?.click()}>
                  <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-lg font-medium">Drag & drop your outfit image here</p>
                  <p className="text-gray-500 mt-2">or click to browse files</p>
                  <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button variant="secondary" onClick={()=> fileInputRef.current?.click()}>Select Image</Button>
                    <Button variant="outline" onClick={startCamera}>Use Camera</Button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" aria-label="Upload outfit image" onChange={handleFileInputChange} />
                </div>
              ) : (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover rounded-lg bg-black" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <Button onClick={capturePhoto} className="bg-indigo-600 hover:bg-indigo-700">Capture</Button>
                    <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                  </div>
                </div>
              )}

              {analysis.image && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="flex justify-center">
                    <img src={analysis.image} alt="Uploaded outfit" className="max-h-96 rounded-lg shadow-md" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analysis.image && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Outfit Analysis</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Outfit Image</div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Style Score</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3"/>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray={`${analysis.score}, 100`} />
                          <text x="18" y="20.5" textAnchor="middle" fill="#4f46e5" fontSize="8" fontWeight="bold">{analysis.score}%</text>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Style Category</p>
                        <Badge variant="secondary" className="text-base">{analysis.styleCategory}</Badge>
                        <p className="mt-2 text-sm text-gray-600">Confidence</p>
                        <Badge variant="outline">{analysis.confidence}%</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
                    <ul className="mt-2 space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={()=> setActiveTab('recommendations')} className="flex items-center gap-2"><StarIcon className="w-4 h-4"/>View Recommendations</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">Personalized Recommendations</h2>
              <div className="text-sm text-gray-600">Based on your profile and outfit analysis</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Product Image</div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <Badge variant="outline">${item.price.toFixed(2)}</Badge>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Button variant="ghost" size="sm" onClick={()=> toggleWishlist(item.id)} className={item.inWishlist? 'text-red-500 hover:text-red-600': ''}>
                        <HeartIcon className={`w-5 h-5 ${item.inWishlist? 'fill-current': ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="flex items-center gap-2 mx-auto" onClick={()=> setRecommendations(prev => prev.map(item => ({...item, inWishlist: false})))}>
                <PlusIcon className="w-4 h-4"/> Add All to Wishlist
              </Button>
            </div>
          </div>
        )}
    </div>
  );

  if (embed) {
    // when embedded inside dashboard — provide only the inner content (no page-level wrapper)
    return innerContent;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-8">
      {innerContent}
    </div>
  );
}

// also keep default export for page routing compatibility
export default DressBetterLiveBetter;
