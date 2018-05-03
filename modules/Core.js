/**
 * Core.js
 *
 * @desc Core module
 * @license Private
 * @version 0.1
 */

 let rp = require("request-promise");
 let google = require("google");
 let helpers = require("./Helpers.js");
 var Core = function() {};


Core.hidden_commands = [ // Unused.
'reconnect',
'quit',
'silence',
'unsilence',
'nick',
'g',
'getURLTitle',
];



Core.init = ( client ) => {

  Core.client = client;

  Core.commands = {
    '!die': {
      desc: '<parting words> Reboots the entire bot',
      handler: 'die'
    },
    '!help': {
      desc: 'duh.',
      handler: 'help'
    },
    '!j': {
      desc: '<chan> Joins a channel',
      handler: 'join'
    },
    '!k': {
      desc: '<nick> <message> Kicks user from current chan',
      handler: 'kick'
    },
    '!kb': {
      desc: '<nick> <message> Kickbans user from current chan',
      handler: 'kickban'
    },
    '+o': {
      desc:'<nick> Ops up to 3 users in current chan',
      handler: 'op',
    },
    '-o': {
      desc: '<nick> Deops up to 3 users in current chan',
      handler: 'deop'
    },
    '+v': {
      desc:'<nick> Voices up to 3 users in current chan',
      handler: 'voice'
    },
    '-v': {
      desc: '<nick> Devoices up to 3 users in current chan',
      handler: 'devoice'
    },
    '!p': {
      desc: '<chan> Parts a channel',
      handler: 'part'
    },
    '!g': {
      desc: '<search term> Googles for you',
      handler: 'search'
    },
    '!whois': {
      desc: '<nick> Performs a public whois',
      handler: 'whois'
    }
  };

  return Core.commands;
}



/**
* reconnect()
*
* @param user Who to kick
* @param message Object full message
*/
Core.reconnect = (message) => {
  let parting_words = getPartingWords( message );
  parting_words = ((typeof  parting_words !== "undefined") &&  parting_words.length) ?  parting_words : '';

  Core.client.disconnect( parting_words );
  Core.client.connect();
}

/**
* join()
*
* @param chan Chan to join
*/
Core.join = (message) => {
  let chan = message.args[1].split(' ')[1];
  Core.client.join(chan);
}


/**
* part()
*
* @param chan Chan to part
*/
Core.part = (message) => {
  let chan = message.args[1].split(' ')[1];
  Core.client.part(chan);
}

/**
* quit()
*
* @param message Quit message
*/
Core.quit = (message) => {
  let parting_words = getPartingWords( message );
  
  parting_words = ((typeof parting_words !== "undefined") && parting_words.length) ?  parting_words : 'kbai.';

  Core.client.disconect( parting_words);
}

/**
* deop()
*
* @param message Quit message
*/
Core.deop = (message) => {
  let chan = message.args[0];
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
    Core.client.send('mode', chan, '-o', nicks[0]);
    break;
    case 2:
    Core.client.send('mode', chan, '-oo', nicks[0], nicks[1]);
    break;
    case 3:
    Core.client.send('mode', chan, '-ooo', nicks[0], nicks[1], nicks[2]);
    break;
  }
}

/**
* op()
*
* @param message Quit message
*/
Core.op = (message) => {
  let chan = message.args[0];
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
    Core.client.send('mode', chan, '+o', nicks[0]);
    break;
    case 2:
    Core.client.send('mode', chan, '+oo', nicks[0], nicks[1]);
    break;
    case 3:
    Core.client.send('mode', chan, '+ooo', nicks[0], nicks[1], nicks[2]);
    break;
  }
}


/**
* devoice()
*
* @param message Quit message
*/
Core.devoice = (message) => {
  let chan = message.args[0];
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
    Core.client.send('mode', chan, '-v', nicks[0]);
    break;
    case 2:
    Core.client.send('mode', chan, '-vv', nicks[0], nicks[1]);
    break;
    case 3:
    Core.client.send('mode', chan, '-vvv', nicks[0], nicks[1], nicks[2]);
    break;
  }
}

/**
* voice()
*
* @param message Quit message
*/
Core.voice = (message) => {
  let chan = message.args[0];
  let nicks = message.args[1].split(' ');
  nicks.shift(); // remove the command

  if (typeof nicks[0] === 'undefined') {
    nicks.push(message.nick);
  }

  switch (nicks.length) {
    case 1:
    Core.client.send('mode', chan, '+v', nicks[0]);
    break;
    case 2:
    Core.client.send('mode', chan, '+vv', nicks[0], nicks[1]);
    break;
    case 3:
    Core.client.send('mode', chan, '+vvv', nicks[0], nicks[1], nicks[2]);
    break;
  }
}

/**
* die()
*
* @param message Quit message
*/
Core.die = (message) => {
  let parting_words = getPartingWords( message );
  console.log( parting_words );
  parting_words = ((typeof parting_words !== "undefined") && parting_words.length > 0) ? parting_words : '';
  console.log( parting_words );
  Core.client.disconnect( parting_words );
  process.exitCode = 100;
  process.exit();
}

