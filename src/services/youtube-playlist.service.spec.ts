import { TestBed } from '@angular/core/testing';

import { YoutubePlaylistService } from './youtube-playlist.service';

describe('YoutubePlaylistService', () => {
  let service: YoutubePlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubePlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
