'use strict';

let bot;
const irc = require('irc');
const helpers = require('./modules/Helpers.js');
const Commander = require('./modules/Commander.js');
const obedience = require('./modules/Obedience.js');
const storage = require('./modules/Storage.js');
const config = require('./config.js');

let init = () => {
  bot = new irc.Client('irc.freenode.net', config.persona.nick, config.persona);
  Commander.init( bot );
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
  let commandIsPublicInChan;

  bot.addListener('error', function(message) {
      console.log('error: ', message);
  });


  /**
   * Listening for Channel Messages
   *
   */
  bot.addListener('message#', (from, to, text, message) => {
    // let command = message.args[1];
    let urlTest = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");


    from = message.nick;
    command = message.args[1].split(' ')[0];
    isMonitoredChan = obedience.isChan( to );
    isMasterOfChan = obedience.isMasterOfChan( from, to );
    isService = obedience.isService( from );
    // isValidCommand = (command.slice(0, 1) === '!');
    // isValidPromoteCommand = (command.slice(0, 1) === '+');
    // isValidDemoteCommand = (command.slice(0, 1) === '-');
    // isValidModeCommand = ( isValidPromoteCommand || isValidDemoteCommand );
    containsURL = urlTest.test( text );
    // command = command.slice(1).toLowerCase();
    command = command.toLowerCase();
    commandIsPublicInChan = obedience.isPublicCommand( to, command );

    // isValidCommand = ( isMonitoredChan && isMasterOfChan && ( isValidCommand || isValidModeCommand ) );

    // if (!isMasterOfChan) {
    //   bot.say(from, "not master." );
    // }
    // if (!isMonitoredChan) {
    //   bot.say(from, "not monitored chan: "+ message.args[0]);
    // }

    if (config.flood_protection.active) {
      core.increaseFloodScore(to, message.nick);
      core.checkForFloods(bot, message.args[0], message.nick);
    }

    console.log("%s isMasterOfChan... %s", from, isMasterOfChan);
    console.log("%s commandIsPublicInChan... %s", command, commandIsPublicInChan);
    if (isMasterOfChan || commandIsPublicInChan ) {
      // run
      console.log('running command');
      Commander.run( command, message );
    }

    if ( config.preview_titles && containsURL && isMonitoredChan ) {
      Commander.fn( 'fetch_url_meta', message );
    }

    // if (isValidCommand) {
    //   // console.log("Command is '" +command+ "' and Message is:");
    //   console.log("Command is '" +command+ "'");

    //   if ( isValidPromoteCommand ) {
    //     if (command === 'o') {
    //       core.op( bot, to, command, message );
    //     }
    //     else if (command === 'v') {
    //       core.voice( bot, to, command, message );
    //     }
    //   }
    //   else if ( isValidDemoteCommand ) {
    //     if (command === 'o') {
    //       core.deop( bot, to, command, message );
    //     }
    //     if (command === 'v') {
    //       core.devoice( bot, to, command, message );
    //     }
    //   }
    //   else {
    //     Commander.run(command, message);
    //   }
    // }
    // else if ( isService ) {
    //   console.log('Message from Service... Unhandled');
    // }
    // else if ( config.preview_titles && containsURL && isMonitoredChan ) {
    //   core.getURLTitle( bot, to, text );
    // }
    // else if ( isMonitoredChan && !isMasterOfChan ) {
    //   command = command.slice(1).toLowerCase();
    //   if (command === 'g') {
    //     Commander.run( command, message );
    //   }
    //   if (command === 'sf') {
    //     // Custom.sf( bot, to, command, message );
    //     Commander.run(command, message);
    //   }
    // }

  });


/**
 * Listening for PM's
 *
 */
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
      Commander.run(command, message);
    }
  });
*/
}


init();
