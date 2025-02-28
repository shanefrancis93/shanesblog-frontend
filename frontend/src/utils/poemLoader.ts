import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getPoems() {
  const poemsDirectory = path.join(process.cwd(), 'public/poems');
  const filenames = fs.readdirSync(poemsDirectory);

  return filenames.map(filename => {
    const filePath = path.join(poemsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      title: data.title,
      content: content,
      illustration: `/illustrations/${path.parse(filename).name}.jpg`
    };
  });
} 