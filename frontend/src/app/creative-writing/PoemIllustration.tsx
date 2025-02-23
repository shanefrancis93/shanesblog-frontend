"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Poem } from "@/data/poems";
import { DynamicImageBackground } from "./DynamicImageBackground";

interface PoemIllustrationProps {
  poem: Poem;
  isChanging?: boolean;
}

export const PoemIllustration: React.FC<PoemIllustrationProps> = ({
  poem,
  isChanging = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
    // Debug logging
    console.log("PoemIllustration received poem:", {
      title: poem.title,
      slug: poem.slug,
      prompt: poem.prompt,
      model: poem.model
    });
  }, [poem]);

  if (!poem.illustration || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-400">No illustration available</span>
      </div>
    );
  }

  return (
    <DynamicImageBackground imageSrc={`/images/poems/${poem.slug}.webp`}>
      <div className="w-full h-full flex items-center justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
          </div>
        )}
        <div className="relative w-full h-full flex flex-col items-center">
          <div className="relative w-full h-[500px] md:h-[600px]">
            <Image
              src={`/images/poems/${poem.slug}.webp`}
              alt={`Illustration for ${poem.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className={`
                object-contain object-center transition-all duration-300 z-10
                ${isLoading ? "opacity-0" : "opacity-100"}
                ${isChanging ? "opacity-0" : "opacity-100"}
              `}
              onLoad={() => setIsLoading(false)}
              onError={() => setImageError(true)}
            />
          </div>

          {/* Attribution Card */}
          <div className="w-full p-4">
            <div 
              className="
                group relative mx-auto max-w-md 
                bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm 
                hover:bg-white/20 dark:hover:bg-gray-900/20
                rounded-lg transition-all duration-300 ease-in-out
                border border-white/10 dark:border-gray-800/10
              "
            >
              <div className="
                p-3 text-sm text-gray-700 dark:text-gray-300
                transform transition-all duration-300 ease-in-out
                group-hover:text-gray-900 dark:group-hover:text-gray-100
              ">
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wider opacity-75">Prompt</span>
                    <span className="italic font-light">{poem.prompt || 'No prompt available'}</span>
                  </div>
                  <div className="text-xs opacity-75">
                    Generated with <span className="font-medium">{poem.model || 'Unknown model'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DynamicImageBackground>
  );
};
