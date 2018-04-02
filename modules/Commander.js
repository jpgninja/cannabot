/**
 * Commands.js
 *
 * @desc Commands module
 * @license Private
 * @version 0.1
 */

let config = require('../config.js');
let cheerio = require('cheerio');
let rp = require('request-promise');
let google = require('google');
let Custom = require('./Custom.js');
let helpers = require('./Helpers.js');
let Commander = function() {};

/**
 * env
 *
 * @description Global environment variable
 */
Commander.state = {
  flooders: {

  }
};

/**
 * reconnect()
 *
 * @param client IRC instance
 * @param user Who to kick
 * @param message Object full message
 */
Commander.reconnect = (client, message) => {
  message = ((typeof message !== "undefined") && message.length) ? message : '';
  client.disconnect(message);
  client.connect();
}

/**
 * join()
 *
 * @param client IRC instance
 * @param chan Chan to join
 */
Commander.join = (client, chan) => {
  client.join(chan);
}

/**
 * part()
 *
 * @param client IRC instance
 * @param chan Chan to part
 */
Commander.part = (client, chan) => {
  client.part(chan);
}

/**
 * quit()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.quit = (client, message) => {
  message = ((typeof message !== "undefined") && message.length) ? message : 'kbai.';
  client.disconect(message);
}

/**
 * deop()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.deop = (client, chan, command, message) => {
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
      client.send('mode', chan, '-o', nicks[0]);
      break;
    case 2:
      client.send('mode', chan, '-oo', nicks[0], nicks[1]);
      break;
    case 3:
      client.send('mode', chan, '-ooo', nicks[0], nicks[1], nicks[2]);
      break;
  }
}

/**
 * op()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.op = (client, chan, command, message) => {
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
      client.send('mode', chan, '+o', nicks[0]);
      break;
    case 2:
      client.send('mode', chan, '+oo', nicks[0], nicks[1]);
      break;
    case 3:
      client.send('mode', chan, '+ooo', nicks[0], nicks[1], nicks[2]);
      break;
  }
}


/**
 * devoice()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.devoice = (client, chan, command, message) => {
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
      client.send('mode', chan, '-v', nicks[0]);
      break;
    case 2:
      client.send('mode', chan, '-vv', nicks[0], nicks[1]);
      break;
    case 3:
      client.send('mode', chan, '-vvv', nicks[0], nicks[1], nicks[2]);
      break;
  }
}

/**
 * voice()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.voice = (client, chan, command, message) => {
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
      client.send('mode', chan, '+v', nicks[0]);
      break;
    case 2:
      client.send('mode', chan, '+vv', nicks[0], nicks[1]);
      break;
    case 3:
      client.send('mode', chan, '+vvv', nicks[0], nicks[1], nicks[2]);
      break;
  }
}

/**
 * die()
 *
 * @param client IRC instance
 * @param message Quit message
 */
Commander.die = (client, message) => {
  message = ((typeof message !== "undefined") && message.length) ? message : '';
  client.disconnect(message);
  process.exitCode = 100;
  process.exit();
}

/**
 * kick()
 *
 * @param client IRC instance
 * @param user Who to kick
 * @param message Object full message
 */
Commander.kick = (client, message) => {
  let chan = message.args[0];
  let parting_words = message.args[1].split(' ');
  let target;

  parting_words.shift(); // remove command
  target = parting_words[0];
  parting_words.shift(); // remove nick
  parting_words = parting_words.join(' ');

  parting_words = ((typeof parting_words !== "undefined") && parting_words.length) ? parting_words : config.messages.kick;
  // client.kick( user, message );
  console.log("KICK: '%s' kicked. Reason: '%s'", target, parting_words);
  client.send('kick', chan, target, parting_words);
}

/**
 * kickban()
 *
 * @param client IRC instance
 * @param user Who to kickban
 * @param message Object full message
 */
Commander.kickban = (client, message) => {
  let chan = message.args[0];
  let host_string;
  let target = message.args[1].split(' ')[1];

  // Get Host
  client.whois(target, (res) => {
    mask = '*!*{{HOST}}z*@*'.replace('{{HOST}}', res.user)
    console.log("Getting host mask for user '%s'... %s", target, mask);

    // Ban host and kick.
    client.send('mode', chan, '+b', mask);
    Commander.kick(client, message);
  });
}

/**
 * increaseFloodScore()
 *
 * @param client IRC instance
 * @param user Who to increaseFloodScore
 * @param message Object full message
 */
Commander.increaseFloodScore = (chan, user) => {
  let chanExists = Commander.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && Commander.state.flooders[chan].hasOwnProperty(user));

  if (chanExists && userExists) {
    Commander.state.flooders[chan][user]++;
  } else if (chanExists && !userExists) {
    Commander.state.flooders[chan][user] = 1;
  } else {
    Commander.state.flooders[chan] = {};
    Commander.state.flooders[chan][user] = 1;
  }

  // Remove
  // setTimeout(function(chan, user) {
  //   return function() {
  //     Commander.decreaseFloodScore( chan, user );
  //   }
  // }, 2000);
}

/**
if (config.flood_protection.active) {
  setInterval(decreaseFloodScores, config.flood_protection.timeframe*1000);
}
**/

function decreaseFloodScores() {
  let nick;
  let nicks;
  let chan;
  let chans = Commander.state.flooders;

  for (chan in chans) {
    for (nick in nicks) {
      if (nicks[ nick ] > 0) {
        nicks[ nick ]--;
      }
    }
  }
}

/**
 * decreaseFloodScore()
 *
 * @param client IRC instance
 * @param user Who to decreaseFloodScore
 * @param message Object full message
 */
