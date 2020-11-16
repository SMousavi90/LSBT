class LectureSchedule {    
    constructor(lectureId, schedule, classNumber, teacherName, courseName, userId, classId, bookingId) {
        if (lectureId) {
            this.lectureId = lectureId;
        }

        this.schedule = schedule;
        this.classNumber = classNumber;
        this.teacherName = teacherName;
        this.courseName = courseName;
        this.userId = userId;
        this.classId = classId;
        this.bookingId = bookingId;
    }
}

module.exports = LectureSchedule;
