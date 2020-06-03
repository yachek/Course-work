import React, {Component} from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password: ''
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
        fetch('/authenticate', {
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
                    alert('Welcome to the club, buddy!')
                } else {
                    throw new Error(res);
                }
            })
            .catch(err => {
                console.error(err);
                //alert('Error logging in please try again');
                alert(err);
            });
    };

    render() {
        return (
            <div className='container'>
                <div className='row row-content'>
                    <div className="offset-3 col-6">
                        <Form model="register" onSubmit={this.onSubmit}>
                            <FormGroup>
                                <h1 className='d-flex justify-content-center'>Login Below!</h1>
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
                                <Button type="submit" color="primary">
                                    Login
                                </Button>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}