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
        this.Main.IOClient.on("set_plexamp_play", function(){
            SELF.Main.IOServer.sockets.emit("set_plexamp_play");
        });
        this.Main.IOClient.on("set_plexamp_pause", function(){
            SELF.Main.IOServer.sockets.emit("set_plexamp_pause");
        });
        this.Main.IOClient.on("set_plexamp_next", function(){
            SELF.Main.IOServer.sockets.emit("set_plexamp_next");
        });
        this.Main.IOClient.on("set_plexamp_previous", function(){
            SELF.Main.IOServer.sockets.emit("set_plexamp_previous");
        });
    }
}

module.exports = Client;
