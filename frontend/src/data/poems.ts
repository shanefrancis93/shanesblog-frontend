// frontend/src/data/poems.ts

export interface PoemAnalysis {
  favoriteLines?: string;
  interpretation?: string;
  literaryDevices?: string;
  challengingAspects?: string;
  emotionalImpact?: string;
}

export interface Poem {
  title: string;
  content: string;
  slug: string;
  illustration?: string;
  notes?: string;
  date?: string;
  analysis?: PoemAnalysis;
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