Commander.decreaseFloodScore = (chan, user) => {
  let chanExists = Commander.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && Commander.state.flooders[chan].hasOwnProperty(user));

  if (chanExists && userExists) {
    if (Commander.state.flooders[chan][user] > 0) {
      Commander.state.flooders[chan][user]--;
    }
  } else if (chanExists && !userExists) {
    Commander.state.flooders[chan][user] = 0;
  } else {
    Commander.state.flooders[chan] = {};
    Commander.state.flooders[chan][user] = 0;
    console.error("decreaseFloodScore(); This isn't good... I dunno what happened but it isn't good");
  }

  console.log("DECREASING: Flood score for '%s' is %d", user, Commander.state.flooders[chan][user]);
}

/**
 * checkForFloods()
 *
 * @param client IRC instance
 * @param user Who to checkForFloods
 * @param message Object full message
 */
Commander.checkForFloods = (client, chan, user) => {
  let flooders = [];
  let chanExists = Commander.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && Commander.state.flooders[chan].hasOwnProperty(user));

  console.log('Checking for flooders');

  if (chanExists && userExists) {
    if (Commander.state.flooders[chan][user] > config.flood_protection.limit) {
      Commander.silence( client, chan, user );
      return true;
    }
  }
  return false;
}

Commander.silence = ( client, chan, nick, duration ) => {
  let mask;
  console.log("Getting host mask for user '%s'", nick);

  client.whois(nick, (res) => {
    let host_string = '*a*!*{{HOST}}*@*';
    // return host_string.replace( '{{HOST}}', res.user );
    // return res.user;
    console.log(host_string.replace('{{HOST}}', res.user ));
    mask = host_string.replace('{{HOST}}', res.user );
    // let mask = helpers.getHostMask(client, nick);
    duration = (typeof duration === "undefined") ? 15 : duration;

    console.log("Silencing '%s' in %s for %d seconds...", nick, chan, duration);
    client.send('mode', chan, '+q', mask);
    client.say(chan, "Shh.");
    Commander.state.flooders[chan][user] = 0;

  });


  // Remove
  setTimeout(function(client, chan, mask) {
    return function() {
      Commander.unsilence( client, chan, mask )
    }
  }(client, chan, mask), duration*1000);
}

Commander.unsilence = ( client, chan, mask ) => {
  // Commander.state.flooders[chan][user] = 0;
  client.send('mode', chan, '-q', mask);
}


/**
 * whois()
 *
 * @description Performs IRC Whois
 * @param client IRC instance
 * @param reply_to chan to respond to
 * @param target Who to identify
 */
Commander.whois = (client, reply_to, target) => {
  client.whois(target, (res) => {
    let result = [];
    console.log(res);
    result.push("'" + res.nick + "' (" + res.realname + ") " + res.accountinfo + " " + res.account);
    result.push("User: " + res.user + " / Host: " + res.host)

    if ("channels" in res) {
      result.push("Channels: " + res.channels.join(', '));
    }

    for (var i = 0; i < result.length; i = i + 1) {
      client.say(reply_to, result[i]);
    }
  })
}

/**
 * nick()
 *
 * @description Changes bots nickname
 * @param client IRC instance
 * @param new_nick Who to identify
 */
Commander.nick = (client, new_nick) => {
  client.send('nick', new_nick);
}

/**
 * unknown()
 *
 * @param client IRC instance
 * @param user Who to identify
 */
Commander.unknown = (client, command, message) => {
  let isCustomCommand = (command === 'sf');

  // console.log('Unknown command from (%s): %s', message.nick, command);
  if (isCustomCommand) {
    Custom[command](client, message);
  }
}

/**
 * identify()
 *
 * @param client IRC instance
 * @param user Who to identify
 */
let identify = (client, user) => {
  console.log("Attempting to identify nick '%s' as master...", user);
  console.log(message);
  // client.say( 'NickServ', 'ACC ' + user );
  // client.addListener('message#', (from, to, text, message) => {
  // });
}

/**
 * search()
 *
 * @param client IRC instance
 * @param reply_to Channel to reply to
 * @param message Object full message
 */
Commander.search = (client, reply_to, query) => {
  if (!query) {
    return;
  }

  google(query, (err, res) => {
    if (err) console.error(err)
    var link = res.links[0];

    link.description = link.description.replace('\r', ' ');
    link.description = link.description.replace('\n', ' ');
    link.description = link.description.replace('\t', ' ');
    link.description = link.description.substring(0, 62) + '...';

    client.say(reply_to, link.title)
    client.say(reply_to, encodeURI(link.href))
    client.say(reply_to, link.description)
  })

}

/**
 * getURLTitle()
 *
 * @param client IRC instance
 * @param reply_to Channel to reply to
 * @param message Object full message
 */
Commander.getURLTitle = (client, reply_to, message) => {
  let urlTest = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
  let first_url = message.match(/\bhttps?:\/\/\S+/g)[0].trim();
  let gotUrl = first_url.length;

  if ( gotUrl.indexOf( 'http' ) === -1) {
    gotUrl = "http://" + gotUrl;
  }

  if (gotUrl) {
    rp(first_url)
      .then((body) => {
        let titleTest = /<title[^>]*>[\s\S]*<\/title>/gi;
        let title = body.match(titleTest).toString();
        title = title.split(">")[1].split("<")[0];
        client.say(reply_to, "Title: " + title);
      })
      .catch((err) => {
        console.log('ERR! Tried getting URLs title', err);
      });
  }
}

module.exports = Commander;
