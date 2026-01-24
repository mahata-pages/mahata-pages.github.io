---
title: "『プログラミングTypeScript』 第四章 - is メソッドの実装"
date: "2023-01-16"
---

『[プログラミングTypeScript](https://www.oreilly.co.jp/books/9784873119045/)』の第四章の練習問題に次のようなものがある。

> 5. 型安全なアサーション関数、isを実装してください。型で概略を記述することから始めます。これは、完成したら、次のように使えるものです。
>
> ```typescript
> // stringとstringを比較します
> is("string", "otherstring"); // false
>
> // booleanとbooleanを比較します
> is(true, false); // false
>
> // numberとnumberを比較します
> is(42, 42); // true
>
> // 異なる型同士を比較すると、コンパイル時エラーになります
> is(10, "foo"); // エラー TS2345: 型 '"foo"' の引数を型 'number' の
> // パラメーターに割り当てることはできません。
> ```

よしよし、そんなに難しくはなさそうだ。この章の後半で出てきたジェネリック型を使えばできるのだろう。こうかな?

```typescript
function is<T>(first: T, second: T) {
  return first === second;
}
```

[動いているようだな](https://www.typescriptlang.org/ja/play?#code/GYVwdgxgLglg9mABDAzgHgCoD4AUwYBOKUAXIhgDSIoCmECAJmRgJSIDeAUIogTVCAJJ8RKIgC8k6nUYBuTgF9OnemBRwANjQB0GuAHMcqHAHJiBGGH0mqJuFAAWNURasmWLWYgD03xMABDDVoVBHUtXQMjFBwoAhAaKkDgmg8vX38gkNVwnT1DYwAWACYqErSfPziEzgzjAEYABltgODh3SsRACoZAS4ZAH4ZyAGVigGZCgFYyQGj1RBMAIla4OZNEQDsGQFR9QAdTQCSGGZMwEABbACNnFdXARYYewEOGPsB+hj7AawZAJyVAKIZAZX1AMwZAaIZAZQZACwZAPYMgHMGQCyDIA-BkA2gyAZIZAEAMnCAA)。おっ、この問題には続きがあるようだ...

```typescript
// ［難問］任意の数の引数を渡せるようにします
is([1], [1, 2], [1, 2, 3]); // false
```

ふむふむ、何個の引数が渡されるかわからないのであれば、レストパラメーターを使えばいけるだろう。俺は詳しいんだ。

```typescript
function is<T>(first: T, ...rest: T[]) {
  return rest.every((_) => _ === first);
}
```

うんうん、[これも期待通りに動くな](https://www.typescriptlang.org/ja/play?#code/GYVwdgxgLglg9mABDAzgHgCoD4AUwYBOKUAXIhgDSIB0tBApsWRgNoC6AlIgN4BQiiBlBAEkDYtXoA3egQCeOAPqIAvFkTKVWxPiJQOAbl4BfXrwgIUcADb1q1uAHMcqHAHJiBGGEduqbuCgAC1lPb18OQ0QAemidAENrFHpzSxs7B2dXKAIQeipgROTIgxi4wqSUizArW3snFxQcABYAJio2krLEHLzeWOQmgEYABn9gODg3LgHACoZAS4ZAH4ZyAGVWgGZmgFYyQGj1RDcAIgm4Q7dEQDsGQFR9QAdTQCSGfbcwEABbACNZc4vARYZ5wEOGRaAfoZFoBrBkATkqAKIZAMr6gDMGQDRDIBlBkAFgyAewZAOYMgFkGQB+DIBtBkAyQyAIAZUjV0vUsk0WEM2FRKVRWtTELTEO1EOtOFEBhVkkA)。ここで本の解答を眺めると...あれ、ちょっと僕の書いたものとは違う。

```typescript
function is<T>(first: T, ...rest: [T, ...T[]]): boolean {
  return rest.every((_) => _ === first);
}
```

...あっ、なるほど。もとの `...rest: T[]` だと `is('foo')` のような入力も許されてしまうのか...これは失態だ。`rest` が少なくともひとつの要素をもつことを保証するためには `...rest: [T, ...T[]]` [のように書く必要がある](https://www.typescriptlang.org/ja/play?#code/GYVwdgxgLglg9mABDAzgHgCoD4AUwYBOKUAXIhgDSIB0tBApsWQNqU20bMC6XAlGQCM4cADb0AhkgDeAKESIGUEASQNi1egDd6BAJ44A+ogC8WREeOXE+IlF4yAvjJkQEKUfWoi4AcxyocAHJiAhgwH0CqQLgoAAsdELCI3l4AbkQAegzrcREUehc3Dy9ffxQcKAIQeipgXPyU9KycvILXMHcxEr8AgBYAJioBxszsyuqZZoCARgAGKOBhQN5RxEAKhkBLhkAfhnIAZX6AZl6AVjJAaPVEQIAiRbgrwMRAOwZAVH1AB1NAJIYLwLAQAFsBHQPR6ARYYNoBDhi2gH6GLaAawZAE5KgCiGQDK+oAzBkA0QyAZQZABYMgHsGQDmDIBZBkAfgyAbQZAMkMgCAGQodYreHrlZjTLhURlUfrMxCsxCDRAHPhpVZ1VqTbIBQK3ZarACiAA8AA70aD0AAmiHEUEQYnExG5aoIPj+9DAUBQVAEIA1PhiiGm1BkQA)。

こういうケースには自分で気づけないといけないな。
