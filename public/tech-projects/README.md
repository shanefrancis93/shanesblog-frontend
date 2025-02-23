# Tech Projects Directory

This directory contains the markdown files and assets for technical project writeups.

## Directory Structure
```
tech-projects/
├── projects/           # Markdown files for each project
│   ├── poetry-llm/
│   │   ├── index.md   # Main project content
│   │   ├── demo.mp4   # Project demo video
│   │   └── images/    # Project-specific images
│   └── blog-platform/
│       ├── index.md
│       └── images/
├── assets/            # Shared assets
│   ├── icons/        # Tech stack icons
│   └── images/       # Shared images
└── README.md         # This file
```

## Frontmatter Schema
Each project markdown file should include the following frontmatter:

```yaml
---
title: "Project Title"
status: "In Development | Live | Completed"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
techStack: 
  - name: "Technology Name"
    icon: "/tech-projects/assets/icons/tech.svg"
highlights:
  - title: "Highlight Title"
    description: "Brief description"
demo:
  type: "video | image | interactive"
  url: "/tech-projects/projects/project-name/demo.mp4"
github: "https://github.com/username/repo"
---
```
