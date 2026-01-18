// Blog post types
export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  slug?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}
