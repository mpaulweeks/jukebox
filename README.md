# jukebox

online music player / backup

- https://s3.amazonaws.com/mpaulweeks-jukebox/data/collection.json
- https://s3.amazonaws.com/mpaulweeks-jukebox/data/metaData.json

## resources

- [how to expose iTunes Music Library.xml](http://osxdaily.com/2018/05/23/itunes-library-xml-file-missing-fix/)

## envFile

```
{
  "ITUNES_MUSIC_LIBRARY": ...
  "AWS_ACCESS_KEY_ID": ...
  "AWS_SECRET_ACCESS_KEY": ...
}
```

## usage

```html
<script defer src="https://s3.amazonaws.com/mpaulweeks-jukebox/jukebox.min.js"></script>
```

```js
createJukebox({
  // playlist: '2016',
  // color_scheme: 'dark',
}).then(jukebox => {
  const elm = document.getElementById('jukebox-open');
  elm.addEventListener('click', jukebox.open);
});

// close it via console. calling createJukebox returns the same promise
(await createJukebox()).close();
```
