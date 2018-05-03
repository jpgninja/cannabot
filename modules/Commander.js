/**
 * Commands.js
 *
 * @desc Commands module
 * @license Private
 * @version 0.1
 */

 let config = require("../config.js");
 let cheerio = require("cheerio");
 let rp = require("request-promise");
 let Custom = require("./Custom.js");
 let Core = require("./Core.js");
 let helpers = require("./Helpers.js");
 let Commander = function() {};

/**
 * env
 *
 * @description Global environment variable
 */
Commander.commands = {};


Commander.init = ( client ) => {
  // Initialize out commands
  let core_commands = Core.init( client );
  let custom_commands = Custom.init( client );

  Commander.client = client;

  addCommands( core_commands );
  addCommands( custom_commands );

};


/**
 * Generic run command
 *
 */
Commander.run = (command, message) => {
  let leave_message;
  let parting_words;
  let parting_words_array;
  let query;
  let query_array;
  let user;
  let chan;
  let target;
  let new_nick;
  let isCoreCommand = (typeof Core.commands[ command ] === 'object');
  let isCustomCommand = (typeof Custom.commands[ command ] === 'object');

  if (isCoreCommand) {
    Core[ Commander.commands[ command ].handler ]( message );
  }
  else if (isCustomCommand) {
    Custom[ Commander.commands[ command ].handler ]( message );
  }

}


/**
 * Core functional command
 *
 */
Commander.fn = ( fn, message) => {
  switch( fn ) {
    case 'fetch_url_meta':
      Core.getURLTitle( message );
      break;
  }
}



/**
 * unknown()
 *
 * @param client IRC instance
 * @param user Who to identify
 */
 Commander.unknown = (client, storage, command, message) => {
  let isCustomCommand = false;

  if (command === 'sf') {
    isCustomCommand = true;
  }
  if (command === 'setstrain') {
    isCustomCommand = true;
  }
  if (command === 'strains') {
    isCustomCommand = true;
  }

  // console.log('Unknown command from (%s): %s', message.nick, command);
  if (isCustomCommand) {
    Custom[command]({
      client: client,
      storage: storage,
      message: message
    });
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

let addCommands = ( commands ) => {
  // console.log("Adding to our current commands...", Commander.commands);

  for (var command in commands) {
    if (commands.hasOwnProperty( command )) {
      if (!Commander.commands.hasOwnProperty( command )) {
        Commander.commands[ command ] = commands[ command ];
      }
      else {
        console.log( Commander.commands, commands, command, Commander.commands[command])
        console.log( "ACK! addCommands() didn't work" );
        throw "ACK! addCommands() didn't work";
      }
    }
  }

  // console.log("We now have commands...", Commander.commands);
}




module.exports = Commander;
