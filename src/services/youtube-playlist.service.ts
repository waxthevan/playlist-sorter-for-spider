import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VideoDetail } from "../models/video-detail";
import { YouTubePlaylistItemListResponse } from "../models/playlist-item";

@Injectable({
  providedIn: "root",
})
export class YoutubePlaylistService {
  constructor(private http: HttpClient) {}

  getPlaylistItems(playlistId: string, nextPageToken: any): Observable<YouTubePlaylistItemListResponse> {
    return this.http.get<YouTubePlaylistItemListResponse>(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: "snippet, contentDetails",
        maxResults: "100",
        playlistId: playlistId,
        key: "AIzaSyB5lJo_C2IbIl0fPfH-JqSuWUdc0NBxrmg",
        pageToken: nextPageToken ? nextPageToken : "",
      },
    });
  }

  getVideoDetails(videoId: string): Observable<VideoDetail> {
    return this.http.get<VideoDetail>(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: "statistics",
        id: videoId,
        key: "AIzaSyB5lJo_C2IbIl0fPfH-JqSuWUdc0NBxrmg",
      },
    });
  }
}
