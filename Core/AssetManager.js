export class AssetManager {
  constructor() {
    // if there isnt a singleton instance of the AssetManager, create one
    if (!window.ASSET_MANAGER) {
      window.ASSET_MANAGER = this; // Singleton instance
    }
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
    this.sfxMuted = false; // flag to control audio muting
    this.musicMuted = false; // flag to control music muting
    this.activeTrack = 0;
    this.musicTracks = ["./assets/music/track1.mp3"];
    return window.ASSET_MANAGER;
  }

  queueDownload(path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
  }

  isDone() {
    return this.downloadQueue.length === this.successCount + this.errorCount;
  }

  downloadAll(callback) {
    if (this.downloadQueue.length === 0) setTimeout(callback, 10);
    for (let i = 0; i < this.downloadQueue.length; i++) {
      const path = this.downloadQueue[i];
      console.log(path);

      switch (path.substring(path.length - 3)) {
        case "gif":
        case "png":
        case "jpg":
          const img = new Image();

          img.addEventListener("load", () => {
            console.log("Loaded " + img.src);
            this.successCount++;
            if (this.isDone()) callback();
          });

          img.addEventListener("error", () => {
            console.log("Error loading " + img.src);
            this.errorCount++;
            if (this.isDone()) callback();
          });

          img.src = path;
          this.cache[path] = img;
          break;

        case "wav":
        case "mp3":
        case "mp4":
        case "ogg":
          const aud = new Audio();
          aud.addEventListener("loadeddata", () => {
            console.log("Loaded " + aud.src);
            this.successCount++;
            if (this.isDone()) callback();
          });

          aud.addEventListener("error", () => {
            console.log("Error loading " + aud.src);
            this.errorCount++;
            if (this.isDone()) callback();
          });

          aud.addEventListener("ended", () => {
            aud.pause();
            aud.currentTime = 0;
          });

          aud.src = path;
          aud.load();

          this.cache[path] = aud;
          break;
          case "ttf":
          case "otf":
          case "woff":
          case "woff2":
            const fontName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
            const font = new FontFace(fontName, `url(${path})`);

              font.load().then((loadedFont) => {
                document.fonts.add(loadedFont);
                console.log("Loaded font: " + fontName);
                this.successCount++;
                if (this.isDone()) callback();
              }).catch((error) => {
                  console.log("Error loading font: " + fontName, error);
                  this.errorCount++;
                  if (this.isDone()) callback();
              });

            this.cache[path] = fontName; // Store font name for later use
          break;
      }
    }
  }

  getAsset(path) {
    return this.cache[path];
  }

  playAsset(path, volumeMult = 1) {
    if (this.sfxMuted) return;
    if (volumeMult === 0) return;
    let audio = this.cache[path];
    if (!audio) return;
    if (audio.currentTime != 0) {
      let bak = audio.cloneNode();
      bak.currentTime = 0;
      bak.volume = .2 * volumeMult;
      bak.play();
    } else {
      audio.volume = .2 * volumeMult;
      audio.currentTime = 0;
      audio.play();
    }
    //console.log("Playing " + path);
  }

  toggleMute(muted) {
    this.sfxMuted = muted; // Set mute flag
    //stop all currently playing audio
    Object.values(this.cache).forEach((asset) => {
      if (asset instanceof Audio) {
        asset.pause();
        asset.currentTime = 0; //reset audio position
      }
    });
  }

  playTrack(i) {
    i -= 1;
    // stop current track
    if (this.cache[this.musicTracks[this.activeTrack]]) {
      this.cache[this.musicTracks[this.activeTrack]].pause();
    }
    this.activeTrack = i;
    let audio = this.cache[this.musicTracks[i]];
    if (!audio) return;
    if (i !== this.activeTrack) audio.currentTime = 0;
    audio.loop = true;
    audio.volume = 0.3;
    if (!this.musicMuted) audio.play();
    console.log('Playing track ' + this.musicTracks[i]);
  }

  toggleMusicMute(muted) {
    this.musicMuted = muted;
    if (this.musicMuted) {
      this.cache[this.musicTracks[this.activeTrack]].pause();
    } else {
      this.cache[this.musicTracks[this.activeTrack]].play();
    }
  }


}
