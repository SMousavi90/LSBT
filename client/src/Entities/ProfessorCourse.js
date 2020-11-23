class ProfessorCourse {

    constructor(StudentId,LastName,Name,CourseName,Schedule, LectureId) {
        console.log("Constructor, got: " + StudentId + LastName + Name + CourseName + Schedule);
        
        this.StudentId = StudentId;
        this.LastName = LastName;
        this.Name = Name;
        this.CourseName = CourseName;
        this.Schedule = Schedule;
        this.LectureId = LectureId;
    }

    /**
     * Construct a StudentCourse from a plain object
     * @param {{}} json 
     * @return {ProfessorCourse} the newly created StudentCourse object
     */
    static from(json) {
        
        const r = Object.assign(new ProfessorCourse(), json);
        return r;
    }

}


export default ProfessorCourse;