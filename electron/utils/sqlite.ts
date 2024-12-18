import {SetFilePath} from "./signalPath.ts";
import {join} from "path";
import {Database} from 'sqlite3';

const sqlite3 = require('sqlite3').verbose();

interface ResponseData {
    message: string;
    isSuccess: boolean;
    data: any[];
}

/**
 * 初始化数据库
 * @returns {sqlite3} 数据库实例
 */
function initSql() {
    const {configPath} = SetFilePath();
    const dbPath: string = join(configPath, 'sakura.db');
    return new sqlite3.Database(dbPath, (err: Error | null) => {
        if (err) {
            console.error("Failed to connect to database:", err.message);
            throw err;
        }
    });
}

/**
 * 通用数据库查询函数
 * @param sql {string} 查询的 SQL 语句
 * @param params {any[]} 查询参数
 * @returns {Promise<any[]>} 查询结果
 */
function query(sql: string, params: any[] = []): Promise<ResponseData> {
    const db: Database = initSql();
    return new Promise((resolve) => {
        db.all(sql, params, (err: Error | null, rows: any[]) => {
            resolve({
                message: err ? err.message : 'Success',
                isSuccess: !err,
                data: err ? [] : rows
            });
        });
        db.close((err: Error | null) => {
            if (err) {
                console.error("Failed to close database connection:", err.message);
            }
        });
    });
}

/**
 * 更新数据库
 * @param sql
 * @param params
 */
function update(sql: string, params: any[] = []): Promise<ResponseData> {
    const db: Database = initSql();
    return new Promise((resolve) => {
        db.run(sql, params, (err: Error | null, rows: any[]) => {
            resolve({
                message: err ? err.message : 'Success',
                isSuccess: !err,
                data: err ? [] : rows
            });
        });
        db.close((err: Error | null) => {
            if (err) {
                console.error("Failed to close database connection:", err.message);
            }
        });
    });
}

/**
 * 获取版本信息
 * @returns {Promise<any[]>} 版本信息
 */
async function getVersion(): Promise<any[]> {
    try {
        const {data} = await query('SELECT * FROM version');
        return data
    } catch (err: any) {
        console.error("Error fetching version info:", err.message);
        return [];
    }
}

/**
 * 获取主题信息
 * @returns {Promise<any[]>} 主题信息
 */
async function getTheme(): Promise<any[]> {
    try {
        const {data} = await query('SELECT * FROM theme');
        return data;
    } catch (err: any) {
        console.error("Error fetching theme info:", err.message);
        return [];
    }
}

async function setTheme(theme: { autoType: boolean; darkType: boolean; lightType: boolean }) {
    let params = [
        '' + theme.autoType,
        '' + theme.darkType,
        '' + theme.lightType
    ]
    const {isSuccess} = await update('UPDATE theme SET autoType = ?, darkType = ?, lightType = ?', params);
    return isSuccess;
}

export function useSqlite(){
    return{
        getVersion,
        getTheme,
        setTheme
    }
};
