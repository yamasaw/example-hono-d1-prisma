import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';
import minimist from 'minimist';
const exec = promisify(execCallback);


const users = [
  {
    email: 'sample6@example.com',
    name: '名前',
    kana: 'かなs',
  },
]


// コマンドライン引数を解析
const args = minimist(process.argv.slice(2));
let DATABASE_NAME: string;
let ENVIRONMENT: 'local'|'remote';
// 必須の引数が提供されていない場合にエラーをスロー
if ((!args.db) || typeof args.db !== 'string') {
  console.error('Error: --db オプションが必要です');
  process.exit(1);
}

if (!args.env) {
  console.error('Error: --env オプションが必要です');
  process.exit(1);
}
if (args.env !== 'local' && args.env !== 'remote') {
  console.error('Error: --env オプションは local または remote である必要があります');
  process.exit(1);
}

DATABASE_NAME = args.db;
ENVIRONMENT = args.env;

async function run () {
  // コマンドライン引数を取得
  const args = process.argv.slice(2); // 最初の2つの要素を除外

  console.log('Seed started');
  console.log('Arguments:', args);
  const promises = execSeed('user', users);
}
run();

async function execSeed(table: string, datas: {[key: string]: string}[])
 {
  try {
    const promises = datas.map(async (data) => {
      const columns = Object.keys(data);
      const values = data;
      const columnStr = `(`
        + columns.map(column => {
          return `\'${column}\'`
        }).join(',')
        + `)`
      const valueStr = `VALUES  (`
        + columns.map(column => {
            const value = values[column]
            return `'${value}'`
          }).join(',')
        + `)`
    
      await exec(`npx wrangler d1 execute ${DATABASE_NAME} --command "INSERT INTO  \"${table}\" ${columnStr} ${valueStr};" --${ENVIRONMENT}`);
    })

    return promises;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed');
  }
}