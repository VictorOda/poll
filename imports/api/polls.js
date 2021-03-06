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
    'polls.insert'(question, option1, option2, option3) {
        check(question, String);
        check(option1, String);
        check(option2, String);
        check(option3, String);

        // Make sure the user is logged in before inserting a poll
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        // Insert a poll into the collection
        Polls.insert({
            question,
            option1,
            option2,
            option3,
            option1Votes: 0,
            option2Votes: 0,
            option3Votes: 0,
            isPublic: false,
            createdAt: new Date(), // current time
            userId: Meteor.userId()
        });
    },
    'polls.remove'(pollId) {
        check(pollId, String);
        Polls.remove(pollId);
    },
    'polls.addVote'(pollId, option) {
        check(option, String);
        switch (option) {
            case '1':
                Polls.update(pollId, {$inc: {option1Votes: 1} });
                break;
            case '2':
                Polls.update(pollId, {$inc: {option2Votes: 1} });
                break;
            case '3':
                Polls.update(pollId, {$inc: {option3Votes: 1} });
                break;
            default:
        }
    },
    'polls.isPublic'(pollId, isPublic) {
        check(pollId, String);
        check(isPublic, Boolean);

        Polls.update(pollId, {$set: {isPublic: !isPublic}});
    }
});
