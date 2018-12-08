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
    }
};