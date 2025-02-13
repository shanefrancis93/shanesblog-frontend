// frontend/src/data/poems.ts

export interface Poem {
    title: string;
    content: string;
    illustration: string;
  }
  
  // This will be populated by the API call
  export const poems: Poem[] = [];
  
  export async function fetchPoems(): Promise<Poem[]> {
    try {
      const response = await fetch('/api/poems');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching poems:', error);
      return [];
    }
  }