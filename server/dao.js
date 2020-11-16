'use strict' //strict mode - prevent using undeclared variables

const StudentCourse = require('./Entities/StudentCourse');
const LecturesSchedule = require('./Entities/LecturesSchedule');
const BookingHistory = require('./Entities/BookingHistory');

const moment = require('moment');
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('db/PULSeBS.db', (err) => {
    if (err) {
        throw err;
    }
});


const createStudentCourse = function (row) {
    return new StudentCourse(row.CourseId, row.Name, row.Description, row.Semester, row.StudentId);
}

const createAvailableLectures = function (row) {
    return new LecturesSchedule(row.LectureId, row.Schedule, row.ClassNumber, row.TeacherName, row.CourseName, row.UserId, row.ClassId, row.BookingId);
}

const createBookingHistory = function (row) {
    return new BookingHistory(row.BookingId, row.StudentId, row.LectureId, row.Presence, row.Canceled, row.Reserved, 
        row.CancelDate, row.ReserveDate, row.BookDate, row.Name, row.BookingDeadline, row.TeacherName);
}

exports.checkNotification = function (userId){
    return new Promise((resolve, reject) => {
        
        const sql = 
       `INSERT INTO teachernotification 
                (teacherid, 
                lectureid, 
                date, 
                sentstatus) 
        SELECT teacherid, 
        lectureid, 
        schedule, 
        0
        FROM   lecture 
        WHERE  teacherid = ?
        AND notificationadded = 0
        AND Canceled = 0
        AND Date(notificationdeadline) = Date('now');
        `;
        
        db.run(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }else{
                resolve();
            }
            
        });
    });
}

exports.updateLecture = function (userId){
    return new Promise((resolve, reject) => {
        const sql = 
       `UPDATE Lecture
        SET NotificationAdded = 1
        WHERE TeacherId = ?
        AND Canceled = 0
        AND Date(notificationdeadline) = Date('now')
        `;

        db.run(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }else{
                resolve();
            }
            
        });
    });
}

exports.updateNotification = function (userId){
    return new Promise((resolve, reject) => {
        const sql = 
       `UPDATE TeacherNotification
        SET SentStatus = 1
        WHERE TeacherId = ?;
        `;

        db.run(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }else{
                resolve();
            }
            
        });
    });
}

exports.getNotification = function (userId) {
    
    return new Promise((resolve, reject) => { //promise is an object used to deal with asynchronous operations
        const sql = `
        SELECT schedule, 
            NAME, 
            Count(*),
            TN.SentStatus
        FROM   teachernotification TN, 
            lecture L, 
            course C, 
            booking B 
        WHERE  TN.lectureid = L.lectureid 
            AND L.courseid = C.courseid 
            AND L.lectureid = B.lectureid 
            AND TN.teacherid = ? 
        GROUP  BY NAME; `;

        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const notifications = rows.map((notification) => ({
                    Name: notification.Name,
                    Schedule: notification.Schedule,
                    nStudents: notification['Count(*)'],
                    SentStatus: notification.SentStatus
                    
                }));
                //console.log(notifications)
                resolve(notifications);
            }
        });
    });
};

exports.getUserById = function (username) {
    //console.log(username);

    return new Promise((resolve, reject) => { //promise is an object used to deal with asynchronous operations
        const sql = 'SELECT * FROM User WHERE UserId = ?';
        db.get(sql, [username], (err, user) => {
            if (err) {
                reject(err);
            } else {
                //console.log(user);
                resolve(user);
            }
        });
    });
};

exports.login = function (username, password) {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT UserId, Name, LastName, Password, RolId, COUNT(*) AS count FROM User WHERE Username = ?';
        db.get(sql, [username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.count == 0) {
                    reject(err); //return null error
                } else { //username exist
                    //console.log(res);
                    bcrypt.compare(password, res.Password, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {

                            resolve({ userId: res.UserId, passRes: result, roleId: res.RolId, name: res.Name + " " + res.LastName }); //return true if equals, false if not equals

                        }
                    });
                }
            }
        });
    });
};

/**
 * Get all student courses 
 */
exports.getStudentCurrentCourses = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `Select sc.*, c.*
        From StudentCourse sc inner join Course c on sc.CourseId=c.CourseId
        Where sc.StudentId=?`;
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let data = rows.map((row) => createStudentCourse(row));
                resolve(data);
            }
        });
    });
}

