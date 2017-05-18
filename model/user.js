'use strict';
var driver = require('./driver');


module.exports = 
{
    createNewUser : function(id) {
        console.log("constructor for user with id " + id);
        var session = driver.session();

        session
            .run("CREATE (n:User {facebook_id:"+id+"}) RETURN n.id")
            .then( (result) => {
                result.records.forEach(function (record) {
                    console.log(record)
                });

                session.close();
                return new Promise((resolve, reject) => {
                    resolve();
                });
            })
            .catch(function (error) {
                return new Promise( (resolve, reject) => {
                    reject("Sorry, an unknown error occured. Please try again later");
                });
            });
    },

    setName : function(id, name) {
        console.log("in name");
        var session = driver.session();
        session
            .run("MATCH (p:User) WHERE p.facebook_id="+id+" SET p.name='"+name+"' RETURN p")
            .then(function (result) {
                result.records.forEach(function (record) {
                    console.log(record)
                });

                session.close();
                return new Promise((resolve, reject) => {
                    resolve();
                });
            })
            .catch(function (error) {
               return new Promise( (resolve, reject) => {
                    reject("Sorry, an unknown error occured. Please try again later");
                });
            });
    },

    futureEvents : function(id) {
        var seession = driver.session();
        var futureEvents = [];
        return;
        // session 
        //     .run("match all events that remind user with id")
        //     .then(function (result) {
                
        //     })
        //     .catch(function (error) {
        //         return false;
        //     });
       // You might have to do this twice. For groups right?
    }
}