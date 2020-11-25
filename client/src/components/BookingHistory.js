import React from "react";
import { AuthContext } from "../auth/AuthContext";
import Table from "react-bootstrap/Table";
import API from "../API/API";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MyCalendar from "./MyCalendar.js";
import moment from 'moment'

class BookingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authUser: {}, resHistory: [] };
  }

  componentDidMount() {
    API.isAuthenticated()
      .then((user) => {
        this.setState((state) => ({ authUser: user }));
        API.getBookingHistory(this.state.authUser.userId)
          .then((r) => {
            console.log(r);
            this.setState({ resHistory: r });
          })
          .catch((errorObj) => {
            console.log(errorObj);
          });
      })
      .catch((err) => {
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
  };

  cancelReservationConfirm = (id) => {
    confirmAlert({
      title: "Warning",
      message: `Continue to cancel reservatino for this lecture?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => this.cancelReservation(id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  createBookingHistory = (r) => {
    return (
      <tr>
        <td>{r.courseName}</td>
        <td>{r.teacherName}</td>
        <td>{r.bookDate}</td>
        <td>{r.bookingDeadline}</td>
        <td>{r.reserved == null ? "No" : "Yes"}</td>
        <td>
          {r.canceled == null ? (
            "No"
          ) : (
            <div>
              <span>You canceled at: </span>
              <span className="badge badge-danger">{r.cancelDate}</span>
            </div>
          )}
        </td>
        <td>{r.presence == null ? "N/A" : "Yes"}</td>
        <td>{r.reserveDate == null ? "N/A" : r.reserveDate}</td>
        <td>
          {
            //
            r.canceled === null ? (
              <Button
                variant="danger"
                className="ml-2"
                type="button"
                onClick={() => this.cancelReservationConfirm(r.bookingId)}
              >
                Cancel
              </Button>
            ) : (
              ""
            )
          }
        </td>
      </tr>
    );
  };
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <MyCalendar
          reservations=
          {this.state.resHistory.map((res) => ({
            id: res.bookingId,
            title: res.courseName,
            start: moment(res.schedule).toDate(),
            end: moment(res.endTime),
            allDay: false

          }))}
          cancelBooking = {this.cancelReservationConfirm}
        />
        )}
      </AuthContext.Consumer>
    );
  }
}

export default BookingHistory;
