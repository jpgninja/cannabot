/**
 * Storage.js
 *
 * @desc Storage module
 * @license Private
 * @version 0.1
 */

let Storage = function() {};

let default_value = {};

Storage.db = default_value;

Storage.get = ( chan, key ) => {
  let ret = {};

  if ( ( chan in Storage.db ) && ( key in Storage.db[ chan ] ) ) {
    ret = Storage.db[ chan ][ key ];
  }

  return ret;
}

/**
 * getHostMask()
 *
 * @description Get a *!*host*@* hostmask for banning, muting, or otherwise
 * @param client IRC client
 * @param target nick
 */
Storage.set = (chan, key, value) => {
  Storage.db[ chan ][ key ] = value;
}

/**
 * getHostMask()
 *
 * @description Get a *!*host*@* hostmask for banning, muting, or otherwise
 * @param client IRC client
 * @param target nick
 */
Storage.add = (chan, key, value) => {
  let delta;
  let value_after;
  let value_before = Storage.db[ chan ][ key ].length;

  Storage.db[ chan ][ key ].push( value );

  value_after = Storage.db[ chan ][ key ].length;
  delta = value_after - value_before;

  return delta;
}


Storage.reset = () => {
  Storage.db = default_value;
}



module.exports = Storage;
