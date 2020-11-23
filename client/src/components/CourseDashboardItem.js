import React from 'react';
const moment = require('moment');

const CourseDashboardItem = (props) => {
    return (
        <>
        
        <tr className="text-center" >
            <td>{props.studentId}</td>
            <td>{props.surname}</td>
            <td>{props.name}</td>
            <td>{props.courseName}</td>
            <td>{props.schedule}</td>
            <td>{props.lectureId}</td>
        </tr> 
    </>
        
    )
}

export default CourseDashboardItem