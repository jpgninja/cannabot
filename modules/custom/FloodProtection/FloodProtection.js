/**
 * FloodProtection.js
 *
 * @desc Commands module
 * @license Private
 * @version 0.1
 */
'use strict';

let config = require('./config.js');
let rp = require('request-promise');
let helpers = require('../../Helpers.js');
let FloodProtection = function() {};

/**
 * env
 *
 * @description Global environment variable
 */
FloodProtection.state = {
  flooders: {}
};

FloodProtection.commands = {};


FloodProtection.init = ( client ) => {
  // Initialize out commands
  let core_commands = Core.init( client );
  let custom_commands = Custom.init( client );

  FloodProtection.client = client;

  addCommands( core_commands );
  addCommands( custom_commands );

};


/**
 * increaseFloodScore()
 *
 * @param client IRC instance
 * @param user Who to increaseFloodScore
 * @param message Object full message
 */
FloodProtection.increaseFloodScore = (chan, user) => {
  let chanExists = FloodProtection.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && FloodProtection.state.flooders[chan].hasOwnProperty(user));

  if (chanExists && userExists) {
    FloodProtection.state.flooders[chan][user]++;
  } else if (chanExists && !userExists) {
    FloodProtection.state.flooders[chan][user] = 1;
  } else {
    FloodProtection.state.flooders[chan] = {};
    FloodProtection.state.flooders[chan][user] = 1;
  }

  // Remove
  // setTimeout(function(chan, user) {
  //   return function() {
  //     FloodProtection.decreaseFloodScore( chan, user );
  //   }
  // }, 2000);
}

/**
if (config.flood_protection.active) {
  setInterval(decreaseFloodScores, config.flood_protection.timeframe*1000);
}
**/

// function decreaseFloodScores() {
//   let nick;
//   let nicks;
//   let chan;
//   let chans = FloodProtection.state.flooders;

//   for (chan in chans) {
//     for (nick in nicks) {
//       if (nicks[ nick ] > 0) {
//         nicks[ nick ]--;
//       }
//     }
//   }
// }

/**
 * decreaseFloodScore()
 *
 * @param client IRC instance
 * @param user Who to decreaseFloodScore
 * @param message Object full message
 */
FloodProtection.decreaseFloodScore = (chan, user) => {
  let chanExists = FloodProtection.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && FloodProtection.state.flooders[chan].hasOwnProperty(user));

  if (chanExists && userExists) {
    if (FloodProtection.state.flooders[chan][user] > 0) {
      FloodProtection.state.flooders[chan][user]--;
    }
  } else if (chanExists && !userExists) {
    FloodProtection.state.flooders[chan][user] = 0;
  } else {
    FloodProtection.state.flooders[chan] = {};
    FloodProtection.state.flooders[chan][user] = 0;
    console.error("decreaseFloodScore(); This isn't good... I dunno what happened but it isn't good");
  }

  console.log("DECREASING: Flood score for '%s' is %d", user, FloodProtection.state.flooders[chan][user]);
}

/**
 * checkForFloods()
 *
 * @param client IRC instance
 * @param user Who to checkForFloods
 * @param message Object full message
 */
FloodProtection.checkForFloods = (client, chan, user) => {
  let flooders = [];
  let chanExists = FloodProtection.state.flooders.hasOwnProperty(chan);
  let userExists = (chanExists && FloodProtection.state.flooders[chan].hasOwnProperty(user));

  console.log('Checking for flooders');

  if (chanExists && userExists) {
    if (FloodProtection.state.flooders[chan][user] > config.flood_protection.limit) {
      FloodProtection.silence( client, chan, user );
      return true;
    }
  }
  return false;
}




module.exports = FloodProtection;