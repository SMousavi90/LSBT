const dao = require('../dao.js');
const sqlite = require('sqlite3');


dao.setDb("db/PULSeBS_test.db")
let db = new sqlite.Database("db/PULSeBS_test.db", (err) => {
  if (err)
    throw err;
});



test('test getUserById', () => {
  return dao.getUserById(1).then(data => {
    expect(data).toEqual(expect.objectContaining({ Username: 'student1' }));
  });
});

test('test getAllLectures', () => {
  return dao.getAllLectures().then(data => {
    expect(data).toHaveLength(3);
  });
});

describe('check Notifications', () => {
  beforeAll(() => {
    return initLectures();
  });
  afterAll(() => {
    clearNotifications();
    return clearLectures();
  });

  test('test check Notification', () => {
    return dao.checkNotification(2).then(data => {
      expect(data).toEqual(2);
    })
  });

  test('test update Lecture Notification Added field', () => {
    return dao.updateLecture(2).then(data => {
      expect(data).toEqual(2);
    })
  });

  test('test update Teacher Notification Sent Status field', () => {
    return dao.updateNotification(2).then(data => {
      expect(data).toEqual(2);
    })
  });

  test('test getAvailableLectures', () => {
    return dao.getAvailableLectures(2).then(data => {
      expect(data).toHaveLength(1);
    });
  });
});




initLectures = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `INSERT INTO Lecture
   (CourseId,
   Schedule,
   ClassId,
   BookingDeadline,
   NotificationDeadline,
   Bookable,
   Canceled,
   TeacherId,
   NotificationAdded)
   VALUES (2,"2020-11-30 15:20", 1,"2020-11-30 15:20", date("now"), 1, 0, 2, 0)
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
}

clearLectures = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `DELETE FROM Lecture
   WHERE CourseId = 2
   AND	Schedule = "2020-11-30 15:20"
   AND	ClassId = 1 
   AND	BookingDeadline = "2020-11-30 15:20"
   AND	NotificationDeadline = date("now")
   AND	Bookable = 1 
   AND	Canceled = 0
   AND	TeacherId = 2
   AND	NotificationAdded = 1
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
}

clearNotifications = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `DELETE FROM TeacherNotification
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
}


describe('check Courses', () => {
  beforeAll(() => {
    clearCourses();
    return initCourses();
  });
  afterAll(() => {
    return clearCourses();
  });

  test('test getStudentCurrentCourses', () => {
    return dao.getStudentCurrentCourses(2).then(data => {
      expect(data).toHaveLength(1);
    });
  });
});


initCourses = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `INSERT INTO StudentCourse
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
}

clearCourses = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `DELETE FROM StudentCourse
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
}

describe('check BookingAndHistory', () => {
  beforeAll(() => {
    return initBooking();
  });
  afterAll(() => {
    return clearBooking();
  });

  test('test bookLecture', () => {
    return dao.bookLecture(2, 2, "2020-11-30 15:20").then(data => {
      expect(data).toEqual(true);
    });
  });

  test('test bookingHistory', () => {
    return dao.getBookingHistory(2).then(data => {
      expect(data).toHaveLength(2);
    });
  });

  test('test cancelReservation', () => {
    return dao.cancelReservation(3).then(data => {
      expect(data).toEqual(null);
    });
  });
});


initBooking = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `INSERT INTO Booking
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
}

clearBooking = () => {
  return new Promise((resolve, reject) => {

    const sql =
      `DELETE FROM Booking
   WHERE BookingId >= 100
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
}

