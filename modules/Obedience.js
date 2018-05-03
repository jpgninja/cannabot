/**
 * Commands.js
 *
 * @desc Commands module
 * @license Private
 * @version 0.1
 */
let config = require('../config.js');
var Obedience = function() {};



Obedience.isService = ( user ) => {
  let userExists = false;
  let filtered = [];
  user = user.toLowerCase();

  filtered = config.services.filter(service => (service.toLowerCase() === user));
  userExists = (filtered.length>0);
  return userExists;
}

Obedience.isMasterOfChan = ( user, chan ) => {
  let chanExists = config.rules.hasOwnProperty( chan );
  let isMasterOfChan = (chanExists) ? (config.rules[chan].admins.indexOf(user.toLowerCase()) > -1) : false ;

  return isMasterOfChan;
}

Obedience.isChan = ( chan ) => {
  return config.rules.hasOwnProperty( chan.toLowerCase() );
}

Obedience.isPublicCommand = ( chan, command ) => {
  let chanExists = config.rules.hasOwnProperty( chan );
  let isPublicCommandInChan = (chanExists) ? (config.rules[chan].commands.indexOf(command.toLowerCase()) > -1) : (command === '!help') ? true : false ;

  return isPublicCommandInChan;
}

module.exports = Obedience;
