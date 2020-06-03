import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from "axios";

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            axios.get('http://localhost:8080/user/checktoken')
                .then((resp) => {
                    if (resp.status === 200) {
                        this.setState({ loading: false });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    alert(err);
                    this.setState({ loading: false, redirect: true });
                });
        }


        render() {
            const { loading, redirect } = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/login"/>;
            }
            return <ComponentToProtect {...this.props} />;
        }
    }
}