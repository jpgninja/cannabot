/**
 * Custom.js
 *
 * @TODO: Load modules from ./custom/* dynamically, and aggregate a list of Custom.commands.
 *
 * @desc Custom module
 * @license Private
 * @version 0.1
 */

var Custom = function() {};
/**
 * Modules and Commands
 *
 * MUST BE LOWERCASE!
 *
 * @description Global environment variables
 *
 */
Custom.modules = ['Cannabis'];


Custom.Cannabis = require('./custom/cannabis/Cannabis.js');

Custom.init = ( client ) => {
  Custom.client = client;

  Custom.Cannabis.init( Custom.client );
  Custom.commands = {
    "!sf": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'sf'
    },
    "!setstrain": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'setstrain'
    },
    "!strains": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'strains'
    },
    // "!terp": {
    //   desc: 'Custom.Cannabis',
    //   module: 'Cannabis',
    //   handler: 'terp'
    // }
  };

  return Custom.commands;
}



// @TODO hard coded. ugly
Custom.sf = ( message ) => {
  Custom.Cannabis.sf_search( message );
}

Custom.strains = ( message ) => {
  Custom.Cannabis.list_strains( message );
}

Custom.setstrain = ( message ) => {
  Custom.Cannabis.setstrain( message );
}

// @TODO hard coded. ugly
Custom.terp = ( message ) => {
  Custom.Cannabis.terp( message );
}


let addCommands = ( commands ) => {
  // console.log("Adding to our current commands...", Custom.commands);

  for (var command in commands) {
    if (commands.hasOwnProperty( command )) {
      if (!Custom.commands.hasOwnProperty( command )) {
        Custom.commands[ command ] = commands[ command ];
      }
      else {
        console.log( Custom.commands, commands, command, Custom.commands[command])
        console.log( "ACK! addCommands() didn't work" );
        throw "ACK! addCommands() didn't work";
      }
    }
  }

  // console.log("We now have commands...", Custom.commands);
}



module.exports = Custom;
