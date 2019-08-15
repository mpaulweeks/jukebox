# todo

## p0

- tools for repairing metadata / re-uploading songs
  - Script to scan metadata for missing info, print out filenames
  - Another script to delete the track ids to force retry on script run
  - Leverage existing local vs prod json usage

## p1

- fullscreen view for album art
  - shrink middle section? keep player on bottom
- search function for songs within playlist
  - opens popup where you type search query
  - on input change, search all tracks
  - split input by space, make sure all words appear in track title + artist + album
  - show links to matching tracks and their playlist
  - clicking link closes popup, loads that track + playlist
- css reset
- crossfade next track
- check logic for updating existing playlists
- diff tool to compare audio with playlist ids to detect orphans

## p2

- add transitions to background-position on bar
- fade animation on button press OR keyboard press
- Audio.onload fills song info with loading dialogue

## radio mode

- obscure playlist views, only offer playback controls
- make a few preset channels based on large aggregate playlists:
  - barbershop
  - chiptune
  - classical
