let Config = {
  persona: {
    nick: "cannabot",
    userName: "spaghetti",
    realName: "moms spaghetti",
    port: 6667,
    localAddress: null,
    debug: false,
    showErrors: false,
    autoRejoin: false,
    autoConnect: true,
    channels: ["#tesla"],
    secure: false,
    selfSigned: false,
    certExpired: false,
    floodProtection: false,
    floodProtectionDelay: 1000,
    sasl: false,
    retryCount: 3,
    retryDelay: 10000,
    stripColors: false,
    // channelPrefixes: "&#",
    messageSplit: 1200,
    encoding: ""
  },
  flood_protection: {
    active: false,
    limit: 3,
    timeframe: 5
  },
  users: {
    '#tesla': ['elon', 'astroboy'],
    '##boring': ['elon']
  },
  services: ['ChanServ', 'NickServ'],
  messages: {
    kick: "kbai."
  }
}

module.exports = Config;
