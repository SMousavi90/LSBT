import React from 'react';
import API from '../API/API';

import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileCsv } from '@fortawesome/free-solid-svg-icons'

import { CSVLink } from 'react-csv';

import jsPDF from "jspdf";
import "jspdf-autotable";

class ContactTracingDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userId: '', name: '', lastName: '', students: [], contacts: [], show: false, studentReportId: null };
    }
    
    componentDidMount() {
        this.searchStudents();
    }

    updateField = (name, value) => {
        this.setState({ [name]: value });
    }

    searchStudents = () => {
        API.getPositiveStudents(this.state.userId, this.state.name, this.state.lastName)
            .then((data) => {
                this.setState({ students: data })
            })
            .catch((err) => console.log(err));
    }

    getContactTracingReport = (userId) => {
        API.getContactTracingReport(userId)
            .then((data) => {
                this.setState({ contacts: data, show: true, studentReportId: userId });
            })
            .catch((err) => console.log(err));
    }

    exportPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = `Contact Tracing Report - Student ID: ${this.state.studentReportId}`;
        const headers = [["Student ID", "Full Name", "Email", "Teacher Name"]];

        const data = this.state.contacts.map(c => [c.StudentId, c.StudentName, c.Email, c.TeacherName]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save(`${this.state.studentReportId}_report.pdf`);
    }


    render() {
        return <Container>
            <Jumbotron className="p-4 mt-1">
                <h3>Contact Tracing Report</h3>
                <p>Select a Covid-19 positive student and click on the button to generate a Contact Tracing Report. The report contains all contacts of the students in the past 14 days.</p>
            </Jumbotron>
            <Form>
                <Row>
                    <Col xs="auto">
                        <Form.Control placeholder="Student ID" name="userId" onChange={(e) => this.updateField(e.target.name, e.target.value)} />
                    </Col>
                    <Col xs="auto">
                        <Form.Control placeholder="First name" name="name" onChange={(e) => this.updateField(e.target.name, e.target.value)} />
                    </Col>
                    <Col xs="auto">
                        <Form.Control placeholder="Last name" name="lastName" onChange={(e) => this.updateField(e.target.name, e.target.value)} />
                    </Col>
                    <Col xs="auto">
                        <Button onClick={() => this.searchStudents()}>Search</Button>
                    </Col>
                </Row>
            </Form>
            <StudentTable students={this.state.students} getContactTracingReport={this.getContactTracingReport} contacts={this.state.contacts}></StudentTable>

            <Modal show={this.state.show} onHide={() => this.setState({ show: false })} >
                <Modal.Header closeButton>
                    <Modal.Title>Contact Tracing Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The requested report has been generated</p>
                    <CSVLink
                        data={this.state.contacts}
                        filename={`${this.state.studentReportId}_report.csv`}
                        className="btn btn-primary"
                        target="_blank">
                        <FontAwesomeIcon icon={faFileCsv} />&nbsp;Download CSV
                    </CSVLink>
                    <Button onClick={() => this.exportPDF()} className="ml-1">
                        <FontAwesomeIcon icon={faFilePdf} />&nbsp;Download PDF
                    </Button>
                </Modal.Body>
            </Modal>

        </Container>
    }
}

function StudentTable(props) {
    return <Table striped bordered hover className="mt-2">
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Last Name</th>
                <th>Fist Name</th>
                <th>Email</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.students.map((e) => <StudentRow key={e.id} student={e} getContactTracingReport={props.getContactTracingReport} contacts={props.contacts} />)}
        </tbody>
    </Table>
}

function StudentRow(props) {
    return <tr>
        <td>{props.student.UserId}</td>
        <td>{props.student.LastName}</td>
        <td>{props.student.Name}</td>
        <td>{props.student.Email}</td>
        <td>
            <Button onClick={() => props.getContactTracingReport(props.student.UserId)} size={"sm"}>Generate Report</Button>
        </td>
    </tr>
}

export default ContactTracingDashboard;