---
title: 'GitHub でスターをつけたプロジェクトを定期的にリマインドする話'
date: '2023-01-18'
---

GitHub プロジェクトにスターをつけるとき、だいたいはブックマーク目的である。しかし、この運用には根本的な問題がある。スターをつけたプロジェクトを忘れてしまうのだ。

そこで、[スターをつけたプロジェクトを取得してきてランダムに Slack に通知するプログラムを書いた](https://gist.github.com/mahata/88ec9f7d4ca7eed9f9c6aa9e2147ee1c)。これを動かすと、次のようなメッセージが Slack に投稿される。

![GitHub にスターをつけたリポジトリ](/images/20230118-github-stars.png)

先日、[GitHub Actions を cron サーバーとして運用する話](/posts/2023-01-17-github-actions-as-a-cron-server)を書いた。これと同じように、GitHub Actions にスターをつけたプロジェクトを定期的に Slack に投稿してもらい、記憶を掘り起こしてもらうようにした。
