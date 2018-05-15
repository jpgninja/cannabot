# A Flexible & Extendable Node IRC Bot With Drop-In Custom Module Support

This project aims to be a flexible bot with some core built-in functionality, plus the ability to drop in Custom modules and have the bot manage them just as easily.

* Working with [node-irc](https://github.com/martynsmith/node-irc)

Do an `npm i` and see where that gets you. You'll probably need other packages, too; that's just me not having a procedure in place and wanting to keep the project files as clean as possible.

Make note of any missing projects and we'll get them in there.


`!help` is broken but would otherwise give you commands.

Of interest:

* `./app.js`
* `./config.sample.js`
	* `Config.persona.channels` is our autojoin channels
	* `Config.rules` is channels where we listen for commands
	* `Config.rules` is a list of admins/masters
	* `Config.rules.[INSERT CHAN HERE].admins` is a list of admins/masters for that chan (all commands available)
	* `Config.rules.[INSERT CHAN HERE].commands` is a list of public commands for that chan
* `./modules/custom/*.js` this is 90% working, with some hard-coded values in `Custom.js`... send a pull request, let's make it happen

---

## Huge refactor left everything broken

I fixed up 80% of it and pushed. The rest is "you get the picture" until I've got some more hours.

Yet to test:

* `!k` kicks person with optional message (or `Config.messages.kick`)
* `!kb` kick-bans person with optional message (or `Config.messages.kick`)
* `!help` needs a rewrite since everything's coming in dynamically now. Would like this to PM all commands to admins, and respond public commands publicly to non-admins.
* `!die` Should quit with optional message (or `Config.messages.quit`) _*** quit message not working, is this the new parting words fn? @TODO_


## Contribution requests

* Would love to have `Custom.js` dynamically looking for custom modules, and loading them in. The basic flow right now is to load the module, then run `CustomModule.init( client )` where client is the irc instance. This init returns a commands object `{'!command':{desc:'Description',handler: 'yourMethodName'}}` .... if anyone's out there... help!
* Gotta hugely decouple a bunch of this shit; feel free to restructure things and send a pull request
* The very first person who wants to code a Custom module's going to get stuck with the above
* They'll also likely want some sort of storage? I've half imnplemented that in the `Cannabis.js` custom module which uses it's own storage.
* Please harden this code. I feel like I'm running downhill with this stuff, where my legs are barely keeping up with the bugs. At some point this will slow down and I'll be able to add in functionality, but there are a ton of use-cases and I'm ending up having to built out a lot of the functionality from the ground up (like op'ing! kicking!)
* I'd like some sort of owner approval/password functionality eventually
* There's a bug if the admin sends a bad command, like `!thisisnotarealcommand` - I believe the bot crashes as of now. I haven't looked into it.