'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera, Sparkles, History } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">AI Outfit Checker</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Button asChild variant="secondary">
              <Link href="/auth/register">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Perfect Your Style with{' '}
              <span className="text-purple-400">AI-Powered</span> Fashion Analysis
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Upload your outfits and get instant feedback on color coordination,
              style matching, and personalized recommendations.
            </p>
            <div className="space-x-4">
              <Button 
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href="/auth/register">
                  Start Free Analysis
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
              >
                <Link href="#features">
                  See Features
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            id="features"
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <Camera className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Quick Analysis
              </h3>
              <p className="text-gray-300">
                Upload your outfit and get instant feedback on colors and style
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <Sparkles className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Style Tips
              </h3>
              <p className="text-gray-300">
                Get personalized recommendations to enhance your outfits
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <History className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-300">
                Keep a history of your outfits and see your style evolution
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-20 bg-gray-800/50 p-8 rounded-xl border border-purple-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
            <div className="space-y-4 text-left max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Upload Your Outfit</h3>
                  <p className="text-gray-300">Take a photo or upload an existing image of your outfit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Get AI Analysis</h3>
                  <p className="text-gray-300">Our AI analyzes colors, patterns, and style composition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Receive Recommendations</h3>
                  <p className="text-gray-300">Get personalized tips to improve your outfit</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AI Outfit Checker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">AI Outfit Checker</span>
          </div>
          <div className="space-x-4">
            <Link 
              href="/auth/login"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Button asChild variant="secondary">
              <Link href="/auth/register">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Perfect Your Style with{' '}
              <span className="text-purple-400">AI-Powered</span> Fashion Analysis
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Upload your outfits and get instant feedback on color coordination,
              style matching, and personalized recommendations.
            </p>
            <div className="space-x-4">
              <Button 
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href="/auth/register">
                  Start Free Analysis
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="text-purple-400 border-purple-400 hover:bg-purple-400/10"
              >
                <Link href="#features">
                  See Features
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            id="features"
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <Camera className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Quick Analysis
              </h3>
              <p className="text-gray-300">
                Upload your outfit and get instant feedback on colors and style
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <Sparkles className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Style Tips
              </h3>
              <p className="text-gray-300">
                Get personalized recommendations to enhance your outfits
              </p>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <History className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Track Progress
              </h3>
              <p className="text-gray-300">
                Keep a history of your outfits and see your style evolution
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-20 bg-gray-800/50 p-8 rounded-xl border border-purple-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
            <div className="space-y-4 text-left max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Upload Your Outfit</h3>
                  <p className="text-gray-300">Take a photo or upload an existing image of your outfit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Get AI Analysis</h3>
                  <p className="text-gray-300">Our AI analyzes colors, patterns, and style composition</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-400/20 rounded-full p-2">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Receive Recommendations</h3>
                  <p className="text-gray-300">Get personalized tips to improve your outfit</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="mt-20 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} AI Outfit Checker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
