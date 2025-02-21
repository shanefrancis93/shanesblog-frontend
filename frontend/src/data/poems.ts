// frontend/src/data/poems.ts

export type LLMType = 'claude' | 'gpt' | 'gemini';

export interface PoemAnalysis {
  favorite_lines: string;
  interpretation: string;
  criticism: string;
  emotional_impact: string;
  image_prompt: string;
}

export interface LLMEntry {
  analysis: PoemAnalysis;
  timestamp?: string;
  version?: string;
  image_url?: string | null;
}

export type LLMAnalysis = {
  [K in LLMType]?: LLMEntry;
}

export interface Poem {
  title: string;
  content: string;
  slug: string;
  illustration?: string;
  description?: string;  // Optional description from frontmatter
  notes?: string;
  date?: string;
  llm_analysis?: LLMAnalysis;
}

// This will be populated by the API call
export const poems: Poem[] = [];

export async function fetchPoems(): Promise<Poem[]> {
  try {
    const response = await fetch("/api/poems");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching poems:", error);
    return [];
  }
}
