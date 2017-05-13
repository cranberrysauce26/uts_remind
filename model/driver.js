'use strict';
console.log("In driver");
const neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver(process.env.GRAPHENEDB_BOLT_URL, neo4j.auth.basic(process.env.GRAPHENEDB_BOLT_USER, process.env.GRAPHENEDB_BOLT_PASSWORD));

driver.onCompleted = function() {
    console.log("Succesfully configured graphene db driver");
};

driver.onError = function(error) {
  console.log('Graphene db driver instantiation failed', error);
};

var session = driver.session();
console.log("Created driver session");
session
    .run("CREATE (n {hello: 'World'}) RETURN n.name")
    .then(function(result) {
        result.records.forEach(function(record) {
            console.log(record)
        });

        session.close();
    })
    .catch(function(error) {
        console.log(error);
    });

module.exports = driver;