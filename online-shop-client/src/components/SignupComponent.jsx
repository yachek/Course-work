import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password: '',
            firstName: '',
            lastName: ''
        };
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/register', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.text())
            .then(res => {
                if (!res.error) {
                    this.props.history.push('/');
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(err => {
                console.error(err);
                alert(err);
            });
    };

    render() {
        return (
            <div className='container'>
                <div className='row row-content align-items-center'>
                    <div className="offset-3 col-6">
                        <Form model="register" onSubmit={this.onSubmit}>
                            <FormGroup>
                                <h1 className='d-flex justify-content-center'>Register Below!</h1>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleEmail">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id = "exampleEmail"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="examplePassword"
                                    placeholder="Enter password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="firstName">First Name</Label>
                                <Input
                                    type="firstName"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="Enter First Name"
                                    value={this.state.firstName}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    type="lastName"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Enter Last Name"
                                    value={this.state.lastName}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button type="submit" color="primary">
                                    Register
                                </Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}