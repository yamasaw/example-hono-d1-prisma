# 概要
yusukebeeさんが作成した[hono](https://hono.dev/)を利用してCloudflare WorkerでAPIサーバーを勉強がてら作成。データベースにはD1 ORMとしてPrismaを利用している

学習以下のサイトを参考に行った
  
- Honoについて
[Hono Getting Started](https://hono.dev/docs/getting-started/cloudflare-workers)

- Cloudflareのデプロイ方法
[Cloudflare Docs CLI](https://developers.cloudflare.com/workers/get-started/guide/)

- D1+Prismaでの構築方法
[Query D1 using Prisma ORM](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/)

- PrismaでのSeedingについて
[Hono + Prisma + Cloudflare D1でさくっとAPIを作ってみる](https://tech.fusic.co.jp/posts/hono-prisma-cloudflare-d1/)


# このアプリの動作方法
## 依存ライブラリのインストール
このアプリケーションでは`pnpm`を利用している
```
pnpm i
```

## 設定ファイルの構築
### 1.設定ファイルのコピー
```
cp sample.wrangler.toml wrangler.toml
```

## DBの構築
### 1.D1の構築
DATABASE_NAMEは任意
```
npx wrangler d1 create <DATABASE_NAME>
```

### 2.databaseの設定
wrangler.tomlで以下の項目を作成されたD1の情報に書き換える
```
[[d1_databases]]
database_name="<DATABASE_NAME>"
database_id="xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx"
```

### 3.migrationの適用
```
npx wrangler d1 migrations apply <DATABASE_NAME> --local
```

### 4.Prisma Clientの生成
```
npx prisma generate
```

# 環境の起動
```
pnpm run dev
```

# DB更新
## migration
### 1.schemaファイルの更新
`prisma/schema.prisma`の更新を行う

### 2.prismaのコマンドでmigrationファイルの作成
```
npx wrangler d1 migrations create prisma-demo-db <MIGRATION_FILE_NAME>
```

### 3.schemaの変更差分を
初回構築ときにはオプション`--from-empty`を指定するが2回目現状とスキーマの差分よりmigrationファイルを生成するため`--from-local-d1`の指定を行う

https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#evolve-your-schema-with-further-migrations
```
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script > migrations/000x_<MIGRATION_FILE_NAME>.sql
```

### 4.migrationを適用する
```
npx wrangler d1 migrations apply <DATABASE_NAME> --local
```
本番環境の変更の場合は`local`を`remote`とする

### 5.clientの更新
clientを更新しないと新たに追加・削除した項目がfetchできないので注意
```
npx prisma generate
```

## seeding
`prisma/seed.ts`の更新を行いその後以下のコマンドを入力する。
d1はwranglerを利用してデータを注入する事ができるこのseed.tsではこのコマンドを利用して`local`あるいは`remote`環境にデータを投入できるようにしている

### 1.seedファイルの更新
`prisma/schema.prisma`の更新を行う

### 2.seed実行
```
npx ts-node prisma/seed.ts
```

# deploy
## Databaseの更新
```
npx wrangler d1 migrations apply <DATABASE_NAME> --remote
```

## アプリケーションのデプロイ
wranglerのコマンド入力するだけで済む
```
pnpm deploy
```