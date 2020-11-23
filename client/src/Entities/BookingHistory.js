
class BookingHistory {

    constructor(bookingId, studentId, lectureId, presence, canceled, reserved, cancelDate, reserveDate, bookDate, courseName, bookingDeadline, teacherName) {
        if (bookingId) {
            this.bookingId = bookingId;
        }

        this.studentId = studentId;
        this.lectureId = lectureId;
        this.presence = presence;
        this.canceled = canceled;
        this.reserved = reserved;
        this.cancelDate = cancelDate;
        this.reserveDate = reserveDate;
        this.bookDate = bookDate;
        this.courseName = courseName;
        this.bookingDeadline = bookingDeadline;
        this.teacherName = teacherName;
    }

    /**
     * Construct a BookingHistory from a plain object
     * @param {{}} json 
     * @return {BookingHistory} the newly created BookingHistory object
     */
    static from(json) {
        const r = Object.assign(new BookingHistory(), json);
        return r;
    }

}

export default BookingHistory;

