const PLAYER_ID = "plexamp_player";
const PLEXAMP_COMPONENT = Vue.component("novaplexamp", {
    data() {
        return{
            playing: false,
            initialised: false,
            autoplay: false,
            tracks: [],
            trackIndex: 0
        }
    },
    methods: {
        toggle: function(event){
            if(this.tracks.length > 0){
                const PLAYER = document.getElementById(PLAYER_ID);
                this.playing = !this.playing;
                if(this.playing){
                    PLAYER.play();
                }
                else{
                    PLAYER.pause();
                }
            }
        },
        next: function(event){
            if(this.trackIndex + 1 >= this.tracks.length){
                this.trackIndex = 0;
            }
            else{
                this.trackIndex++;
            }
        },
        previous: function(event){
            if(this.trackIndex - 1 < 0){
                this.trackIndex = this.tracks.length - 1;
            }
            else{
                this.trackIndex--;
            }
        }
    },
    template: ''+
        '<div class="col col-12 col-sm-10 col-md-8 col-lg-6">'+
            '<div class="plexamp">'+
                '<div class="wallpaper"><div :style="{ backgroundImage: \'url(\' + (tracks[trackIndex] != undefined ? tracks[trackIndex].Wallpaper : null) + \')\' }"></div></div>'+
                '<div class="img" :style="{ backgroundImage: \'url(\' + (tracks[trackIndex] != undefined ? tracks[trackIndex].Cover : null) + \')\' }"></div>'+
                '<div class="controls">'+
                    '<div v-if="initialised" class="name">{{ tracks[trackIndex] != undefined ? tracks[trackIndex].Title : null }}</div>'+
                    '<div v-if="initialised" class="artist">{{ tracks[trackIndex] != undefined ? tracks[trackIndex].Album : null }}</div>'+
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
                    '<audio volume="1" v-bind:autoplay="playing" id="' + PLAYER_ID + '" v-if="initialised" v-bind:src="tracks[trackIndex].URL"></audio>'+
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

MAIN.Socket.emit("get_plexamp_tracks");

MAIN.Socket.on("set_plexamp_tracks", function(_tracks) {
    PlexampApp.$children[0].initialised = true;
    PlexampApp.$children[0].tracks = _tracks;
});

MAIN.Socket.on("set_plexamp_play", function() {
    PlexampApp.$children[0].playing = true;
    const PLAYER = document.getElementById(PLAYER_ID);
    PLAYER.play();
});

MAIN.Socket.on("set_plexamp_pause", function() {
    PlexampApp.$children[0].playing = false;
    const PLAYER = document.getElementById(PLAYER_ID);
    PLAYER.pause();
});

MAIN.Socket.on("set_plexamp_next", function() {
    if(PlexampApp.$children[0].trackIndex + 1 >= PlexampApp.$children[0].tracks.length){
        PlexampApp.$children[0].trackIndex = 0;
    }
    else{
        PlexampApp.$children[0].trackIndex++;
    }
});

MAIN.Socket.on("set_plexamp_previous", function() {
    if(PlexampApp.$children[0].trackIndex - 1 < 0){
        PlexampApp.$children[0].trackIndex = PlexampApp.$children[0].tracks.length - 1;
    }
    else{
        PlexampApp.$children[0].trackIndex--;
    }
});