# SETUP

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

## running loader

On Windows bash:

```
cd /mnt/c/git/jukebox
yarn cronjob
```
