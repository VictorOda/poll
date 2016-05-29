import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Polls = new Mongo.Collection('polls');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('polls', function() {
        return Polls.find({userId: this.userId});
    });
}

Meteor.methods({
    'polls.insert'(question) {
        check(question, String);

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
          throw new Meteor.Error('not-authorized');
        }

        // Insert a leaderboard into the collection
        Polls.insert({
            question,
            createdAt: new Date(), // current time
            userId: Meteor.userId()
        });
    },
    'polls.remove'(pollId) {
        check(pollId, String);
        Polls.remove(pollId);
    },
});
