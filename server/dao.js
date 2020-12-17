"use strict"; //strict mode - prevent using undeclared variables

const StudentCourse = require("./Entities/StudentCourse");
const LecturesSchedule = require("./Entities/LecturesSchedule");
const BookingHistory = require("./Entities/BookingHistory");

const sqlite = require("sqlite3");
const bcrypt = require("bcrypt");
const moment = require("moment");

let db;

exports.setDb = function (dbname) {
  db = new sqlite.Database(dbname, (err) => {
    if (err) throw err;
  });
};

const createStudentCourse = function (row) {
  return new StudentCourse(
    row.CourseId,
    row.Name,
    row.Description,
    row.Semester,
    row.StudentId
  );
};

const createAvailableLectures = function (row) {
  return new LecturesSchedule(
    row.LectureId,
    row.Schedule,
    row.ClassNumber,
    row.TeacherName,
    row.CourseName,
    row.UserId,
    row.ClassId,
    row.BookButton,
    row.FreeSeats,
    row.Reserved
  );
};

const createBookingHistory = function (row) {
  return new BookingHistory(
    row.Schedule,
    row.EndTime,
    row.Bookable,
    row.CourseName,
    row.ClassNumber,
    row.TeacherName,
    row.BookingId,
    row.BookingDeadline,
    row.CourseId,
    row.LectureId
  );
};

exports.checkNotification = function (userId) {
  //X
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO teachernotification 
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
      } else {
        resolve(userId);
      }
    });
  });
};

exports.updateLecture = function (userId) {
  //X
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Lecture
        SET NotificationAdded = 1
        WHERE TeacherId = ?
        AND Canceled = 0
        AND Date(notificationdeadline) = Date('now')
        `;

    db.run(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(userId);
      }
    });
  });
};

exports.updateNotification = function (userId) {
  //X
  return new Promise((resolve, reject) => {
    const sql = `UPDATE TeacherNotification
        SET SentStatus = 1
        WHERE TeacherId = ?;`;

    db.run(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(userId);
      }
    });
  });
};

exports.getNotification = function (userId) {
  return new Promise((resolve, reject) => {
    //promise is an object used to deal with asynchronous operations
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
            AND B.Canceled IS NULL
        GROUP  BY NAME, L.Schedule; `;

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const notifications = rows.map((notification) => ({
          Name: notification.Name,
          Schedule: notification.Schedule,
          nStudents: notification["Count(*)"],
          SentStatus: notification.SentStatus,
        }));
        console.log(notifications)
        resolve(notifications);
      }
    });
  });
};

exports.getUserById = function (username) {
  //X
  //console.log(username);

  return new Promise((resolve, reject) => {
    //promise is an object used to deal with asynchronous operations
    const sql = "SELECT * FROM User WHERE UserId = ?";
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
    const sql =
      "SELECT UserId, Name, LastName, Password, RolId, COUNT(*) AS count FROM User WHERE Username = ?";
    db.get(sql, [username], (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.count == 0) {
          reject(err); //return null error
        } else {
          //username exist
          //console.log(res);
          bcrypt.compare(password, res.Password, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve({
                userId: res.UserId,
                passRes: result,
                roleId: res.RolId,
                name: res.Name + " " + res.LastName,
              }); //return true if equals, false if not equals
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
      if (err) reject(err);
      else if (rows.length === 0) resolve(undefined);
      else {
        let data = rows.map((row) => createStudentCourse(row));
        resolve(data);
      }
    });
  });
};

/**
 * Get Available Lectures
 */
exports.getAvailableLectures = function (id, userId) {
  //X
  return new Promise((resolve, reject) => {
    var currentDate = new Date(); // get current date
    var firstDay = new Date(
      currentDate.setDate(currentDate.getDate())
    ).toISOString().slice(0, 10);
    var lastDay = new Date(
      currentDate.setDate(currentDate.getDate() + 14)
    ).toISOString().slice(0, 10);
    
    const sql = `select BookingDeadline,U.UserId, l.Room as ClassId, L.LectureId, Schedule, l.Room as ClassNumber,
    U.Name || ' ' || U.LastName as TeacherName, 
    cr.Name, cr.Name as CourseName,case ava.FreeSeats when 0 then 0 else 1 end as BookButton,ava.FreeSeats,case when Reservetbl.Reserved=1 then 1 else 0 end as Reserved
    from Lecture L 
    Inner join User U on U.UserId=L.TeacherId
    inner join Course cr on cr.CourseId = L.CourseId
    inner join StudentCourse sc on sc.CourseId = L.CourseId
    left join AvailableSeats ava on ava.LectureId=l.LectureId
    left join (select LectureId,StudentId,Reserved from StudentFinalBooking where BookDate is null and Canceled is null and Reserved=1)Reservetbl
    on Reservetbl.LectureId=l.LectureId 
    and Reservetbl.StudentId=?
    where 
      l.LectureId not in(select LectureId from StudentFinalBooking where 
    StudentId=?  and 
    BookDate is not null and Canceled is null)
    and  l.CourseId=? 
    and   l.Bookable=1 and l.Canceled=0
      And BookingDeadline between ? and ?
    And sc.StudentId = ?
        `;
    db.all(
      sql,
      [userId, userId, id, firstDay, lastDay, userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(undefined);
        } else {
          //   console.log(rows);
          let data = rows.map((row) => createAvailableLectures(row));
          resolve(data);
        }
      }
    );
  });
};

