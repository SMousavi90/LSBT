class LectureSchedule {    
    constructor( lectureId,schedule,classNumber,teacherName,courseName,userId,classId,bookButton,freeSeats, reserved){

        if (lectureId) {
            this.lectureId = lectureId;
        }

        this.schedule = schedule;
        this.classNumber = classNumber;
        this.teacherName = teacherName;
        this.courseName = courseName;
        this.userId = userId;
        this.classId = classId;
        this.bookButton = bookButton;
        this.freeSeats = freeSeats;
        this.reserved = reserved;
    }
}

module.exports = LectureSchedule;
