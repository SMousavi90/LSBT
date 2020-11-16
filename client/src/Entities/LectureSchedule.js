
class LectureSchedule {

    constructor(lectureId, schedule, classNumber, teacherName, courseName, userId, classId) {
        if (lectureId) {
            this.lectureId = lectureId;
        }

        this.schedule = schedule;
        this.classNumber = classNumber;
        this.teacherName = teacherName;
        this.courseName = courseName;
        this.userId = userId;
        this.classId = classId;
    }

    /**
     * Construct a StudentCourse from a plain object
     * @param {{}} json 
     * @return {LectureSchedule} the newly created StudentCourse object
     */
    static from(json) {
        const r = Object.assign(new LectureSchedule(), json);
        return r;
    }

}

export default LectureSchedule;

