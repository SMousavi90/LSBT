import React from 'react';
import API from '../API/API';
import { Col, Form, Row } from "react-bootstrap";
import { confirmAlert } from 'react-confirm-alert'; // Import

class OfficerDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedFile: null, selectedType: "Schedule"}
    }

    componentDidMount() {
        API.isAuthenticated().then(
            (user) => {
                this.setState((state) => ({ authUser: user }));
            }
        ).catch((err) => {
            this.setState({ authErr: err.errorObj });
        });
    }

    onChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    onClickHandler = () => {
        const data = new FormData();
        data.append('file', this.state.selectedFile);
        let importType = this.state.selectedType;
        data.append('importType', importType);
        if (this.state.selectedFile === null) {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui-danger'>
                            <h1></h1>
                            <p>The file is not selected</p>
                            <button onClick={onClose}>Ok</button>
                        </div>
                    );
                }
            });
        } else {
        API.uploadDataCSV(data)
            .then(() => {
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <div className='custom-ui-success'>
                                <h1></h1>
                                <p>Successfully imported!</p>
                                <button onClick={onClose}>Ok</button>
                            </div>
                        );
                    }
                });
            })
            .catch((errorObj) => {
                console.log(errorObj);
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <div className='custom-ui-danger'>
                                <h1></h1>
                                <p>There was an error during the upload!</p>
                                <button onClick={onClose}>Ok</button>
                            </div>
                        );
                    }
                });
            });
        }
    }

    onEntityTypeChange = (ev) => {
        let type = ev.target.value;
        this.setState({ selectedType: type });
    }

    render() {
        return (<>
            <div className="container col-md-12">
                <div className="jumbotron p-4 p-md-5 text-white rounded" style={{ backgroundColor: 'rgb(74, 77, 85)' }}>
                    <div className="col-md-6 px-0">
                        <h1 className="display-4 font-italic"><h2>Welcome, {this.props.name}</h2></h1>
                        <p className="lead my-3">To import the data, please use the uploader below:</p>
                    </div>
                </div>
                <Form>
                    <div class="card">
                        <div class="card-header">
                            Import
                        </div>
                        <div class="card-body">
                            <Row>
                                <Col className="col-md-2">
                                    <label>Entity:</label>
                                    <select
                                        className="custom-select custom-select-lg mb-3"
                                        onChange={(x) => this.onEntityTypeChange(x)}>
                                        <option value="Schedule" selected>Schedule</option>
                                        <option value="Courses">Courses</option>
                                        <option value="Enrollment">Enrollment</option>
                                        <option value="Professors">Professors</option>
                                        <option value="Students">Students</option>
                                    </select>
                                </Col>
                                <Col className="col-md-2">
                                    <label>Select your file:</label>
                                    <input type="file" name="file" onChange={this.onChangeHandler} />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-md-2">
                                </Col>
                                <Col className="col-md-2">
                                    <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Form>
            </div>
        </>);
    }
}

export default OfficerDashboard;