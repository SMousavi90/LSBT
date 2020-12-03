import React from "react";
import { AuthContext } from "../auth/AuthContext";
import API from "../API/API";
import Button from "react-bootstrap/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MyCalendar from "./MyCalendar.js";
import moment from "moment";

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
            // console.log(r);
            this.setState({ resHistory: r });
          })
          .catch((errorObj) => {
            
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
            
          });
      })
      .catch((errorObj) => {
      
      });
  };

  cancelReservationConfirm = (id) => {
    confirmAlert({
      title: "Warning",
      message: `Do you want to cancel the reservation for this lecture?`,
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
    console.log(this.state.resHistory)
    var color = ["#ff6600", "#00cc66", "#0099cc","#006666", "#0066cc"]
    
    return (
      <AuthContext.Consumer>
        {(context) => (
          <MyCalendar
            reservations={this.state.resHistory.map((res) => ({
              id: res.bookingId,
              title: res.courseName,
              start: moment(res.schedule).toDate(),
              end: moment(res.endTime).toDate(),
              allDay: false,
              color: color[res.courseId-1]
            }))}
            cancelBooking = {this.cancelReservationConfirm}
            resHistory = {this.state.resHistory}
          />
        )}
      </AuthContext.Consumer>
    );
  }
}

export default BookingHistory;
