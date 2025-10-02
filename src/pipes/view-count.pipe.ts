import { inject, Pipe, PipeTransform } from "@angular/core";
import { YoutubePlaylistService } from "../services/youtube-playlist.service";
import { lastValueFrom } from "rxjs";

@Pipe({
  name: "viewCount",
})
export class ViewCountPipe implements PipeTransform {
  private youtubePlaylistService = inject(YoutubePlaylistService);

  async transform(value: unknown, ...args: unknown[]): Promise<unknown> {
    if (typeof value === "string") {
      const videoId = value;
      const response = await lastValueFrom(this.youtubePlaylistService.getVideoDetails(videoId));
      return response ? response.items[0]?.statistics?.viewCount : null;
    }
    return null;
  }
}
