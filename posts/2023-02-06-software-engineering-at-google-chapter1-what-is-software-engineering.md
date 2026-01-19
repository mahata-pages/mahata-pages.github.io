---
title: 'Software Engineering at Google: Chapter 1 - What Is Software Engineering'
date: '2023-02-06'
---

『[Software Engineering at Google](https://learning.oreilly.com/library/view/software-engineering-at/9781492082781/)』の第一章「What Is Software Engineering」を読んだ感想をメモしていく。

## Hyrum's Law (ハイラムの法則)

この章では「[Hyrum's Law](https://www.hyrumslaw.com/)」という言葉が導入される。本書の後の方でも何度か言及されるキーワードである。「Hyrum...誰...??」と思ったけど、これは著者の Hyrum Wright さんのことのようだ。

本には次のように書かれている。

> With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.
> 
> (抄訳) 十分な数の API 利用者がいれば、契約で約束した内容は重要ではありません。あなたのシステムで観測できる挙動はすべて、誰かに依存されることになります。

これはどういうことを言っているのだろうか。書籍ではハッシュコンテナを例に説明しているけど、もう少し具体的に Python で Hyrum's Law に該当する例を示してみよう。

かつて Python では dict オブジェクトのデータ挿入順は保持されなかった。しかし [バージョン 3.7 からは dict オブジェクトの挿入順序が保存される](https://docs.python.org/ja/3/whatsnew/3.7.html)。それでは、`dict` がデータの挿入順を保持することに依存するコードを書いて良いのかというと、そうとは言い切れない。未来のバージョンでは、この振る舞いが変わる可能性もある。

そして「**システムで観測できる挙動はすべて、誰かに依存される**」というのは、過去の Python では dict を疑似ランダマイザーとして使うプログラマーがいた、という意味だ。**たまたま** 未定義の振る舞いを観測したプログラマーが、それに依存したコードを書いてしまうのである。

プログラミング言語の未定義な振る舞いを活用したプログラムは「賢い」プログラムである。しかし、このような「賢さ」はソフトウェアエンジニアリングの文脈では褒められるものではない、とある。

## Trade-offs and Costs (トレードオフとコスト)

組織の健全性はキャッシュフローだけの問題ではない。次の一節は素晴らしい話だと思った。

> Efficiency gains from keeping engineers happy, focused, and engaged can easily dominate other factors, simply because focus and productivity are so variable, and a 10-to-20% difference is easy to imagine.
> 
> (抄訳) エンジニアが幸せで、集中し、仕事に打ち込むことで得られる効率性は、他の要因を圧倒します。なぜなら、集中力と生産性は非常に変わりやすく、10～20%の差は簡単に想像できるからです。

組織がエンジニアの幸福に投資することは、福利厚生ではない。組織の成長のための戦略である。

「10~20% の差」という数字の根拠は特に書かれていなかったけど、少なく見積もってもその程度の差はあるだろう。

