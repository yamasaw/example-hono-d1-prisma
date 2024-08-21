import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';
const exec = promisify(execCallback);

const DATABASE_NAME = 'prisma-demo-db';
const ENVIROMENT = 'local';

const users = [
  {
    email: 'sample1@example.com',
    name: 'sample1'
  },
]


async function run () {
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
          return `'\"${column}"\'`
        }).join(',')
        + `)`
      const valueStr = `VALUES  (`
        + columns.map(column => {
            const value = values[column]
            return `'${value}'`
          }).join(',')
        + `)`
    
      await exec(`npx wrangler d1 execute ${DATABASE_NAME} --command "INSERT INTO  \"${table}\" ${columnStr} ${valueStr};" --${ENVIROMENT}`);
    })

    return promises;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed');
  }
}