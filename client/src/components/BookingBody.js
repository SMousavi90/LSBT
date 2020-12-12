import React from 'react';
import API from '../API/API';
import StudentCurrentCourses from './StudentCurrentCourses'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


class BookingBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = { courses: [], selectedCourse: "", selectedCourseId: -1, scheduleVisibility: "none", lectures: [] };
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                API.getStudentCurrentCourses(this.state.authUser.userId)
                    .then((c) => {
                        this.setState({ courses: c });
                    })
                    .catch((errorObj) => {
                        console.log(errorObj);
                    });
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
        });
    }

    getAvailableLectures = (id, ev) => {
        API.getAvailableLectures(id, this.state.authUser.userId)
            .then((data) => {
                // show the list of available lectures
                // console.log(data);
                if (data.length > 0) {
                    this.setState(() => ({ scheduleVisibility: "", selectedCourse: data[0].courseName, selectedCourseId: id, lectures: data })); // todo change selectedCourse
                } else {
                    this.setState(() => ({ scheduleVisibility: "none", selectedCourse: "", selectedCourseId: -1, lectures: [] }));
                }
            })
            .catch((errorObj) => {
                // console.log(errorObj);
                this.setState(() => ({ scheduleVisibility: "none", selectedCourse: "", lectures: [] }));
            });
    }

    bookLecture = (lectureId, schedule) => {
        API.bookLecture(lectureId, this.state.authUser.userId, schedule)
            .then((data) => {
                if (data==true) {
                    confirmAlert({
                        customUI: ({ onClose }) => {
                            return (
                                <div className='custom-ui-success'>
                                    <h1></h1>
                                    <p>Successfully booked!</p>
                                    <button onClick={onClose}>Ok</button>
                                </div>
                            );
                        }
                    });

                }else if(data==false)
                {
                    confirmAlert({
                        customUI: ({ onClose }) => {
                            return (
                                <div className='custom-ui-warning'>
                                    <h1></h1>
                                    <p>There are no available seats for the selected lecture,</p>
                                    <p>you're now in the waiting list.</p>
                                    <button onClick={onClose}>Ok</button>
                                </div>
                            );
                        }
                    });
                }
                this.getAvailableLectures(this.state.selectedCourseId);
                // console.log(data);
            })
            .catch((errorObj) => {
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <div className='custom-ui-danger'>
                                <h1></h1>
                                <p>You have already booked for this lecture!</p>
                                <button onClick={onClose}>Ok</button>
                            </div>
                        );
                    }
                });
                console.log(errorObj);
            });
    }

    bookLectureConfirm = (lectureId, schedule) => {
        confirmAlert({
            title: "Warning",
            message: `Continue to book ${this.state.selectedCourse} on ${schedule}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.bookLecture(lectureId, schedule)
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        })
    }

        createLectureRows = (r) => {
        
        return (
            <tr>
                <td>{r.schedule}</td>
                <td>{r.classNumber}</td>
                <td>{r.teacherName}</td>
                <td>{r.freeSeats}</td>
                <td>{
                    r.reserved === 0 ? 
                    <Button variant={r.bookButton === 1 ? "success":"warning"} className="btn btn-sm btn-block btn-success mt-auto" type="button" onClick={() => this.bookLectureConfirm(r.lectureId, r.schedule)}>{r.bookButton === 1 ?"Book":"Reserve"}</Button>
                    : <Button variant="warning disabled">Waiting list</Button>
                
                }</td>
            </tr>
        );
    }

    render() {
        return (<>
            <div className="container col-md-12">
                <div className="jumbotron p-4 p-md-5 text-white rounded" style={{ backgroundColor: 'rgb(74, 77, 85)' }}>
                    <div className="col-md-6 px-0">
                        <h1 className="display-4 font-italic"><h2>Welcome, {this.props.name}</h2></h1>
                        <p className="lead my-3">To book for a lecture, please select a subject listed below:</p>
                    </div>
                    {/* <div className="col-md-3">
                        <button type="button" className="btn btn-lg btn-danger pull-right" onClick={() => this.goToBookingHistory()}>Go to my Reservations</button>
                    </div> */}
                </div>
                <div className="card-deck mb-3 text-center">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <StudentCurrentCourses courses={this.state.courses} onGetAvailableLectures={this.getAvailableLectures} />
                    </div>
                </div>
                <div style={{ display: `${this.state.scheduleVisibility}` }}>
                    <h5><strong>{this.state.selectedCourse}</strong></h5>
                    <hr style={{ borderColor: 'gray' }} />
                    <div className="container col-md-12">
                        <div class="panel panel-default">
                            <Table striped bordered hover variant="white">
                                <thead>
                                    <tr style={{ backgroundColor: '#c3c3c3' }}>
                                        <th className="col-md-1">Schedule</th>
                                        <th>Class Number</th>
                                        <th>Teacher Name</th>
                                        <th>Available Seats</th>
                                        <th className="col-md-1 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.lectures.map(this.createLectureRows)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
}


export default BookingBody;