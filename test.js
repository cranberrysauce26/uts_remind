var p = new Promise( (resolve, reject) => {
    var q = new Promise( (res, rej) => {
        res();
    }).then( (val) => {
        console.log("then", val);
        reject('hey');
        return null;
    }).then( () => {
        console.log("in herer");
    }).catch( (err) => {
        console.log("catch")
        reject('dude');
    })
}).catch(err => {
    console.log(err);
})