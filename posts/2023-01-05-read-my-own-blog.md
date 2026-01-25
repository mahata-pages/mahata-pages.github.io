---
title: "ブログの読み返しが好きな話"
date: "2023-01-05"
---

いかにもナルシストっぽい発言だけど、僕は自分の過去のブログ記事を読み返すのが好きだ。[以前もそのような趣旨の記事を書いたことがある](https://mahata.gitlab.io/post/2021-04-01-read-your-own-blog/)。

今までは、この自作ブログには `sitemap.xml` が存在しなかったので、先の記事のように定期的にランダムな記事を取得して Slack にポストすることができなかった。

少しずつ記事も増えてきたので、このブログでも `sitemap.xml` を生成するようにした。

この `sitemap.xml` の生成は [sitemap という npm モジュール](https://www.npmjs.com/package/sitemap)で半自動的に生成している。具体的には次のようにする。

```sh
$ ls posts | xargs -I {} echo "https://mahata.vercel.app/posts/{}" | sed 's/\.md$//' > urls.txt
$ npx sitemap < urls.txt > public/sitemap.xml
```

ブログ記事ファイルが `posts/` に存在するとき、上記のコマンドで `public/sitemap.xml` を生成できる。

最後にこれと同等の内容を Vercel の `Build Command` の設定に忍ばせた。これで Vercel に更新があるたびに最新の `sitemap.xml` が生成される。
