const express = require('express');
const morgan = require('morgan'); //morgan is a logger
const moment = require('moment');
var nodemailer = require('nodemailer');
const dao = require('./dao.js');
const jwt = require('express-jwt'); //provide an authentication system based on a json web token
const jsonwebtoken = require('jsonwebtoken'); //used to generate a json token
const cookieParser = require("cookie-parser"); //parse Cookie header and populate req.cookies with an object keyed by the cookie names.

const PORT = 3001;
const BASEURI = '/api';

const dbErrorObj = { 'param': 'Server', 'msg': 'Database error' };
const authErrorObj = { 'param': 'Server', 'msg': 'Authorization error' };

const jwtSecret = "9SMivhSVEMs8KMz3nSvEsbnTBT4YkKaY4pnS957cDG7BID6Z7ZpxUC0jgnEqR0Zm";

var multer = require('multer')
var cors = require('cors');

//dao.setDb("db/PULSeBS_test.db");
//dao.setDb("db/PULSeBS_test_empty.db");

//You activate the test database by running
// npm start --test=true
if (process.env.npm_config_test === "true") {
    console.log("Test database activated");
    dao.setDb("db/PULSeBS_test_clear.db");

}
else {
    dao.setDb("db/PULSeBS.db");
}

let app = new express();

app.use(morgan('dev')); //to print log as Standard Apache combined log output.
app.use(express.json()); //method inbuilt in express to recognize the incoming Request Object as a JSON Object
app.use(cookieParser());
app.use(cors());
var fs = require('fs');
const neatCsv = require('neat-csv');

const expireTime = 3600 * 24 * 7; //7 days

