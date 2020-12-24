import React from "react";
import { Form, Row } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../API/API";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from 'react-bootstrap/Table';
import Chart from "react-apexcharts";

const moment = require("moment");

class PresenceHistory extends React.Component {
    constructor() {
        super();
        this.state = {
            courses: [],
            history: [],
            selectedCourse: null,
            selectedCourseId: null,
            startDate: new Date(),
            endDate: null,
            series: [],
            options: {
                chart: {
                    width: 380,
                    type: 'pie',
                },
                labels: ['Book Count', 'Presence Count', 'Absence Count'],
                colors : ['#ff6f00', '#008ffb', '#0bb596'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
        };
    }

    componentDidMount() {
        API.getTeacherCourses()
            .then((data) => {
                this.setState({
                    courses: data,
                    selectedCourse: null,
                    selectedCourseId: null,
                });
                API.isAuthenticated()
                    .then((user) => {
                        this.setState((state) => ({ authUser: user }));
                        API.getStudentCurrentCourses(this.state.authUser.userId)
                            .then((c) => {
                                this.setState({ courses: c });
                            })
                            .catch((errorObj) => {
                                console.log(errorObj);
                            });
                    })
                    .catch((err) => {
                        this.setState({ authErr: err.errorObj });
                    });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    getTeacherCourses = (ev) => {
        API.getTeacherCourses()
            .then((data) => {
                this.setState({
                    courses: data,
                    selectedCourse: null,
                    selectedCourseId: null,
                    selectedLecture: null,
                });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    };

    onCourseClick = async (courseName, courseId) => {
        await this.setState({
            selectedCourse: courseName,
            selectedCourseId: courseId !== undefined ? courseId : "",
        });
        this.getPresenceHistory(courseId);
    };

    onDateChange = async (dates) => {
        const [start, end] = dates;
        await this.setState({ startDate: start, endDate: end });
        if (end !== null)
            this.getPresenceHistory(this.state.selectedCourseId)
    };

    getPresenceHistory = (courseId) => {
        this.setState({ history: [] });
        let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
        let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
        API.getPresenceHistory(courseId, startDate, endDate)
            .then((data) => {
                this.setState({
                    history: data
                });
                if (data.length > 0) {
                    let series = [data[0].bookCount, data[0].presenceCount, data[0].absenceCount];
                    console.log(series);
                    this.setState({ series });
                    let options = { ...this.state.options };
                    options.labels = ["Book Count " + "#" + data[0].bookCount, "Presence Count " + "#" + data[0].presenceCount, "Absence Count " + "#" + data[0].absenceCount];
                    this.setState({ options });
                } else {
                    let series = [];
                    this.setState({ series });
                    let options = { ...this.state.options };
                    options.labels = ["Book Count N/A", "Presence Count - N/A", "Absence Count - N/A"];
                    this.setState({ options });
                }
            })
            .catch((errorObj) => {
                console.log(errorObj);
                let series = [0,0,0];
                this.setState({ series });
                let options = { ...this.state.options };
                options.labels = ["Book Count N/A", "Presence Count - N/A", "Absence Count - N/A"];
                this.setState({ options });
            });
    }

    createPresenceHistory = (r) => {
        return (
            <tr>
                <td>{r.bookCount}</td>
                <td>{r.presenceCount}</td>
                <td>{r.absenceCount}</td>
            </tr>
        );
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <div className="container col-md-12">
                        <div
                            className="jumbotron p-4 p-md-2 text-white rounded"
                            style={{ backgroundColor: "rgb(182, 93, 16)", opacity: "60%" }}
                        >
                            <div className="col-md-6 px-0">
                                <h1 className="display-4 font-italic">
                                    <h2>
                                        Historical data about presence in lecrures of {this.props.Username}
                                    </h2>
                                </h1>
                            </div>
                        </div>
                        <Form>
                            <Row>
                                <div className="col-md-10">
                                    <label>Select one course:</label>
                                    <div>
                                        {this.state.courses
                                            .sort((a, b) => a.LectureId - b.LectureId)
                                            .map((c, index) => (
                                                <button
                                                    key={index}
                                                    id={c.CourseId}
                                                    type="button"
                                                    class="btn btn-outline-primary mx-2"
                                                    style={{ height: "48px" }}
                                                    onClick={() => this.onCourseClick(c.Name, c.CourseId)}
                                                >
                                                    {c.Name}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="col-md-2">
                                    <label></label>
                                    <ReactDatePicker
                                        selected={this.state.startDate}
                                        onChange={(x) => this.onDateChange(x)}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        selectsRange
                                        inline
                                    />
                                </div>
                                <div className="mixed-chart col-md-10 mt-4">
                                    <label style={{ margin: "0 auto" }}>
                                        {this.state.selectedCourse === null ? "" : this.state.selectedCourse}
                                    </label>
                                    <Chart options={this.state.options} series={this.state.series} type="pie" width={380} />
                                    {/* <Table striped bordered hover variant="white">
                                        <thead>
                                            <tr style={{ backgroundColor: '#c3c3c3' }}>
                                                <th>Book Count</th>
                                                <th>Presence Count</th>
                                                <th>Absence Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.history.length > 0 ? this.state.history.map(this.createPresenceHistory) : <td colSpan="3" style={{ textAlign: "center" }}>No data available, please select one course and a date range!</td>}
                                        </tbody>
                                    </Table> */}
                                </div>
                            </Row>

                        </Form>
                    </div>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default PresenceHistory;
