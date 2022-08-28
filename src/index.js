const { format } = require("path");

const LIBRARIES = {
  Skill: require("../../../Libraries/Skill"),
  Track: require("./Track"),
  Axios: require("axios")
};

class Plexamp extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;

    _settings.libraryID = null;
    _settings.typeID = null;

    if(_settings.token != null && _settings.token != ""){
      LIBRARIES.Axios.get(_settings.serverIP + ":" + _settings.serverPort + "/library/sections/?X-Plex-Token=" + _settings.token)
        .then((res1) => {
          loop1:
          for(let library_index in res1.data.MediaContainer.Directory){
            if(res1.data.MediaContainer.Directory[library_index].title == _settings.musicLibraryName){
              _settings.libraryID = res1.data.MediaContainer.Directory[library_index].key;
              
              for(let type_index = 0; type_index < 11; type_index++){
                LIBRARIES.Axios.get(_settings.serverIP + ":" + _settings.serverPort + "/library/sections/" + _settings.libraryID + "/all?type=" + type_index + "&X-Plex-Token=" + _settings.token)
                  .then((res2) => {
                    if(res2.data.MediaContainer.Metadata != undefined){
                      if(res2.data.MediaContainer.Metadata[0] != undefined){
                        if(res2.data.MediaContainer.Metadata[0].type == "track"){
                          _settings.typeID = type_index;
                          _main.Log("[Plexamp] I'm ready.");
                          SELF.afterPlexReady();
                        }
                      }
                    }
                  }).catch((err) => {
                    console.error(err);
                  }
                );
              }
              break loop1;
            }
          }
        }).catch((err) => {
          console.error(err);
        }
      );
    }
  }

  // Cette fonction part récupérer la liste de toutes les musiques disponible.
  getAllTracks(_callback){
    const SELF = this;
    const TRACKS = [];

    LIBRARIES.Axios.get(this.Settings.serverIP + ":" + this.Settings.serverPort + "/library/sections/" + this.Settings.libraryID + "/all?type=" + this.Settings.typeID + "&X-Plex-Token=" + this.Settings.token)
      .then((res2) => {
        if(res2.data.MediaContainer.Metadata != undefined){
          if(res2.data.MediaContainer.Metadata[0] != undefined){
            if(res2.data.MediaContainer.Metadata[0].type == "track"){
              for(let track_index in res2.data.MediaContainer.Metadata){
                console.log(res2.data.MediaContainer.Metadata[track_index]);
                let track = new LIBRARIES.Track(
                  res2.data.MediaContainer.Metadata[track_index].title,
                  res2.data.MediaContainer.Metadata[track_index].parentTitle,
                  SELF.Settings.serverIP + ":" + SELF.Settings.serverPort + res2.data.MediaContainer.Metadata[track_index].thumb + "?X-Plex-Token=" + this.Settings.token,
                  SELF.Settings.serverIP + ":" + SELF.Settings.serverPort + res2.data.MediaContainer.Metadata[track_index].parentThumb + "?X-Plex-Token=" + this.Settings.token,
                  SELF.Settings.serverIP + ":" + SELF.Settings.serverPort + res2.data.MediaContainer.Metadata[track_index].Media[0].Part[0].key + "?X-Plex-Token=" + this.Settings.token
                )
                TRACKS.push(track);
              }
              if(_callback != undefined){
                _callback(TRACKS);
              }
            }
          }
        }
      }).catch((err) => {
        console.error(err);
      }
    );
  }

  // Cette fonction s'execute une fois que Plexamp s'est correctement injitialisé.
  afterPlexReady(){
    const SELF = this;
    
    this.Main.Manager.addAction("Plexamp.play", function(_intent, _socket){
      socket.emit("set_plexamp_play");
    });

    this.Main.Manager.addAction("Plexamp.pause", function(_intent, _socket){
      socket.emit("set_plexamp_pause");
    });

    this.Main.Manager.addAction("Plexamp.next", function(_intent, _socket){
      socket.emit("set_plexamp_next");
    });

    this.Main.Manager.addAction("Plexamp.previous", function(_intent, _socket){
      socket.emit("set_plexamp_previous");
    });

    /* ############################################################################################ */
    /* ### SOCKETS ################################################################################ */
    /* ############################################################################################ */

    this.Main.ClientIO.on("connection", function(socket){
      // L'utilisateur demande son token
      socket.on("get_plexamp_tracks", function() {
        SELF.getAllTracks(function(tracks){
          socket.emit("set_plexamp_tracks", tracks.sort(() => Math.random() - 0.5));
        });
      });
    });
  }
}

module.exports = Plexamp;
