import React, { useState, useEffect } from 'react';
import API from '../API/API';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CourseDashboardTable from './CourseDashboardTable';

class DashboardBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = { courses: [], selectedCourse: "", selectedCourseId: -1, scheduleVisibility: "none", lectures: [] };
    }

    componentDidMount() {
        /*API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                API.getStudentsPerLecturePerProfessor(this.state.authUser.userId).
                    then((c) => {
                        this.setState({ courses: c });

                    })
                    .catch((errorObj) => {
                        console.log(errorObj);
                    });

            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
        });*/
    }

    getTeacherCourses = (ev) => {
        API.getTeacherCourses()
            .then((data) => {
                // show the list of available lectures
                this.setState({ courses: data });

            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    render() {
        return <>
            <h2>Welcome, {this.props.name} , ID: {this.props.id}</h2>

            <Breadcrumb className="full-width">
                <Breadcrumb.Item onClick={(e) => this.getTeacherCourses(e)}>Courses</Breadcrumb.Item>
                <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                    Library
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Data</Breadcrumb.Item>
            </Breadcrumb>

            <CourseTable courses={this.state.courses} />
        </>
    }
}

function CourseTable(props) {
    console.log(props.courses);

    return <Table striped bordered hover>
        <thead>
            <tr>
                <th className="col-1">CourseId</th>
                <th>Name</th>
                <th className="col-2"></th>
            </tr>
        </thead>
        <tbody>
            {props.courses.map((e) => <CourseRow key={e.id} course={e} />)}
        </tbody>
    </Table>
}

function CourseRow(props) {
    return <tr>
        <td>{props.course.CourseId}</td>
        <td>{props.course.Name}</td>
        <td className="text-center"><Button variant="primary">View Lectures</Button></td>
    </tr>
}

export default DashboardBody;