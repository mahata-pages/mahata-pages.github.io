---
title: 'Software Engineering at Google: Chapter 2 - How To Work Well On Teams'
date: '2023-02-10'
---

この記事は『[Software Engineering at Google](https://learning.oreilly.com/library/view/software-engineering-at/9781492082781/)』の第二章「How To Work Well On Teams」を読んだ感想である。

(以下、本書の主張と自分の意見をあえて混ぜて書いている)

## コードを隠したくなる気持ちと、その悪影響

まだ [Google Code](https://code.google.com/) が稼働していたころ、機能要望には「コードを隠す手段」に関するものが多かった。「コードを見られる "不安" は根深い」と本章の著者は主張している。なお、著者の Brian Fitzpatrick さんは [Subversion](https://subversion.apache.org/) の作者の一人である。

Linus Torvalds や Guido Van Rossum などの偉大なプログラマーが「またたく間に、たった一人で世界を変えた」というのは誤解である。ソフトウェア開発はチームプレイだ。彼らでさえ、コミュニティの力がなければ、ここまで広く使われるソフトウェアは作れなかった。

本章には「多くのエンジニアは "天才" と思われたい」とある。そして「おそらく、あなたは天才ではない」とも書かれている。

コードを隠したい気持ちは、未完成の仕事を見られたくない気持ちと一緒だ。未完成の仕事を見られると、自分が天才ではないことがバレる。しかし「自分は正しい方向に進んでいるのか?」「同じようなことをしている人はいないのか?」という疑問は、仕事を衆目に晒さないと答えを得られない。

## 謙虚、尊敬、信頼

次の言葉は Richard Hamming さんのエッセイからの引用である。

> The moral is this: do not underestimate the power of playing the social game.
> 
> (抄訳: ソーシャルゲームの力を見くびらないことです)

彼は秘書に対して愛想よく振る舞う「努力」をしていた。のちに彼が仕事でトラブルを経験したとき、その秘書は身を粉にして彼を助けるべく動いてくれた。この人間関係の力学を「ソーシャルゲーム」と表現している。情けは人の為ならず、ということだ。

また、同氏による「カジュアルな服装のせいで重要人物だと認知してもらえない」エピソードも紹介されている。ソーシャルゲームにおいて「外見」は重要である。ソーシャル「ゲーム」なのだから、ルール内で自分が有利になるような装備をすれば良い。

この「友好的に接することで、相手の協力を得られる」ことや「適切な格好をすることで、相手からの評価を得られる」ことを Richard さんは「システム」と呼んでいる。

> By realizing you have to use the system and studying how to get the system to do your work, you learn how to adapt the system to your desires. Or you can fight it steadily, as a small, undeclared war, for the whole of your life.
> 
> (抄訳: システムを使わなければならないことを自覚し、システムに仕事をさせる方法を研究して、システムを自分の要望に適合させる方法を学びましょう。そうしないと、一生をかけて些細な戦争を繰り返すことになります)

まったくその通りだ。

ところで、本章では [Team Geak](https://www.oreilly.co.jp/books/9784873116303/) にも登場する「Humility (謙虚), Respect (尊敬), Trust (信頼)」の 3 つの言葉が登場する。エンジニアリング文化の根幹である。

これをコードレビューに反映させるとどうなるか、という話は面白い。つまり「自分が正しくて、相手が悪い」という態度は謙虚ではないし、「(自分には無駄に思えるコードだけど) 相手はドメインに対する造詣が深いから、そう書いているのかもしれない」という態度は尊敬である。

そのような態度をコードレビューに反映すると、次のようなコメントになる。

> “Hey, I’m confused by the control flow in this section here. I wonder if the xyzzy code pattern might make this clearer and easier to maintain?”
> 
> (抄訳: ここの制御フローで混乱してしまいました。xyzzyのコードパターンを使えば、この部分がより明確になり、メンテナンスが楽になったりしないでしょうか?)

攻撃的ではないし、フィードバックも与えられている。`I'm confused ...` の辺りは「あなたのコードが読みづらい」ではなく「わたしの理解が追いつかない」という感じで謙虚さを感じる。

正しければ何を言っても構わない、という考え方もあるだろう。しかし、それはソーシャルゲームにおけるシステムを無視しており、損をしている。何より、そういう人とはチームメイトとして一緒に働きたくない。
