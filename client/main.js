import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { check } from 'meteor/check';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';

import { Polls } from '../imports/api/polls.js';
import { Votes } from '../imports/api/votes.js';

import '../imports/ui/layouts/MainLayout.html';
import '../imports/ui/pages/HomePage.html';

Template.MainLayout.helpers({
    isLoggedIn() {
        if(!Meteor.userId() && FlowRouter.current().path === '/') {
            FlowRouter.go('/login');
        }
        return Meteor.userId();
    },
});

Template.SignUpPage.events({
    'submit form'(e) {
        e.preventDefault();

        // Get values
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        // Check if passwords match
        if(password === confirmPassword) {
            Accounts.createUser({ email: email, password: password }, (err) => {
                if (err) {
                    console.log(err);
                    // Bert.alert(err.reason, 'danger', 'fixed-top', 'fa-remove');
                } else {
                    console.log('success!');
                    // Bert.alert('Account successfully created!', 'success', 'fixed-top', 'fa-check');
                    FlowRouter.go('/');
                }
            });
        } else {

        }
    },
});

Template.LogInPage.events({
    'submit form'(e) {
        e.preventDefault();

        // Get values
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Try to login
        Meteor.loginWithPassword(email, password, (err) => {
            if(err) {
                // Bert.alert(err.reason, 'danger', 'fixed-top', 'fa-remove');
            } else {
                console.log('success!');
                // Bert.alert('User successfully logged in!', 'success', 'fixed-top', 'fa-check');
                FlowRouter.go('/');
            }
        });
    },
});

Template.HomePage.onCreated(() => {
    Meteor.subscribe('polls');
    Meteor.subscribe('votes');
});

Template.HomePage.helpers({
    polls() {
        return Polls.find();
    },
});

Template.HomePage.events({
    'submit #new-poll'(e) {
        e.preventDefault();

        // Get value from form element
        const target = e.target;
        const question = target.question.value;
        const option1 = target.option1.value;
        const option2 = target.option2.value;
        const option3 = target.option3.value;

        // Insert a leaderboard into the collection
        Meteor.call('polls.insert', question, option1, option2, option3);

        // Clear form
        target.question.value = '';
        target.option1.value = '';
        target.option2.value = '';
        target.option3.value = '';
    },
});

Template.poll.helpers({
    isSelected() {
        const vote = Votes.findOne({pollId: this._id});

        if(!vote && Session.get(this._id) !== undefined) {
            return true;
        } else {
            return false;
        }
    },
    isChecked1() {
        const checked = {checked: "checked"};
        return Session.get(this._id) === '1' ? checked : {};
    },
    isChecked2() {
        const checked = {checked: "checked"};
        return Session.get(this._id) === '2' ? checked : {};
    },
    isChecked3() {
        const checked = {checked: "checked"};
        return Session.get(this._id) === '3' ? checked : {};
    },
    // hasVoted() {
    //     return
    // }
});

Template.poll.events({
    'click #option1'(e) {
        if(Session.get(this._id) === '1') {
            Session.set(this._id, undefined);
        } else {
            Session.set(this._id, '1');
        }
    },
    'click #option2'(e) {
        if(Session.get(this._id) === '2') {
            Session.set(this._id, undefined);
        } else {
            Session.set(this._id, '2');
        }
    },
    'click #option3'(e) {
        if(Session.get(this._id) === '3') {
            Session.set(this._id, undefined);
        } else {
            Session.set(this._id, '3');
        }
    },
    'click button'(e) {
        Meteor.call('polls.addVote', this._id, Session.get(this._id));
        Meteor.call('votes.insert', this._id, Session.get(this._id));
    },
});
