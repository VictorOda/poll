import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../imports/ui/layouts/MainLayout.html';
import '../../imports/ui/pages/HomePage.html';
import '../../imports/ui/pages/SignUpPage.html';
import '../../imports/ui/pages/LogInPage.html';

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('MainLayout', {main: 'HomePage'});
        console.log('FLOW ROUTER');
    }
});

FlowRouter.route('/signin', {
    action() {
        BlazeLayout.render('MainLayout', {main: 'SignUpPage'});
        console.log('SIGN UP');
    }
});

FlowRouter.route('/login', {
    action() {
        BlazeLayout.render('MainLayout', {main: 'LogInPage'});
        console.log('LOG IN');
    }
});
