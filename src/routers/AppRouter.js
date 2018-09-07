import React from 'react';
import { Switch } from 'react-router-dom';
import NotFound from '../views/NotFound';
import Dashboard from '../views/Dashboard';
import LoginContainer from '../views/Login/LoginContainer';
import ProjectsContainer from '../views/Projects/ProjectsContainer';
import CompaniesContainer from '../views/Companies/CompaniesContainer';
import Users from '../views/Users';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Routes = () => (
    <Switch>
        <PrivateRoute path="/" component={Dashboard} exact />
        <PrivateRoute path="/projects" component={ProjectsContainer} />
        <PrivateRoute path="/companies" component={CompaniesContainer} />
        <PrivateRoute path="/users" component={Users} />
        <PublicRoute path="/login" component={LoginContainer} />
        <PublicRoute component={NotFound} />
    </Switch>
);

export default Routes;
