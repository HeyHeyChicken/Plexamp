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
            autoplay: false
        }
    },
    methods: {
        power: function(event){
            MAIN.Socket.emit("get_spotify_token");
        },
        toggle: function(event){
            this.playing = !this.playing;
            PlexampPlayer.togglePlay();
        },
        next: function(event){
            PlexampPlayer.nextTrack();
        },
        previous: function(event){
            PlexampPlayer.previousTrack();
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
                    '<button v-show="!initialised" @click="power">'+
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

const DIV = document.createElement("novaplexamp");
const ID = "novaplexamp";
DIV.setAttribute("id", ID);
document.getElementById("home").getElementsByClassName("row")[0].appendChild(DIV);

MAIN.Volume.Subscriptions.push(function(_volume){
    if(PlexampPlayer !== null){
        PlexampPlayer.setVolume(_volume.Value / 100);
    }
});

let SpotifyApp = new Vue({
    el: "#" + ID
});
SpotifyApp.$children[0].img = MAIN.App.server.url + "/260646715/img/plexamp.jpg"

let PlexampPlayer = null;