import React from "react";
import { Form, Row } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import API from "../API/API";
import Chart from "react-apexcharts";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require("moment");

class AllBooking extends React.Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      selectedPeriod: "Monthly",
      selectedCourse: null,
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
        colors : ['#ff6f00'],
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
        this.onPeriodChange();
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
      selectedCourseId: courseId !== undefined ? courseId : "All",
    });
    this.onPeriodChange();
  };

  onPeriodChange = (ev) => {
    let startDate = moment(this.state.startDate).format("yyyy-MM-DD");
    let endDate = moment(this.state.endDate).format("yyyy-MM-DD");
    let period = "";
    if (ev === undefined) period = this.state.selectedPeriod;
    else {
      period = ev.target.value;
      this.setState({ selectedPeriod: period });
    }
    API.getTeacherStats(
      period,
      this.state.authUser.userId,
      startDate,
      endDate,
      this.state.selectedCourseId
    )
      .then((data) => {
        if (period === "Monthly") {
          var months = [];
          for (var k = 0; k < 12; k++) {
            months.push(0);
          }
          for (var i = 0; i < data.length; i++) {
            months[data[i].no - 1] = data[i].avg;
            // let r = Math.floor(Math.random() * 100);
            // months[i] = r;
          }
          let series = [
            {
              name: "Monthly",
              data: months,
            },
          ];
          let options = {
            colors : ['#ff6f00'],
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
          };
          this.setState({ series, options });
        } else if (period === "Weekly") {
          var weeks = [];
          var weekNames = [];
          for (var _w = 0; _w < data.length; _w++) {
            weeks.push(0);
            weekNames.push("Week #" + (_w + 1));
          }
          for (var w = 0; w < data.length; w++) {
            weeks[data[w].no - 1] = data[w].avg;
            // let r = Math.floor(Math.random() * 100);
            // weeks[w] = r;
          }
          let series = [
            {
              name: "Weeks",
              data: weeks,
            },
          ];
          let options = {
            colors : ['#ff6f00'],
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
              categories: weekNames,
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
          };

          this.setState({ series, options });
        } else {
          var days = [];
          var dayNames = [];
          for (var _d = 0; _d < data.length; _d++) {
            days.push(0);
            dayNames.push("Day #" + (_d + 1));
          }
          for (var d = 0; d < data.length; d++) {
            days[data[d].no - 1] = data[d].avg;
          }
          let series = [
            {
              name: "Days",
              data: days,
            },
          ];
          let options = {
            colors : ['#ff6f00'],
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
              categories: dayNames,
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
          };
          this.setState({ series, options });
        }
      })
      .catch((errorObj) => {
        console.log(errorObj);
      });
  };

  onDateChange = async (dates) => {
    const [start, end] = dates;
    await this.setState({ startDate: start, endDate: end });
    if (end !== null)
      this.onPeriodChange();
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
                  <label>by courses:</label>
                  <div>
                    <button
                      key="0"
                      type="button"
                      class="btn btn-outline-primary mx-2"
                      style={{ height: "48px" }}
                      onClick={() => this.onCourseClick("All")}
                    >
                      All
                    </button>
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
                <div className="col-md-4">
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
                <div
                  className="mixed-chart col-md-8"
                  style={{ margin: "auto", padding: "10px" }}
                >
                  <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    width="800"
                  />
                </div>
              </Row>
              <Row>
                <label style={{ margin: "0 auto" }}>
                  {this.state.selectedPeriod === "Monthly"
                    ? "Monthly Average for "
                    : this.state.selectedPeriod === "Weekly"
                    ? "Weekly Average for "
                    : "Daily Average for "}
                  {this.state.selectedCourse === null ? "All" : this.state.selectedCourse} 
                </label>
              </Row>
            </Form>
          </div>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default AllBooking;
