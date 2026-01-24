---
title: "『プログラミングTypeScript』 第四章 - ジェネレーターとイテレーター"
date: "2023-01-13"
---

『[プログラミングTypeScript](https://www.oreilly.co.jp/books/9784873119045/)』の第四章ではジェネレーターおよびイテレーターに関するセクションがある。そこではフィボナッチ数を生成するジェネレーターを返す関数 (ジェネレーター関数) が例示されている。

本記事では「素数を生成するジェネレーター」を返す関数を書いてみよう。素数は無限に存在するので、**次の**素数を返せるというのはジェネレーターの用途として適切だろう。

[全体のコードは次の通り](https://www.typescriptlang.org/ja/play?#code/GYVwdgxgLglg9mABAKggJwKYEMoYApowC2GA4hmBmjnGgBQCUiA3gFCKIQIDOUiADoRLdEAXkSUA7ogDKGKAB4wIIgCMqAPkat2iADbzOINJjB9xAJl2SAFjAOI6UNCAxM2HDrfsZHz1+66nvqGMNwExL7i-hhBnsC0jlxgvAJCvnDAaZHcgcHBMFl0EMamfACk2SRiouIADHn5BeHpYojAWHrcsU3BqphYANZxwQC+I4jjE4WOAIRhESSNTSUmFFAA1BsA3BMcybDKPflTTYI5AHRYACbXxaXrDBP92MNjOsEAnjAYetdGazMW104ymyVS5xI5Eo1CgiXE6GwuEWZAoVBo9CeCTQjgMfBgbTq20QBIUiAAjHUiSSto1wXADBc9HAAOZ0SGomEYi6UAAeUEYT3GQA)。

```typescript
function* createPrimeGenerator() {
  const primes = new Set<number>();

  let current = 2;
  while (true) {
    while (true) {
      let isPrime = true;
      for (const prime of primes) {
        if (current % prime === 0) {
          isPrime = false;
          break;
        }
      }

      if (!isPrime) {
        current++;
        continue;
      }

      primes.add(current);
      break;
    }

    yield current++;
  }
}

const primeGenerator = createPrimeGenerator();
for (let i = 0; i < 100; i++) {
  console.log(primeGenerator.next());
}
```

関数名の前に `*` をつけることでジェネレーター関数を定義できる。ジェネレーター関数はジェネレーター (`Generator`) を返し、その値は `yield` キーワードで生成される。利用者は `next()` をコールすることでジェネレーターに次の値を要求できる。

## ジェネレーターとイテレーター

`createPrimeGenerator()` が返す値はジェネレーターだが、イテレーターでもある。もっと言えば、反復可能なイテレーターでもある。

『プログラミングTypeScript』から「反復可能オブジェクト」と「イテレーター」の定義を引用しよう。

> **反復可能オブジェクト**: `Symbol.iterator` と呼ばれるプロパティを含んでいるオブジェクト。このプロパティの値は、イテレーターを返す関数。
>
> **イテレーター**: `next` と呼ばれるメソッドを定義しているオブジェクト。この `next` メソッドは `value` および `done` というプロパティを持つオブジェクトを返す。

ここで IDE (IntelliJ IDEA) は先ほどの例での `primeGenerator.` の補完を次のように表示してくる。

![IntelliJ IDEA が表示するジェネレーターの補完候補](/images/20230113-iterator.png)

`System.iterator` と `next` の両方を持つことがわかる。したがって、これは反復可能なイテレーターだと言える。
