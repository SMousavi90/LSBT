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
}

module.exports = StudentCourse;
