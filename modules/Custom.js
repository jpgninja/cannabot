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
Custom.commands = [
  {
    command: "sf",
    class: Custom.Cannabis
  },
  {
    command: "terp",
    class: Custom.Cannabis
  }
];

Custom.Cannabis = require('./custom/cannabis/Cannabis.js');


// @TODO hard coded. ugly
Custom.sf = ( client, message ) => {
  console.log(message);
  Custom.Cannabis.sf_search( client, message );
}

// @TODO hard coded. ugly
Custom.terp = ( client, message ) => {
  Custom.Cannabis.terp( client, message );
}

Custom.findCommand = ( client, command, message ) => {
  console.log('finding custom command... ');
  // for each in Custom.commands match command to Custom.commands[i].command
  // If so, class is Custom.commands[i].class and emthod is Custom.commands[i].command
  // lol will that even work?
}

Custom.addCommands = ( ) => {
  // @TODO

  for (key in Custom.Cannabis) {
    // skip loop if the property is from prototype
    if (!results.hasOwnProperty(result)) continue;

    // LOL no way this works when we finally try to run it
    Custom.commands.push({
      command: key,
      class: Custom.Cannabis
    });
  }
}



module.exports = Custom;
