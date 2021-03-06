const app = require('express')();
const database = require('./database');
const user = require('./manage/user');
const community = require('./manage/community');
const bodyParser = require('body-parser');
require('date-utils');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

function checkToken(token, success, fail) {
    database.connect(function (connection) {
        connection.query(
            "SELECT * FROM DREAMMEMO_DB.UserLoginToken_TB where token=?;",
            [token],
            function (err, rows, fields) {
                if(err) {
                    fail(err)
                } else if(rows.length===0) {
                    fail({code:"Invalid Token"})
                } else {
                    success(rows[0].userID)
                }
                connection.release()
            }
        )
    })
}

app.get('/board/replies', (req, res)=>{
    if(req.query.boardID===undefined) {
        res.status(400).send("boardID를 확인하지 못했습니다\r\n");
        return
    }
    database.connect(function (connection) {
        community.viewReplies(connection,
            (rows)=>{
                res.send(rows);
                connection.release()
            },
            (err)=>{
                console.error(err);
                res.send("알 수 없는 오류\r\n");
                connection.release()
            }, req.query.boardID)
    })
});

app.post('/signUp', (req, res)=> {
    database.connect(function (connection) {
        user.signUp(connection,
            (rows)=>{
            res.send("회원가입 성공. 다시 로그인 해주세요\r\n");
            console.log(req.body.userID+"가 회원가입함");
            connection.release();
            },
            (err)=>{
            switch(err.code) {
                case "ER_DUP_ENTRY":
                    res.status(500).send("계정이 중복됩니다.\r\n");
                    break;
                case "ER_BAD_NULL_ERROR":
                    res.status(500).send("전달된 인자가 부족합니다.\r\n");
                    break;
                default:
                    res.status(500).send("알 수 없는 오류\r\n");
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
            console.log(req.query.userID+"가 로그인함");
            connection.release();
        },
        (err)=>{
            if(err==null) {
                res.status(500).send("잘못된 id 혹은 비밀번호입니다.\r\n");
            } else {
                switch(err.code) {
                    case "ER_BAD_NULL_ERROR":
                        res.status(500).send("전달된 인자가 부족합니다.\r\n");
                        break;
                    default:
                        res.status(500).send("알 수 없는 오류\r\n");
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
        res.send("success\r\n")
        connection.release();
        },
        (err)=>{
        res.send("fail\r\n")
        connection.release();
        }, req.body.userID, req.body.userPW, req.body.userNewPW)
    });
});

app.post('/user/delete', (req, res)=> {
    database.connect(function (connection){
        user.deleteID(connection,
        (rows)=>{
        res.send("success\r\n")
        connection.release();
        },
        (err)=>{
        res.send("fail\r\n")
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
                connection.release()
            },
            (err)=>{
                console.error("/board 조회 오류 : "+err);
                res.send("fail\r\n")
                connection.release()
            })
    })
});

app.get('/board/:userID', (req, res)=>{
    database.connect(function (connection) {
        community.viewUserBoard(connection,
            (rows)=>{
                res.send(rows)
                connection.release()
            },
            (err)=>{
                console.error("/board 조회 오류 : "+err);
                res.send("fail\r\n")
                connection.release()
            }, req.params.userID)
    })
});

app.post('/board', (req, res)=>{
    console.log('board post Request');
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {

            community.postBoard(connection,
                (rows)=>{
                    res.send("게시글 작성 성공.\r\n")
                    console.log(userID+"가 \'"+req.body.title+"\'게시글을 작성했습니다.")
                    connection.release()
                },
                (err)=>{
                    switch(err.code) {
                        case 'ER_BAD_NULL_ERROR':
                            res.status(400).send("전달된 인자 부족\r\n");
                            break;
                        default:
                            res.send("알 수 없는 오류\r\n")
                    }
                    connection.release()
                }, userID, req.body.title, req.body.dreamContent, req.body.commentContent)

        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.post('/board/delete', (req, res)=>{
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {
            community.deleteBoard(connection,
                (rows)=>{
                if(rows.affectedRows===0) {
                    res.send("게시글 삭제 실패. 올바른 계정인지와 지우고자 하는 게시글인지 확인해주세요\r\n")
                } else {
                    res.send("게시글 삭제 성공\r\n")
                    console.log(userID+"가 "+req.body.boardID+"게시글을 삭제했습니다.")
                }
                    connection.release()
                },
                (err)=>{
                    switch(err.code) {
                        case 'ER_BAD_NULL_ERROR':
                            res.status(400).send("전달된 인자 부족\r\n");
                            break;
                        default:
                            res.send("알 수 없는 오류\r\n")
                    }
                    connection.release()
                }, req.body.boardID, userID)

        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.post('/board/keywords', (req, res)=>{
    console.log('board post Request');
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {
            connection.query(
                "SELECT ID FROM DREAMMEMO_DB.DreamBoard_TB where ID=? and UserID=?;",
                [req.body.boardID, userID],
                function (err, rows) {
                    if(err) {
                        res.send("알수없는 오류\r\n")
                    } else if(rows.length===0) {
                        res.send("올바른 ID로 로그인해주세요\r\n")
                    } else {
                        community.postKeyword(connection,
                            (rows)=>{
                                res.send("키워드 등록 성공.\r\n")
                            },
                            (err)=>{
                                switch(err.code) {
                                    case 'ER_BAD_NULL_ERROR':
                                        res.status(400).send("전달된 인자 부족\r\n");
                                        break;
                                    case 'ER_NO_REFERENCED_ROW_2':
                                        res.status(400).send("등록되지 않은 키워드입니다.\r\n");
                                        break;
                                    case 'ER_DUP_ENTRY':
                                        res.status(400).send("이미 등록된 키워드입니다.\r\n");
                                        break;
                                    default:
                                        console.log(err)
                                        res.send("알 수 없는 오류\r\n")
                                }
                                connection.release()
                            }, req.body.boardID, req.body.keyword)
                    }
                }
            )
        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.get('/board/search', (req, res)=>{
    database.connect(function (connection) {
        community.searchBoard(connection,
            (rows)=>{
                res.send(rows);
                connection.release()
            },
            (err)=>{
                console.error("/board/search 조회 검색 오류 : "+err);
                res.send("fail\r\n");
                connection.release()
            }, req.query.keyword)
    })
});

app.post('/board/replies', (req, res)=>{
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {

            community.postReply(connection,
                (rows)=>{
                    res.send("댓글 작성 성공.\r\n")
                    console.log(userID+"가 "+req.body.boardID+"게시글에 \'"+req.body.content+"\'댓글을 달았습니.")
                },
                (err)=>{
                    switch(err.code) {
                        case 'ER_BAD_NULL_ERROR':
                            res.status(400).send("전달된 인자 부족\r\n");
                            break;
                        default:
                            res.send("알 수 없는 오류\r\n")
                    }
                    connection.release()
                }, req.body.boardID, userID, req.body.content)

        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.post('/board/replies/:reply/edit', (req, res)=>{
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {
            community.editReply(connection,
                (rows)=>{
                    if(rows.affectedRows===0) {
                        res.send("게시글 수정 실패. 올바른 계정인지와 변경하고자 하는 게시글인지 확인해주세요\r\n")
                    } else {
                        res.send("게시글 수정 성공\r\n")
                        console.log(userID+"가 "+req.params.reply+"번 댓글을 \'"+req.body.content+"\'로 변경했습니다.")
                    }
                    connection.release()
                },
                (err)=>{
                    switch(err.code) {
                        case 'ER_BAD_NULL_ERROR':
                            res.status(400).send("전달된 인자 부족\r\n");
                            break;
                        default:
                            res.send("알 수 없는 오류\r\n")
                    }
                    connection.release()
                }, req.params.reply, userID, req.body.content)

        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.post('/board/replies/:reply/delete', (req, res)=>{
    database.connect(function (connection) {
        checkToken(req.headers.authorization, function (userID) {
            community.deleteReply(connection,
                (rows)=>{
                    if(rows.affectedRows===0) {
                        res.send("댓글 삭제 실패. 올바른 계정인지와 지우고자 하는 게시글인지 확인해주세요\r\n")
                    } else {
                        res.send("댓글 삭제 성공\r\n")
                        console.log(userID+"가 "+req.params.reply+"댓글을 삭제했습니다.")
                    }
                    connection.release()
                },
                (err)=>{
                    switch(err.code) {
                        case 'ER_BAD_NULL_ERROR':
                            res.status(400).send("전달된 인자 부족\r\n");
                            break;
                        default:
                            res.send("알 수 없는 오류\r\n")
                    }
                    connection.release()
                }, req.params.reply, userID)

        }, function (err) {
            res.send("인증되지 않은 토큰입니다.\r\n")
        })
    })
});

app.get('/dream_analysis', (req, res)=>{
    database.connect(function (connection) {
        if(req.query.tags===undefined) {
            res.status(400).send("tags인자를 보내주세요")
            connection.release()
            return
        }
        community.viewKeywords(connection,
            (rows)=>{
                res.send(rows);
                connection.release()
            },
            (err)=>{
                console.error("/dream_analysis 조회 검색 오류 : "+err);
                res.send("fail\r\n");
                connection.release()
            }, JSON.parse(req.query.tags))
    })
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
