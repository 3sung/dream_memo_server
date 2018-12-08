const app = require('express')();
const database = require('./database');

const user = require('./manage/user');
const community = require('./manage/community');

app.post('/signUp', (req, res)=> {
    console.log(req);
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            res.send("success")
                connection.release()
            },
            (err)=>{
            res.send("fail")

            }, req.body.userID, req.body.userEmail, req.body.userPW)
    });
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
