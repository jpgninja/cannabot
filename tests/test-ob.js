
/**
 * The World's Shittiest Test Suite
 *
 */

 
const obedience = require('../modules/Obedience.js');
let obj;
let result;


/**
 * isMasterOfChan();
 *
 */
obj = {
  user: 'devc1',
  chan: '#stonedcode'
};
result = obedience.isMasterOfChan( obj.user, obj.chan );
console.log('isMasterOfChan(): Is bad user (%s) in good chan (%s)... %s', obj.user, obj.chan, (result === false) ? 'Passed' : 'Failed! ***');


obj = {
  user: 'devc',
  chan: '#stonedcode'
};
result = obedience.isMasterOfChan( obj.user, obj.chan );
console.log('isMasterOfChan(): Is good user (%s) in good chan (%s)... %s', obj.user, obj.chan, (result === true) ? 'Passed' : 'Failed! ***');



obj = {
  user: 'foo1',
  chan: '#bar1'
};
result = obedience.isMasterOfChan( obj.user, obj.chan );
console.log('isMasterOfChan(): Is bad user (%s) in bad chan (%s)... %s', obj.user, obj.chan, (result === false) ? 'Passed' : 'Failed! ***');




/**
 * isService();
 *
 */
obj = 'NickServ';
result = obedience.isService( obj );
console.log('isService(): Is good user (%s)... %s', obj, (result === true) ? 'Passed' : 'Failed! ***');


obj = 'NiCKSeRV';
result = obedience.isService( obj );
console.log('isService(): Is good user (%s) with bad case... %s', obj, (result === true) ? 'Passed' : 'Failed! ***');


obj = 'OtherUser';
result = obedience.isService( obj );
console.log('isService(): Is bad user (%s)... %s', obj, (result === false) ? 'Passed' : 'Failed! ***');




/**
 * isChan();
 *
 */
obj = '#stonedcode';
result = obedience.isChan( obj );
console.log('isChan(): Is good chan (%s)... %s', obj, (result === true) ? 'Passed' : 'Failed! ***');


obj = '##CANNABIs';
result = obedience.isChan( obj );
console.log('isChan(): Is good chan (%s) with bad case... %s', obj, (result === true) ? 'Passed' : 'Failed! ***');


obj = '#sailor_moon';
result = obedience.isChan( obj );
console.log('isChan(): Is bad chan (%s)... %s', obj, (result === false) ? 'Passed' : 'Failed! ***');
