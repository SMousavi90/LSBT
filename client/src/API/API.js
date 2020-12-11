import StudentCourse from "../Entities/StudentCourse";
import ProfessorCourse from "../Entities/ProfessorCourse";
import axios from "axios"

const APIURL = "api";

async function getNotification(userId) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + `/teacher/${userId}/notification`).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((notifications) => resolve(notifications))
          .catch((err) => {
            reject({
              errors: [
                { param: "Application", msg: "Cannot parse server response" },
              ],
            });
          });
      }
    });
  });
}

async function updateNotificationStatus(userId) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + `/teacher/${userId}/updatenotification`, {
      method: "PUT",
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response
          .json()
          .then((obj) => {
            reject(obj);
          })
          .catch((err) => {
            reject({
              errors: [
                { param: "Application", msg: "Cannot parse server response" },
              ],
            });
          });
      }
    });
  });
}
async function isAuthenticated() {
  let url = APIURL + "/user";

  const response = await fetch(url);
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw response.status; //just send status code
  }
}

async function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + "/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((obj) => resolve(obj))
            .catch((err) => reject(err));
        } else {
          response
            .json()
            .then((obj) => reject(obj)) //to send username/password errors
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
}

async function logout() {
  const url = APIURL + "/logout";
  const response = await fetch(url, {
    method: "POST",
  });
  if (response.ok) {
    return;
  } else {
    throw response.status;
  }
}

