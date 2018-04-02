'use strict';

let bot;
const irc = require('irc');
const commander = require('./modules/Commander.js');
const obedience = require('./modules/Obedience.js');
const config = require('./config.js');

let init = () => {
  bot = new irc.Client('irc.freenode.net', config.persona.nick, config.persona);
  // @TODO config.json

  addEventListeners();
}


let addEventListeners = () => {
  let from;
  let command;
  let isMasterOfChan;
  let isService;
  let isValidCommand;
  let isValidPromoteCommand;
  let isValidDemoteCommand;
  let isValidModeCommand;
  let isMonitoredChan;
  let containsURL;

  bot.addListener('error', function(message) {
      console.log('error: ', message);
  });

/*
  bot.addListener('pm', function(from, text, message) {
    let command = message.args[1];
    from = message.nick;
    command = message.args[1].split(' ')[0];
    isMasterOfChan = obedience.isMasterOfChan( from );
    isService = obedience.isService( from );
    isValidCommand = (command.slice(0, 1) === '!');
    isValidCommand = ( isMasterOfChan && isValidCommand );

    if (!isMasterOfChan) {
      bot.say(from, "not master." );
    }

    if (isValidCommand) {
      command = command.slice(0, 1).toLowerCase();
      // console.log(message);
      console.log('Command is:', command);
      // bot.say(from, "msg" );
      command_center(command, message);
    }
  });
*/

  bot.addListener('message#', (from, to, text, message) => {
    // let command = message.args[1];
    let urlTest = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");

    from = message.nick;
    command = message.args[1].split(' ')[0];
    isMonitoredChan = obedience.isChan( to );
    isMasterOfChan = obedience.isMasterOfChan( from, to );
    isService = obedience.isService( from );
    isValidCommand = (command.slice(0, 1) === '!');
    isValidPromoteCommand = (command.slice(0, 1) === '+');
    isValidDemoteCommand = (command.slice(0, 1) === '-');
    isValidModeCommand = ( isValidPromoteCommand || isValidDemoteCommand );
    containsURL = urlTest.test( text );

    isValidCommand = ( isMonitoredChan && isMasterOfChan && ( isValidCommand || isValidModeCommand ) );

    // if (!isMasterOfChan) {
    //   bot.say(from, "not master." );
    // }
    // if (!isMonitoredChan) {
    //   bot.say(from, "not monitored chan: "+ message.args[0]);
    // }

    if (config.flood_protection.active) {
      commander.increaseFloodScore(to, message.nick);
      commander.checkForFloods(bot, message.args[0], message.nick);
    }

    if (isValidCommand) {
      command = command.slice(1).toLowerCase();
      // console.log("Command is '" +command+ "' and Message is:");
      console.log("Command is '" +command+ "'");
      // console.log(message);

      if ( isValidPromoteCommand ) {
        if (command === 'o') {
          commander.op( bot, to, command, message );
        }
        else if (command === 'v') {
          commander.voice( bot, to, command, message );
        }
      }
      else if ( isValidDemoteCommand ) {
        if (command === 'o') {
          commander.deop( bot, to, command, message );
        }
        if (command === 'v') {
          commander.devoice( bot, to, command, message );
        }
      }
      else {
        command_center(command, message);
      }
    }
    else if ( isService ) {
      console.log('Message from Service... Unhandled');
    }
    else if ( containsURL && isMonitoredChan ) {
      commander.getURLTitle( bot, to, text );
    }
    else if ( isMonitoredChan && !isMasterOfChan ) {
      command = command.slice(1).toLowerCase();
      if (command === 'g') {
        commander.op( bot, to, command, message );
      }
    }

  });
}

/* @TODO  move this to Commander.js */
let command_center = (command, message) => {
  let leave_message;
  let parting_words;
  let parting_words_array;
  let query;
  let query_array;
  let user;
  let chan;
  let target;
  let new_nick;
  let private_commands = [
    '!die <parting words> Reboots the entire bot',
    '!help duh.',
    '!j <chan> Joins a channel',
    '!k <nick> <message> Kicks user from current chan',
    '!kb <nick> <message> Kickbans user from current chan',
    '+o <nick> Ops up to 3 users in current chan',
    '-o <nick> Deops up to 3 users in current chan',
    '+v <nick> Voices up to 3 users in current chan',
    '-v <nick> Devoices up to 3 users in current chan',
    '!p <chan> Parts a channel',
    '!whois <nick> Performs a public whois'
  ];
  let public_commands = [
    '!g <search term> Googles for you'
  ];


  switch (command) {
    case 'die':
      parting_words_array = message.args[1].split(' ');
      parting_words_array.shift(); // remove the command
      parting_words = (parting_words_array instanceof Array) ? parting_words_array.join(' ') : parting_words_array;

      commander.die( bot, parting_words );
      break;
    case 'g':
      chan = message.args[0];
      query_array = message.args[1].split(' ');
      query_array.shift(); // remove the command
      query = (query_array instanceof Array) ? query_array.join(' ') : query_array;

      commander.search( bot, chan, query );
      break;
    case 'hello':
      // commander.identify(bot, user);
      break;
    case 'help':
      chan = message.args[0];
      let commands = [];

      commands.push('Operator Commands:');
      commands.push(...private_commands);
      commands.push('Public Commands:');
      commands.push(...public_commands);
      commands.push('Enjoy! :)');


      let custom_commands = []; // @TODO
      // @TODO merge them

      helpers.dripReply( commands );

      break;
    case 'j':
      chan = message.args[1].split(' ')[1];
      commander.join(bot, chan);
      break;
    case 'k':
      commander.kick( bot, message );
      break;
    case 'kb':
      commander.kickban( bot, message );
      break;
    case 'nick':
      new_nick = message.args[1].split(' ')[1];
      commander.nick( bot, new_nick );
      break;
    case 'p':
      chan = message.args[1].split(' ')[1];
      console.log('chan is: ', chan);
      commander.part(bot, chan);
      break;
    case 'q':
      parting_words_array = message.args[1].split(' ');
      parting_words_array.shift(); // remove the command
      parting_words = (parting_words_array instanceof Array) ? parting_words_array.join(' ') : parting_words_array;

      commander.die( bot, parting_words );
      break;
    case 'reconnect':
      parting_words_array = message.args[1].split(' ');
      parting_words_array.shift(); // remove the command
      parting_words = (parting_words_array instanceof Array) ? parting_words_array.join(' ') : parting_words_array;
      commander.reconnect(bot, parting_words);
      break;
    case 'whois':
      // console.log(message);
      chan = message.args[0];
      target = message.args[1].split(' ')[1];
      console.log('reply_to is: ', chan);
      console.log('target is: ', target);
      commander.whois( bot, chan, target );
      break;
    default:
      commander.unknown(bot, command, message);
  }
}


init();
