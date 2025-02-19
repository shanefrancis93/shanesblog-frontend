import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const poemsDirectory = path.join(process.cwd(), "public", "poems", "Poems");

    if (!fs.existsSync(poemsDirectory)) {
      console.error("Directory not found:", poemsDirectory);
      return NextResponse.json(
        { error: "Poems directory not found" },
        { status: 404 }
      );
    }

    const filenames = fs
      .readdirSync(poemsDirectory)
      .filter((filename) => filename.endsWith(".md"));

    const poems = filenames
      .map((filename) => {
        try {
          const filePath = path.join(poemsDirectory, filename);
          const fileContents = fs.readFileSync(filePath, "utf8");

          // Use gray-matter with default values
          const { data = {}, content = "" } = matter(fileContents);

          // If no frontmatter or published is not explicitly true, skip this poem
          if (!data.published) {
            return null;
          }

          const slug = path.parse(filename).name;

          return {
            title: data.title || slug.replace(/-/g, " "),
            content: content.trim(),
            slug: slug,
            description: data.description || "",
            illustration: data.illustration || `/images/poems/${slug}.webp`,
            notes: data.notes || "",
            date: data.date || new Date().toISOString().split("T")[0], // Default to current date if none provided
            llm_analysis: data.llm_analysis || null,
          };
        } catch (error: any) {
          // Just skip any files that can't be processed
          console.log(`Skipping ${filename}: ${error.message}`);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    // Sort by date if available
    poems.sort(
      (a, b) =>
        Number(new Date((b as any).date)) - Number(new Date((a as any).date))
    );

    console.log(`Successfully loaded ${poems.length} published poems`);
    return NextResponse.json(poems);
  } catch (error: any) {
    console.error("Error in poems API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
