# todo

- move library location into env.json
- playlist for By Album, By Artist that lead to secondary view
  - enum on App for browsing album/artist
  - album view uses meta from first track
- put entire App into box thats perfectly fit to screen
  - have the top and sidebar collapse by going into negative margin
  - have everything flex-fill in its dimmension to seamlessly animate when other comps disappear
- constant that reads windw.config, determines "whitelist" and "sidebar visible"
  - if whitelist, only use songs from those playlists to populate AllSong, Albums, etc
  - else, use collection.tracks
- config can be determined via global obj (embed) or query param (main app)
  - load config before const
