# 概要


# このアプリの動作方法
## 設定ファイルの構築
### 1.設定ファイルのコピー
```
cp sample.wrangler.toml wrangler.toml
```

### 2.databaseの設定
```
database_id
```

## Prisma Clientの生成
```
npx prisma genarate
```

# 環境の起動
## 
```
pnpm run dev
```

# DB更新
## migration
### 1.schemaファイルの更新
`prisma/schema.prisma`の更新を行う

### 2.prismaのコマンドでmigration
```
npx prisma migrate dev
```

```
npx 
```

## seeder
`prisma/seed.ts`の更新を行いその後以下のコマンドを入力する。
d1はwranglerを利用してデータを注入する事ができるこのseed.tsではこのコマンドを利用して`local`あるいは`remote`環境にデータを投入できるようにしている

```
npx ts-node prisma/seed.ts
```
