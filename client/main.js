import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { check } from 'meteor/check';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';

import { Bert } from 'meteor/themeteorchef:bert';

import '../imports/ui/layouts/MainLayout.html';
import '../imports/ui/pages/HomePage.html';
