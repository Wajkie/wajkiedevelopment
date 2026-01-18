// Journey/Education Timeline types
export interface JourneyEntry {
  id: number;
  title: string;
  description: string;
  date: string;
  period: string;
  images: string[];
  learnings: string[];
  result?: string;
  tags: string[];
  links: Array<{ title: string; url: string }>;
  orderIndex: number;
}

export interface JourneyFormData {
  title: string;
  description: string;
  date: string;
  period: string;
  images: Array<{ path: string }>;
  learnings: Array<{ text: string }>;
  result: string;
  tags: Array<{ name: string }>;
  links: Array<{ title: string; url: string }>;
}
