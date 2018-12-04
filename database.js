const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'dreammemo',
    password: 'adminadmin',
    database: 'DREAMMEMO_DB',
    multipleStatements: true,
    connectionLimit: 100
});

module.exports = {
    connect: function(successHandler) {
        pool.getConnection((err, connection)=>{
            if (err) {
                console.error("DB connection get failed : ", err);
                const interval = setInterval(()=>{
                    pool.getConnection((err, connection)=>{
                        if(err) {
                            console.error("DB connection get failed again")
                        } else {
                            clearInterval(interval);
                            successHandler(connection)
                        }
                    })
                }, 1000)
            } else {
                successHandler(connection)
            }
        })
    }
};