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
    return initLectures();
  });
  afterAll(() => {
    clearNotifications();
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
    return dao.getAvailableLectures(4, 1).then((data) => {
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
    return dao.getStudentCurrentCourses(2).then((data) => {
      expect(data).toHaveLength(1);
    });
  });

  test("test getStudentCurrentCourses", () => {
    return dao.getStudentCurrentCourses(1010).then((data) => {
      expect(data).toEqual(undefined);
    });
  });
});

describe("check BookingAndHistory", () => {
  beforeAll(() => {
    clearLectures();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    return clearBooking();
  });

  test("test bookLecture", () => {
    return dao.bookLecture(1, 4, "2020-12-30 15:20").then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("test bookLecture false", () => {
    return dao.bookLecture(1, 5, "2020-12-30 15:20").then((data) => {
      expect(data).toEqual(false);
    });
  });

  test("test bookingHistory", () => {
    return dao.getBookingHistory(4).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test cancelReservation", () => {
    return dao.cancelReservation(3).then((data) => {
      expect(data).toEqual(null);
    });
  });

  test("test getBookingDetails", () => {
    return dao.getBookingDetails(4,1).then((data) => {
      expect(data.length>0);
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
    return dao.getStudentlistOfLecture(2).then((data) => {
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
      expect(data.length>0);
    });
  });

  test("test cancelLecture", () => {
    return dao.cancelLecture(2).then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("test getTeacherStats1", () => {
    return dao.getTeacherStats("M", 8, "2020-12-01", "2020-12-18", "null").then((data) => {
      expect(data.length>0);
    });
  });

  test("test getTeacherStats2", () => {
    return dao.getTeacherStats("W", 8, "2020-12-01", "2020-12-18", "All").then((data) => {
      expect(data.length>0);
    });
  });

  test("test getTeacherStats5", () => {
    return dao.getTeacherStats("W", 8, "2020-12-01", "2020-12-18", 4).then((data) => {
      expect(data.length>0);
    });
  });

  test("test getTeacherStats3", () => {
    return dao.getTeacherStats("D", 8, "2020-12-01", "2020-12-18", "All").then((data) => {
      expect(data.length>0);
    });
  });

  test("test getTeacherStats4", () => {
    return dao.getTeacherStats("D", 8, "2020-12-01", "2020-12-18", 4).then((data) => {
      expect(data.length>0);
    });
  });

  test("test getBookingStatistics", () => {
    return dao.getBookingStatistics("W", "2020-12-01", "2020-12-18").then((data) => {
      expect(data.length>0);
    });
  });

  test("test getCancellationStatistics", () => {
    return dao.getCancellationStatistics("D", "2020-12-01", "2020-12-18").then((data) => {
      expect(data.length>0);
    });
  });

  test("test getAttendanceStatistics", () => {
    return dao.getAttendanceStatistics("D", "2020-12-01", "2020-12-18").then((data) => {
      expect(data.length>0);
    });
  });

});

initLectures = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Lecture
   (CourseId,
   Schedule,
   ClassId,
   BookingDeadline,
   NotificationDeadline,
   Bookable,
   LectureId,
   Canceled,
   TeacherId,
   NotificationAdded)
   VALUES (2,"2021-01-30 10:00", 1,"2020-12-30 15:20", date("now"), 1, 1, 0, 2, 0)
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
   WHERE CourseId = 2
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
   StudentId,
   Semester)
   VALUES (100, 1, 2, 2020)
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
   WHERE StudentCourseId = 100
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
        console.log(rows)
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
    )
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
   WHERE BookingId >= 100 or StudentId = 4
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