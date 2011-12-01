# siili

A go client/server written in [jquery](http://jquery.com) and [expressjs](http://expressjs.com/).

By Frank Prößdorf <fp@notjusthosting.com>.

## Libraries

* express 2.x
* couchdb

## Usage

Start with `node app.js`.


## TODO

* Mark dead stones when counting at the end of the game on the client side.
* Support different board sizes.
* Add dev, test and production environments.
* Filter active, passive, resigned and ended games.
* Add komi.
* Add time limit.
* Calculate user's rank.
* Add handicap depending on users' ranks.
* Review games.
* Push updates on her games to the user.
* Maybe change frontend code to use sammy.js or at least move the html into templates.
* Export sgf.
* Import sgf.
* Better visuals: Messages must be clearer, the border of the board should be nicer, cleaner structure and footer.
* Sort open games.
* Part of the validation needs to move to a central place, because it needs to take place when passing and resigning, too.


## NOTE

* Currently this implementation only works for browsers supporting css transitions.
