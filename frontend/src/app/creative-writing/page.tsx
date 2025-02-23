"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Clipboard, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import { type Poem, fetchPoems } from "../../data/poems";
import { PoemIllustration } from "./PoemIllustration";
import { PoemAIGallery } from "./PoemAIGallery";
import { PoemNavigation } from "./PoemNavigation";
import { BottomPoemNavigation } from "./BottomPoemNavigation";
import PoemAnalysisOverlay from "./PoemAnalysisOverlay";
import Collapsible from "../../components/Collapsible";
import Image from 'next/image';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

const CreativeWritingPage = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showAIGallery, setShowAIGallery] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const { isMobile, isTablet } = useDeviceDetect();
  const currentPoem = poems[currentPoemIndex];

  useEffect(() => {
    const loadPoems = async () => {
      setIsLoading(true);
      try {
        const fetchedPoems = await fetchPoems();
        console.log('Fetched poems:', fetchedPoems); // Debug log
        setPoems(fetchedPoems);
        
        // Check URL for poem selection
        const urlParams = new URLSearchParams(window.location.search);
        const poemSlug = urlParams.get('poem');
        if (poemSlug) {
          const poemIndex = fetchedPoems.findIndex(p => p.slug === poemSlug);
          if (poemIndex >= 0) {
            setCurrentPoemIndex(poemIndex);
          }
        }
      } catch (error) {
        console.error("Error loading poems:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoems();
  }, []);

  useEffect(() => {
    if (currentPoem) {
      console.log('Current poem:', currentPoem); // Debug log
      console.log('LLM Analysis:', currentPoem.llm_analysis); // Debug log
    }
  }, [currentPoem]);

  const copyToClipboard = () => {
    if (!currentPoem) return;
    const textToCopy = `${currentPoem.title}\nby Shane Farrow\n\n${currentPoem.content}`;
    navigator.clipboard.writeText(textToCopy);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handlePoemChange = async (newIndex: number) => {
    if (newIndex < 0 || newIndex >= poems.length) return;
    setIsChanging(true);
    setCurrentPoemIndex(newIndex);
    
    // Wait for the fade transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Scroll to show the poem container
    const poemContainer = document.querySelector('.poem-container');
    if (poemContainer) {
      const headerOffset = isMobile ? 150 : 80; // Larger offset for mobile to show poem selector
      const elementPosition = poemContainer.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsChanging(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="relative max-w-3xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-theme-light-primary dark:border-theme-dark-primary"></div>
          <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-theme-light-primary dark:border-theme-dark-primary"></div>
          
          {/* Quote container */}
          <div className="relative px-6 py-8 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm
            rounded-lg shadow-sm border border-gray-200/20 dark:border-gray-700/20">
            
            {/* Decorative quotes */}
            <span className="absolute top-0 left-0 transform -translate-y-1/2 -translate-x-1/2
              text-4xl text-theme-light-primary dark:text-theme-dark-primary font-serif">❝</span>
            <span className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2
              text-4xl text-theme-light-primary dark:text-theme-dark-primary font-serif">❞</span>
            
            {/* Quote text */}
            <p className="text-center font-serif text-lg md:text-xl italic
              text-theme-light-text dark:text-theme-dark-text">
              Keep making, it doesn't matter if it's not good, just keep going.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative mb-16">
        {/* Left column with poem content */}
        <div className="flex-1">
          <Collapsible 
            title="Poem Gallery" 
            defaultOpen={true} // Always start open
          >
            {(isOpen) => (
              <>
                {/* Book Container */}
                <div className={`mt-4 flex flex-col bg-cream dark:bg-[#112240] rounded-lg shadow-2xl min-h-[800px] border border-gray-200 dark:border-transparent relative overflow-hidden poem-container ${
                  isMobile ? 'flex-col' : 'flex-row'
                }`}>
                  {/* Poem Selection Dropdown */}
                  <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">
                    <select
                      value={currentPoemIndex}
                      onChange={(e) => {
                        const newIndex = Number(e.target.value);
                        if (!isNaN(newIndex) && newIndex >= 0 && newIndex < poems.length) {
                          setIsChanging(true);
                          setCurrentPoemIndex(newIndex);
                          // Update URL to reflect the selected poem
                          const selectedPoem = poems[newIndex];
                          if (selectedPoem) {
                            window.history.pushState(
                              { poemIndex: newIndex },
                              selectedPoem.title,
                              `/creative-writing?poem=${selectedPoem.slug}`
                            );
                          }
                          setTimeout(() => setIsChanging(false), 300);
                        }
                      }}
                      className="w-64 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {poems.map((poem, index) => (
                        <option key={poem.slug} value={index}>
                          {poem.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Content Container */}
                  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} flex-1`}>
                    {/* Left Page (Poem) */}
                    <div className={`${isMobile ? 'border-b' : 'border-r'} border-gray-300 dark:border-gray-600 flex-1 p-4 sm:p-6 md:p-8 font-sans text-base sm:text-lg md:text-xl leading-relaxed relative text-black dark:text-gray-100`}>
                      <div className="max-w-prose mx-auto h-full flex flex-col relative">
                        <div className="flex justify-between items-start mb-6">
                          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-serif font-bold text-gray-900 dark:text-gray-100`}>
                            {currentPoem?.title}
                          </h1>
                          <button
                            onClick={copyToClipboard}
                            className={`p-2 rounded-full transition-colors ${
                              showCopyFeedback
                                ? "bg-green-200 dark:bg-green-800"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                            title="Copy poem to clipboard"
                          >
                            {showCopyFeedback ? (
                              <>
                                <Check className="w-5 h-5" />
                                <span className="absolute -bottom-8 right-0 text-sm bg-gray-800 text-white px-2 py-1 rounded">
                                  Poem copied
                                </span>
                              </>
                            ) : (
                              <Clipboard className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div 
                          id="poem-content"
                          className="prose dark:prose-invert max-w-none"
                        >
                          <div
                            className={`whitespace-pre-wrap transition-opacity duration-300 text-black dark:text-gray-100 ${
                              isMobile ? 'text-base' : 'text-base sm:text-lg md:text-xl'
                            } ${
                              isChanging ? "opacity-0" : "opacity-100"
                            }`}
                          >
                            {currentPoem?.content}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Page (Image and Navigation) */}
                    <div className={`flex-1 relative flex flex-col ${isMobile ? 'pt-2' : 'pt-4'}`}>
                      {/* Description Box */}
                      {currentPoem?.description && (
                        <div className={`backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-y border-gray-200 dark:border-gray-700 ${
                          isMobile ? 'text-sm' : 'text-base'
                        }`}>
                          <p className="px-4 sm:px-6 py-3 sm:py-4 text-gray-700 dark:text-gray-300 italic">
                            {currentPoem.description}
                          </p>
                        </div>
                      )}

                      <div className="flex-1 min-h-[500px] md:min-h-[600px]">
                        {showAIGallery ? (
                          <PoemAIGallery poem={currentPoem} isChanging={isChanging} />
                        ) : (
                          <PoemIllustration poem={currentPoem} isChanging={isChanging} />
                        )}
                      </div>
                      
                      {/* Navigation arrows beneath the illustration */}
                      {isOpen && (
                        <div className="w-full">
                          <BottomPoemNavigation
                            poems={poems}
                            currentIndex={currentPoemIndex}
                            onNavigate={handlePoemChange}
                            isChanging={isChanging}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section */}
                {showAIAnalysis && currentPoem && (
                  <PoemAnalysisOverlay 
                    poem={currentPoem} 
                    onClose={() => setShowAIAnalysis(false)} 
                  />
                )}
              </>
            )}
          </Collapsible>
        </div>

        {/* Controls for AI features */}
        <div className="flex justify-end gap-2">
          {currentPoem?.llm_analysis && Object.keys(currentPoem.llm_analysis).length > 0 && (
            <>
              <button
                onClick={() => setShowAIGallery(!showAIGallery)}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                  showAIGallery 
                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100' 
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                {showAIGallery ? (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Show Illustration</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Show AI Gallery</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  showAIAnalysis 
                  ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100' 
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                AI Analysis
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreativeWritingPage;
