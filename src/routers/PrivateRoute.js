import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import WP_AUTH from '../data/Auth';
import HeaderContainer from '../components/Header/HeaderContainer';
import Footer from '../components/Footer/Footer';
import Sidebar from '../components/Sidebar/Sidebar';
import DataProvider from '../data/SharedDataContext';

const auth = new WP_AUTH();
const PrivateRoute = ({ component: Component, path, exact }) => (
    <DataProvider>
        <Sidebar />
        <div id="wrapper">
            <HeaderContainer />
            <main id="content" className="main">
                <div className="container">
                    <div className="section">
                        <Route
                            path={path}
                            exact={exact}
                            render={props =>
                                auth.isAuthenticated() ? (
                                    <Component />
                                ) : (
                                    <Redirect
                                        to={{
                                            pathname: '/login',
                                            state: { from: props.location }
                                        }}
                                    />
                                )
                            }
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    </DataProvider>
);

export default PrivateRoute;
