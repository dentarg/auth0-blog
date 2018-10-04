---
layout: post
title: "7 Things You Should Know About WebAssembly"
description: "Learn 7 things you should know about WebAssembly, one of the biggest changes the web will experience in the coming years."
date: 2015-10-14 18:00
alias: /2015/10/14/7-things-you-should-know-about-web-assembly/
category: Technical Guide, Architecture, WebAssembly
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design:
  bg_color: "#415156"
  image: https://cdn.auth0.com/blog/web-assembly/logo.png
  image_size: "120%"
  image_bg_color: "#B6C5CA"
  blog_series: false
tags:
- webassembly
- web-assembly
- wasm
- wast
- asm.js
- nacl
- pnacl
- javascript
- emscripten
- llvm
related:
- 2016-01-11-updated-and-improved-more-benchmarks-virtual-dom-vs-angular-12-vs-mithril-js-vs-the-rest
- 2015-10-09-whats-the-fuss-with-googles-accelerated-mobile-pages-amp
- 2016-03-23-intro-to-immutable-js
---

In this post we will explore seven key facts about *WebAssembly*, one of the biggest changes the web will experience in the coming years. Will it meet our expectations? Read on!

-----

## Introduction
If you are not familiar with the concepts behind WebAssembly, read this excellent [post by Peter Bright from ArsTechnica](http://arstechnica.com/information-technology/2015/06/the-web-is-getting-its-bytecode-webassembly/) or the [announcement post from Brendan Eich in his personal blog](https://brendaneich.com/2015/06/from-asm-js-to-webassembly/).

For the purposes of this post, here is a short glossary:

- **Source code:** What a developer writes.
- **Compiler:** An application that turns source code into assembly, bytecode or machine code (what other apps or hardware run).
- **Assembly:** A low-level source-like language specific to a machine or an application.
- **Bytecode:** A low-level binary representation of code that can be run by other applications.
- **Machine code:** A binary representation of code that can be run directly by hardware.

WebAssembly aims to be the *bytecode* for the web. Here is how a developer would use WebAssembly in the future:

1. Develop an app (write the *source code* in any language that can be compiled to WebAssembly).
2. Use a *compiler* to turn the *source code* into WebAssembly *bytecode* (and potentially into *assembly-code* if required).
3. Load the *bytecode* in a browser and run it.

![WebAssembly development flow](https://cdn.auth0.com/blog/webassembly/webassembly-2.png)

## Fact 1: WebAssembly is not the end of JavaScript
It's been said before and it will be said again: **JavaScript is here to stay**. Thanks to the growth of the web, JavaScript has become a **lingua franca** among developers and tool vendors. WebAssembly will not change this. WebAssembly is meant to fill a place that JavaScript has been forced to occupy up to now: a **low-level code representation that can serve as a compiler target**. As more and more languages and platforms begin to target the web, more stress is put on JavaScript and browser vendors to provide missing features that are much needed. Some of these features **do not play well** with the already complex semantics of JavaScript. WebAssembly is the right answer:

- It was designed as a compiler target from the beginning.
- It is supported by all major browser vendors.
- It can diverge from JavaScript semantics as much as needed.

{% include tweet_quote.html quote_text="Thanks to the growth of the web, JavaScript has become a **lingua franca** among developers and tool vendors." %}

WebAssembly is the much needed **complement** to JavaScript for the web.

## Fact 2: WebAssembly is being developed by the teams behind asm.js and (P)NaCl
If you have been following the development of the web over the last few years you know that WebAssembly is aiming at a difficult goal: providing a unified compilation target for languages that do not map easily to JavaScript. Not only is this goal **difficult to achieve from a technical point of view**, but it is also **hard to attain from a standards point of view**. The web is not controlled by any single vendor, so every change must be a **joint effort**. Fortunately, the teams behind WebAssembly know this. At Mozilla, a group of hardcore developers tried to provide an answer in the form of **asm.js**: a subset of JavaScript meant to serve as a compiler target. On the other side, Google worked on **Native Client (NaCl)** and **Portable Native Client (PNaCl)**, a binary format for the web based on LLVM. Although each of these solutions worked to some degree, they **did not provide a satisfactory answer** to all the problems. It is from this experience that Web Assembly was born: a **joint effort aimed at providing a cross-browser compiler target**. The future looks bright for WebAssembly.

## Fact 3: WebAssembly is backwards compatible
Backwards-compatibility is an essential feature of the web. WebAssembly will not be an exception: a **polyfill** will be available for old-browsers. In fact, a prototype is [already available](https://github.com/WebAssembly/polyfill-prototype-1). You can see it working [here](http://lukewagner.github.io/AngryBotsPacked/) or [here](http://lukewagner.github.io/PlatformerGamePacked/).

## Fact 4: WebAssembly does not look like CPU assembly
When reading the word "assembly" you might immediately hear "unreadable" in your head. Fortunately, that is not the case for WebAssembly. In contrast to other low-level code representations, or most bytecodes, WebAssembly describes an **abstract syntax tree (AST)**. That's right, WebAssembly provides higher level constructs such as **loops and branches**. This means that it is actually possible to **write WebAssembly directly**, or decompile existing binary files into something that is much more readable than opcodes or instructions. You might be thinking "what about variable names?". WebAssembly will support adding **debugging information** to the compiled files.

This is a sample of what a text representation of WebAssembly might look like. This example uses s-expressions (a lightweight representation of ASTs):

```none
  ;; Iterative factorial named
  (func $fac-iter (param $n i64) (result i64)
    (local $i i64)
    (local $res i64)
    (set_local $i (get_local $n))
    (set_local $res (i64.const 1))
    (label $done
      (loop
        (if
          (i64.eq (get_local $i) (i64.const 0))
          (break $done)
          (block
            (set_local $res (i64.mul (get_local $i) (get_local $res)))
            (set_local $i (i64.sub (get_local $i) (i64.const 1)))
          )
        )
      )
    )
    (return (get_local $res))
  )
```

See the full example [here](https://github.com/WebAssembly/spec/blob/master/ml-proto/test/fac.wast).

Wait, are s-expressions the final format? No, no text representation of WebAssembly has been officially adopted yet. Here is another example, using a totally different syntax that you might find more familiar:

```none
export func main() i32 {
  storeI32(temp, 0);
  var i i32 = 0;
  done: while (i < 10) {
    i = i + 1;
    if (i >= 7) {
      break done;
    }
  }
  return (i + ifelse(0, 1, 2) * 2) * loadI32(temp) + loadI32(scale);
}
```

You can find this example [here](https://github.com/ncbray/wassembler/blob/master/demos/simple.wasm).

## Fact 5: WebAssembly will extend beyond the features required by JavaScript
The initial implementations of WebAssembly aim at **feature parity with asm.js**. In other words, what you can do today with asm.js, you will be able to do (better) with WebAssembly once it becomes available. One of the improvements you can expect in the initial versions are **better load times**. The binary format behind WebAssembly is much faster to parse than the text representation of asm.js. So even in its initial version, WebAssembly will result in improvements. This is what the current documents for WebAssembly call the [minimum viable product (MVP)](https://github.com/WebAssembly/design/blob/master/MVP.md). For future versions, some of the improvements we can expect are:

- Full threading support
- SIMD types and intrinsics
- Zero-cost exceptions (stack inspection and unwinding)
- Coroutines
- Dynamic linking
- DOM integration
- Integrated garbage collection
- Tail-call optimization
- Multi-process support

Some of these things would be really **hard to implement using JavaScript** or even plain asm.js. WebAssembly is being developed with these things in mind and will serve as a **great platform** for languages that support these (and other) features.

## Fact 6: Source-maps will allow you to easily debug compiled code in the browser
One of the downsides of a compiled target-language is that debugging usually gets harder. If you have played with any language that currently translates to JavaScript, you might have experienced debugging hell when trying to mentally **map the resulting code to your original code**. WebAssembly aims to be a great platform for other languages, so a solution for this is already being developed. Much like current native compilers, WebAssembly will allow for **debugging information** in its binary format along with **source maps**. Source maps will tell browsers and debuggers how to map the generated code to its original source representation. **Easy debugging** is part of the WebAssembly spec.

## Fact 7: You do not need to wait for WebAssembly to be ready
Although WebAssembly is still in its infancy, you can already take advantage of many of the benefits that WebAssembly will provide in the future. As we mentioned in fact 2, WebAssembly is the result of **years of experience** implementing asm.js and NaCl, and all the benefits provided by these two implementations will be available in WebAssembly. If you want to use some of these benefits right now, **asm.js is an excellent solution**. For instance, [Emscripten](https://github.com/kripken/emscripten) allows you to compile your code to asm.js *today*. If you think committing to asm.js today is a bad idea, keep in mind, again, that WebAssembly is still in its **infancy**. And even so, WebAssembly aims at feature parity with asm.js as its first goal. So don't be afraid to bet on asm.js. WebAssembly is being developed as an **upgrade path** from current solutions, so, even though it might be a good idea to start thinking about the future, this in no way means that asm.js is not receiving support today. Hack away!

## Aside: WebAssembly and existing libraries
At Auth0 we have a full body of work written in JavaScript. The cool thing about WebAssembly is that calls to JavaScript libraries (and vice versa) will be possible. So, for instance, you could make calls to the Auth0 JavaScript library directly from C++. How cool is that? For more on Auth0 (and our extensive use of JavaScript), <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">signup and start hacking</a>.

## Conclusion
During the last few years, we have seen an explosion of frameworks, compilers and other types of solutions that aim to take your existing code and make it *web-compatible*. This has caused a lot of **frustration in the community**. On one hand, features that do not fit well with JavaScript semantics or ideology have started showing up in implementors' forums and have raised **serious questions** among JavaScript developers. On the other hand, developers who want to use their existing code, or who want to use their favorite language or framework, have found themselves **locked out of the web**, or facing serious debugging challenges (among other problems). Even though existing solutions such as asm.js or PNaCl have done a lot to reduce these concerns, up to now there hasn't been a **proper, cross-vendor solution**. WebAssembly aims to solve that. A proper, cross-vendor, cross-language target for compilers, aiming at supporting all necessary features for making **a great all-around platform**. The stakes are high, but so are the rewards. And the people working on this know their stuff. WebAssembly is the evolution of an idea that has been requested by developers for a long time. WebAssembly is the future.