/**
* kick()
*
* @param message Object full message
*/
Core.kick = (message) => {
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
  Core.client.send('kick', chan, target, parting_words);
}

/**
* kickban()
*
* @param message Object full message
*/
Core.kickban = (message) => {
  let chan = message.args[0];
  let host_string;
  let target = message.args[1].split(' ')[1];

  // Get Host
  Core.client.whois(target, (res) => {
    mask = '*!*{{HOST}}z*@*'.replace('{{HOST}}', res.user)
    console.log("Getting host mask for user '%s'... %s", target, mask);

    // Ban host and kick.
    Core.client.send('mode', chan, '+b', mask);
    Core.kick(message);
  });
}


/**
* Silence
*/
Core.silence = (chan, nick, duration ) => {
  let mask;
  console.log("Getting host mask for user '%s'", nick);

  Core.client.whois(nick, (res) => {
    let host_string = '*a*!*{{HOST}}*@*';
    // return host_string.replace( '{{HOST}}', res.user );
    // return res.user;
    console.log(host_string.replace('{{HOST}}', res.user ));
    mask = host_string.replace('{{HOST}}', res.user );
    // let mask = helpers.getHostMask(nick);
    duration = (typeof duration === "undefined") ? 15 : duration;

    console.log("Silencing '%s' in %s for %d seconds...", nick, chan, duration);
    Core.client.send('mode', chan, '+q', mask);
    Core.client.say(chan, "Shh.");
    Core.state.flooders[chan][user] = 0;

  });


  // Remove
  setTimeout(function(chan, mask) {
    return function() {
      Core.unsilence(chan, mask )
    }
  }(chan, mask), duration*1000);
}

/**
* Unsilence
*/
Core.unsilence = (chan, mask ) => {
  // Core.state.flooders[chan][user] = 0;
  Core.client.send('mode', chan, '-q', mask);
}

/**
* whois()
*
* @description Performs IRC Whois
* @param message
*/
Core.whois = ( message ) => {
  let chan = message.args[0];
  let target = message.args[1].split(' ')[1];

  Core.client.whois(target, (res) => {
    let result = [];
    console.log(res);
    result.push("'" + res.nick + "' (" + res.realname + ") " + res.accountinfo + " " + res.account);
    result.push("User: " + res.user + " / Host: " + res.host)

    if ("channels" in res) {
      result.push("Channels: " + res.channels.join(', '));
    }

    for (var i = 0; i < result.length; i = i + 1) {
      Core.client.say(chan, result[i]);
    }
  })
}

/**
* nick()
*
* @description Changes bots nickname
* @param message object
*/
Core.nick = ( message ) => {
  let new_nick = message.args[1].split(' ')[1];
  Core.client.send('nick', new_nick);
}


/**
* help()
*
* Special command that gets passed all commands from Commander, to display
*/
Core.help = ( message, commands ) => {
  let chan = message.args[0];
  let channelCommands = config.rules[ chan ].commands;


  for (var command in channelCommands) {
      // console.log(Commander.commands[command]);
      console.log('%s %s', command, Commander.commands[command].desc);

      replies.push( commands + ' ' + Commander.commands[command].desc)
      //helpers.dripReply( Core.client, chan, replies );

      // if (commands.hasOwnProperty( command )) {
      // }
    }

  }


/**
* search()
*
* @param chan Channel to reply to
* @param message Object full message
*/
Core.search = ( message ) => {
  let chan = message.args[0];
  let query;
  let query_array = message.args[1].split(' ');

  query_array.shift(); // remove the command
  query = (query_array instanceof Array) ? query_array.join(' ') : query_array;

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

    Core.client.say(chan, link.title)
    Core.client.say(chan, encodeURI(link.href))
    Core.client.say(chan, link.description)
  });

}

/**
* getURLTitle()
*
* @param chan Channel to reply to
* @param message Object full message
*/
Core.getURLTitle = (message) => {
  // let urlTest = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
  let chan = message.args[0];
  let msg_text = message.args[1];
  let first_url = '';
  let urlTest = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  let gotUrl = urlTest.test(msg_text);

  if (urlTest.test(msg_text)) {
    console.log(msg_text.match(urlTest)[0].trim());
    first_url = msg_text.match(urlTest)[0].trim();
  }

  if ( gotUrl && first_url.length ) {
    rp(first_url)
    .then((body) => {
      let titleTest = /<title[^>]*>[\s\S]*<\/title>/gi;
      let title = body.match(titleTest).toString();
      title = title.split(">")[1].split("<")[0];
      Core.client.say(chan, "Title: " + title);
    })
    .catch((err) => {
      console.log('ERR! Tried getting URLs title', err);
      throw err;
    });
  }
}


/**
* getPartingWords()
*
* Formats goodbye strings and/or kick messages. 
* @TODO Rename across the project
*/
let getPartingWords = ( message ) => {
  let parting_words;
  let parting_words_array = message.args[1].split(' ');
  
  parting_words_array.shift(); // remove the command

  return (parting_words_array instanceof Array) ? parting_words_array.join(' ') : parting_words_array;
}







module.exports = Core;