app.post(BASEURI + '/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    dao.login(username, password)
        .then((result) => {
            if (result.passRes == false) {
                res.status(500).json({ param: 'Server', code: 2, msg: 'wrong password' });
            } else {
                const token = jsonwebtoken.sign({ username: result.userId }, jwtSecret, { expiresIn: expireTime }); //create token
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
                res.status(500).send();
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
    dao.getAvailableLectures(req.params.courseId, req.user.username)
        .then((row) => {
            if (!row) {
                res.status(500).send();
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
        .then((result) => {
            if (result == true) {
                dao.getBookingDetails(req.body.lectureId, req.body.userId)
                    .then((book) => {
                        sendMailToStudent(book);
                        res.json({ reserved: true });
                        // res.status(200).end();
                    })
                    .catch((err) => res.status(500).json({
                        errors: [{ 'param': 'Server', 'msg': err }]
                    }));
            } else if (result == false) {
                res.json({ reserved: false });
                // res.status(200).end();
            }



        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }]
        }));
});

app.get('/api/bookingHistory/:userId', (req, res) => {
    dao.getBookingHistory(req.params.userId)
        .then((rows) => {
            if (!rows) {
                res.json([]); //if its the last element, then return an empty array
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
app.put('/api/cancelReservation/:bookingId/:lectureId', (req, res) => {
    dao.cancelReservation(req.params.bookingId, req.params.lectureId)
        .then((result) => {
            if (result == null) {
                dao.manageQueueReservation(req.params.lectureId)
                    .then((result) => {
                        if (result !== null) {
                            sendMailToStudent(result);
                        }
                        res.status(200).end();
                    })
                    .catch((err) => res.status(500).json({
                        errors: [{ 'param': 'Server', 'msg': err }],
                    }));
            }
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

app.get(BASEURI + '/teacher/:userId/notification', (req, res) => {
    dao.checkNotification(req.params.userId)
        .then(() => {
            dao.updateLecture(req.params.userId)
                .then(() => {
                    dao.getNotification(req.params.userId)
                        .then((notifications) => { res.json(notifications); })
                        .catch(() => { res.status(500).json({ 'error': 'there are no notifications' }); });
                })
                .catch(() => { });

        })
        .catch(() => { res.status(500).json({ 'error': 'problems during notification check' }); });

});

app.put(BASEURI + '/teacher/:userId/updatenotification', (req, res) => {

    dao.updateNotification(req.params.userId)
        .then(() => { res.status(200); })
        .catch(() => res.status(500).json({ 'error': 'error while updating notification' }));
});

app.get(BASEURI + '/getTeacherCourses', (req, res) => {
    dao.getTeacherCourses(req.user.username)
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get(BASEURI + '/getCourseLectures/:courseId', (req, res) => {
    dao.getCourseLectures(req.params.courseId, req.user.username)
        .then((lectures) => {
            res.json(lectures);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get(BASEURI + '/getLectureStudents/:lectureId', (req, res) => {
    dao.getLectureStudents(req.params.lectureId)
        .then((lectures) => {
            res.json(lectures);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.post(BASEURI + '/cancelLecture/:lectureId', (req, res) => {
    dao.cancelLecture(req.params.lectureId)
        .then(() => {
            dao.getStudentlistOfLecture(req.params.lectureId)
                .then((lecture) => {
                    sendCancelationMailToStudent(lecture);
                    res.status(200).end();
                })
                .catch((err) => {
                    res.status(500).json({
                        errors: [{ 'param': 'Server', 'msg': err }],
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});


app.get(BASEURI + '/getTeacherStats/:period/:userId/:startDate/:endDate/:courseId', (req, res) => {
    dao.getTeacherStats(req.params.period, req.params.userId, req.params.startDate, req.params.endDate, req.params.courseId)
        .then((data) => {
            res.json(data);
        })
});

app.post(BASEURI + '/makelectureonline/:lectureId', (req, res) => {
    dao.makeLectureOnline(req.params.lectureId)
        .then(() => {
            res.status(200).end();
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});
//Story 11
app.get(BASEURI + '/getAllCourses', (req, res) => {
    dao.getAllCourse()
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get(BASEURI + '/getBookingStatistics/:period/:startDate/:endDate', (req, res) => {
    dao.getBookingStatistics(req.params.period, req.params.startDate, req.params.endDate)
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});
app.get(BASEURI + '/getCancellationStatistics/:period/:startDate/:endDate', (req, res) => {
    dao.getCancellationStatistics(req.params.period, req.params.startDate, req.params.endDate)
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});
app.get(BASEURI + '/getAttendanceStatistics/:period/:startDate/:endDate', (req, res) => {
    dao.getAttendanceStatistics(req.params.period, req.params.startDate, req.params.endDate)
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get(BASEURI + '/getContactTracingReport/:userId', (req, res) => {

    dao.getContactTracingReport(req.params.userId)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.get(BASEURI + '/getPositiveStudents', (req, res) => {

    dao.getPositiveStudents(req.query.userId, req.query.name, req.query.lastName)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'param': 'Server', 'msg': err }],
            });
        });
});

app.post(BASEURI + '/uploadDataCSV', (req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'upload')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
    var upload = multer({ storage: storage }).any();

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {
            let f = req.files[0];
            fs.rename(f.path,
                "upload/" + req.body.importType + ".csv", function (err) {
                    if (err) console.log('ERROR: ' + err);
                });

            f.filename = req.body.importType + ".csv";
            f.path = "upload/" + f.filename;
            setTimeout(function() {
                makeCSVArray(f, req.body.importType, res);
            }, 2000)
        }
    });
});

makeCSVArray = (file, type, res) => {
    fs.readFile(file.path, async (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        let csvData = await neatCsv(data);
        dao.importCSVData(csvData, type)
            .then((data) => {
                res.end("File has been uploaded");
            })
            .catch((err) => {
                res.status(500).json({
                    errors: [{ 'param': 'Server', 'msg': err }],
                });
            });
    })
}

module.exports = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);

    //send mail to teachers once a course deadline expires
    /*dao.getAllLectures()
        .then((res) => {

            res.forEach(function (e) {
                setTimer(e.BookingDeadline, insertNotification, e);
            });
        })
        .catch((err) => console.log(err));*/
});

function setTimer(date, func, lecture) {

    const d = moment(date);
    var now = moment();
    const delay = d.valueOf() - now.valueOf();

    var diff = Math.max(delay, 0);
    if (diff > 0x7FFFFFFF) //setTimeout limit is MAX_INT32=(2^31-1)
        setTimeout(function () { setTimer(date, func, lecture); }, 0x7FFFFFFF);
    else
        setTimeout(func, diff, lecture);
}

function insertNotification(lecture) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "politotestflight@gmail.com",
            pass: "testme123"
        }
    });

    var subject = `Bookings of lecture ${lecture.CourseName} scheduled on ${lecture.Schedule}`;
    var body = `The lecture of the course ${lecture.CourseName} scheduled on ${lecture.Schedule} has been booked by ${lecture.nStudents} students.`;

    var mailOptions = {
        from: "politotestflight@gmail.com",
        to: lecture.Email + ",r.meydanshahi@gmail.com",
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendMailToStudent(book) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "politotestflight@gmail.com",
            pass: "testme123"
        }
    });

    var subject = `Booking confirmation of lecture ${book.CourseName} scheduled on ${book.Schedule}`;
    var body = `Dear ${book.Name}, your booking for lecture of ${book.CourseName} scheduled on ${book.Schedule} has been confirmed.`;

    var mailOptions = {
        from: 'politotestflight@gmail.com',
        to: book.Email + ",r.meydanshahi@gmail.com",
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendCancelationMailToStudent(lecture) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "politotestflight@gmail.com",
            pass: "testme123"
        }
    });

    var subject = `Cancelation of the lecture ${lecture.CourseName} scheduled on ${lecture.Schedule}`;
    var body = `Dear Student, the lecture of ${lecture.CourseName}, presented by 
    Professor ${lecture.TeacherName}, that was scheduled on ${lecture.Schedule} is canceled.`;

    var mailOptions = {
        from: 'politotestflight@gmail.com',
        to: lecture.Emails_List + ",r.meydanshahi@gmail.com",
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


