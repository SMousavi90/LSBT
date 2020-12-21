const { findIconDefinition } = require("@fortawesome/fontawesome-svg-core");
const moment = require("moment");

const APIURL = "api";






const studentLogin = (number) => {
    cy.visit('http://localhost:3000/');
    //cy.url().should('contain' , 'http://localhost:3000/login');
    cy.contains('Username').click().type('student'+number);
    cy.contains('Password').click().type('pass').type('{enter}');
    cy.location('href').should('eq','http://localhost:3000/');
    
}

const professorLogin = () => {
  cy.visit('http://localhost:3000/');
  cy.url().should('contain' , 'http://localhost:3000/login');
  cy.contains('Username').click().type('teacher1');
  cy.contains('Password').click().type('pass').type('{enter}');
  
}



function addCourse(courseData){
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addcourse/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: courseData }),
      
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}

function addBooking(bookingData){
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addbooking/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: bookingData }),
      
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}




function addStudentCourse(studentcourseData){
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addstudentcourse/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: studentcourseData }),
      
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}


function addLecture(lectureData){
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addlecture/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: lectureData }),
      
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )


}




function clearDatabase(){
  cy.request({
    method: 'DELETE',
    url:"http://localhost:3000/" + APIURL + '/cleardatabase/',
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
}


describe('[LSBT1-1]As a student I want to book a seat for one of my lectures so that I can attend it', () =>{

  
    it('Student books a lecture', () => {
      
      clearDatabase();
      
      const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

      addCourse(courseData);
      
      const studentcourseData = [1,1,1];

      addStudentCourse(studentcourseData);




      new Date().toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      );
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate()+1);
      const tomorrowstring = tomorrow.toISOString().slice(0,2);

      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 5);

      const deadlinestring = deadline.toISOString().slice(0,16);
      


        console.log(tomorrowstring);
        console.log(deadlinestring);
        console.log(new Date(tomorrowstring));
      const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
         
      addLecture(lectureData);
      
      cy.visit("http://localhost:3000/");
      studentLogin(1);
      cy.contains(courseData[2]).click();
      cy.contains(courseData[5]); //click();
      cy.get('Button').contains('Book').click();
      cy.get('Button').contains('Yes').click();
      cy.get('Button').contains('Ok').click();
    })

    it('Student cannot book a lecture scheduled in more than 2 weeks', () => {
      
      clearDatabase();
      
      const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

      addCourse(courseData);
      
      const studentcourseData = [1,1,1];

      addStudentCourse(studentcourseData);
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate()+20);
      const tomorrowstring = tomorrow.toISOString().slice(0,16);

      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 20);

      const deadlinestring = deadline.toISOString().slice(0,16);
      


        
      const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
         
      addLecture(lectureData);
      
      cy.visit("http://localhost:3000/");
      studentLogin(1);
      cy.contains(courseData[2]).click();
      cy.contains(courseData[5]); //click();
      cy.get('td').should('have.text','No lecture available, please select one course.');
    })

    
})




describe('[LSBT1-2]As a teacher I want to get notified of the number of students attending my next lecture so that I am informed' , () => {

  it('Student books a lecture -> teacher receives notification', () => {
      
    clearDatabase();
    
    const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

    addCourse(courseData);
    
    const studentcourseData = [1,1,1];

    addStudentCourse(studentcourseData);




    new Date().toLocaleDateString(
      'en-gb',
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
    );
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrowstring = tomorrow.toISOString().slice(0,2);

    const deadline = new Date(today);
    deadline.setDate(deadline.getDate() + 5);

    const deadlinestring = deadline.toISOString().slice(0,16);
    


      console.log(tomorrowstring);
      console.log(deadlinestring);
      console.log(new Date(tomorrowstring));
    const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
       
    addLecture(lectureData);
    
    cy.visit("http://localhost:3000/");
    studentLogin(1);
    cy.contains(courseData[2]).click();
    cy.contains(courseData[5]); //click();
    cy.get('Button').contains('Book').click();
    cy.get('Button').contains('Yes').click();
    cy.get('Button').contains('Ok').click();
    cy.get('#collasible-nav-dropdown > span').click();
    cy.get('.dropdown-item').click();

    professorLogin();

  })



})


