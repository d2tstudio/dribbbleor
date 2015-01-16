Dribbble = {};

OAuth.registerService('dribbble', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
      username: identity.login
    },
    options: {profile: {name: identity.name}}
  };
});

// http://developer.dribbble.com/v3/#user-agent-required
var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'dribbble'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://dribbble.com/oauth/token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('dribbble', config),
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Dribbble. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Dribbble. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://api.dribbble.com/v1/user", {
        headers: {"User-Agent": userAgent}, // http://developer.dribbble.com/v3/#user-agent-required
        params: {access_token: accessToken}
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from dribbble. " + err.message),
                   {response: err.response});
  }
};


Dribbble.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
