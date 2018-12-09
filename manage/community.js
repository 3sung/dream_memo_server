const mysql = require('mysql');
module.exports = {
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
    }
};