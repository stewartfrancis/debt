var sequelize = require('./sequelize');
var model = require('./model/index');
var Promise = require('bluebird');

Promise.coroutine(function*() {
    try {
        //clear existing data
        yield sequelize.dropAllSchemas();
        
        //recreate schemas
        yield sequelize.sync({force: true});
        
        var john = yield model.User.build({
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com"
        }).save();
        
        var jane = yield model.User.build({
            firstName: "Jane",
            lastName: "Doe",
            email: "janedoe@example.com"
        }).save();
        
        var jim = yield model.User.build({
            firstName: "Jim",
            lastName: "Doe",
            email: "jimdoe@example.com"
        }).save();
        
        var debt = yield model.Debt.build({
            created: new Date(2015, 9, 25),
            amount: 2000
        }).save();
        yield debt.setFrom(john);
        yield debt.setTo(jane);
        
        // var debt2 = yield model.Debt.build({
        //   created: new Date(2015, 9, 26),
        //   amount: 1000
        // }).save();
        // yield debt2.setFrom(jane);
        // yield debt2.setTo(john);
        
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();