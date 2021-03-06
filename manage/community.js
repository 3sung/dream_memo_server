const mysql = require('mysql');
module.exports = {
    viewKeywords: function(connection, success, fail, keywords) {
        connection.query(
            "SELECT KeyWord tag, Content content FROM DREAMMEMO_DB.DreamKeyword_TB WHERE KeyWord in ('"+keywords.join("', '")+"');",
            [],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },

    viewBoard: function (connection, success, fail) {
        connection.query(
            "SELECT * FROM DREAMMEMO_DB.DreamBoard_TB;",
            [],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    viewUserBoard: function(connection, success, fail, userID) {
        connection.query(
            "SELECT * FROM DREAMMEMO_DB.DreamBoard_TB Where UserID=?;",
            [userID],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    postBoard: function(connection, success, fail, userID, Title, DreamContent, CommentContent) {
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`DreamBoard_TB` (`UserID`, `Title`, `DreamContent`, `CommentContent`, `Time`) VALUES (?, ?, ?, ?, ?);",
            [userID, Title, DreamContent, CommentContent, (new Date()).toFormat('YYYY-MM-DD HH24:MI:SS')],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    deleteBoard: function(connection, success, fail, boardID, userID) {
        connection.query(
            "DELETE FROM `DREAMMEMO_DB`.`DreamBoard_TB` WHERE (`ID` = ? and `UserID` = ?);",
            [boardID, userID],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    postKeyword: function(connection, success, fail, boardID, keyword) {
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`DreamBoardKeyword` (`BoardID`, `KeyWord`) VALUES (?, ?);",
            [boardID, keyword],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },

    searchBoard: function (connection, success, fail, searchKeyword) {
        connection.query(
            "SELECT * FROM DREAMMEMO_DB.DreamBoard_TB WHERE DreamContent like ? or CommentContent like ?;",
            ["%"+searchKeyword+"%", "%"+searchKeyword+"%"],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    viewReplies: function (connection, success, fail, boardID) {
        connection.query(
            "SELECT * FROM DREAMMEMO_DB.DreamBoardReply_TB WHERE BoardID=?;",
            [boardID],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    postReply: function (connection, success, fail, boardID, userID, content) {
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`DreamBoardReply_TB` (`BoardID`, `UserID`, `Content`) VALUES (?, ?, ?);",
            [boardID, userID, content],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    editReply: function (connection, success, fail, commentID, userID, content) {
        connection.query(
            "UPDATE `DREAMMEMO_DB`.`DreamBoardReply_TB` SET `Content` = ? WHERE (`ID` = ? and `UserID` = ?);",
            [content, commentID, userID],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    deleteReply: function (connection, success, fail, commentID, userID) {
        connection.query(
            "DELETE FROM `DREAMMEMO_DB`.`DreamBoardReply_TB` WHERE (`ID` = ? and `UserID` = ?);\n",
            [commentID, userID],
            function (err, rows, fields) {
                if(err){
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    }
};