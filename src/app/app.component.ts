import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { YoutubePlaylistService } from "../services/youtube-playlist.service";
import { lastValueFrom } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SkeletonModule } from "primeng/skeleton";
import { AgoPipe } from "../pipes/ago.pipe";
import { VideoItem } from "../models/playlist-item";
import { ProgressSpinnerModule } from 'primeng/progressspinner';

type Video = {
  contentDetailVideoId: string;
  snippetResourceIdVideoId: string;
  thumbnailUrl: string;
  url: string;
  title: string;
  viewCount: number;
  publishedAt: string;
};

@Component({
  selector: "app-root",
  imports: [ButtonModule, SkeletonModule, AgoPipe, ProgressSpinnerModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  private youtubePlaylistService = inject(YoutubePlaylistService);
  private sanitizer = inject(DomSanitizer);
  private selectedVideoUrl: string | null = null;
  public trustedUrl: SafeResourceUrl | null = null;
  public loading: WritableSignal<boolean> = signal(false);
  public videos = signal<Array<Video>>([]);
  nextPageToken: any;
  playListId: string = "";
  previousToken: any;
  previousPageToken: any;
  maxCount: number = 0;

  public async getAndLoadPlaylist() {
    navigator.clipboard
      .readText()
      .then(async (text) => {
        const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
        const match = text.match(regex);
        const playlistId = match ? match[1] : null;
        if (!playlistId) {
          console.error("No playlist ID found in the URL");
          return;
        } else {
          await this.loadPlaylistItems(playlistId);
        }
      })
      .catch((err) => {
        console.error("Failed to read clipboard contents: ", err);
      });
  }

  private async loadPlaylistItems(playlistId: string, pageToken: string = "") {
    this.loading.set(true);
    this.playListId = playlistId;
    let playlist = await lastValueFrom(this.youtubePlaylistService.getPlaylistItems(playlistId, pageToken));
    this.maxCount = playlist.pageInfo.totalResults;
    let videos: Video[] = [];
    for (let item of playlist.items) {
      const videoDetails = await lastValueFrom(this.youtubePlaylistService.getVideoDetails(item.contentDetails.videoId));
      const videoCount = videoDetails.items[0]?.statistics?.viewCount || "0";
      videos.push(this.mapToVideo(item, videoCount));
    }

    videos = videos.sort((a, b) => a.viewCount - b.viewCount);

    this.previousPageToken = playlist.prevPageToken;
    this.nextPageToken = playlist.nextPageToken;
    this.selectedVideoUrl = "https://www.youtube.com/embed/" + playlist.items[0].snippet.resourceId.videoId;
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideoUrl);
    this.videos.set(videos);
    this.loading.set(false);
  }

  private mapToVideo(item: VideoItem, videoCount: string): Video {
    return {
      contentDetailVideoId: item.contentDetails.videoId,
      snippetResourceIdVideoId: item.snippet.resourceId.videoId,
      thumbnailUrl: item.snippet.thumbnails.standard?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
      url: "https://www.youtube.com/embed/" + item.snippet.resourceId.videoId + "?autoplay=1",
      title: item.snippet.title,
      viewCount: parseInt(videoCount, 10),
      publishedAt: item.contentDetails.videoPublishedAt,
    };
  }

  public loadNextPage() {
    if (this.nextPageToken) {
      this.loadPlaylistItems(this.playListId, this.nextPageToken);
    }
  }

  public loadPreviousPage() {
    if (this.previousPageToken) {
      this.loadPlaylistItems(this.playListId, this.previousPageToken);
    }
  }

  public playVideoAndCopyVideo(video: Video) {
    this.selectedVideoUrl = video.url;
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideoUrl);
    navigator.clipboard.writeText(video.title);
  }

  public searchVideo(title: string) {
    // open a new tab and search for the title on google
    const url = `https://www.google.com/search?q=${encodeURIComponent(title)}`;
    window.open(url, "_blank");
  }
}
