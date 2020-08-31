const Users = require("../models/users");
const Error = require('http-errors');
module.exports = async function saveUsers(req) {
    let users = new Users({
        username: req.body.username,
    });
    await users.save(function (err) {
        console.log("inside save")
        if (err) {
            return console.log(err);

        } else {
            console.log("inside created")
            return 'user created'
        }
    });
};