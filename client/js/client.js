/* global Ember */
/* global DS */

App = Ember.Application.create();

App.User = DS.Model.extend({
   firstName: DS.attr('string'),
   lastName: DS.attr('string'),
   email: DS.attr('string'),
   from: DS.hasMany('debt', {async: true}),
   to: DS.hasMany('debt', {async: true})
});

App.Debt = DS.Model.extend({
    from: DS.belongsTo('user', {async: true}),
    to: DS.belongsTo('user', {async: true}),
    amount: DS.attr('number') ,
    created: DS.attr('date'),
    settled: DS.attr('date')
});