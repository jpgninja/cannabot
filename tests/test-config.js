let Config = {
  persona: {
    nick: "cannabot1",
    userName: "spaghetti",
    realName: "moms spaghetti",
    port: 6667,
    localAddress: null,
    debug: false,
    showErrors: false,
    autoRejoin: false,
    autoConnect: true,
    channels: ["#stonedcode"],
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
    active: true,
    limit: 3,
    timeframe: 1
  },
  users: {
    "#stonedcode": ["devc", "FraJah"],
    "##cannabis": ["devc"]
  },
  services: ['ChanServ', 'NickServ']
}

module.exports = Config;
