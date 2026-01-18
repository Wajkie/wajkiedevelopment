import { Skill, Value } from '@/lib/db';

export type BioFormData = {
  name: string;
  tagline: string;
  shortPitch: string;
  aboutParagraphs: { text: string }[];
  contactEmail: string;
  contactGithub: string;
  contactLinkedin: string;
  skillsFrontend: Skill[];
  skillsBackend: Skill[];
  skillsTools: Skill[];
  values: Value[];
};
