'use strict' //strict mode - prevent using undeclared variables

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('db/PULSeBS.db', (err) => {
    if (err) {
        throw err;
    }
});

exports.getUserById = function (username) {
    console.log(username);
    return new Promise((resolve, reject) => { //promise is an object used to deal with asynchronous operations
        const sql = 'SELECT * FROM User WHERE Username = ?';
        db.get(sql, [username], (err, user) => {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

exports.login = function (username, password) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT Name, LastName, Password, RolId, COUNT(*) AS count FROM User WHERE Username = ?';
        db.get(sql, [username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.count == 0) {
                    reject(err); //return null error
                } else { //username exist
                    bcrypt.compare(password, res.Password, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({passRes: result, roleId: res.RolId, name: res.Name + " " + res.LastName}); //return true if equals, false if not equals
                        }
                    });
                }
            }
        });
    });
};