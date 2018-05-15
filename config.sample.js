let Config = {
  persona: {
    nick: "bot",
    userName: "username",
    realName: "john d'oh!",
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
    server: 'irc.dal.net',
    // channelPrefixes: "&#",
    messageSplit: 1200,
    encoding: ""
  },
  preview_titles: true,
  flood_protection: {
    active: false,
    limit: 3,
    timeframe: 5
  },
  modules: [
    'Commander',
    'Custom',
    'Helpers',
    'Obedience',
    'Storage'
  ],
  rules: {
    "#tesla": {
      admins: ["elon", "astroboy"],
      commands: ['!g', '!whois']
    },
    "##boring": {
      admins: ["elon"],
      commands: ['!g', '!whois']
    }
  },
  services: ['ChanServ', 'NickServ'],
  messages: {
    kick: "kbai.",
    quit: "kbai."
  }
}

module.exports = Config;
