---
title: "定期的な処理を GitHub Actions で行う話"
date: "2023-01-17"
---

何かの処理を定期的に実行したい、そんなこともあるでしょう。プログラマであれば。

[過去には `Launchd` で MacBook から定期的に Slack メッセージをポストしたりしていた](https://mahata.gitlab.io/post/2021-04-01-read-your-own-blog/)。これには概ね満足していたけど、いくつか気になる点もあった。

1. 手元の MacBook で `Launchd` が動いているため、マシンを落としていると処理を実行できない
2. 複数の MacBook があると、どこの `Launchd` に何を設定したか管理しづらい

これを克服するため GitHub Actions を cron サーバーのように運用することにした。

[GitHub Actions は `on.schedule.cron` で起動タイミングを設定できる](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)。この機能を使い、任意のタイミングで任意のコマンドを実行できる。GitHub Actions は (障害が起きていない限り) 常に利用可能なので、MacBook の `Launchd` より高い可用性を期待できる。

ひとつ設定時にはまったのは、GitHub Actions の最短の実行間隔が 5 分だということだ。ドキュメントにはこう書かれている。

> The shortest interval you can run scheduled workflows is once every 5 minutes.

つまり `cron: '*/2 * * * *'` のようには書けない。僕は試行錯誤のために毎分 GitHub Actions をトリガーしようと思ったが、うまくアクションが動かずに「あれーなんでだろう...」となってしまった。
