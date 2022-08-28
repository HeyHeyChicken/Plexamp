class Client {
    constructor(_main) {
        const SELF = this;

        this.Main = _main;

        // Sockets from client
        this.Main.IOServer.on("connection", function(socket){
            socket.on("get_plexamp_tracks", function(){
                SELF.Main.IOClient.emit("get_plexamp_tracks");
            });
        });

        // Sockets from server
        this.Main.IOClient.on("set_plexamp_tracks", function(_tracks){
            SELF.Main.IOServer.sockets.emit("set_plexamp_tracks", _tracks);
        });
        this.Main.IOClient.on("set_spotify_next", function(){
            SELF.Main.IOServer.sockets.emit("set_spotify_next");
        });
        this.Main.IOClient.on("set_spotify_previous", function(){
            SELF.Main.IOServer.sockets.emit("set_spotify_previous");
        });
        this.Main.IOClient.on("set_spotify_pause", function(){
            SELF.Main.IOServer.sockets.emit("set_spotify_pause");
        });
    }
}

module.exports = Client;
