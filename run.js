const app = require('express')();
const database = require('./database');

const user = require('./manage/user');

app.post('/signUp', (req, res)=> {
    console.log(req);
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            req.send("success")
                connection.release()
            },
            (err)=>{
            req.send("fail")

            }, req.body.userID, req.body.userEmail, req.body.userPW)
    });
});

app.listen(80, () => {
    console.log('App listening on port 3000!');
});
