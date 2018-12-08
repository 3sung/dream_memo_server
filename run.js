const app = require('express')();
const database = require('./database');
const user = require('./manage/user');


app.post('/signUp', (req, res)=> {
    console.log(req);
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            req.send("success")
            connection.release();
            },
            (err)=>{
            req.send("fail")
            connection.release();
            }, req.body.userID, req.body.userEmail, req.body.userPW)
    });
});

app.get('/signIn', (req, res)=> {
    console.log(req);
    database.connect(function (connection){
        user.signIn(connection,
        (rows)=>{
        res.json({
            token: user.getToken(req.body.userID)
        });
        req.send("success")
        connection.release();
        },
        (err)=>{
        req.send("fail")
        connection.release();
        }, req.body.userID, req.body.userPW)
    });
});

app.post('/edit', (req, res)=> {
    console.log(req);
    database.connect(function (connection){
        user.signIn(connection,
        (rows)=>{
        req.send("success")
        connection.release();
        },
        (err)=>{
        req.send("fail")
        connection.release();
        }, req.body.userID, req.body.userPW, req.body.userNewPW)
    });
});

app.post('/delete', (req, res)=> {
    console.log(req);
    database.connect(function (connection){
        user.deleteID(connection,
        (rows)=>{
        req.send("success")
        connection.release();
        },
        (err)=>{
        req.send("fail")
        connection.release();
        }, req.body.userID, req.body.userPW)
    });
});


// database.connect(function (connection) {
//     connection.query(
//         "SELECT * FROM DREAMMEMO_DB.User_TB;",
//         function (err, rows, fields) {
//             console.log(rows)
//         })
// });

app.get('/', (req, res)=> {
    console.log('접속 탐지')
    res.send('success')
});

app.listen(80, () => {
    console.log('App listening on port 3000!');
});
