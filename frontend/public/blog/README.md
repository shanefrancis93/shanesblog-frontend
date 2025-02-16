# Blog Posts Directory

This directory contains markdown files and assets for blog posts.

## Directory Structure
```
blog/
├── posts/            # Blog post markdown files
│   ├── 2024/        # Organized by year
│   │   ├── 01/      # Then by month
│   │   └── 02/
│   └── 2025/
├── assets/          # Shared blog assets
│   ├── images/      # Shared images
│   └── attachments/ # PDFs, downloads, etc.
└── README.md        # This file
```

## Frontmatter Schema
Each blog post should include the following frontmatter:

```yaml
---
title: "Blog Post Title"
date: "YYYY-MM-DD"
author: "Your Name"
tags: ["tag1", "tag2"]
excerpt: "Brief description of the post"
coverImage: "/blog/assets/images/cover.jpg"  # Optional
published: true
---
```
