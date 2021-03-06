'use strict';
const driver = require('./driver');
const query = require('../facebook/query');

module.exports =
    {
        createNewUser: (id) => {
            console.log(`Creating a new user with id ${id}.`);
            const session = driver.session();
            return new Promise( (resolve, reject) => {
                query.userInfo(id, "first_name,last_name,timezone", (q) => {
                    console.log("In callback. q is", q);
                    if (q === null) {
                        console.log(`A facebook error occured when querying userInfo for user ${id}.`);
                        reject('FACEBOOK_ERROR');
                    }
                    session
                        .run(`CREATE (n:User {facebook_id: '${id}', first_name: '${q.first_name}', last_name: '${q.last_name}', timezone: ${q.timezone}, input_state: 'DEFAULT'}) RETURN n`)
                        .then(() => {
                            console.log(`Successfully created user with id ${id}`);
                            session.close();
                            resolve();
                        })
                        .catch((err) => {
                            console.log(`Database error creating user with id ${id}`, err);
                            reject('DATABASE_ERROR');
                        });
                })
            })
        },

        setName: (id, name) => {
            console.log("in name");
            const session = driver.session();
            return session
                .run(`MATCH (p:User) WHERE p.facebook_id='${id}' SET p.name='${name}' RETURN p`)
                .then(() => {
                    console.log("succesfully set name");
                    session.close();
                })
                .catch(() => {
                    return new Promise.reject('DATABASE_ERROR');
                });
        },
        
        getInputState: (id) => {
            console.log("In getInputState");
            const session = driver.session();
            return session
                .run(`MATCH (p:User) WHERE p.facebook_id='${id}' RETURN p.input_state AS inputState`)
                .then((result) => {
                    const inputState = result.records[0].get('inputState');
                    console.log("successfully queried database. returning", inputState);
                    session.close();
                    return inputState;
                })
                .catch((error) => {
                    console.log("error querying database", error);
                    return new Promise.reject();
                });
        },

        setInputState: function (id, state) {
            const session = driver.session();
            return session
                .run(`MATCH (p:User) WHERE p.facebook_id='${id}' SET p.input_state='${state}' RETURN p`)
                .then(() => {
                    session.close();
                })
                .catch(() => {
                    return new Promise.reject('DATABASE_ERROR');
                });
        }
    }