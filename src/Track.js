const LIBRARIES = {
    Axios: require("axios")
  };
  
  class Track {
    constructor(_title, _album, _cover, _wallpaper, _url) {
      this.Title = _title;
      this.Album = _album;
      this.Cover = _cover;
      this.Wallpaper = _wallpaper;
      this.URL = _url;
    }
  }
  
  module.exports = Track;
  