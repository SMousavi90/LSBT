import React from "react";
import { Table, Form, Row, Button } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../API/API";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require("moment");

class BookingAnalytics extends React.Component {
  
  constructor() {
    super();
    this.state = {
      bookings: [],
      selectedPeriod: "Monthly",
      selectedType: "Booking",
      selectedCourseId: null,
      startDate: new Date(),
      endDate: null,
      series: [
        {
          name: "Monthly",
          data: [],
        },
      ],
      options: {
        colors: ["#ff6f00"],
        chart: {
          height: 400,
          width: 800,
          type: "bar",
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "center", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val;
            },
          },
        },
        title: {
          floating: true,
          offsetY: 330,
          align: "bottom",
          style: {
            color: "#444",
          },
        },
      },
    };
  }

  componentDidMount() {
    // this.setState({
    //   startDate: new Date("2020-11-01"),
    //   endDate: new Date("2020-11-30"),
    // });

    this.onTypeClick("Booking");
  }

  getBookings = () => {
    const { selectedPeriod } = this.state;
    let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
    let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
    API.getBookingStatistics(selectedPeriod, startDate, endDate)
      .then((data) => {
        console.log("DATA CATCHED");
        console.log(data);
        this.setState(() => ({
          bookings: data,
        }));
        // this.onTypeClick("Booking");
      })
      .catch((errorObj) => {
        console.log(errorObj);
      });
  };
  getCancellation = () => {
    const { selectedPeriod } = this.state;
    let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
    let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
    API.getCancellationStatistics(selectedPeriod, startDate, endDate)
      .then((data) => {
        console.log("DATA Cancel");
        console.log(data);
        this.setState(() => ({
          bookings: data,
        }));
        // this.onTypeClick("Cancelletion");
      })
      .catch((errorObj) => {
        console.log(errorObj);
      });
  };
  getAttendance = () => {
    const { selectedPeriod } = this.state;
    let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
    let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
    API.getAttendanceStatistics(selectedPeriod, startDate, endDate)
      .then((data) => {
        console.log("DATA Attendace");
        console.log(data);
        this.setState(() => ({
          bookings: data,
        }));
        // this.onTypeClick("Attendance");
      })
      .catch((errorObj) => {
        console.log(errorObj);
      });
  };
  getAllCourses = (ev) => {
    API.getAllCourses()
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

  onTypeClick = async (type) => {
    await this.setState({
      selectedType: type,
    });
    // switch(type){
    //     case 'Booking': {
    //         this.getBookings()
    //         break;
    //     }
    //     case 'Cancelletion': {
    //         this.getCancellation()
    //         break;
    //     }
    //     case 'Attendance': {
    //         this.getAttendance()
    //         break;
    //     }
    // }
    this.onPeriodChange();
  };

  // getBookings = async () => {
  //   const { selectedPeriod } = this.state;
  //   let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
  //   let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
  //   API.getBookingStatistics(period, startDate, endDate)
  //     .then((data) => {
  //       console.log(data);
  //       await this.setState({
  //         bookings: data,
  //       });
  //     })
  //     .catch((errorObj) => {
  //       console.log(errorObj);
  //     });
  // };

  onPeriodChange = async (ev) => {
    // let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
    // let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
    let period = "";
    if (ev === undefined) period = this.state.selectedPeriod;
    else {
      period = ev.target.value;
      await this.setState({ selectedPeriod: period });
    }
    switch (this.state.selectedType) {
      case "Booking": {
        this.getBookings();
        break;
      }
      case "Cancelletion": {
        this.getCancellation();
        break;
      }
      case "Attendance": {
        this.getAttendance();
        break;
      }
    }
  };

  onDateChange = async (dates) => {
    const [start, end] = dates;
    await this.setState({ startDate: start, endDate: end });
    if (end !== null) this.onPeriodChange();
  };

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
                    All booking reports related to {this.props.Username}'s
                    lectures
                  </h2>
                </h1>
              </div>
            </div>
            <Form>
              <Row>
                <div className="col-md-2">
                  <label>by period:</label>
                  <select
                    className="custom-select custom-select-lg mb-3"
                    onChange={(x) => {
                      this.setState({ selectedCourseId: "All" });
                      this.onPeriodChange(x);
                    }}
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly" selected>
                      Monthly
                    </option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
                <div className="col-md-10">
                  <label>by type:</label>
                  <div>
                    {["Booking", "Cancelletion", "Attendance"].map(
                      (type, index) => (
                        <Button
                          key={index}
                          id={type}
                          type="button"
                          active={type === this.state.selectedType}
                          class="btn btn-outline-primary mx-2"
                          style={{ height: "48px", margin: "0 10px" }}
                          onClick={() => this.onTypeClick(type)}
                        >
                          {type}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </Row>
              <Row>
                <div className="col-md-2 mr-5">
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
                <div className="mixed-chart col-md-9">
                  <StatisticsTable
                    bookings={this.state.bookings}
                    selectedPeriod={this.state.selectedPeriod}
                    avg={
                      this.state.selectedPeriod === "Daily"
                        ? "Count"
                        : "Average"
                    }
                  />
                </div>
              </Row>
            </Form>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}

function StatisticsTable(props) {
  const { bookings } = props;
  console.log(props);
  const bookingRows = bookings.map((booking, index) => {
    return (
      <tr key={index}>
        <td>{booking.TeacherName}</td>
        <td>{booking.CourseName}</td>
        <td>{booking.no}</td>
        <td>{booking.avg}</td>
      </tr>
    );
  });
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className="col-1">Teacher Name</th>
          <th>Course Name</th>
          <th>{props.selectedPeriod}</th>
          <th>{props.avg}</th>
        </tr>
      </thead>
      <tbody>{bookingRows}</tbody>
    </Table>
  );
}

export default BookingAnalytics;
