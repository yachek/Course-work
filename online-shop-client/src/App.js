import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './components/HomeComponent';
import Login from './components/LoginComponent';
import SignUp from "./components/SignupComponent";
import AccountDetails from "./components/AccountDetailsComponent";
import LikedItems from "./components/LikedComponent";
import AddItem from "./components/AddItemComponent";
import LogOut from "./components/LogOutComponent";
import Users from "./components/UsersComponent";
import ItemDetail from "./components/ItemDetailsComponent";
import { Button, Form } from 'reactstrap';
import withAdmin from "./components/withAdmin";
import withAuth from "./components/withAuth";

function Header() {
    const isAdmin = localStorage.getItem('isAdmin');
    const inSystem = localStorage.getItem('inSystem');
    if (isAdmin) {
        return <div className='row row-header pb-3 d-flex justify-content-center'>
            <Form action='/home' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Home
                </Button>
            </Form>
            <Form action='/liked' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Liked
                </Button>
            </Form>
            <Form action='/account' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Your account
                </Button>
            </Form>
            <Form action='/users' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Users
                </Button>
            </Form>
            <Form action='/logout' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Logout
                </Button>
            </Form>
        </div>
    } else if (inSystem) {
        return <div className='row row-header pb-3 d-flex justify-content-center'>
            <Form action='/home' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Home
                </Button>
            </Form>
            <Form action='/liked' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Liked
                </Button>
            </Form>
            <Form action='/account' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Your account
                </Button>
            </Form>
            <Form action='/logout' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    LogOut
                </Button>
            </Form>
        </div>
    } else {
        return <div className='row row-header pb-3 d-flex justify-content-center'>
            <Form action='/home' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Home
                </Button>
            </Form>
            <Form action='/login' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Login
                </Button>
            </Form>
            <Form action='/signup' className='col-2'>
                <Button type='submit' className='col-12' color='link'>
                    Register
                </Button>
            </Form>
        </div>
    }
}

class App extends Component {

  render() {
    return (
        <div className='container'>
          <Header/>
          <br/>
              <div>
                  <Switch>
                      <Route path="/" exact component={Home}/>
                      <Route path="/home" component={Home}/>
                      <Route path='/home/add' component={withAdmin(AddItem)}/>
                      <Route path="/home/:itemId" component={ItemDetail}/>
                      <Route path="/liked" component={withAuth(LikedItems)}/>
                      <Route path="/login" component={Login} />
                      <Route path="/signup" component={SignUp}/>
                      <Route path="/logout" component={withAuth(LogOut)}/>
                      <Route path="/users" component={withAdmin(Users)}/>
                      <Route path="/account" component={withAuth(AccountDetails)}/>
                  </Switch>
              </div>
        </div>
    );
  }
}

export default App;
