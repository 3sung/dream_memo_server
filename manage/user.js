const mysql = require('mysql');
module.exports = {
    signUp: function (connection, success, fail, userID, userEmail, userPassword) {
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`User_TB` (`ID`, `Email`, `Password`) VALUES (?, ?, ?);",
            [userID, userEmail, userPassword],
            function (err, rows, fields) {
                if(err) {
                    success(rows);
                } else {
                    fail(err)
                }
            }
        )
    },
    signIn: function (connection, success, fail) {
        connection.query(
            "",
            function (err, rows, fields) {
                if(err) {
                    success(rows);
                } else {
                    fail(err)
                }
            }
        )
    }
};