import React from 'react';
import { AuthContext } from '../auth/AuthContext'
import API from '../API/API';

class StudentCurrentCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = { authUser: {}, courses: [], courseBGColor: "" }
    }

    createCourses = (c) => {
        return (
            <button className="card mb-4 shadow-sm btn btn-lg btn-outline-primary" onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>
                <div className="card-header">
                    <h4 className="my-0 font-weight-normal">{c.name}</h4>
                </div>
                <div className="card-body d-flex flex-column" style={{backgroundColor: '#cecece'}}>
                    <ul className="list-unstyled mt-3 mb-4">
                        <li style={{color: '#000'}}>{c.desc}</li>
                    </ul>
                    {/* <button id={btnName} type="button" className="btn btn-lg btn-block btn-outline-primary mt-auto"
                        onClick={(ev) => this.props.onGetAvailableLectures(`${c.courseId}`, ev)}>Select</button> */}
                </div>
            </button>
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
