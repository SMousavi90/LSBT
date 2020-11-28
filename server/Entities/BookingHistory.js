class BookingHistory {    
    constructor( Schedule,EndTime,Bookable, CourseName,ClassNumber,TeacherName,BookingId, BookingDeadline){
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
    }
}

module.exports = BookingHistory;
