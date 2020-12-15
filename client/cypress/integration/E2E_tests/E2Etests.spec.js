const moment = require("moment");

const APIURL = "api";

Cypress.Commands.add('login', () => { 
    cy.request({
      method: 'POST',
      url: APIURL + '/login',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
        
      
    })
    .then((resp) => {
      window.localStorage.setItem('jwt', resp.body.user.token)
    })
  
  })




const studentLogin = () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('contain' , 'http://localhost:3000/login');
    cy.contains('Username').click().type('student1');
    cy.contains('Password').click().type('pass').type('{enter}');
    
}

const professorLogin = () => {
  cy.visit('http://localhost:3000/');
  cy.url().should('contain' , 'http://localhost:3000/login');
  cy.contains('Username').click().type('teacher1');
  cy.contains('Password').click().type('pass').type('{enter}');
  
}




// studentLogin()
//             // cy.wait('@Login',{ timeout: 10000});
//             API.clearDatabase().then(
//                 (resp) => {
//                     expect(resp).to.be.null;
//                 }
//             ).catch((errorObj) => {
//                 console.log(errorObj);
//             });

//             API.addCourse(courseData).then(
//                 () => {
//                     console.log("Course added");
//                 }
//             ).catch((errorObj) => {
//                 console.log(errorObj);
//             });
            
//             //addLecture()



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

  
    it('Student login', () => {
      
      clearDatabase();
      
      const courseData = [1,"data science","We study a lot of data science","2020","Scott"];

      addCourse(courseData);
      
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
      const tomorrowstring = tomorrow.toLocaleDateString(
        'it-IT',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      ) + " " +  tomorrow.toLocaleTimeString('it-It');

      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 5);

      const deadlinestring = deadline.toLocaleDateString(
        'it-IT',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      ) + " " +  deadline.toLocaleTimeString('it-It');

      // (CourseId, Schedule,
      // BookingDeadline, NotificationDeadline, EndTime,
      // Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time)


        console.log(tomorrowstring);
        console.log(deadlinestring);
        console.log(new Date(tomorrowstring));
      const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 1, 0, 1, 120, "Mon",  "8:30-11:30"];
         
      addLecture(lectureData);
      
      cy.visit("http://localhost:3000/");
      studentLogin();
      cy.contains(courseData[2]).click();
      //cy.contains(courseData[5]); //click();
      //   cy.get('Button').contains('Book').click();
    })

    
})




describe('[LSBT1-2]As a teacher I want to get notified of the number of students attending my next lecture so that I am informed' , () => {

  // it('Professor Login', () => {
  //   professorLogin();
  // })


})


describe('[LSBT1-3]As a teacher I want to access the list of students booked for my lectures so that I am informed' , () => {
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
})

describe('[LSBT1-14]As a student in the waiting list I want to be added to the list of students booked when someone cancels their booking so that I can attend the lecture' , () => {
})

describe('[LSBT1-15]As a student I want to get notified when I am taken from the waiting list so that I can attend the lecture' , () => {
})

describe('[LSBT1-16]As a booking manager I want to generate a contact tracing report starting with a positive student so that we comply with safety regulations' , () => {
})

describe('[LSBT1-17]As a support officer I want to update the list of bookable lectures' , () => {
})
