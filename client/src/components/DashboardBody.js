import React, { useState, useEffect } from 'react';
import API from '../API/API';
import ProfessorCourse from './StudentCurrentCourses'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { Redirect } from 'react-router-dom';
import CourseDashboardTable from './CourseDashboardTable'

class DashboardBody extends React.Component {

   


    displayRows = (r) => {
        return (
            <tr className="DashboardBody">
                <td>{r.StudentId}</td>
                <td>{r.LastName}</td>
                <td>{r.Name}</td>
                <td>{r.CourseName}</td>
                <td>{r.Schedule}</td>
                <td>{r.LectureId}</td>
                
            </tr>
        )

    }

    constructor(props) {
        super(props);
        this.state = { courses: [], selectedCourse: "", selectedCourseId: -1, scheduleVisibility: "none", lectures: [] };
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                console.log("This.props.id = " + this.state.authUser.userId);
                API.getStudentsPerLecturePerProfessor(this.state.authUser.userId).
                    then((c) => {
                        this.setState({ courses: c });
                        
                    })
                    .catch((errorObj) => {
                        console.log(errorObj);
                    });
            
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log(this.state.courses);
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
        });
    }



    render(){ return (
    <><h2 >Welcome, {this.props.name} , ID: {this.props.id}</h2>
       
        <CourseDashboardTable courses={this.state.courses}/>

       
        </>
    ) ; }
}

export default DashboardBody;