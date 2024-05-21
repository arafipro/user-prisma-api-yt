# 【Cloudflare Workers】Hono＋Cloudflare D1＋Prisma 20分でREST APIを作成

## YouTube

[!["【Cloudflare Workers】Hono＋Cloudflare D1＋Prisma 20分でREST APIを作成"](https://i.ytimg.com/vi/f641dliqzwQ/maxresdefault.jpg)](https://youtu.be/f641dliqzwQ)

## 技術選定

- TypeScript
- Hono
- Prisma
- Cloudflare D1
- Cloudflare Workers

## 初期設定

### NodeModule をインストール

```bash
npm install
```

### データベースを作成

```bash
npx wrangler d1 create user-prisma-api
```

### wrangler.toml に追記

```toml
[[d1_databases]]
binding = "DB"
database_name = "user-prisma-api"
database_id = "<unique-ID-for-your-database>"
```

`<unique-ID-for-your-database>`はデータベースを作成したときに出力されるID

### ローカルデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply user-prisma-api --local
```

### リモートデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply user-prisma-api --remote
```

### ローカルデータベースのテーブルにダミーデータを登録

```bash
npx wrangler d1 execute user-prisma-api --local --file=./prisma/dummy-data.sql
```

### リモートデータベースのテーブルにダミーデータを登録

```bash
npx wrangler d1 execute user-prisma-api --remote --file=./prisma/dummy-data.sql
```

## デプロイ

```bash
npm run deploy
```

## APIに接続を許可するURLを指定(CORS)

`src/index.ts`のcorsのoriginに接続を許可するURLを指定する  
配列で複数指定することも可能  
コメントアウトして使用する
接続を許可するURLを指定する場合は最後のスラッシュ（/）は不要  
例）`http://localhost:8000（/は不要）`  

### /users

idを指定しないURLの場合
GETとPOSTでしか使わない

```ts:src/index.ts
app.use(
  "/users",
  cors({
    origin: ["{許可するURL1}", "{許可するURL2}"],
    allowHeaders: [
    "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
		...
  })
);
```

### /users/*

idを指定したURLの場合
GETとPUTとDELETEでしか使わない

```ts:src/index.ts
app.use(
  "/users/*",
  cors({
    origin: ["{許可するURL1}", "{許可するURL2}"],
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
    ],
    allowMethods: ["GET", "PUT", "DELETE", "OPTIONS"],
		...
  })
);
```

## テーブル

### テーブル名 User

| No. | カラム名 | データ型 | 主キー |
| --- | -------- | -------- | :----: |
| 1   | id       | integer  |   ○    |
| 2   | name     | text     |        |
| 3   | email    | text     |   　   |
