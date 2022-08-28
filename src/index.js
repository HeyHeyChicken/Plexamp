const LIBRARIES = {
  Skill: require("../../../Libraries/Skill"),
  Axios: require("axios")
};

class Facebook extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;

    console.log(_settings);

    if(_settings.token != null && _settings.token != ""){
      axios.post(_settings.serverIP + ":" + _settings.serverPort + "/library/sections/?X-Plex-Token=" + _settings.token)
        .then((res) => {
          console.log(`Status: ${res.status}`);
          console.log('Body: ', res.data);
        }).catch((err) => {
          console.error(err);
        }
      );
    }

    this.Main.Manager.addAction("Facebook.post", function(_intent, _socket){
      // Here you will add an action when the user want to post anything on Facebook.
      // You can access utterances variables like this : _intent.Variables.text
    });
  }
}

module.exports = Facebook;
