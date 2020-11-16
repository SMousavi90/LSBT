const express = require('express');
const morgan = require('morgan'); //morgan is a logger
const dao = require('./dao.js');
const jwt = require('express-jwt'); //provide an authentication system based on a json web token
const jsonwebtoken = require('jsonwebtoken'); //used to generate a json token
const cookieParser = require("cookie-parser"); //parse Cookie header and populate req.cookies with an object keyed by the cookie names.
const { check, validationResult } = require('express-validator'); //to validate passed parameters

const PORT = 3001;
const BASEURI = '/api';

const dbErrorObj = { 'param': 'Server', 'msg': 'Database error' };
const authErrorObj = { 'param': 'Server', 'msg': 'Authorization error' };

const jwtSecret = "9SMivhSVEMs8KMz3nSvEsbnTBT4YkKaY4pnS957cDG7BID6Z7ZpxUC0jgnEqR0Zm";

app = new express();

//app.use(morgan('combined')); //to print log as Standard Apache combined log output.
app.use(express.json()); //method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(cookieParser());

const expireTime = 3600 * 24 * 7; //7 days

app.post(BASEURI + '/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    dao.login(username, password)
        .then((result) => {
            if (result.passRes == false) {
                res.status(500).json({ param: 'Server', code: 2, msg: 'wrong password' });
            } else {
                const token = jsonwebtoken.sign({ username: username }, jwtSecret, { expiresIn: expireTime }); //create token
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000 * expireTime });
                res.status(200).json({ userId: result.userId, username: username, roleId: result.roleId, name: result.name });
            }
        })
        .catch((err) => {
            if (err == null)
                res.status(500).json({ param: 'Server', code: 1, msg: 'wrong username' });
            else
                res.status(503).json(dbErrorObj);
        });

});

app.post(BASEURI + '/logout', (req, res) => {
    res.clearCookie('token').end();
});


//all next APIs require authentication (express-jwt)
//app.use is executed everytime that app receives a request
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token,
        algorithms: ['HS256']
    })
);

//to handle each UnauthorizedError
app.use(function (err, req, res, next) { //used when i call isAuthenticated (client side) and the user is not authenticated
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

//get a user info (used by client to reauthenticate itself - getting its user info)
app.get(BASEURI + '/user', (req, res) => {
    const username = req.user.username;
    dao.getUserById(username)
        .then((user) => res.status(200).json({ userId: user.UserId, username: user.Username, roleId: user.RolId, name: user.Name + " " + user.LastName }))
        .catch(() => res.status(503).json(dbErrorObj));
});


app.get('/api/getStudentCurrentCourses/:userId', (req, res) => {
    dao.getStudentCurrentCourses(req.params.userId)
        .then((row) => {
            if (!row) {
                res.status(404).send();
            } else {
                res.json(row);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get('/api/getAvailableLectures/:courseId', (req, res) => {
    dao.getAvailableLectures(req.params.courseId)
        .then((row) => {
            if (!row) {
                res.status(404).send();
            } else {
                res.json(row);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.post('/api/bookLecture', (req, res) => {
    dao.bookLecture(req.body.lectureId, req.body.userId, req.body.scheduleDate)
        .then((result) => res.status(200).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

app.get('/api/bookingHistory/:userId', (req, res) => {
    dao.getBookingHistory(req.params.userId)
        .then((rows) => {
            if (!rows) {
                res.status(404).send();
            } else {
                res.json(rows);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

//PUT /cancelReservation/<bookingId>
app.put('/api/cancelReservation/:bookingId', (req, res) => {
    dao.cancelReservation(req.params.bookingId)
        .then((result) => res.status(200).end())
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

app.get(BASEURI + '/teacher/:userId/notification', (req,res)=>{  
    dao.checkNotification(req.params.userId)
        .then(()=>{
            dao.updateLecture(req.params.userId)
            .then(()=>{
                dao.getNotification(req.params.userId)
                .then((notifications)=>{res.json(notifications);})
                .catch(()=>{res.status(500).json({ 'error': 'there are no notifications' }); });
            })
            .catch(()=>{});
            
        })
        .catch(()=>{res.status(500).json({ 'error': 'problems during notification check' }); });

});

app.put(BASEURI + '/teacher/:userId/updatenotification', (req, res) => {
   
    dao.updateNotification(req.params.userId)
        .then(()=>{res.status(200);})
        .catch(()=>{console.log("here");res.status(500).json({ 'error': 'error while updating notification' }); });
  });


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));