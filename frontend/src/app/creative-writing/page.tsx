"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Clipboard, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import { type Poem, fetchPoems } from "../../data/poems";
import { PoemIllustration } from "./PoemIllustration";
import { PoemAIGallery } from "./PoemAIGallery";
import { PoemNavigation } from "./PoemNavigation";
import PoemAnalysisOverlay from "./PoemAnalysisOverlay";
import Collapsible from "../../components/Collapsible";
import Image from 'next/image';

const CreativeWritingPage = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showAIGallery, setShowAIGallery] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
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
    await new Promise(resolve => setTimeout(resolve, 300));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          <p>
            The best thing you can do for yourself as a writer (and don't get it twisted, that's a burden none of us can escape in the age of texting, emailing and prompting) is to learn to differentiate yourself from the machines.
          </p>
          <p>
            This is a space for my own catharis, my personal expression and a reminder to keep writing and keep creating.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Left column with poem content */}
          <Collapsible title="Poem Gallery" defaultOpen={true}>
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <PoemNavigation
                  poems={poems}
                  currentIndex={currentPoemIndex}
                  onNavigate={handlePoemChange}
                  isChanging={isChanging}
                />
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

              {/* Book Container */}
              <div className="mt-4 flex flex-col bg-cream dark:bg-[#112240] rounded-lg shadow-2xl min-h-[800px] border border-gray-200 dark:border-transparent relative overflow-hidden">
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
                <div className="flex flex-1">
                  {/* Left Page (Poem) */}
                  <div className="flex-1 p-4 sm:p-6 md:p-8 border-r border-gray-300 dark:border-gray-600 font-sans text-base sm:text-lg md:text-xl leading-relaxed relative text-black dark:text-gray-100">
                    <div className="max-w-prose mx-auto h-full flex flex-col relative">
                      <div className="flex justify-between items-start mb-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-gray-100">
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
                        className={`whitespace-pre-wrap transition-opacity duration-300 text-black dark:text-gray-100 text-base sm:text-lg md:text-xl ${
                          isChanging ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        {currentPoem?.content}
                      </div>
                    </div>
                  </div>

                  {/* Right Page (Image) */}
                  <div className="flex-1 relative">
                    {showAIGallery ? (
                      <PoemAIGallery poem={currentPoem} isChanging={isChanging} />
                    ) : (
                      <PoemIllustration poem={currentPoem} isChanging={isChanging} />
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
            </div>
          </Collapsible>
        </div>
      </div>
    </Layout>
  );
};

export default CreativeWritingPage;
