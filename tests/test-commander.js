
/**
 * The World's Shittiest Test Suite
 *
 */

/**


                    _                          _
 _ __   ___  ___  __| |___  __      _____  _ __| | __
| '_ \ / _ \/ _ \/ _` / __| \ \ /\ / / _ \| '__| |/ /
| | | |  __/  __/ (_| \__ \  \ V  V / (_) | |  |   <
|_| |_|\___|\___|\__,_|___/   \_/\_/ \___/|_|  |_|\_\



**/

const config = require('./test-config.js');
const commander = require('../modules/Commander.js');
let obj;
let now;
let result;
let expected;
let client = {
  say: ()=> {},
  send: ()=> {},
  whois: () => {}
};

/**
 * increaseFloodScore();
 *
 */
now = Date.now();
obj = {
  user: 'devc1',
  chan: '#stonedcode',
  timestart: now,
  messages_sent: 0,
  limit: config.flood_protection.limit
};
obj.messages_sent++;
commander.increaseFloodScore( obj.chan, obj.user );
result = commander.checkForFloods( client, obj.chan );
expected = (obj.messages_sent >= obj.limit) ? (result.length>0) : (result.length===0);
console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.messages_sent, Date.now()-obj.timestart, (expected) ? 'Passed' : 'Failed! ***');

obj.messages_sent++;
commander.increaseFloodScore( obj.chan, obj.user );
result = commander.checkForFloods( client, obj.chan );
expected = (obj.messages_sent >= obj.limit) ? (result.length>0) : (result.length===0);
console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.messages_sent, Date.now()-obj.timestart, (expected) ? 'Passed' : 'Failed! ***');

obj.messages_sent++;
commander.increaseFloodScore( obj.chan, obj.user );
result = commander.checkForFloods( client, obj.chan );
expected = (obj.messages_sent >= obj.limit) ? (result.length>0) : (result.length===0);
console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.messages_sent, Date.now()-obj.timestart, (expected) ? 'Passed' : 'Failed! ***');

obj.messages_sent++;
commander.increaseFloodScore( obj.chan, obj.user );
result = commander.checkForFloods( client, obj.chan );
expected = (obj.messages_sent >= obj.limit) ? (result.length>0) : (result.length===0);
console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.messages_sent, Date.now()-obj.timestart, (expected) ? 'Passed' : 'Failed! ***');


obj.messages_sent++;
commander.increaseFloodScore( obj.chan, obj.user );
result = commander.checkForFloods( client, obj.chan );
expected = (obj.messages_sent >= obj.limit) ? (result.length>0) : (result.length===0);
console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.messages_sent, Date.now()-obj.timestart, (expected) ? 'Passed' : 'Failed! ***');


// console.log('increaseFloodScore(): %d message(s) in %s milliseconds... %s', obj.user, obj.chan, (result === false) ? 'Passed' : 'Failed! ***');
