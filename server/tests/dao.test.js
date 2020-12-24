let moment = require("moment")
const dao = require("../dao.js");
const sqlite = require("sqlite3");

dao.setDb("db/PULSeBS_test.db");
let db = new sqlite.Database("db/PULSeBS_test.db", (err) => {
  if (err) throw err;
});

test("test login ok", () => {
  return dao.login("student1", "pass").then((data) => {
    expect(data).toEqual(expect.objectContaining({ userId: 1 }));
  });
});

test("test login user does not exists", () => {
  return expect(dao.login("usernotexist", "pass")).rejects.toEqual(null);
});

test("test getUserById", () => {
  return dao.getUserById(1).then((data) => {
    expect(data).toEqual(expect.objectContaining({ Username: "student1" }));
  });
});

describe("check Notifications", () => {
  beforeAll(() => {
    clearLectures();
    initCourses();
    return initLectures();
  });
  afterAll(() => {
    clearNotifications();
    clearCourses();
    return clearLectures();
  });

  test("test check Notification", () => {
    return dao.checkNotification(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test update Lecture Notification Added field", () => {
    return dao.updateLecture(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test update Teacher Notification Sent Status field", () => {
    return dao.updateNotification(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test getAvailableLectures", () => {
    
    return dao.getAvailableLectures("XY0422", 1).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getAvailableLectures undef", () => {
    return dao.getAvailableLectures(4, 100).then((data) => {
      expect(data).toEqual(undefined);
    });
  });

  test("test getAllLectures", () => {
    return dao.getAllLectures().then((data) => {
      expect(data.length > 0);
    });
  });
});

describe("check Courses", () => {
  beforeAll(() => {
    clearCourses();
    return initCourses();
  });
  afterAll(() => {
    return clearCourses();
  });

  test("test getStudentCurrentCourses", () => {
    return dao.getStudentCurrentCourses(1).then((data) => {
      expect(data).toHaveLength(1);
    });
  });

  test("test getStudentCurrentCourses", () => {
    
    return dao.getStudentCurrentCourses(5).then((data) => {
      expect(data).toHaveLength(1);
    });
  });

  test("test getAllCourses", () => {

    return dao.getAllCourse().then((data) => {
      expect(data.length > 0);
    });
  });

});

describe("check BookingAndHistory", () => {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    // clearCourses();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test bookLecture false", () => {
    return dao.bookLecture(2, 5, "2020-12-30 15:20").then((data) => {
      expect(data).not.toEqual(undefined);
    });
  });

  test("test cancelReservation", () => {
    return dao.cancelReservation(3).then((data) => {
      expect(data).toEqual(null);
    });
  });

 
  test("test getBookCountByCourseID W", () => {
    return dao.getBookCountByCourseID("Weekly", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID M", () => {
    return dao.getBookCountByCourseID("Monthly", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID D", () => {
    return dao.getBookCountByCourseID("Daily", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID all courses", () => {
    return dao.getBookCountByCourseID("Daily", "2020-10-01","2020-12-01","All").then((data) => {
      expect(data.length > 0);
    });
  });
  

  test("test manageQueueReservation", () => {
    // debugger
    return dao.manageQueueReservation(2).then((data) => {
      expect(data.length > 0);
    });
  });
});
describe("check BookingAndHistory", () => {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test bookLecture", () => {
    
    return dao.bookLecture(1, 4, "2020-12-30 15:20").then((data) => {
      expect(data).not.toEqual(undefined);
    });
  });

  test("test bookingHistory", () => {
    
    return dao.getBookingHistory(4).then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getBookingDetails", () => {
    return dao.getBookingDetails(1, 4).then((data) => {
      expect(data.length > 0);
    });
  });

});

describe("check Teacher Dashboard", () => {
  beforeAll(() => {
    clearLectures();
    return initLectures();
  });
  afterAll(() => {
    return clearLectures();
  });

  test("test getTeacherCourses", () => {
    return dao.getTeacherCourses(2).then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getCourseLectures", () => {
    return dao.getCourseLectures(2).then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getLectureStudents", () => {
    return dao.getLectureStudents(2).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getStudentlistOfLecture", () => {
    return dao.getStudentlistOfLecture(1).then((data) => {
      expect(data.length > 0);
    });
  });

  // Make the lecture unbookable, then count the unbookable lectures
  test("Test makeLectureOnline", () => {
    //dao.makeLectureOnline(1); // (lectureId)
    // return getUnbookableLectures().then((data) => {
    //   expect(data).toHaveLength(1);
    // });
    return dao.makeLectureOnline(1).then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("test getNotification", () => {
    return dao.getNotification(2).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test cancelLecture", () => {
    return dao.cancelLecture(2).then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("test getTeacherStats1", () => {
    return dao
      .getTeacherStats("Monthly", 8, "2020-12-01", "2020-12-18", "null")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats2", () => {
    return dao
      .getTeacherStats("Weekly", 8, "2020-12-01", "2020-12-18", "All")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats5", () => {
    return dao
      .getTeacherStats("Weekly", 8, "2020-12-01", "2020-12-18", 4)
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats3", () => {
    return dao
      .getTeacherStats("Daily", 8, "2020-12-01", "2020-12-18", "All")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats4", () => {
    return dao
      .getTeacherStats("Daily", 8, "2020-12-01", "2020-12-18", 4)
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getBookingStatistics", () => {
    return dao
      .getBookingStatistics("Weekly", "2020-12-01", "2020-12-18")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getCancellationStatistics", () => {
    return dao
      .getCancellationStatistics("Daily", "2020-12-01", "2020-12-18")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getAttendanceStatistics", () => {
    return dao
      .getAttendanceStatistics("Daily", "2020-12-01", "2020-12-18")
      .then((data) => {
        expect(data.length > 0);
      });
  });
  test("test getAttendanceStatistics W", () => {
    return dao
      .getAttendanceStatistics("Weekly", "2020-12-01", "2020-12-18")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getAttendanceStatistics D", () => {
    return dao
      .getAttendanceStatistics("Daily", "2020-12-01", "2020-12-18")
      .then((data) => {
        expect(data.length > 0);
      });
  });
});

describe("check Contact tracing", () => {
  beforeAll(() => {
    clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test getPositiveStudents", () => {
    return dao
      .getPositiveStudents("", "", "")
      .then((data) => {
        expect(data.length > 0);
      });
  });
  
  test("test getContactTracingReport", () => {
    return dao
    .getContactTracingReport(1)
    .then((data) => {
      expect(data.length > 0);
    });
  });
});


initLectures = () => {
  
  var day = moment().add(4, 'd').format("yyyy-MM-DD")+" 10:00"
  var deadline = moment().add(3, 'd').format("yyyy-MM-DD")+" 10:00"
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Lecture
   (CourseId,
   Schedule,
   Room,
   BookingDeadline,
   NotificationDeadline,
   Bookable,
   LectureId,
   Canceled,
   TeacherId,
   Seats,
   NotificationAdded)
   VALUES ('XY0422','${day}', 1, '${deadline}', date("now"), 1, 1, 0, 2, 120,0),('XY0422','${day}', 1, '${deadline}', date("now"), 1, 2, 0, 2, 0,0)
    `;
  

    db.run(sql, (err, rows) => {
      
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearLectures = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Lecture
   WHERE CourseId = 'XY0422' or LectureId = 1
    `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearNotifications = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM TeacherNotification
     `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

initCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO StudentCourse
   (StudentCourseId,
   CourseId,
   StudentId)
   VALUES (100, 'XY0422', 1),
   (101, 'XY0422', 4),
   (102, 'XY0422', 5);
   `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM StudentCourse
   WHERE StudentCourseId in (100,101,102)
    `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

getUnbookableLectures = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Lecture WHERE Bookable=0`;

    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(rows);
      }
    });
  });
};

//Just

initBooking = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Booking
   (BookingId,
   StudentId,
   LectureId,
   BookDate)
   VALUES (
     101,
     2,
     3,
     "2020-11-25 15:20" 
    ); 
   `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearBooking = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Booking
   WHERE BookingId >= 100 or StudentId in (2,4)
    `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};
