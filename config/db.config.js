const mysql = require('mysql2');

const pool = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ppsu_db',

    // host: 'apii.sipooppsu.my.id',
    // user: 'sipn5779_newppsuDatabasesAlen',
    // password: '060899Alen.',
    // database: 'sipn5779_23November2024',
});

module.exports = pool.promise();
