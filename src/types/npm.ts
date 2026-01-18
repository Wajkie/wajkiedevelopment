// NPM Package types
export interface NpmPublisher {
  email: string;
  username: string;
}

export interface NpmMaintainer {
  email: string;
  username: string;
}

export interface NpmLinks {
  homepage?: string;
  repository?: string;
  bugs?: string;
  npm: string;
}

export interface NpmPackageInfo {
  name: string;
  keywords: string[];
  version: string;
  description: string;
  sanitized_name: string;
  publisher: NpmPublisher;
  maintainers: NpmMaintainer[];
  license: string;
  date: string;
  links: NpmLinks;
}

export interface NpmDownloads {
  monthly: number;
  weekly: number;
}

export interface NpmScoreDetail {
  popularity: number;
  quality: number;
  maintenance: number;
}

export interface NpmScore {
  final: number;
  detail: NpmScoreDetail;
}

export interface NpmFlags {
  insecure: number;
}

export interface NpmPackageObject {
  downloads: NpmDownloads;
  dependents: number | string;
  updated: string;
  searchScore: number;
  package: NpmPackageInfo;
  score: NpmScore;
  flags: NpmFlags;
}

export interface NpmSearchResponse {
  objects: NpmPackageObject[];
  total: number;
  time: string;
}
