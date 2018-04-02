let helpers = require('./modules/Helpers.js');
let cannabis = require('./modules/custom/cannabis/Cannabis.js');

cannabis.search_seedfinder({
  say: () => {
    return;
  }
}, {
  nick: 'test',
  args: ['#dfoof', "!sf clockwork orange : riot "]
})