/**
 * Book a Lecture
 */
exports.bookLecture = function (lectureId, userId, scheduleDate) {
  //X
  return new Promise((resolve, reject) => {
    const sqlAlreadyBooked = `select BookingId from Booking where LectureId = ? and StudentId = ? and BookDate is not null and Canceled is null`;
    db.all(sqlAlreadyBooked, [lectureId, userId], (err, rows) => {
      if (err) reject(err);
      else if (rows.length === 0) {
        const sqlCapacity = `select TotalSeats as Capacity from AvailableSeats where LectureId=?`;
        db.all(sqlCapacity, [lectureId], (err, rows) => {
          if (err) reject(err);
          else if (rows.length === 0) resolve(undefined);
          else {
            let capacity = rows[0].Capacity;
            const sqlBookingCount = `select BookCount as BookedCount from AvailableSeats where LectureId=?`;
            db.all(sqlBookingCount, [lectureId], (err, rows) => {
              if (err) reject(err);
              else if (rows.length === 0) resolve(undefined);
              else {
                let bookedCount = rows[0].BookedCount;
                if (bookedCount < capacity) {
                  const sqlBook = `Insert into Booking(StudentId, LectureId, BookDate) Values (?, ?,  datetime('now','localtime'))`;
                  db.run(
                    sqlBook,
                    [userId, lectureId],
                    (err, rows) => {
                      if (err) reject(err);
                      else resolve(true);
                    }
                  );
                } else {
                  // the class is full, the booking is not possible
                  const sqlResBook = `insert into Booking(StudentId,LectureId,BookDate)
                  values(?,?,datetime('now','localtime'))`;
                  db.run(sqlResBook, [userId, lectureId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(false);
                  });
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
};

/**
 * Get all reservations
 */
exports.getBookingHistory = function (id) {
  //X
  return new Promise((resolve, reject) => {
    // var currentDate = new Date(); // get current date
    // var firstDay = new Date(
    //   currentDate.setDate(currentDate.getDate())
    // ).toISOString();
    // var lastDay = new Date(
    //   currentDate.setDate(currentDate.getDate() + 14)
    // ).toISOString();

    const sql = `select  c.CourseId,b.Schedule,EndTime,BookingDeadline,NotificationDeadline,Bookable,l.LectureId,l.TeacherId,b.StudentId,
    c.Name as CourseName,ST.Name || ' ' || ST.LastName as StudentName,l.Room as ClassNumber,
    T.Name || ' ' || T.LastName as TeacherName,
    b.BookingId,BookDate,ReserveDate,l.Canceled as LectureCanceled
    from StudentFinalBooking b inner join user u on u.userid=b.StudentId 
    inner join lecture l on l.LectureId=b.LectureId
    inner join  Course c on l.CourseId=c.CourseId
    inner join  User  ST on St.UserId=b.StudentId
    inner join User T on T.UserId=L.TeacherId
    where b.BookDate is not null and b.Canceled is null and b.Schedule >=date()
    and L.Canceled = 0 
    and b.StudentId = ?`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        // console.log(err);
        reject(err);
      } else if (rows.length === 0) resolve(undefined);
      else {
        let res = rows.map((row) => createBookingHistory(row));
        resolve(res);
      }
    });
  });
};

/**
 * Cancel an existing reservation with a given id.
 */
exports.cancelReservation = function (id) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Booking SET canceled=1, CancelDate=? WHERE BookingId = ?";
    db.run(sql, [new Date().toISOString().slice(0, 10), id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(null);
      }
    });
  });
};

exports.manageQueueReservation = function (lectureId) {
  return new Promise((resolve, reject) => {
    const sql = `select  StudentId from StudentFinalBooking where LectureId=? 
        and BookDate is null and Canceled is null  and Reserved=1
        and ReserveDate=(select min(ReserveDate)MinReserveDate 
              from StudentFinalBooking
              where ReserveDate is not null and LectureId=?
              and BookDate is null and Canceled is null  and Reserved=1)
        `;
    db.all(sql, [lectureId, lectureId], (err, rows) => {
      if (err) reject(err);
      else {
        if (rows != null && rows.length > 0) {
          let newStudentId = rows[0].StudentId;
          if (newStudentId) {
            //if there's a waiting student
            let sql = `update Booking set Reserved=null ,ReserveDate=null ,BookDate=datetime('now', 'localtime')
                where StudentId=? and LectureId=?   
                `;
            db.run(sql, [newStudentId, lectureId], (err, rows) => {
              if (err) {
                reject(err);
              } else {
                let sqlEmail = `select b.Schedule,u.Name || ' ' || u.LastName as Name,c.Name as CourseName, u.Email
                    from StudentFinalBooking b inner join Course c on c.CourseId=b.CourseId
                    inner join user u on u.UserId=b.StudentId
                    where b.StudentId=? and b.LectureId=?   
                  `;
                db.all(sqlEmail, [newStudentId, lectureId], (err, rows) => {
                  if (err) {
                    reject(err);
                  } else {
                    if (rows != null && rows.length > 0) resolve(rows[0]);
                    else resolve(null);
                  }
                });
              }
            });
          }
        }else{
          resolve(null);
        }
      }
    });
  });
}

/**
 * Get all lectures
 */
exports.getAllLectures = function () {
  //getAllLectures scheduled for today or later //X
  return new Promise((resolve, reject) => {
    const sql = `select Schedule, BookingDeadline, U.Name || " " || U.LastName as Name, U.Email, C.Name as CourseName, COUNT(StudentId) AS nStudents from Lecture L 
        inner join User U on U.UserId=L.TeacherId
        inner join Course C on C.CourseId = L.CourseId
        left join Booking B on B.LectureId = L.LectureId and B.Canceled IS NULL 
        where Schedule > datetime('now', 'localtime') and BookingDeadline > datetime('now', 'localtime')
        and L.Canceled = 0
        GROUP BY L.LectureId`;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        resolve(rows);
      }
    });
  });
};

/*exports.getStudentsPerLecturePerProfessor = function (id)  {
    return new Promise((resolve, reject) => {
        const sql = `select StudentId ,U.LastName,  U.Name, C.Name as CourseName, Schedule, L.LectureId  from Booking B
        inner join Lecture L on B.LectureId = L.LectureId
        inner join Course C on C.CourseId = L.CourseId
        inner join User U on U.UserId = B.StudentId and B.Canceled IS NULL 
        where TeacherId = ? and L.Canceled = 0 and StudentId is not NULL`;
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else {
                resolve(rows);
            }
        });
    });
}*/

exports.getTeacherCourses = function (id) {
  return new Promise((resolve, reject) => {
    const sql = `select C.CourseId, Name FROM Lecture L 
        inner join Course C on C.CourseId = L.CourseId
        WHERE TeacherId = ?
        GROUP BY C.CourseId`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getCourseLectures = function (id, teacherId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT L.LectureId, L.Schedule, L.BookingDeadline,l.Room as ClassNumber, L.Bookable, L.Canceled, 
                    strftime("%Y-%m-%d", L.CancelDate) as CancelDate 
                FROM Lecture L
                WHERE L.CourseId = ?
                AND datetime(L.Schedule) > datetime('now','localtime')
                AND l.TeacherId=?
                ORDER BY L.Schedule`;
    db.all(sql, [id, teacherId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getLectureStudents = function (id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT U.Name || " " || U.LastName as 'Name', B.BookDate FROM StudentFinalBooking B
    INNER JOIN 'User' U ON U.UserId = B.StudentId
    WHERE B.LectureId = ?
    AND (b.Canceled IS NULL OR b.Canceled = 0)
    ORDER BY Name`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getBookingDetails = function (lectureId, userId) {
  return new Promise((resolve, reject) => {
    const sql = `select Schedule, U.Name || " " || U.LastName as 'Name', U.Email, C.Name as CourseName from Lecture L
        inner join Course C on C.CourseId = L.CourseId
        inner join StudentCourse SC on SC.CourseId = L.CourseId
        inner join User U on U.UserId = SC.StudentId
        where L.LectureId = ? and SC.StudentId = ?`;
    db.get(sql, [lectureId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.cancelLecture = function (lectureId) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Lecture SET Canceled=1, CancelDate=datetime('now','localtime') WHERE LectureId = ?`;
    db.run(sql, [lectureId], (err) => {
      if (err) {
        reject(err);
      } else resolve(true);
    });
  });
};

exports.getTeacherStats = function (
  period,
  userId,
  startDate,
  endDate,
  courseId
) {
  console.log(period, userId, startDate, endDate, courseId);
  return new Promise((resolve, reject) => {
    let sql = "";
    if (period === "W") {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, row_number() over(order by weekno) as weekno
      from BookCount
      where Schedule between ? and ?
      and TeacherId = ? and CourseId = ?
      group by weekNo`;
      else
        sql = `select avg(BookCount) as avg, row_number() over(order by weekno) as weekno
      from BookCount
      where Schedule between ? and ?
      and TeacherId = ?
      group by weekNo`;
    } else if (period === "M") {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, monthno
      from BookCount
      where Schedule between ? and ?
      and TeacherId = ? and CourseId = ?
      group by monthNo`;
      else
        sql = `select avg(BookCount) as avg, monthno
            from BookCount
            where Schedule between ? and ?
            and TeacherId = ?
            group by monthNo`;
    } else {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, row_number() over(order by Dayno) as Dayno
            from BookCount
            where Schedule between ? and ?
            and TeacherId = ?
            and CourseId = ?
            group by Dayno,CourseId,CourseName
            order by Dayno
            `;
      else
        sql = `select avg(BookCount) as avg, row_number() over(order by Dayno) as Dayno
            from BookCount
            where Schedule between ? and ?
            and TeacherId = ?
            group by Dayno,CourseId,CourseName
            order by Dayno`;
    }
    if (courseId != "null" && courseId != "All") {
      db.all(sql, [startDate, endDate, userId, courseId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.all(sql, [startDate, endDate, userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }
  });
};

exports.getStudentlistOfLecture = function (lectureId) {
  return new Promise((resolve, reject) => {
    const sql = `select t.Name || ' ' || t.LastName as TeacherName,c.Name as CourseName,
        l.Schedule,(SELECT group_concat(Email, ', ')
                        FROM User u inner join StudentFinalBooking s on u.UserId=s.StudentId
                        WHERE s.LectureId = l.LectureId
                       ) AS Emails_List
        from Lecture l
        inner join user T on t.UserId=l.TeacherId
        inner join course c on c.CourseId=l.CourseId
        where l.LectureId=?`;
    db.get(sql, [lectureId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.makeLectureOnline = function (lectureId) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Lecture SET Bookable=0 WHERE LectureId = ?`;
    db.run(sql, [lectureId], (rows, err) => {
      if (err) {
        reject(err);
      } else resolve(true);
    });
  });
};
/**
 * Get All Course
 */
exports.getAllCourse = function () {
  return new Promise((resolve, reject) => {
    const sql = `SELECT CourseID, Name, Description FROM Course c;`;
    db.all(sql, [], (err, rows) => {
      console.log("ROW RA");
      console.log(rows);
      console.log(err);
      if (err) reject(err);
      else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
};
/**
 * Get All Stats for Manager
 */
// Booking statistics:
exports.getBookCountByCourseID = function (
  period,
  startDate,
  endDate,
  courseId
) {
  console.log(period, userId, startDate, endDate, courseId);
  return new Promise((resolve, reject) => {
    let sql = "";
    if (period === "W") {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, row_number() over(order by weekno) as weekno
      from BookCount
      where Schedule between ? and ?
      and CourseId = ?
      group by weekNo`;
      else
        sql = `select avg(BookCount) as avg, row_number() over(order by weekno) as weekno
      from BookCount
      where Schedule between ? and ?
      group by weekNo`;
    } else if (period === "M") {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, monthno
      from BookCount
      where Schedule between ? and ?
      and CourseId = ?
      group by monthNo`;
      else
        sql = `select avg(BookCount) as avg, monthno
            from BookCount
            where Schedule between ? and ?
            group by monthNo`;
    } else {
      if (courseId != "null" && courseId != "All")
        sql = `select avg(BookCount) as avg, row_number() over(order by Dayno) as Dayno
            from BookCount
            where Schedule between ? and ?
            and CourseId = ?
            group by Dayno,CourseId,CourseName
            order by Dayno
            `;
      else
        sql = `select avg(BookCount) as avg, row_number() over(order by Dayno) as Dayno
            from BookCount
            where Schedule between ? and ?
            group by Dayno,CourseId,CourseName
            order by Dayno`;
    }
    if (courseId != "null" && courseId != "All") {
      db.all(sql, [startDate, endDate, courseId], (err, rows) => {
        console.log(rows);
        console.log(err);
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.all(sql, [startDate, endDate], (err, rows) => {
        console.log(rows);
        console.log(err);
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }
  });
};
//@Rmeidanshahi correct way
//Booking statistics
exports.getBookingStatistics = function (period, startDate, endDate) {
  console.log(period, startDate, endDate);
  return new Promise((resolve, reject) => {
    let sql = "";
    if (period === "W") {
      sql = `select avg(BookCount) as avg,weekno,CourseId,CourseName,u.Name || ' ' || u.LastName as TeacherName
        from BookCount inner join user u on u.UserId=BookCount.TeacherId
        where Schedule between @Starttime and @endtime
        group by weekno,CourseId,CourseName,u.Name,u.LastName 
        order by weekno`;
    } else if (period === "M") {
      sql = `select avg(BookCount) as avg,monthno,CourseId,CourseName,u.Name || ' ' || u.LastName as TeacherName
        from BookCount inner join user u on u.UserId=BookCount.TeacherId
        where Schedule between @Starttime and @endtime
        group by monthno,CourseId,CourseName,u.Name,u.LastName
        order by monthno`;
    } else {
      sql = `select count(BookingId)BookCount,l.Schedule ,c.CourseId,c.Name as CorseName,
        u.Name || ' ' || u.LastName as TeacherName
         ,strftime('%d',l.Schedule) as Dayno
         from StudentFinalBooking b inner join lecture l on b.LectureId=l.LectureId
         inner join course C on C.CourseId=l.CourseId
         inner join user U on l.TeacherId=u.UserId
        where b.BookDate is not null and b.Canceled is null and l.Canceled=0
        and l.Schedule between @Starttime and @endtime
        group by l.Schedule,c.CourseId,c.Name,u.Name , u.LastName
        order by l.Schedule
            `;
    }
    db.all(sql, [startDate, endDate], (err, rows) => {
      console.log(rows);
      console.log(err);
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
//Cancellation statistics
exports.getCancellationStatistics = function (period, startDate, endDate) {
  console.log(period, startDate, endDate);
  return new Promise((resolve, reject) => {
    let sql = "";
    if (period === "W") {
      sql = `select count(c.BookingId) CancelCounts,c.Schedule,CourseName,TeacherName,c.weekno
        from StudentCancel C left join Studentbook B on c.LectureId=b.LectureId and b.StudentId=c.StudentId
        where b.StudentId is NULL
        and c.Schedule between @Starttime and @endtime
        group by c.Schedule,CourseName,TeacherName,c.weekno
        order by c.weekno`;
    } else if (period === "M") {
      sql = `select count(c.BookingId) CancelCounts,c.Schedule,CourseName,TeacherName,c.monthno
        from StudentCancel C left join Studentbook B on c.LectureId=b.LectureId and b.StudentId=c.StudentId
        where b.StudentId is NULL
        and c.Schedule between @Starttime and @endtime
        group by c.Schedule,CourseName,TeacherName,c.monthno
        order by c.monthno`;
    } else {
      sql = `select count(c.BookingId) CancelCounts,c.Dayno ,CourseName,TeacherName
        from StudentCancel C left join Studentbook B on c.LectureId=b.LectureId and b.StudentId=c.StudentId
        where b.StudentId is NULL
        and c.Schedule between @Starttime and @endtime
        group by c.Dayno,CourseName,TeacherName
        order by c.Dayno
            `;
    }
    db.all(sql, [startDate, endDate], (err, rows) => {
      console.log(rows);
      console.log(err);
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
//Attendance
exports.getAttendanceStatistics = function (period, startDate, endDate) {
  console.log(period, startDate, endDate);
  return new Promise((resolve, reject) => {
    let sql = "";
    if (period === "W") {
      sql = `select weekno,CourseName, TeacherName,sum(BookCounts) as BookCounts, sum(PresenceCount) as PresenceCount, sum(AbsenceCount) as AbsenceCount
        from StudentAttendance
        where Schedule BETWEEN @Starttime and @endtime
        group by weekno,CourseName, TeacherName 
        order by weekno
       `;
    } else if (period === "M") {
      sql = `select monthno,CourseName, TeacherName,sum(BookCounts) as BookCounts, sum(PresenceCount) as PresenceCount, sum(AbsenceCount) as AbsenceCount
        from StudentAttendance
        where Schedule BETWEEN @Starttime and @endtime
        group by monthno,CourseName, TeacherName 
        order by monthno
       `;
    } else {
      sql = `select BookCounts, PresenceCount,AbsenceCount
        ,Schedule, CourseName, TeacherName ,Dayno
        from StudentAttendance
        where Schedule BETWEEN @Starttime and @endtime
        order by Dayno
            `;
    }
    db.all(sql, [startDate, endDate], (err, rows) => {
      console.log(rows);
      console.log(err);
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getDateOfDay = (start, end, day) => {
  var result = [];
  var current = start.clone();

  while (current.day(7 + day).isBefore(end)) {
    result.push(current.clone());
  }
  return result;
};

exports.importCSVData = function (data, type) {
  return new Promise((resolve, reject) => {
    if (type === "Students") {
      data.forEach((element) => {
        // let birthDate = moment(element.Birthday).format("yyyy-MM-DD");
        let sql = `insert into user 
        (UserId,Name,LastName,Username,Password,Email,RolId,City,SSN,Birthday)
        values (?,?,?,?,
        '$2a$10$ZybXIO4gXxk9FvRdk9XsvuCg9Z5Od17BjcfyaA0nhgUmm.qxqo7Mu',?,1,?,?,?)
       `;
        db.run(
          sql,
          [
            element.Id,
            element.Name,
            element.Surname,
            element.SSN,
            element.OfficialEmail,
            element.City,
            element.SSN,
            element.Birthday,
          ],
          (rows, err) => {
            if (err) {
              reject(err);
            } else resolve(true);
          }
        );
      });
    } else if (type === "Professors") {
      data.forEach((element) => {
        let sql = `insert into user (Name,LastName,Username,Password,Email,RolId,SSN,Number)
        values (?,?,?,'$2a$10$ZybXIO4gXxk9FvRdk9XsvuCg9Z5Od17BjcfyaA0nhgUmm.qxqo7Mu',?,2,?,?)
       `;
        db.run(
          sql,
          [
            element.GivenName,
            element.Surname,
            element.SSN,
            element.OfficialEmail,
            element.SSN,
            element.Number,
          ],
          (rows, err) => {
            if (err) {
              reject(err);
            } else resolve(true);
          }
        );
      });
    } else if (type === "Courses") {
      data.forEach((element) => {
        let sql = `insert into Course (CourseId,name,Description,Year,Semester,Teacher)
        values (?,?,?,?,?,?)
       `;
        db.run(
          sql,
          [
            element.Code,
            element.Course,
            element.Course,
            element.Year,
            element.Semester,
            element.Teacher,
          ],
          (rows, err) => {
            if (err) {
              reject(err);
            } else resolve(true);
          }
        );
      });
    } else if (type === "Enrollment") {
      data.forEach((element) => {
        let sql = `insert into StudentCourse(CourseId,StudentId)
        values (?,?)
       `;
        db.run(sql, [element.Code, element.Student], (rows, err) => {
          if (err) {
            reject(err);
          } else resolve(true);
        });
      });
    } else if (type === "Schedule") {
      data.forEach((element) => {
        const getUserIdSql = `select UserId from user where Number=(select Teacher from Course where CourseId=?)`;
        db.all(getUserIdSql, [element.Code], (err, rows) => {
          if (err) reject(err);
          else if (rows.length === 0) resolve(undefined);
          else {
            let userId = rows[0].UserId;

            const getCourseYearSemester = `select Year, Semester from Course where CourseId=?`;
            db.all(getCourseYearSemester, [element.Code], (err, rows) => {
              if (err) reject(err);
              else if (rows.length === 0) resolve(undefined);
              else {
                let year = rows[0].Year;
                let semester = rows[0].Semester;
                let dates = [];
                // todo: check if the current date is the first semester or the second semester
                if (semester === "1") {
                  // find dates between October 1st to Jan 15th
                  let startDate = moment(`${moment().format("YYYY")}-10-01`);
                  let endDate = moment(
                    `${moment().add(1, "Y").format("YYYY")}-01-15`
                  );
                  switch (element.Day) {
                    case "Mon":
                      dates = getDateOfDay(startDate, endDate, 1);
                      break;
                    case "Tue":
                      dates = getDateOfDay(startDate, endDate, 2);
                      break;
                    case "Wed":
                      dates = getDateOfDay(startDate, endDate, 3);
                      break;
                    case "Thu":
                      dates = getDateOfDay(startDate, endDate, 4);
                      break;
                    case "Fri":
                      dates = getDateOfDay(startDate, endDate, 5);
                      break;
                    default:
                      break;
                  }
                } else {
                  // it is second semester lecture and the date is between March 1st to Jun 15th
                  let startDate = moment(
                    `${moment().add(1, "Y").format("YYYY")}-03-01`
                  );
                  let endDate = moment(`${moment().format("YYYY")}-06-15`);
                  switch (element.Day) {
                    case "Mon":
                      dates = getDateOfDay(startDate, endDate, 1);
                      break;
                    case "Tue":
                      dates = getDateOfDay(startDate, endDate, 2);
                      break;
                    case "Wed":
                      dates = getDateOfDay(startDate, endDate, 3);
                      break;
                    case "Thu":
                      dates = getDateOfDay(startDate, endDate, 4);
                      break;
                    case "Fri":
                      dates = getDateOfDay(startDate, endDate, 5);
                      break;
                    default:
                      break;
                  }
                }

                let sql = `insert into Lecture (CourseId, Schedule,
                  BookingDeadline, NotificationDeadline, EndTime,
                  Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)                  
                `;
                dates.forEach((d) => {
                  let startTime = "";
                  let endTime = "";
                  if (element.Time.includes("-")) {
                    let hour = element.Time.split("-")[0].split(":")[0];
                    let minute = element.Time.split("-")[0].split(":")[1];
                    if (hour < 10 && hour != "00") hour = "0" + hour;
                    if (minute < 10 && minute != "00") minute = "0" + minute;

                    let ehour = element.Time.split("-")[1].split(":")[0];
                    let eminute = element.Time.split("-")[1].split(":")[1];
                    if (ehour < 10 && ehour != "00") ehour = "0" + ehour;
                    if (eminute < 10 && eminute != "00")
                      eminute = "0" + eminute;

                    startTime = hour + ":" + minute;
                    endTime = ehour + ":" + eminute;
                  } else {
                    let hour = element.Time.split(":")[0];
                    let minute = element.Time.split(":")[1];
                    if (hour < 10 && hour != "00") hour = "0" + hour;
                    if (minute < 10 && minute != "00") minute = "0" + minute;

                    let ehour = element.Time.split(":")[2];
                    let eminute = element.Time.split(":")[3];
                    if (ehour < 10 && ehour != "00") ehour = "0" + ehour;
                    if (eminute < 10 && eminute != "00")
                      eminute = "0" + eminute;

                    startTime = hour + ":" + minute;
                    endTime = ehour + ":" + eminute;
                  }
                  db.run(
                    sql,
                    [
                      element.Code,
                      moment(d).format("yyyy-MM-DD") + " " + startTime, // Schedule
                      moment(d).add(-1, "d").format("yyyy-MM-DD") + " " + startTime, // BookingDeadline
                      moment(d).format("yyyy-MM-DD"), // NotificationDeadline
                      moment(d).format("yyyy-MM-DD") + " " + endTime, // EndTime
                      1,
                      0,
                      userId,
                      0,
                      element.Room,
                      element.Seats,
                      element.Day,
                      element.Time,
                    ],
                    (rows, err) => {
                      if (err) {
                        reject(err);
                      } else resolve(true);
                    }
                  );
                });
              }
            });
          }
        });
      });
    }
  });
};

exports.clearDatabase = function () {
  return new Promise((resolve, reject) => {
    if (process.env.npm_config_test !== "true") {
      console.log("Tried clearing production database");
      reject("ClearProductionDB");
    }

    
     const sql =
      "DELETE from Course";
    //  const sql =
    //   "DELETE from user where UserId>23; DELETE from Course; DELETE from Class; DELETE from StudentCourse; DELETE from Lecture; DELETE from Booking; DELETE from TeacherNotification;";
      //console.log("Clearing database");
      db.run(sql, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });
    
      const sqlLecture =
      "DELETE from Lecture"; 
      db.run(sqlLecture, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });

      const sqlBooking =
      "DELETE from Booking"; 
      db.run(sqlBooking, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });

      const sqlClass =
      "DELETE from Class"; 
      db.run(sqlClass, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });
      

      const sqlStudentCourse =
      "DELETE from StudentCourse"; 
      db.run(sqlStudentCourse, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });
      

      const sqlTeacherNotification =
      "DELETE from TeacherNotification"; 
      db.run(sqlTeacherNotification, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });



      const sqlUser =
      "DELETE from user where UserId>23"; 
      db.run(sqlUser, (err) => {
        if (err) {
          console.log("DB failed clearing database");
          console.log(err);
          reject(err);
          
        } else resolve(null);
      });


    });
  };
  
  exports.addCourse = function (data) {
    return new Promise((resolve, reject) => {
      if (process.env.npm_config_test !== "true") {
        console.log("Tried clearing production database");
        reject("ClearProductionDB");
      }
      
      let sql = `insert into Course (CourseId,Name,Description,Year,Semester,Teacher) values (?, ?, ?, ?, ?, ?)                  
      `;
      db.run(sql, [...data], (err) => {
        if (err) {
        console.log(err);
        console.log("DB failed adding course");
        reject(err);
      } else {
        console.log("DAO resolved");
        resolve(null);}
    });
  });
};

exports.addBooking = function (data) {
  return new Promise((resolve, reject) => {
    if (process.env.npm_config_test !== "true") {
      console.log("Tried clearing production database");
      reject("ClearProductionDB");
    }
    
    let sql = `insert into Booking (BookingId,StudentId,LectureId,Presence,Canceled,Reserved,CancelDate,ReserveDate,BookDate) values (?, ?, ?, ?, ?, ?, ?, ?, ?)                  
    `;
    db.run(sql, [...data], (err) => {
      if (err) {
      console.log(err);
      console.log("DB failed adding course");
      reject(err);
    } else {
      console.log("DAO resolved");
      resolve(null);}
  });
});
};




exports.addStudentCourse = function (data) {
  return new Promise((resolve, reject) => {
    if (process.env.npm_config_test !== "true") {
      console.log("Tried clearing production database");
      reject("ClearProductionDB");
    }
    
    let sql = `insert into StudentCourse (StudentCourseId,CourseId,StudentId) values (?, ?, ?)                  
    `;
    db.run(sql, [...data], (err) => {
      if (err) {
      console.log(err);
      console.log("DB failed adding course");
      reject(err);
    } else {
      console.log("DAO resolved");
      resolve(null);}
  });
});
};


exports.addLecture = function (data) {
  return new Promise((resolve, reject) => {
    if (process.env.npm_config_test !== "true") {
      console.log("Tried modifying production database");
      reject("ClearProductionDB");
    }

    let sql = `insert into Lecture (CourseId, Schedule,
      BookingDeadline, NotificationDeadline, EndTime,
      Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)                  
    `;

    db.run(sql, [...data], (err) => {
      if (err) {
        reject(err);
      } else resolve(null);
    });
  });
};




exports.getPositiveStudents = function (userId, name, lastName) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT UserId, Name, LastName, Email FROM User where RolId = 1 and TestResult = 1 and UserId LIKE ? AND Name LIKE ? AND LastName LIKE ? ORDER BY LastName, Name";

    db.all(sql, [userId + "%", name + "%", lastName + "%"], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.getContactTracingReport = function (userId) {
  return new Promise((resolve, reject) => {
    const sql = `select distinct Contlist.StudentId, ContList.StudentName, ContList.Email, ContList.TeacherName from  
    (SELECT LectureId, Schedule
    from StudentFinalBooking 
    where StudentId=?
    and Presence=1 and Schedule <= DATETIME('now') and Schedule >= date(DATETIME('now') , '-14 day')) PositiveList
    left join 
    (select b.LectureId, StudentId,St.Name || ' ' || st.LastName as StudentName, st.Email, t.Name || ' ' || t.LastName as TeacherName
    from StudentFinalBooking  B inner join user St 
    on b.StudentId=St.UserId
    inner join User T on t.UserId=b.TeacherId
    where Presence=1 and StudentId<>?
    )Contlist
    on PositiveList.LectureId=Contlist.LectureId`;

    db.all(sql, [userId, userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
