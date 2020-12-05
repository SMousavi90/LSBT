class BookingHistory {    
    constructor( Schedule,EndTime,Bookable, CourseName,ClassNumber,TeacherName,BookingId, BookingDeadline, CourseId){
        if (BookingId) {
            this.bookingId = BookingId;
        }

        this.bookable = Bookable;
        this.courseName = CourseName;
        this.teacherName = TeacherName;
        this.schedule = Schedule; 
        this.endTime = EndTime; 
        this.classNumber = ClassNumber; 
        this.bookingDeadline = BookingDeadline; 
        this.courseId = CourseId; 
    }
}

module.exports = BookingHistory;
