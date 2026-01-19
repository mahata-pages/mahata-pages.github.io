---
title: '『プログラミングTypeScript』 第四章 - final 修飾子のエミュレート'
date: '2023-01-23'
---

『[プログラミングTypeScript](https://www.oreilly.co.jp/books/9784873119045/)』の第五章では、Java などのプログラミング言語における `final` キーワードを TypeScript で実現するアイディアについて紹介されている。面白いと思った。

Java の `final` は色々なところに書けるが、ここではクラスに対する `final` について考える。クラスに対して `final` をつけると、そのクラスは継承できなくなる。

TypeScript で継承不可能なクラスを定義するにはどうすれば良いだろう? [コンストラクタを `private` にすれば継承は不可能になる](https://www.typescriptlang.org/play?#code/MYGwhgzhAECyYFsFhNA3gKGtADgJwEsA3MAFwFNpgB7AOwlLwFdhTq8AKASnQF8N+GUJBgARagHNo5AB4VaAExjwkKPhiF0G0BZOgBeaLXIB3aOIncMQA)。

```typescript
class Mammal {
  private constructor() {}
}

class Dog extends Mammal {}

const dog = new Dog()
```

このとき `class Dog extends Mammal {}` に対するエラーメッセージは `Cannot extend a class 'Mammal'. Class constructor is marked as private.(2675)` である。また `const dog = new Dog()` については `Constructor of class 'Mammal' is private and only accessible within the class declaration.(2673)` と言われる。エラーメッセージがすべてを言い表している。

ところで Java の `final` は継承を禁止するだけで `final` のついたクラスのインスタンス化を禁止するものではない。この修飾子をエミュレートするのであれば `const dog = new Dog()` 相当のものは許したい。`private` なコンストラクタを外から呼べない、という制約があるので `Mammal` クラスの中でインスタンスを作れば良いだろう。[具体的には次のようにする](https://www.typescriptlang.org/ja/play?#code/MYGwhgzhAECyYFsFhNA3gKGtADgJwEsA3MAFwFNpgB7AOwlLwFdhTq8AKASnQF8toDMgWBU85MuW7oB2caSZ5a0WuQDucRMhDcB-fhhr1S0ZEhTQAvJvMgAdMHGTdQA)。

```typescript
class Mammal {
  private constructor() {}
  static create() {
    return new Mammal()
  }
}

const mammal = Mammal.create()
```

これで Mammal は継承不可であり、そのインスタンスは `Mammal.create()` によって得られるようになった。



