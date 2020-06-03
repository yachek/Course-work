import React, { Component } from 'react';
import {Card, CardBody, CardText, CardHeader, CardTitle, Button} from "reactstrap";
import axios from 'axios';

function RenderItem({ item }) {
    return(
        <Card>
            <CardBody>
                <CardHeader>{item.name}</CardHeader>
                <CardTitle>Price: {item.price}</CardTitle>
            </CardBody>
            <CardBody className='d-flex justify-content-center'>
                <img width='40%' src={item.photoPath} alt={item.name}/>
            </CardBody>
            <CardBody>
                <CardText>{item.shortDescription}</CardText>
            </CardBody>
        </Card>
    );
}

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            items: null
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/home')
            .then((json) => {
                this.setState({
                    items: json.data.map((item) => {
                        return (
                            <div className='col-12' key={item._id}>
                                <RenderItem item={item}/>
                            </div>
                        )
                    })
                })
                //console.log(json);
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <h1 className='d-flex justify-content-center'>Home</h1>
                {this.state.items}
            </div>
        );
    }
}