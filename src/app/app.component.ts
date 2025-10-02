import { Component, inject, signal, WritableSignal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { YoutubePlaylistService } from "../services/youtube-playlist.service";
import { VideoItem } from "../models/playlist-item";
import { lastValueFrom } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { SkeletonModule } from "primeng/skeleton";
import { AgoPipe } from "../pipes/ago.pipe";
import { ViewCountPipe } from "../pipes/view-count.pipe";
import { AsyncPipe } from "@angular/common";
@Component({
  selector: "app-root",
  imports: [ButtonModule, SkeletonModule, AgoPipe, ViewCountPipe, AsyncPipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  private youtubePlaylistService = inject(YoutubePlaylistService);
  private sanitizer = inject(DomSanitizer);
  private selectedVideoUrl: string | null = null;
  public trustedUrl: SafeResourceUrl | null = null;
  public loading: WritableSignal<boolean> = signal(false);
  public videos = signal<Array<VideoItem>>([]);
  nextPageToken: any;
  playListId: string = "";
  previousToken: any;
  previousPageToken: any;

  public async getAndLoadPlaylist() {
    navigator.clipboard
      .readText()
      .then(async (text) => {
        const playlistId = text.split("list=")[1];
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
    this.playListId = playlistId;
    this.previousToken = pageToken;
    const playlist = await lastValueFrom(this.youtubePlaylistService.getPlaylistItems(playlistId, pageToken));
    this.nextPageToken = playlist.nextPageToken;
    this.selectedVideoUrl = "https://www.youtube.com/embed/" + playlist.items[0].snippet.resourceId.videoId;
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideoUrl);
    this.videos.set(playlist.items);
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

  public playVideoAndCopyVideo(video : VideoItem) {
    this.selectedVideoUrl = "https://www.youtube.com/embed/" + video.snippet.resourceId.videoId + "?autoplay=1";
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideoUrl);
    navigator.clipboard.writeText(video.snippet.title);
  }
}
