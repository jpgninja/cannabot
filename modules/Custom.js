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
  Custom.commands = { // This is a Gatekeeper which allows/disallows commands to be run.
    "!sf": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'sf'
    },
    "!setstrain": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'set_strain'
    },
    "!straincheck": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'list_strains'
    },
    "!strains": {
      desc: 'Custom.Cannabis',
      module: 'Cannabis',
      handler: 'list_strains'
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
  // Custom[ Cannabis ][sf_search]( message ); // We need to do this dynamically @TODO
}
// @TODO hard coded. ugly
Custom.list_strains = ( message ) => {
  Custom.Cannabis.list_strains( message );
}
// @TODO hard coded. ugly
Custom.set_strain = ( message ) => {
  Custom.Cannabis.set_strain( message );
}
// @TODO hard coded. ugly
Custom.terp = ( message ) => {
  Custom.Cannabis.terp( message );
}

// this gets us half there? Or maybe works? @TODO Test
let addCommands = ( commands ) => {
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
}


module.exports = Custom;
