const app = require('express')();
const database = require('./database');
const user = require('./manage/user');
const community = require('./manage/community');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/signUp', (req, res)=> {
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            res.send("success")
            connection.release();
            },
            (err)=>{
            switch(err.code) {
                case "ER_DUP_ENTRY":
                    res.status(500).send("계정이 중복됩니다.");
                    break;
                case "ER_BAD_NULL_ERROR":
                    res.status(500).send("전달된 인자가 부족합니다."+err.sqlMessage);
                    break;
                default:
                    res.status(500).send("알 수 없는 오류");
                    break;
            }
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
            if(err==null) {
                res.status(500).send("잘못된 id 혹은 비밀번호입니다.");
            } else {
                switch(err.code) {
                    case "ER_BAD_NULL_ERROR":
                        res.status(500).send("전달된 인자가 부족합니다."+err.sqlMessage);
                        break;
                    default:
                        res.status(500).send("알 수 없는 오류");
                        break;
                }
            }
            connection.release();
        }, req.query.userID, req.query.userPW)
    });
});

app.post('/user/edit', (req, res)=> {
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

app.post('/user/delete', (req, res)=> {
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
    console.log('board View Request');
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
