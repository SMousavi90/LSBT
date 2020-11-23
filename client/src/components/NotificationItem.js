import React from 'react';
const moment = require('moment');

const NotificationItem = (props) => {
    return (
        <>
            {props.alreadyShown === 0 ?
            <tr className="text-center" style={{ 'backgroundColor': '#79daad' }}>
                <td>{props.name}</td>
                <td>{moment(props.schedule).format("dddd, MMMM Do YYYY, H:mm")}</td>
                <td>{props.nStudents}</td>
            </tr> :
            <tr className="text-center" >
                <td>{props.name}</td>
                <td>{moment(props.schedule).format("dddd, MMMM Do YYYY, H:mm")}</td>
                <td>{props.nStudents}</td>
             </tr>}
        </>
    )
}

export default NotificationItem