# siili

A go client/server written in [jquery](http://jquery.com) and [expressjs](http://expressjs.com/).

By Frank Prößdorf <fp@notjusthosting.com>.


## Usage

Start with `node app.js`.


## TODO

* Part of the validation needs to move to a central place, because it needs to take place when passing and resigning, too.
* Count who has won at the end.
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
* Support different board sizes.
* Sort open games.


## NOTE

* Currently this implementation only works for browsers supporting css transitions.