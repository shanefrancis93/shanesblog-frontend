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
  }, [poem.slug]);

  if (!poem.illustration || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-400">No illustration available</span>
      </div>
    );
  }

  return (
    <DynamicImageBackground imageSrc={poem.illustration}>
      <div className="w-full h-full flex items-start justify-center p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
          </div>
        )}
        <div className="relative w-full h-full">
          <Image
            src={poem.illustration}
            alt={`Illustration for ${poem.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={`
              object-contain object-top transition-all duration-300 z-10
              ${isLoading ? "opacity-0" : "opacity-100"}
              ${isChanging ? "opacity-0" : "opacity-100"}
            `}
            onLoad={() => setIsLoading(false)}
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    </DynamicImageBackground>
  );
};
