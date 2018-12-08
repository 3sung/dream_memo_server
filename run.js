const app = require('express')();
const database = require('./database');
const user = require('./manage/user');
const community = require('./manage/community');


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

app.get('/', (req, res)=> {
    console.log('접속 탐지')
    res.send('success')
});

app.get('/board', (req, res)=>{
    database.connect(function (connection) {
        community.viewBoard(connection,
            (rows)=>{
                res.send(rows)
            },
            (err)=>{
                console.error("/board 조회 오류 : "+err);
                res.send("fail")
            })
    })
});

app.get('/board/search', (req, res)=>{
    database.connect(function (connection) {
        community.searchBoard(connection,
            (rows)=>{
                res.send(rows)
            },
            (err)=>{
                console.error("/board/search 조회 검색 오류 : "+err);
                res.send("fail")
            }, req.query.keyword)
    })
});


app.listen(80, () => {
    console.log('App listening on port 3000!');
});
