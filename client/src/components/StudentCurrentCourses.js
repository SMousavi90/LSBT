import React from 'react';
import { AuthContext } from '../auth/AuthContext'

class StudentCurrentCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = { authUser: {}, courses: [], courseBGColor: "" }
    }

    createCourses = (c) => {
        return (
            /* <button className="card mb-4 shadow-sm btn btn-lg btn-outline-primary" onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>
                {/* <div className="card-header">
                    <h4 className="my-0 font-weight-normal">{c.name}</h4>
                </div> */

            // <div class="card" style={{height: "150px"}} onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>
            //     <div class="card-body" style={{textAlign: "center"}}>
            //         <h5 class="card-title" style={{minHeight: "68px"}}>{c.name}</h5>
            //         <a href="#" class="btn btn-primary btn-block" onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>Select lecture</a>
            //     </div>
            // </div>
            <div class="container">
                <a class="card1" href="#" style={{textDecoration: "none"}} onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>
                    <h3>{c.name}</h3>
                    <p class="small">{c.desc}</p>
                    <div class="go-corner" href="#">
                        <div class="go-arrow">
                            →
                        </div>
                    </div>
                </a>
            </div >
        );
    }
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => (
                    this.props.courses.map(this.createCourses)
                )}
            </AuthContext.Consumer>
        );
    }
}

export default StudentCurrentCourses;
