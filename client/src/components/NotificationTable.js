import Table from 'react-bootstrap/Table';
import NotificationItem from './NotificationItem.js';
const moment = require('moment');

const NotificationTable = (props) =>{

    return <Table>
    <thead>
      <tr className="text-center">
        <th>Course</th>
        <th>Date</th>
        <th>Number of students</th>
      </tr>
    </thead>
    <tbody>
      {props.notifications.sort((a, b) => { 
       return moment(a.schedule).diff(moment(b.schedule))
  }).map((notification,index)=><NotificationItem key = {index} schedule ={notification.Schedule} name = {notification.Name} nStudents = {notification.nStudents} alreadyShown = {notification.SentStatus} />)}
    </tbody>
  </Table>
}

export default NotificationTable;