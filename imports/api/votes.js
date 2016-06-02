import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Votes = new Mongo.Collection('votes');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('votes', function() {
        return Votes.find({userId: this.userId});
    });
}

Meteor.methods({
    'votes.insert'(pollId, option) {
        check(pollId, String);
        check(option, String);

        // Make sure the user is logged in before inserting a vote
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        // Insert a vote into the collection
        Votes.insert({
            pollId,
            option,
            createdAt: new Date(), // current time
            userId: Meteor.userId()
        });
    },
    'votes.remove'(voteId) {
        check(voteId, String);
        Polls.remove(voteId);
    },
});