async function getStudentCurrentCourses(userId) {
  let url = "/getStudentCurrentCourses";
  const queryParams = "/" + userId;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  if (response.ok) {
    return json.map(
      (row) =>
        new StudentCourse(
          row.courseId,
          row.name,
          row.desc,
          row.semester,
          row.studentId
        )
    );
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}

async function getAvailableLectures(courseId) {
  let url = "/getAvailableLectures";
  const queryParams = "/" + courseId;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  if (response.ok) {
    return json;
    // return json.map((row) => new LectureSchedule(row.lectureId, row.schedule, row.classNumber, row.teacherName, row.courseName, row.userId, row.classId, row.bookingId, row.bookCanceled));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}

async function bookLecture(lectureId, userId, scheduleDate) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + "/bookLecture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"lectureId": "${lectureId}", "userId": "${userId}", "scheduleDate": "${scheduleDate}"}`,
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          let err = { status: response.status, errObj: response };
          throw err;
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function getBookingHistory(userId) {
  let url = "/bookingHistory";
  const queryParams = "/" + userId;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  if (response.ok) {
    return json;

    // return json.map((row) => new BookingHistory(row.schedule,row.endTime,row.bookable, row.courseName,row.classNumber,row.teacherName,row.bookingId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err; // An object with the error coming from the server
  }
}

async function cancelReservation(id) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + "/cancelReservation/" + id, {
      method: "PUT",
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

async function getStudentsPerLecturePerProfessor(userId) {
  let url = "/getStudentsPerLecturePerProfessor";
  const queryParams = "/" + userId;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  console.log("API function, getting ID " + userId);
  //console.log(response);
  if (response.ok) {
    return json.map(
      (row) =>
        new ProfessorCourse(
          row.StudentId,
          row.LastName,
          row.Name,
          row.CourseName,
          row.Schedule,
          row.LectureId
        )
    );
    //return json.map((row) => new StudentCourse(row.courseId, row.name, row.desc, row.semester, row.studentId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}

async function getTeacherCourses() {
  const url = "/getTeacherCourses";
  const response = await fetch(APIURL + url);
  const courses = await response.json();
  if (response.ok) {
    return courses;
  } else {
    let err = { status: response.status, errObj: courses };
    throw err;
  }
}

async function getCourseLectures(courseId) {
  const url = `/getCourseLectures/${courseId}`;
  const response = await fetch(APIURL + url);
  const lectures = await response.json();
  if (response.ok) {
    return lectures;
  } else {
    let err = { status: response.status, errObj: lectures };
    throw err;
  }
}

async function getLectureStudents(lectureId) {
  const url = `/getLectureStudents/${lectureId}`;
  const response = await fetch(APIURL + url);
  const lectures = await response.json();
  if (response.ok) {
    return lectures;
  } else {
    let err = { status: response.status, errObj: lectures };
    throw err;
  }
}

async function cancelLecture(id) {
  return new Promise((resolve, reject) => {
    fetch(APIURL + "/cancelLecture/" + id, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}


async function getTeacherStats(period, userId, startDate, endDate, courseId) {
  let url = "/getTeacherStats";
  const queryParams =
    "/" + period + "/" + userId + "/" + startDate + "/" + endDate + "/" + courseId;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  //console.log(response);
  if (response.ok) {
    return json.map((row) => {
      let r = null;
      if (period === "W") {
         r = { avg: row.avg.toFixed(2), no: row.weekno };
         return r;
      }
      else if (period === "M") {
        r = { avg: row.avg.toFixed(2), no: row.monthno };
        return r;
    }
    else { 
        r = { avg: row.avg.toFixed(2), no: row.Dayno };
        return r;
      }
    });
    //return json.map((row) => new StudentCourse(row.courseId, row.name, row.desc, row.semester, row.studentId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}

async function makeLectureOnline(id) {
    return new Promise((resolve, reject) => {
        fetch(APIURL + "/makelectureonline/" + id, {
            method: 'POST'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// Get All courses
async function getAllCourses() {
  const url = "/getAllCourses";
  const response = await fetch(APIURL + url);
  const courses = await response.json();
  if (response.ok) {
    return courses;
  } else {
    let err = { status: response.status, errObj: courses };
    throw err;
  }
}
// Booking
async function getBookingStatistics(period, startDate, endDate) {
  let url = "/getBookingStatistics";
  const queryParams =
    "/" + period + "/"  + startDate + "/" + endDate;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  //console.log(response);
  if (response.ok) {
    return json.map((row) => {
      let r = null;
      if (period === "W") {
         r = { avg: row.avg.toFixed(2), no: row.weekno, CourseId: row.CourseId, CourseName: row.CourseName, TeacherName: row.TeacherName };
         return r;
      }
      else if (period === "M") {
        r = { avg: row.avg.toFixed(2), no: row.monthno, CourseId: row.CourseId, CourseName: row.CourseName, TeacherName: row.TeacherName };
        return r;
    }
    else { 
      r = { avg: row.BookCount, no: row.Dayno, CourseId: row.CourseId, CourseName: row.CorseName, TeacherName: row.TeacherName };
        return r;
      }
    });
    //return json.map((row) => new StudentCourse(row.courseId, row.name, row.desc, row.semester, row.studentId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}
// Cancellation Delete it if there is way to use enum
async function getCancellationStatistics(period, startDate, endDate) {
  let url = "/getCancellationStatistics";
  const queryParams =
    "/" + period + "/"  + startDate + "/" + endDate;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  //console.log(response);
  if (response.ok) {
    return json.map((row) => {
      let r = null;
      if (period === "W") {
         r = { avg: row.CancelCounts, no: row.weekno, CourseName: row.CourseName, TeacherName: row.TeacherName };
         return r;
      }
      else if (period === "M") {
        r = { avg: row.CancelCounts, no: row.monthno, CourseName: row.CourseName, TeacherName: row.TeacherName };
        return r;
    }
    else { 
      r = { avg: row.CancelCounts, no: row.Dayno, CourseName: row.CourseName, TeacherName: row.TeacherName };
        return r;
      }
    });
    //return json.map((row) => new StudentCourse(row.courseId, row.name, row.desc, row.semester, row.studentId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}
async function getAttendanceStatistics(period, startDate, endDate) {
  let url = "/getAttendanceStatistics";
  const queryParams =
    "/" + period + "/"  + startDate + "/" + endDate;
  url += queryParams;
  const response = await fetch(APIURL + url);
  const json = await response.json();
  //console.log(response);
  if (response.ok) {
    return json.map((row) => {
      let r = null;
      if (period === "W") {
        r = { avg: row.PresenceCount, no: row.weekno, CourseId: row.CourseId, CourseName: row.CourseName, TeacherName: row.TeacherName };
         return r;
      }
      else if (period === "M") {
        r = { avg: row.PresenceCount, no: row.monthno, CourseId: row.CourseId, CourseName: row.CourseName, TeacherName: row.TeacherName };
        return r;
    }
    else { 
      r = { avg: row.PresenceCount, no: row.Dayno, CourseId: row.CourseId, CourseName: row.CourseName, TeacherName: row.TeacherName };
        return r;
      }
    });
    //return json.map((row) => new StudentCourse(row.courseId, row.name, row.desc, row.semester, row.studentId));
  } else {
    let err = { status: response.status, errObj: json };
    throw err;
  }
}

async function uploadDataCSV(data) {
    axios.post(APIURL + "/uploadDataCSV/", data, {
      })
      .then(res => { // then print response status
        console.log(res.statusText);
      })
}

export default { isAuthenticated, login, logout, getStudentCurrentCourses, getAvailableLectures, bookLecture, getBookingHistory, cancelReservation, getNotification, updateNotificationStatus, getStudentsPerLecturePerProfessor, getTeacherCourses, getCourseLectures, getLectureStudents, cancelLecture, makeLectureOnline, getTeacherStats, getAllCourses, getBookingStatistics, getCancellationStatistics, getAttendanceStatistics, uploadDataCSV};