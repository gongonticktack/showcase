# リポジトリ一覧

GitHub リポジトリをサムネイル付きカードで一覧化するショーケースサイト。Webアプリはカードからそのまま開け、ローカルアプリはリポジトリへ移動する。

公開URL: https://showcase.gongonticktack.workers.dev/

## データ

- データソースは Supabase のテーブル `public.github_repos`
- 初期データの投入は `schema.sql` を Supabase の SQL Editor で実行する（テーブル作成・RLS・公開 select ポリシー・16件のシードを含む）。シードの元データは `seed.json`
- サムネイル画像は `assets/` フォルダの SVG（16件）で、`thumbnail` カラムには `assets/<name>.svg` の相対パスが入る
- サイトは Cloudflare Worker の `/api/repos` 経由で Supabase REST から読み取り、失敗時はブラウザから直接 Supabase REST を読む
- 接続情報（URL と anon キー）は `config.json` にある。書き込みは公開していない（RLS で select のみ許可）

## ローカル開発

```sh
npm install
npm run dev
```

## デプロイ

```sh
npm run deploy
```

wrangler で Cloudflare Workers にデプロイされる（`wrangler.jsonc` の `name: showcase`）。