describe('[LSBT1-3]As a teacher I want to access the list of students booked for my lectures so that I am informed' , () => {
  
  // it('Professor Login', () => {
  //   clearDatabase();
      
  //   const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
  //   addCourse(courseData);

  //   const today = new Date();
  //     const tomorrow = new Date(today);
  //     tomorrow.setDate(tomorrow.getDate()+20);
  //     const tomorrowstring = tomorrow.toISOString().slice(0,16);

  //     const deadline = new Date(today);
  //     deadline.setDate(deadline.getDate() + 20);

  //     const deadlinestring = deadline.toISOString().slice(0,16);
      


        
  //     const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
  //     addLecture(lectureData);

  //     const bookingDate = new Date().toISOString().slice(0,16);

  //     const bookingData = [1,1,1,null,null,null,null,null,bookingDate];
  //     addBooking(bookingData);

  //   professorLogin();

  //   cy.get('.btn > .svg-inline--fa > path').click();
  //   cy.get('.d-inline-flex > :nth-child(2)').click();
  //   cy.get('tbody > tr > :nth-child(1)').should('have.text',courseData[5]);
  //   cy.get('tbody > tr > :nth-child(2)').should('have.text',bookingDate);


    
  // })


})

describe('[LSBT1-4]As a student I want to get an email confirmation of my booking so that I am informed' , () => {
})

describe('[LSBT1-5]As a student I want to cancel my booking so that I am free' , () => {
})

describe('[LSBT1-6]As a student I want to access a calendar with all my bookings for the upcoming weeks' , () => {
})

describe('[LSBT1-7]As a teacher I want to cancel a lecture up to 1h before its scheduled time' , () => {
})

describe('[LSBT1-8]As a student I want to get notified when a lecture is cancelled' , () => {
})

describe('[LSBT1-9]As a teacher I want to turn a presence lecture into a distance one up to 30 mins before its scheduled time' , () => {
})

describe('[LSBT1-10]As a teacher I want to access the historical data about bookings so that I can plan better' , () => {
})

describe('[LSBT1-11]As a booking manager I want to monitor usage (booking, cancellations, attendance) of the system' , () => {
})

describe('[LSBT1-12]As a support officer I want to upload the list of students, courses, teachers, lectures, and classes to setup the system' , () => {








})

describe('[LSBT1-13]As a student I want to be put in a waiting list when no seats are available in the required lecture' , () => {

  it('Student gets reservation', () =>
{  clearDatabase();
      
      //(CourseId,Name,Description,Year,Semester,Teacher)
      const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

      addCourse(courseData);
      
      //(StudentCourseId,CourseId,StudentId)
      var studentcourseData = [1,1,1];

      addStudentCourse(studentcourseData);

      studentcourseData = [2,1,3];
      addStudentCourse(studentcourseData);
      new Date().toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      );
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate()+1);
      const tomorrowstring = tomorrow.toISOString().slice(0,2);

      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 5);

      const deadlinestring = deadline.toISOString().slice(0,16);
      


      //(CourseId, Schedule,BookingDeadline, NotificationDeadline, EndTime,Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time)
      const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring + 1 , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];

      addLecture(lectureData);

      cy.visit("http://localhost:3000/");
      studentLogin(1);
      cy.contains(courseData[2]).click();
      cy.contains(courseData[5]); //click();
      cy.get('.btn').should('have.text', 'Book').click();
      cy.get('Button').contains('Yes').click();
      cy.get('Button').contains('Ok').click();
      //Logout
      cy.get('#collasible-nav-dropdown > span').click();
      cy.get('.dropdown-item').click();
      studentLogin(2);
      cy.get('h3').should('have.text', 'data science').click();
      cy.get('tbody > tr > :nth-child(4)').should('have.text','0');
      cy.get('.btn').should('have.text','Reserve').click();
      cy.get('.react-confirm-alert-body > h1').should('have.text','Warning');
      cy.get('.react-confirm-alert-button-group > :nth-child(1)').should('have.text', 'Yes').click();
      cy.get('.custom-ui-warning > :nth-child(3)').should('have.text','you\'re now in the waiting list.');
      cy.get('.custom-ui-warning > button').should('have.text','Ok').click();
      cy.get('.btn').should('have.text','Waiting list');
}

 )}
)

describe('[LSBT1-14]As a student in the waiting list I want to be added to the list of students booked when someone cancels their booking so that I can attend the lecture' , () => {

  it('Student cancels lecture booking -> student in waiting list gets the spot', () => {
    //Logout
    cy.get('#collasible-nav-dropdown > span').click();
    cy.get('.dropdown-item').click();
    studentLogin(1);
  })




})

describe('[LSBT1-15]As a student I want to get notified when I am taken from the waiting list so that I can attend the lecture' , () => {
})

describe('[LSBT1-16]As a booking manager I want to generate a contact tracing report starting with a positive student so that we comply with safety regulations' , () => {
})

describe('[LSBT1-17]As a support officer I want to update the list of bookable lectures' , () => {
})
