# Node IRC bot

* Working with [node-irc](https://github.com/martynsmith/node-irc)

Do an `npm i` and see where that gets you. You'll probably need other packages, too.

!help is broken but would otherwise give you commands.

Of interest:

* `./app.js`
* `./modules/*.js`

---

## Huge refactor left everything broken

I fixed up 80% of it and pushed. The rest is "you get the picture" until I've got some more hours.

Yet to test:

* `!k`
* `!kb`
* `!help` needs a rewrite since everything's coming in dynamically now. Would like this to PM all commands to admins, and respond public commands publicly to non-admins.
* `!die` not sending message? is this the new parting words fn?
