const mysql = require('mysql');
const jwt = require('jsonwebtoken');

module.exports = {
    signUp: function (connection, success, fail, userID, userEmail, userPassword) {
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`User_TB` (`ID`, `Email`, `Password`) VALUES (?, ?, ?);",
            [userID, userEmail, userPassword],
            function (err, rows, fields) {
                if(err) {
                    fail(err)
                } else {
                    success(rows);
                }
            }
        )
    },
    signIn: function (connection, success, fail, userID, userPassword) {
        connection.query(
            "SELECT ID, Password FROM `DREAMMEMO_DB`.`User_TB` WHERE ID=? AND Password=?",
            [userID, userPassword],
            function (err, rows, fields) {
                if(err || rows.length!==1) {
                    fail(err)
                } else {
                    success(rows)
                }
            }
        )
    },
    edit: function (connection, success, fail, userID, userPassword, userNewPW) {
        connection.query(
            "SELECT * FROM `DREAMMEMO_DB`.`User_TB` WHERE ID=? AND Password=?",
            [userID,userPW],
            function (err, rows, fields) {
                if (err) {
                    fail(err)
                } else {
                    connection.query(
                        "UPDATE `DREAMMEMO_DB`.`User_TB` SET Password=? WHERE ID=?;",
                        [userNewPW],
                        function (err, rows, fields) {
                            if(err) {
                                fail(err)
                            } else {
                                success(rows);
                            }
                        }
                    )
                }
            }
        )
    },
    deleteID: function (connection, success, fail, userID, userPassword) {
        connection.query(
            "SELECT * FROM `DREAMMEMO_DB`.`User_TB` WHERE ID=? AND Password=?",
            [userID, userPW],
            function (err, rows, fields) {
                if (err) {
                    fail(err)
                } else {
                    connection.query(
                        "DELETE FROM `DREAMMEMO_DB`.`User_TB` WHERE ID=?",
                        [userID],
                        function (err, rows, fields) {
                            if(err) {
                                fail(err)
                            } else {
                                success(rows);
                            }
                        }
                    )
                }
            }
        )
    },
    getToken: function(connection, userID){
        var token = jwt.sign({
            id: userID
        }, 'secret');
        connection.query(
            "INSERT INTO `DREAMMEMO_DB`.`UserLoginToken_TB` (`userID`, `token`) VALUES (?, ?);",
            [userID, token],
            function(err, rows, fields){
            }
        )
        return token;
    }
};
