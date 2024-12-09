import {SetFilePath} from "./signalPath.ts";

const sqlite3 = require('sqlite3').verbose();
const {join} = require('path');


function initSql() {
    const {configPath} = SetFilePath()
    const dbPath = join(configPath, 'demo.db');
    // 创建一个新的SQLite数据库实例
    return new sqlite3.Database(dbPath, (err: Error | null) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });
}

function getUserInfo() {
    const db = initSql()
    db.all('SELECT * FROM user', (err: Error | null, rows: any) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(rows);
        }
    });
}

export {
    initSql,
    getUserInfo
}
