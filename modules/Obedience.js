/**
 * Commands.js
 *
 * @desc Commands module
 * @license Private
 * @version 0.1
 */
let config = require('../config.js');
// let config = require('../tests/test-config.js');
var Obedience = function() {};


/**
 * Masters and Master Channels
 *
 * MUST BE LOWERCASE!
 *
 * @description Global environment variables
 *
 */
// Obedience.masters = ['devc'];
// Obedience.services = ['ChanServ', 'NickServ'];
// Obedience.channels = ['#stonedcode', '##cannabis'];


Obedience.isService = ( user ) => {
  let userExists = false;
  let filtered = [];
  user = user.toLowerCase();

  filtered = config.services.filter(service => (service.toLowerCase() === user));
  userExists = (filtered.length>0);
  return userExists;
}

// Obedience.isMaster = ( user ) => {
  // return ( Obedience.masters.indexOf( user.toLowerCase() ) > -1);
  // let isMaster = false;
  // Object.keys( config.users ).forEach(( chan ) => {
  //   for
  // return (user in config.users)( config.users.indexOf( user.toLowerCase() ) > -1);
// }

Obedience.isMasterOfChan = ( user, chan ) => {
  let chanExists = config.users.hasOwnProperty( chan );
  let isMasterOfChan = (!chanExists) ? false : (config.users[chan].indexOf(user.toLowerCase()) > -1);

  return isMasterOfChan;
}

Obedience.isChan = ( chan ) => {
  return config.users.hasOwnProperty( chan.toLowerCase() );
}

module.exports = Obedience;
