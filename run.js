const app = require('express')();
const database = require('./database');
const user = require('./manage/user');
const community = require('./manage/community');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/signUp', (req, res)=> {
    console.log(req);
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            res.send("success")
            connection.release();
            },
            (err)=>{
            res.send("fail")
            connection.release();
            }, req.body.userID, req.body.userEmail, req.body.userPW)
    });
});

app.get('/signIn', (req, res)=> {
    database.connect(function (connection){
        user.signIn(connection,
        (rows)=>{
        res.json({
            token: user.getToken(connection, req.query.userID)
        });
        connection.release();
        },
        (err)=>{
        res.send("fail")
        connection.release();
        }, req.query.userID, req.query.userPW)
    });
});

app.post('/edit', (req, res)=> {
    console.log(req);
    database.connect(function (connection){
        user.signIn(connection,
        (rows)=>{
        res.send("success")
        connection.release();
        },
        (err)=>{
        res.send("fail")
        connection.release();
        }, req.body.userID, req.body.userPW, req.body.userNewPW)
    });
});

app.post('/delete', (req, res)=> {
    database.connect(function (connection){
        user.deleteID(connection,
        (rows)=>{
        res.send("success")
        connection.release();
        },
        (err)=>{
        res.send("fail")
        connection.release();
        }, req.body.userID, req.body.userPW)
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


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
