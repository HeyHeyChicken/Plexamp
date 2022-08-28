const LIBRARIES = {
  Skill: require("../../../Libraries/Skill"),
  Axios: require("axios")
};

class Facebook extends LIBRARIES.Skill {
  constructor(_main, _settings) {
    super(_main, _settings);
    const SELF = this;

    console.log(_settings);

    this.Main.Manager.addAction("Facebook.post", function(_intent, _socket){
      // Here you will add an action when the user want to post anything on Facebook.
      // You can access utterances variables like this : _intent.Variables.text
    });
  }
}

module.exports = Facebook;
