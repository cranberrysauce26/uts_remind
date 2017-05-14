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

console.log("made it here!");

module.exports = driver;