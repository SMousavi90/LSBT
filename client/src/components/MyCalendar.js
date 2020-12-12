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

import React from "react";
import FullCalendar from "@fullcalendar/react";
import momentPlugin from "@fullcalendar/moment";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";

const MyCalendar = (props) => {
  
 
  return (
    <FullCalendar
      plugins={[momentPlugin, timeGridPlugin]}
      initialView="timeGridWeek"
      slotMinTime="08:00:00"
      scrollTime = "12:00:00"
      firstDay = {1}
      allDaySlot={false}
      nowIndicator={true}
      events={props.reservations}
      eventClick={function (info) {
        var eventObj = info.event;
        console.log(eventObj.id);
        props.cancelBooking(eventObj.id);
      }}
      eventDidMount={function (info) {
        // console.log(info.event.id);
        // console.log(info.el.firstElementChild.firstElementChild.children[1]);
        
        var res = props.resHistory.filter((v) => {
          return v.bookingId == info.event.id;
        })[0];
        var teacherName = res.teacherName;
        var classNumber = res.classNumber;
        var bookable = res.bookable;

        
        info.el.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.setAttribute("style","font-size:20px" )
        info.el.firstElementChild.firstElementChild.firstElementChild.setAttribute("style","font-size:15px" )
        
        info.el.firstElementChild.firstElementChild.children[1].insertAdjacentHTML(
          "beforeend",
          `<div style="font-size:20px">${classNumber}<\div>`
        );
        info.el.firstElementChild.firstElementChild.children[1].insertAdjacentHTML(
          "beforeend",
          `<div style="font-size:20px">${teacherName} <\div>`
        );
        
        
        if(moment().diff(res.bookingDeadline)>0)
        {
          info.el.firstElementChild.firstElementChild.children[1].insertAdjacentHTML(
            "beforeend",
            `<div style="color:white, font-size:15px"><b> Booking deadline expired!</b><\div>`
          );
        }

        if(bookable==0)
        {
          info.el.firstElementChild.firstElementChild.children[1].insertAdjacentHTML(
            "beforeend",
            `<div style="color:white, font-size:15px><b> This lecture is now online!</b><\div>`
          );

        }

        info.el.firstElementChild.firstElementChild.children[1].insertAdjacentHTML(
          "afterend",
          `<div><input type="button" value="X" style="float: right; background-color:red;border:none; color:white;"></div>`
        );

        
      }}
      eventTimeFormat={
        // like '14:30:00'
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          meridiem: false,
        }
      }
      slotLabelFormat={
        // like '14:30:00'
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          meridiem: false,
        }
      }
      // eventColor = 'red'
      // eventDidMount={function (info) {
      //   console.log(info);
      //   if (true) {
      //     info.el.css('background-color', 'yellow');
      //   }
      // }}
    />
  );
};

export default MyCalendar;
