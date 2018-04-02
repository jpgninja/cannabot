/**
 * Helpers.js
 *
 * @desc Helpers module
 * @license Private
 * @version 0.1
 */

let Helpers = function() {};


/**
 * env
 *
 * @description Global environment variable
 */
Helpers.env = 'DEV';


Helpers.containsURL = (text) => {
  let urlTest = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
  return urlTest.test(text);
}

/**
 * getHostMask()
 *
 * @description Get a *!*host*@* hostmask for banning, muting, or otherwise
 * @param client IRC client
 * @param target nick
 */
Helpers.getHostMask = (client, target) => {
  client.whois(target, (res) => {
    let host_string = '*!*{{HOST}}z*@*'.replace('{{HOST}}', res.user)
    console.log("Getting host mask for user '%s'... %s", target, host_string);
    return host_string;
  });
}

/**
 * dripReply()
 *
 * @description Drips messages out to the channel with a small delay to avoid flooding large messages
 * @param client IRC client
 * @param chan active IRC chan
 * @param replies Array of messages to say to chan.
 */
Helpers.dripReply = (client, chan, replies) => {
  replies.forEach(function(reply, i, replies) {
    setTimeout(()=> {
        client.say(chan, replies[i]);
    }, (500 * i));
  });
}



module.exports = Helpers;