/**
 * Get Available Lectures 
 */
exports.getAvailableLectures = function (id, userId) {
    return new Promise((resolve, reject) => {
        var currentDate = new Date; // get current date
        var firstDay = new Date(currentDate.setDate(currentDate.getDate())).toISOString();
        var lastDay = new Date(currentDate.setDate(currentDate.getDate() + 14)).toISOString();

        const sql = `Select U.UserId, C.ClassId, L.LectureId, Schedule,c.ClassNumber,U.Name || ' ' || U.LastName as TeacherName, cr.Name, cr.Name as CourseName, BookingId
        from Lecture L inner join Class C on l.ClassId=C.ClassId
        Inner join User U on U.UserId=L.TeacherId
        inner join Course cr on cr.CourseId = L.CourseId
        left join Booking b on b.LectureId = L.LectureId and (b.Canceled = 0 or b.Canceled IS NULL) and b.StudentId = ?
        where l.CourseId=?
        And l.Bookable=1 and l.Canceled=0
        And Schedule between ? and ?`;

        db.all(sql, [userId, id, firstDay.slice(0, 10), lastDay.slice(0, 10)], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let data = rows.map((row) => createAvailableLectures(row));
                resolve(data);
            }
        });
    });
}

/**
 * Book a Lecture 
 */
exports.bookLecture = function (lectureId, userId, scheduleDate) {
    return new Promise((resolve, reject) => {
        const sqlAlreadyBooked = `select BookingId from Booking where LectureId = ? and StudentId = ? and BookDate is not null and Canceled is null`;
        db.all(sqlAlreadyBooked, [lectureId, userId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0) {
                const sqlCapacity = `Select Capacity from Class where ClassId=(select ClassId from Lecture where LectureId=?)`;
                db.all(sqlCapacity, [lectureId], (err, rows) => {
                    if (err)
                        reject(err);
                    else if (rows.length === 0)
                        resolve(undefined);
                    else {
                        let capacity = rows[0].Capacity;
                        const sqlBookingCount = `Select Count(BookingId) BookedCount
                from Booking 
                where LectureId=? and BookDate is not null and Canceled is null`;
                        db.all(sqlBookingCount, [lectureId], (err, rows) => {
                            if (err)
                                reject(err);
                            else if (rows.length === 0)
                                resolve(undefined);
                            else {
                                let bookedCount = rows[0].BookedCount;
                                if (bookedCount < capacity) {
                                    const sqlBook = `Insert into Booking(StudentId, LectureId, BookDate) Values (?, ?, ?)`;
                                    db.run(sqlBook, [userId, lectureId, scheduleDate], (err, rows) => {
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(true);
                                    });
                                } else {
                                    resolve(false); // the class is full, the booking is not possible
                                }
                            }
                        });
                    }
                });
            } else {
                reject(err);
            }
        });
    });
}

/**
 * Get all reservations 
 */
exports.getBookingHistory = function (id) {
    return new Promise((resolve, reject) => {
        var currentDate = new Date; // get current date
        var firstDay = new Date(currentDate.setDate(currentDate.getDate())).toISOString();
        var lastDay = new Date(currentDate.setDate(currentDate.getDate() + 14)).toISOString();

        const sql = `select B.*, C.Name, L.BookingDeadline, U.Name || ' ' || U.LastName as TeacherName from 
        Booking B 
        left outer join Lecture L on L.LectureId = B.LectureId
        left outer join Course C on C.CourseId = L.CourseId
        left outer join User U on U.UserId = L.TeacherId
        where StudentId = ? and BookDate is not null and BookDate between ? and ? order by L.BookingDeadline asc`;
        db.all(sql, [id, firstDay.slice(0, 10), lastDay.slice(0, 10)], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else {
                let rents = rows.map((row) => createBookingHistory(row));
                resolve(rents);
            }
        });
    });
}

/**
 * Cancel an existing reservation with a given id.
 */
exports.cancelReservation = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Booking SET canceled=1, CancelDate=? WHERE BookingId = ?';
        db.run(sql, [new Date().toISOString().slice(0, 10), id], (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else
                resolve(null);
        })
    });
}