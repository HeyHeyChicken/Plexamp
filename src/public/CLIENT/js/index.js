const PLEXAMP_COMPONENT = Vue.component("novaplexamp", {
    data() {
        return{
            playing: false,
            name: null,
            artists: null,
            img: null,
            wallpaper: null,
            token: null,
            initialised: false,
            autoplay: false,
            tracks: []
        }
    },
    methods: {
        toggle: function(event){
            if(this.tracks.length == 0){
                MAIN.Socket.emit("get_plexamp_tracks");
            }
            this.playing = !this.playing;
        },
        next: function(event){
            MAIN.Socket.emit("plexamp_next");
        },
        previous: function(event){
            MAIN.Socket.emit("plexamp_previous");
        }
    },
    template: ''+
        '<div class="col col-12 col-sm-10 col-md-8 col-lg-6">'+
            '<div class="plexamp">'+
                '<div class="wallpaper"><div :style="{ backgroundImage: \'url(\' + wallpaper + \')\' }"></div></div>'+
                '<div class="img" :style="{ backgroundImage: \'url(\' + img + \')\' }"></div>'+
                '<div class="controls">'+
                    '<div :title="name" v-if="initialised" class="name">{{name}}</div>'+
                    '<div :title="artists" v-if="initialised" class="artist">{{artists}}</div>'+
                    //'<input type="range" min="0" max="100">'+
                    '<button v-show="!initialised" @click="toggle">'+
                        '<i class="fas fa-power-off"></i>'+
                    '</button>'+
                    '<table v-show="initialised">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>'+
                                    '<button @click="previous">'+
                                    '<i class="fas fa-step-backward"></i>'+
                                '</button>'+
                                '</td>'+
                                '<td>'+
                                    '<button @click="toggle">'+
                                    '<div v-show="!playing">'+
                                        '<i class="fas fa-play"></i>'+
                                    '</div>'+
                                    '<div v-show="playing">'+
                                        '<i class="fas fa-pause"></i>'+
                                    '</div>'+
                                    '</button>'+
                                '</td>'+
                                '<td>'+
                                    '<button @click="next">'+
                                        '<i class="fas fa-step-forward"></i>'+
                                    '</button>'+
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
            '</div>'+
        '</div>'
});

const ID = "novaplexamp";
const DIV = document.createElement(ID);
DIV.setAttribute("id", ID);
document.getElementById("home").getElementsByClassName("row")[0].appendChild(DIV);

MAIN.Volume.Subscriptions.push(function(_volume){
    if(PlexampPlayer !== null){
        PlexampPlayer.setVolume(_volume.Value / 100);
    }
});

let PlexampApp = new Vue({
    el: "#" + ID
});
PlexampApp.$children[0].img = MAIN.App.server.url + "/529913411/img/plexamp.png"

let PlexampPlayer = null;

/* ############################################################################################ */
/* ### SOCKETS ################################################################################ */
/* ############################################################################################ */

MAIN.Socket.on("set_plexamp_tracks", function(_tracks) {
    console.log(_tracks);
    PlexampApp.$children[0].img = _tracks[0].Cover;
    PlexampApp.$children[0].wallpaper = _tracks[0].Wallpaper;
    PlexampApp.$children[0].initialised = true;
    PlexampApp.$children[0].tracks = _tracks;
});

MAIN.Socket.on("set_plexamp_play", function(_track) {
    console.log(_track);
    if(!PlexampApp.$children[0].playing){
        PlexampPlayer.resume();
    }
});

MAIN.Socket.on("set_plexamp_next", function() {
    PlexampPlayer.nextTrack();
});

MAIN.Socket.on("set_plexamp_previous", function() {
    PlexampPlayer.previousTrack();
});

MAIN.Socket.on("set_plexamp_pause", function() {
    PlexampPlayer.pause();
});