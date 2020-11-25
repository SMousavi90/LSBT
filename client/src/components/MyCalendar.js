// import React from 'react'
// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import moment from 'moment'

// const localizer = momentLocalizer(moment)

// const MyCalendar = (props) => {
//   return(
//     <>
//     <Calendar
//       localizer={localizer}
//       events={props.reservations}
//       startAccessor="start"
//       endAccessor="end"
      
//     />
//     </>)
// }


// export default MyCalendar

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import momentPlugin from '@fullcalendar/moment'
import timeGridPlugin from '@fullcalendar/timegrid';

const MyCalendar = (props) => {
  // console.log(props.reservations);
    return (
      <FullCalendar
        plugins={[ momentPlugin, timeGridPlugin ]}
        initialView="timeGridWeek"
        slotMinTime = "08:00:00"
        allDaySlot = {false}
        nowIndicator = {true}
        events = {props.reservations}
        eventClick = {function(info) {
          var eventObj = info.event;
          console.log(eventObj.id)
          props.cancelBooking(eventObj.id);
        }
      }
        // eventColor = 'red'
        
      />
    )
}

export default MyCalendar