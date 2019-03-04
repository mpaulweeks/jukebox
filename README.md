# jukebox

online music player / backup

- https://s3.amazonaws.com/mpaulweeks-jukebox/data/collection.json
- https://s3.amazonaws.com/mpaulweeks-jukebox/data/metaData.json

## usage

```html
<script defer src="https://s3.amazonaws.com/mpaulweeks-jukebox/jukebox.min.js"></script>
```

```js
createJukebox({
  // optional args
  playlist: '2016',
  colorScheme: 'dark',
}).then(jukebox => {
  jukebox.open();
});

// close it via console. calling createJukebox again returns the same promise
(await createJukebox()).close();
```
