# todo

- `yarn stage:loader` isnt reading the existing json

- how to export as vanilla js?
  - see todo in store
- use `now` to deploy player to s3?
- add redux for currentTrack/Playlist and player settings
- capture meta on track length
  - simplify update by just deleting meta file?
  - split out step that reads mp3s for meta, probably the slow part
- constant that reads windw.config, determines "whitelist" and "sidebar visible"
  - if whitelist, only use songs from those playlists to populate AllSong, Albums, etc
  - else, use collection.tracks
- config can be determined via global obj (embed) or query param (main app)
  - load config before const
