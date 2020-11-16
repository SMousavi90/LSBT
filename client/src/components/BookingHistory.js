import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import Table from 'react-bootstrap/Table';
import API from "../API"
import Button from 'react-bootstrap/Button';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css' 

class BookingHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = { authUser: {}, resHistory: [] }
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
                API.getBookingHistory(this.state.authUser.userId)
                    .then((r) => {
                        console.log(r);
                        this.setState({ resHistory: r });
                    })
                    .catch((errorObj) => {
                        console.log(errorObj);
                    });
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
        });
    }

    cancelReservation = (id) => {
        API.cancelReservation(id)
            .then(() => {
                API.getBookingHistory(this.state.authUser.userId)
                    .then((r) => {
                        this.setState({ resHistory: r });
                    })
                    .catch((errorObj) => {
                        console.log(errorObj);
                    });
            })
            .catch((errorObj) => {
                console.log(errorObj);
            });
    }

    cancelReservationConfirm = (id) => {
        confirmAlert({
            title: "Warning",
            message: `Continue to cancel reservatino for this lecture?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.cancelReservation(id)
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        })
    }

    createBookingHistory = (r) => {
        return (
            <tr>
                <td>{r.courseName}</td>
                <td>{r.teacherName}</td>
                <td>{r.bookDate}</td>
                <td>{r.bookingDeadline}</td>
                <td>{r.reserved == null ? "No" : "Yes"}</td>
                <td>{r.canceled == null ? "No" : (<div><span>Canceled at: </span><span className="badge badge-danger">{r.cancelDate}</span></div>)}</td>
                <td>{r.presence == null ? "N/A" : "Yes"}</td>
                <td>{r.reserveDate == null ? "N/A" : r.reserveDate}</td>
                <td>{
                    //  
                    (r.canceled === null) ?
                        <Button variant="danger" className="ml-2" type="button"
                            onClick={() => this.cancelReservationConfirm(r.bookingId)}>Cancel</Button> : ""
                }</td>
            </tr>
        );
    }

    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    <Table striped bordered hover variant="white">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Teacher</th>
                                <th>Book Date</th>
                                <th>Booking Deadline</th>
                                <th>Reserved</th>
                                <th>Canceled</th>
                                <th>Presence</th>
                                <th>Reservation Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.resHistory.map(this.createBookingHistory)}
                        </tbody>
                    </Table>
                )}
            </AuthContext.Consumer>
        );

    }
}

export default BookingHistory;