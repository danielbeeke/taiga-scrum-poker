Projects = new Mongo.Collection('projects');
ProjectDetails = new Mongo.Collection('projectdetails');
Tables = new Mongo.Collection('tables');
Estimations = new Mongo.Collection('estimations');
UserStories = new Mongo.Collection('userstories');
Points = new Mongo.Collection('points');
Instances = new Mongo.Collection('instances');
Members = new Mongo.Collection('members');
Issues = new Mongo.Collection('issues');
Roles = new Mongo.Collection('roles');

if (Meteor.isServer && !Instances.findOne({ url: 'https://api.taiga.io/api/v1' })) {
    Instances.insert({ url: 'https://api.taiga.io/api/v1', name: 'Taiga' })
}