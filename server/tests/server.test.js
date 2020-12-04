const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const dao = require('../dao.js');
const sqlite = require("sqlite3");

let session;

beforeAll((done) => {
    dao.setDb("db/PULSeBS_test.db");

    request.post('/api/login')
        .send({ username: 'student1', password: 'pass' })
        .set('Accept', 'application/json')
        .end((err, response) => {
            session = response.headers['set-cookie'];
            done();
        });
});

let db = new sqlite.Database("db/PULSeBS_test.db", (err) => {
    if (err) throw err;
  });

describe('server rest APIs', function () {

    beforeAll(() => {
        clearBooking();
        clearLectures();
        initLectures();
        return initBooking();
      });
      afterAll(() => {
        clearBooking();
        return clearLectures();
      });

    it('getUser', async () => {
        const response = await request
            .get('/api/user')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('getStudentCurrentCourses', async () => {
        const response = await request
            .get('/api/getStudentCurrentCourses/1')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('getAvailableLectures', async () => {
        const response = await request
            .get('/api/getAvailableLectures/4')
            .send({ userId: '1' })
            .set('Accept', 'application/json')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('bookingHistory', async () => {
        const response = await request
            .get('/api/bookingHistory/1')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('teacher notification', async () => {
        const response = await request
            .get('/api/teacher/7/notification')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('getTeacherCourses', async () => {
        const response = await request
            .get('/api/getTeacherCourses')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('getCourseLectures', async () => {
        const response = await request
            .get('/api/getCourseLectures/1')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('getLectureStudents', async () => {
        const response = await request
            .get('/api/getLectureStudents/1')
            .set('Cookie', session)
        expect(response.status).toBe(200);
    });

    it('makelectureonline', async () => {
      const response = await request
          .post('/api/makelectureonline/1')
          .set('Cookie', session)
      expect(response.status).toBe(200);
  });

  it("cancelReservation", async () => {
    const response = await request
      .put("/api/cancelReservation/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #1", async () => {
    const response = await request
      .get("/api/getTeacherStats/M/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #2", async () => {
    const response = await request
      .get("/api/getTeacherStats/W/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("getTeacherStats #3", async () => {
    const response = await request
      .get("/api/getTeacherStats/All/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #3 no course", async () => {
    const response = await request
      .get("/api/getTeacherStats/All/2/2020-11-01/2020-12-01/null")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("bookLecture", async () => {
    const response = await request
      .post("/api/bookLecture")
      .send({ "lectureId": "2", "userId": "4", "scheduleDate": "2020-12-30 15:20" })
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getBookingStatistics ", async () => {
    const response = await request
      .get("/api/getBookingStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getCancellationStatistics ", async () => {
    const response = await request
      .get("/api/getCancellationStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getCancellationStatistics ", async () => {
    const response = await request
      .get("/api/getCancellationStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

});

///getTeacherStats/:period/:userId/:startDate/:endDate/:courseId

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
     VALUES (2,"2021-01-30 10:00", 2,"2020-12-30 15:20", date("now"), 1, 1, 0, 2, 0)
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

  initBooking = () => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Booking
     (BookingId,
     StudentId,
     LectureId,
     BookDate)
     VALUES (
       101,
       1,
       1,
       "2020-11-30 15:20" 
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
     WHERE BookingId = 101
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