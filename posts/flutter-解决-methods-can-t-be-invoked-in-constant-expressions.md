---
title: Flutter：解决 Methods can't be invoked in constant expressions.
date: 2026-02-25T14:49:32.343Z
---

在Flutter中，出现`Methods can't be invoked in constant expressions.`是因为运行时方法，不能出现在 const 上下文里（const 表达式必须在编译期可确定）。有两种常见修复：

- 把外层的 const 去掉（如果不需要编译期常量）。

- 使用编译期常量构造器，例如颜色： Color.fromRGBO、Color.fromARGB 或十六进制常量 Color(0xAARRGGBB)。

const 是 Dart 中标记“编译时常量”的关键字。被标记为 const 的表达式：

- 在编译期求值（不能包含运行时方法调用）。

- 是不可变的（immutable）。

- 会被 canonicalize（相同字面量只分配一次，有助于减少运行时开销）。
