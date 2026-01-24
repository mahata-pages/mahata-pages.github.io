---
title: 'SadServers - "Saskatoon" の解説'
date: "2023-01-11"
---

[前回](/posts/2023-01-10-sadservers1-saint-john)に続いて SadServers の ["Saskatoon": counting IPs.](https://sadservers.com/newserver/saskatoon#) を解いてみよう。概要は次の通りだ。

`/home/admin/access.log` に Web サーバーのアクセスログがあり、1 行が 1 リクエストに相当する。ログの先頭はリクエスト元の IP アドレスであり、アクセスログの中で最も多くのリクエストを発行している IP アドレスを特定したい。当該 IP アドレスは `/home/admin/highestip.txt` に保存するものとする。

まずはログファイルの中から IP アドレスを抽出しよう。僕なら次のようにする。

```
$ cat /home/admin/access.log | cut -d ' ' -f 1
```

`cut` に渡している `-d` と `-f` は、それぞれ「区切り文字」と「何カラム目が欲しいか」を指定するオプションである。これを実行すると次のような結果が得られる。

```
$ cat /home/admin/access.log | cut -d ' ' -f 1
83.149.9.216
83.149.9.216
83.149.9.216
...
```

これをソートするために `| sort` でつなげよう。さらに `| uniq -c` でつなげると重複行を数えてくれる。ここまでパイプでつなげると、結果が次のようになる。

```
$ cat /home/admin/access.log | cut -d ' ' -f 1 | sort | uniq -c
      6 1.22.35.226
      6 100.2.4.116
     84 100.43.83.137
...
```

問われているのは「最も多くのリクエストを送信している IP アドレス」なので、ここで結果を `sort` し直して最後の結果だけを取得すればよい。したがって `| sort | tail -n 1` を追加する。

```
$ cat /home/admin/access.log | cut -d ' ' -f 1 | sort | uniq -c | sort | tail -n 1
    482 66.249.73.135
```

ここまで来たら後は前後の空白をトリムした上で IP アドレスが表示される 2 カラム目を取得すればよい。

```
$ cat /home/admin/access.log | cut -d ' ' -f 1 | sort | uniq -c | sort | tail -n 1 | sed 's/^ *\| *$//' | cut -d ' ' -f 2 > /home/admin/highestip.txt
```

`| sed 's/^ *| *$//'` は行頭から始まる空白 **もしくは** 行末まで続く空白を除去する。

この内容で正答としてジャッジされる。

## 補足

次のような書き方でも問題ない。

- `cut -d ' ' -f 1` のようにする代わりに `awk '{print $1}'` として 1 カラム目を取得する

- `| sort | tail -n 1` のようにする代わりに `| sort -r | head -n 1`として `sort` 後にもっとも後ろに来る行を取得する
