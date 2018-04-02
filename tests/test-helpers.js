
/**
 * The World's Shittiest Test Suite
 *
 */


const helpers = require('../modules/Helpers.js');
let obj;
let result;


/**
 * isMasterOfChan();
 *
 */
obj = {
  client: {whois: () => {
    return {host: 'cocacola'};
  }},
  user: 'devc1',
  chan: '#stonedcode'
};
result = '';
result = helpers.getHostMask( obj.client, obj.user );
console.log(result);
console.log('getHostMask(): Should get host back... %s', (result.length) ? 'Passed' : 'Failed! ***');
