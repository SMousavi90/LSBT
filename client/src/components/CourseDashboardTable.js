import Table from 'react-bootstrap/Table';
import CourseDashboardItem from './CourseDashboardItem'


const CourseDashboardTable = (props) =>{

    return <Table>
    <thead>
      <tr className="text-center">
        <th>Student Id</th>
        <th>Surname</th>
        <th>Name</th>
        <th>Course</th>
        <th>Date</th>
        <th>LectureId</th>
      </tr>
    </thead>
    <tbody>
      {props.courses.sort((a, b) => 
       a.LectureId - b.LectureId 
  ).map((c,index)=><CourseDashboardItem key = {index} studentId={c.StudentId} surname = {c.LastName} name = {c.Name} courseName={c.CourseName} schedule={c.Schedule} lectureId = {c.LectureId}/>)}
    </tbody>
      
  </Table>
}

export default CourseDashboardTable;