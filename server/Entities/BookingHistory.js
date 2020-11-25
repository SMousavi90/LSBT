class BookingHistory {    
    constructor( Schedule,EndTime,Bookable, CourseName,ClassNumber,TeacherName,BookingId){
        if (BookingId) {
            this.bookingId = BookingId;
        }

        this.bookable = Bookable;
        this.courseName = CourseName;
        this.teacherName = TeacherName;
        this.schedule = Schedule; 
        this.endTime = EndTime; 
        this.classNumber = ClassNumber; 
    }
}

module.exports = BookingHistory;
