
class StudentCourse {

    constructor(courseId, name, desc, semester, studentId) {
        if (courseId) {
            this.courseId = courseId;
        }

        this.name = name;
        this.desc = desc;
        this.semester = semester;
        this.studentId = studentId;
    }

    /**
     * Construct a StudentCourse from a plain object
     * @param {{}} json 
     * @return {StudentCourse} the newly created StudentCourse object
     */
    static from(json) {
        const r = Object.assign(new StudentCourse(), json);
        return r;
    }

}

export default StudentCourse;

