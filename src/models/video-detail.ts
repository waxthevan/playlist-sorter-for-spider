export interface VideoDetail {
  kind: string;
  etag: string;
  items: VideoItem[];
  pageInfo: PageInfo;
}

export interface VideoItem {
  kind: string;
  etag: string;
  id: string;
  statistics: VideoStatistics;
}

export interface VideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
