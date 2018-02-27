---
layout: post
title: "Node.js アプリを構築し、JSON Web Token で認証する"
description: "Node js は JavaScript でのバックエンドアプリケーションの構築を可能にします。このチュートリアルでは、JSON Web Token (JWT) で Node.js アプリをセキュアにする方法を見ていきます。"
date: 2016-11-21 08:30
category: Technical Guide, Backend, NodeJS
banner:
  text: "Auth0 makes it easy to add authentication to your NodeJs application."
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/nodejs-awesome-polls/nodejs_logo.png
  bg_color: "#333333"
tags:
- nodejs
- expressjs
- nodejs-authentication
- javascript
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: building-and-authenticating-nodejs-apps
---

---

**TL;DR** Node Js は JavaScript のシンプルさをバックエンドにもたらします。今回は空白のページから構築し、複数のルートや認証、リモートデータアクセスでさえも完全に機能するアプリケーションを完了して、アプリケーション全体を Node JS で構築していきます。 [GitHub リポジトリ](https://github.com/auth0-blog/nodejs-awesome-polls) から完成したコード例をチェックしてください。

[Node Js](https://nodejs.org/)、または Node.js、NodeJS、または単なる Node は Ryan Dahl によって2009年に初めてリリースされ、今日、最も人気の高いバックエンド用のプログラミング言語のひとつになりました。Node Js は JavaScript のあらゆる意図や目的に対応しますが、Node Js コードはユーザーブラウザーで実行する代わりに、バックエンドで実行します。JavaScript に使い慣れたデベロッパーは Node Js コードにすぐに戻って書き込むことができます。

今回のチュートリアルでは、Node で最も人気の高いWeb フレームワークのひとつの [Express Js](http://expressjs.com/) を使って完全な Node Js アプリケーションを書き込みます。プロジェクトの設定からルーティング、外部 API の呼び出しなどあらゆることを取り上げます。コードに取りかかる前に、Node Js が人気が高く、広く使用されている理由を理解し、アプリケーションで Node Js を使用したいと思う理由をよく理解しましょう。

## Node Js の誕生

Node Js が一夜にしてセンセーションを巻き起こした理由は複数あります。性能が大きな要因となりました。Node Js は [イベントベースアーキテクチャ](https://en.wikipedia.org/wiki/Event-driven_architecture)および [非同期 I/O](https://en.wikipedia.org/wiki/Asynchronous_I/O) を中心に構築されました。これにより Node Js アプリケーションはその他のプログラミング言語と比較して優れた I/O と負荷性能を達成します。Node Js コードは Google の [V8 JavaScript エンジン](https://developers.google.com/v8/)を介して機械コードにコンパイルされます。Node Js の誕生につながったその他数点の要因を見てみましょう。

### **バックエンドでの JavaScript**

プログラミング言語としての JavaScript にはたくさんの欠陥があります。また、Web ブラウザーで実行する唯一の言語でもあります。Web サイトまたはアプリにあらゆるタイプの動的な機能を持たせたいのであれば、JavaScript で実装しなければなりません。この事実によって多くのデベロッパーが JavaScript を学び、まもなく続いてオープン ソースライブラリを学んでいきます。

Node Js は JavaScript であるため、 [lodash](https://lodash.com/)、 [Moment](http://momentjs.com/)、および [request](https://github.com/request/request) などこれら多くのライブラリは一切修正しなくてもバックエンドで使用することができます。多くの場合、デベロッパーが一旦コードを書き込むと、フロントエンドとバックエンドの両方で実行でき、多くの人がすぐにフルスタックデベロッパーになることができます。

### **Node Package Manager**

Node が人気の高い最大の理由のひとつは [Node Package Mananger](https://www.npmjs.com/) (NPM)です。NPM はデベロッパーがオープンソースコミュニティからリリースされた優れた全てのライブラリを簡単に管理できるようにします。デベロッパーは単に `npm install lodash` のようなコマンドをタイプし、Node Package Manager は lodash の最新版に移動して特殊な `node_modules`ディレクトリにダウンロードし、デベロッパーはコードでそれを要求とすることで lodash ライブラリにアクセスすることができます。

NPM は当時画期的なものでした。また、今日でもパッケージマネージャーとしては相変わらず最も秀逸なもののひとつです。これは最初のパッケージマネージャーではありませんでした。 [NuGet](https://www.nuget.org/) は .Net プラットフォーム用、 [pip](https://pypi.python.org/pypi/pip) は Python 用、 [gems](https://rubygems.org/) は Ruby 用などですが、NPM のシンプルさが Node の成功で大きな役割を果たしました。

### **エコシステム**

Node Js は Web アプリケーションの構築に限られたものではありません。例えば、 [Electron](http://electron.atom.io/) では、Node でネイティブデスクトップアプリケーションの構築が可能で、 [こちら](https://auth0.com/blog/create-a-desktop-app-with-angular-2-and-electron/)から構築方法のチュートリアルをご覧いただけます。ユーティリティやビルドシステムは Node Js で構築する際の非常に人気の高い候補で、 [Bower](https://bower.io/) は Node で構築する際の人気の高いフロントエンドパッケージマネージャーです。一方、 [Gulp](http://gulpjs.com/)、 [Grunt](http://gruntjs.com/)、および [WebPack](https://webpack.github.io/) はワークフローを改善し、デベロッパーの効率を高めることができる Node で構築する際のタスクランナーやビルドシステムです。

フットプリントが小さく、Node Js アプリケーションを実行するためのリソース要件が低いため、Node Js は [Web タスク](https://webtask.io/)、 [AWS Lambda](https://aws.amazon.com/lambda/)、および [Google Cloud Function](https://cloud.google.com/functions/docs/) （ほぼ例外なく Node Js をサポートする）のようなプラットフォームでコンピューティングするサーバーレスでその責任を先導しています。

## Node Js は誰が使用するか？

この質問は昔から議論されており、おそらく最も答えにくい質問と言えます。その答えはケースバイケースだからです。責任逃れの回答だと思われるかもしれませんが、本当にケースバイケースなのです。ここ Auth0 では Node Js が広く使用されており、その価値がスケールに役立っていることは証明されています。当社全体でどのようにさまざまなテクノロジーを使用するかについての詳細は、 [第一線のストーリー](https://auth0.engineering/)をチェックしてください。

Node Js は多くのケースで使用されていますが、あまり良くないケースもあります。資産または Web ページの提供など多くの計算を必要としない高 I/O が必要であれば、Node にご満足いただけるでしょう。パスワードのハッシュまたはシミュレーション実行など複雑な操作をする場合、Node Js の性能が低くなる可能性があります。使用ケースをよく調査し、その仕事にあった正しいツールを使用してください。

{% include tweet_quote.html quote_text="Node Js の使用ケースで優れているものはたくさんありますが、あらゆるものの特効薬ではありません。" %}

## Node Js でアプリケーションを構築する

![Node Js App - Awesome Polls](https://cdn.auth0.com/blog/nodejs-awesome-polls/polls.png)

これまで Node Js の詳細について学びましたので、コーディングやアプリケーションを構築する用意ができました。今回構築するアプリケーションは Awesome Polls と呼ばれるものです。合衆国では大統領選挙が行われたばかりですが、今回その結果の分析に役立つアプリを構築します。視聴者に正確なレポートを提供できるように最新の情報が欲しいと願っている報道機関のためにこのアプリを構築することについて想像してみてください。

このチュートリアルでは、ユーザーは少なくてもある程度の JavaScript と一般的なプログラミングの知識は必要ですが、 Node Js の経験はないと想定していますので、詳細な手順で説明していきます。一緒に理解していく場合は、完成したコードを [GitHub レポジトリ](file:///h)からチェックできます。

### **Node Js および NPM をインストールする**

Node Js をインストールするには、公式サイトの [https://nodejs.org](https://nodejs.org/)に移動すると利用中のオペレーティングシステムに対応した大きな緑色のダウンロードボタンが表示されます。今回のチュートリアルの例では、Node の 6.x LTS バージョンを実行します。実行ファイルをダウンロードし、それを実行し、Node Js をシステムにインストールするステップに従います。

Mac にインストールするのであれば、 [Homebrew](http://brew.sh/) からでも Node Js および NPM をインストールできます。端末から `homebrew install node` を実行すると、数秒で Node および NPM がインストールされます。

NPM および Node の両方がインストールされていることを確認します。手動で、または Homebrew を通してのどちらかで、インストールのステップを実行したら、そのインストールが成功したことを確認します。そのためには、端末のウィンドウを閉じ、再度開いて`node -v`コマンドを実行します。このコマンドは Node のどのバージョンがインストールされたことを知らせてくれます。次に `npm -v` を実行し、同様にして Node Package Manager のバージョンがシステムにインストールされたことが表示されます。

![Verify Node Js Installation](https://cdn.auth0.com/blog/nodejs-awesome-polls/test.png)

_注：Node.js には 2 つのバージョンがあります。6.x は安定/長期サポートバージョンで、 __8__.x は最先端のバージョンで、最新の ES6 機能の一部をサポートします。両方のバージョンは稼働準備済みで、このチュートリアルでは Node の 6.x バージョンを使用します。_

### **Node Js プロジェクト設定**

Node および NPM がインストールされましたので、次のステップに進む用意ができました。私個人にとって Node アプリケーションの最も良いことのひとつは、ファイルシステムのどこででもアプリケーションをライブにする機能です。各 Node アプリケーションは内蔵されていますので、プロジェクトを設定するには、 `awesome-polls` と呼ばれるディレクトリをデスクトップ上に作成し、このディレクトリ内にアプリケーション全体を置きます。

このプロジェクトに追加する最初のファイルは `package.json` ファイルです。このファイルはすべての依存関係を追跡するだけでなく、アプリケーションについての有用な情報を提供します。このファイルを手動で作成するか、あるいはコマンド `npm init` を実行してステップバイステップのプロセスに従うかのどちらか一方を実行します。まず、端末の `awesome-polls` ディレクトリに移動します。そうしなければ、`package.json` ファイルは他の場所に作成されます。
これで、`package.json` ファイルが作成されましたので、依存関係の追加と保存ができます。これをするには複数の方法があります。例えば、依存関係を手動で `package.json` ファイルに書き込みできますが、お勧めの方法は `npm install` コマンドを実際に実行する際に`--save` フラグを渡す方法です。この方法で依存関係は `package.json` ファイルに自動的に追加されます。

この方法をよく見てみましょう。アプリケーションの構築には、Express JavaScript Web フレームワークを使用します。現時点では、Express はマシンにインストールされていません。このためには、単に `npm install express --save` を実行します。わずか数秒で、Express はダウンロードされ、`node_modules` と呼ばれるファイルシステムの新規ディレクトリに保存されます。このディレクトリは `awesome-polls` ディレクトリにあり、ローカル依存関係です。また、`-g` フラグを通してグローバル依存関係をインストールできますが、インストールするライブラリの多数にはこれをしない方がいいかもしれません。Webpack のようなユーティリティはグローバルにインストールします。

また、複数の依存関係を一度にインストールすることも可能です。残りの依存関係をインストールしましょう。以下を書きます。

```sh
npm install body-parser connect-ensure-login cookie-parser debug dotenv express-session jade morgan passport passport-auth0 --save
```

これらは、アプリケーションを書くために使用するサードパーティのオープンソースライブラリの全てです。現時点でこれらが何を意味し、何をするかについて理解していなくても、これから説明していきますので大丈夫です。このセクションを終了するにあたり、`package.json` ファイルを見てみると、`dependencies` と呼ばれる新規セクションに追加されたライブラリが表示されます。

### **Node Js ディレクトリ構造**

Node Js および Express Js はディレクトリ構造に関して言えば、両方ともかなり柔軟性が高いです。自分で定義が自由にでき、抽象化レイヤーが多すぎたり少なすぎたりしてもペナルティが与えられることはありません。その日の終わりには、コードはコンパイルされ、コード構造はフラット化されるので、自分に合った方法をご自由に見つけてください。これはアプリケーションのサイズやスコープにもかなり依存します。このデモアプリはかなり小さいので、その構造は以下のようになります。

```
.env - // グローバル環境変数をここに保存します

package.json - // アプリの外部依存関係をここに定義します

app.js - // このファイルはアプリケーションのエントリポイントです

|- node\_modules - // 自動的に生成され、npm は外部依存関係をこちらに保存します

|- public

  |- stylesheets

    |- style.css - // グローバルスタイルをこちらに保存します

|- routes

  |- index.js - // このファイルでは、アプリケーションのルートを定義します

|- views - // UI ビューの全てをこちらに置きます

  |- error.jade - // エラーのビュー

  |- index.jade - // メインホームページのビュー

  ```

このディレクトリ構造はかなりシンプルです。このアプリを MVC スタイルファッションで構築していきます。この `views` ディレクトリは全てのフロントエンドビューを保留し、`routes` ディレクトリは従来のコントローラロジックを処理します。このシンプルなアプリケーションにはモデルがありません。もう一度言いますが、現時点ではこれらのファイルが意味をなさなくても大丈夫です。その詳細については後ほど、説明していきます。

![Node Js Directory Structure](https://cdn.auth0.com/blog/nodejs-awesome-polls/setup.png)

### **Awesome Polls を構築する**

では、Node Js コードを書きましょう。最初にアプリケーションに実装する機能はメインエントリポイントです。`App.js`
ファイルを開くか、あるいは用意ができていなければそのファイルを作成します。 現時点では、以下を追加しましょう。

```js
// npm を通して依存関係をダウンロードする方法を学びました。これらの依存関係をコードで使うには、これらが必要です。ライブラリを要求する構文はキーワード保護で、そのライブラリの名前の文字列です。この require 関数をある変数に割り当てると、その変数を通してライブラリからメソッドにアクセスできます。ここでは良い練習として、ページ上部で全ての依存関係を要求しています。

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');

// dotenv ライブラリを使って .env ファイルから環境変数をロードします。現時点では、 .env ファイルには何もありませんが、後で入れていきます。
dotenv.load();

// 丁度、外部ライブラリのように、require 関数を使ってアプリケーションコードをインポートできます。大きな違いは、特定のパスをファイルに指定しなければならないことです。ディレクトリ構造のセクションで、ルートディレクトリに index.js ファイルが作られることを知りました。ファイルを作っていないのであれば、ここで作成します。ファイルを作成しなければ、コードをコンパイルするときにエラーが生じます。
var app = express();

// このコード行は Express JS フレームワークをインスタンス化します。アプリと呼ばれる変数にそれを割り当て、後でコンフィギュレーションをこの変数に追加します。
var app = express();

// .set メソッドは Express フレームワークでさまざまなオプションを構成することができます。ここでは、ビューディレクトリを設定するだけでなく、テンプレートエンジンは Jade であることを Express に伝えます。詳細は後で説明します。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// .use メソッドは .set メソッドと似ており、追加のコンフィグレーションが可能です。.use メソッドも、ある要求が Node Js アプリケーションにヒットすると一連のイベントとして作動します。まず、要求データをログし、着信データを分析します。
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));


// 404 をキャッチし エラーハンドラーに転送します。
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// アプリケーションにエラーが発生した場合は、そのエラーが表示され、それぞれに応じてスタックトレースが出力されます。
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
});

// 最後に、アプリがポート 3000 でリッスンするように選択します。これで、アプリが起動すると、localhost:3000 に移動でき、アプリのアクションを見ることができます。自由に必要なポートを選択できるので、8080、80、あるいはどんな番号でも大丈夫です。一般的に 3000 が使用される理由は Mac/Linux システムの特権を昇格しないで使用できるポートの最小番号だからです。
app.listen(3000);
```

ここまでのアプリをテストしてみましょう。アプリを実行するには、単にコマンド `node app` を端末で実行するだけです。次に、Web ブラウザの `locahost:3000` に移動します。全てが想定通りにいったら、404 （ページが見つかりません）が表示されるはずです。これは、アプリケーションにルートを追加しなかったので、想定通りですが、「ページが見つかりません」 のエラーハンドラーを追加しました。次に、ルートを追加しましょう。

### **Express Js ルーティング**

ディレクトリ構造のステップに従うと、タイトルが `routes` というディレクトリ内に `index.js` ファイルが作成されます。まだ作成していないのであれば、このファイルを作成し、アプリケーションのルートを定義します。これを遂行するには、以下の内容を記述します。

```js
// 再度、使用するライブラリをインポートします。
var express = require('express');
var router = express.Router();

// ルータ変数上に、さまざまなメソッドを含めることができるようになります。このアプリでは GET リクエストだけを使用しますので、メソッド router.get はそのインタラクションだけを処理します。このメソッドは１つめのパラメータとして文字列を指定し、それは URL パスなので１つめのルートには '/' だけを指定し、既定のルートとします。次に、3 つのパラメータを使用する Node Js コールバック関数を定義します。このパラメーターにはリクエスト (req)、レスポンス (res)、およびオプションの next (next) パラメーターがあります。最後に、コールバック関数で、「ホームページが表示されました」 というメッセージを送信します。
router.get('/', function(req, res, next) {
  res.send('You are on the homepage');
});

// 残りのルータでも同じことをします。
router.get('/login',function(req, res){
  res.send('You are on the login page');
});

router.get('/logout', function(req, res){
  res.send('You are on the logout page');
});

router.get('/polls', function(req, res){
  res.send('You are on the polls page');
})

router.get('/user', function(req, res, next) {
  res.send('You are on the user page');
});



// 最後に、このモジュールをエクスポートしてそれを app.js ファイルにインポートし、定義したルートにアクセスできるようにします。

module.exports = router;
```

次に進む前に、 Express でのルーティングについて簡単に説明します。ルートを定義するとき、ルートを /user ルートとしコールバック関数を渡すと、ブラウザが localhost:3000/user にポイントした際に指定したコールバック関数を呼び出すように Express に伝えます。

Req パラメータには IP アドレス、ルートで渡したパラメータ、Express ミドルウェアを通してアタッチするアイテムなどリクエストの全ての詳細があります。

Res パラメータはサーバからブラウザにレスポンスをハンドルします。ここでは、ビュー、エラー、JSON データなどを返すことができます。最後に、オプションで next パラメータを追加できます。

Next を呼び出して現在の関数を終了し、ミドルウェアスタックに移動します。リクエストは関数のスタックを通して Express Js で処理されます。各関数の終わりには、next を呼び出してスタックの next 関数に移動するか、あるいは res を呼び出してブラウザにレスポンスを送信するかのどちらかを実行します。適切な res メソッドが呼び出されたら、そのリクエストの実行は停止します。ミドルウェアはコードを論理構成に分離する素晴らしい方法です。例えば、ミドルウェアはリクエストを変換したり、あるいはユーザーが続行する前にログインしているかをチェックしたりします。次のセクションでは、その方法を学んでいきます。

では、ルータに戻りましょう。ルータを定義しましたが、アプリケーションを実行して、例えば localhost:3000/login にアクセスしようとすると404 エラーがまだ表示されます。このルータをアプリにリンクしていなかったからです。次はこれを実行しましょう。App.js ファイルを開き、以下の変更を行います。


```js
// 既存のコードにコメントアウトしましたので、新規コードをどこに追加すればいいかが分かります。

//ファイルにはコメントアウトしないでください。

// var express = require('express');
// var path = require('path');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var session = require('express-session');
// var dotenv = require('dotenv');

// dotenv.load();

// 丁度、外部ライブラリのように、require 関数を使ってアプリケーションコードをインポートできます。大きな違いは、特定のパスをファイルに指定しなければならないことです。ディレクトリ構造のセクションで、ルートディレクトリに index.js ファイルが作られることを知りました。ファイルを作っていないのであれば、ここで作成します。ファイルを作成しなければ、コードをコンパイルするときにエラーが生じます。

var routes = require('./routes/index');

// var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(session({
//  secret: 'shhhhhhhhh',
//  resave: true,
//  saveUninitialized: true
// }));
// app.use(express.static(path.join(__dirname, 'public')));

// ここでは、USE ステートメントに 「このルートの追加」 を使用します。これを使用することで、定義したルートとアプリをリンクします。
app.use('/', routes);

// app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
// });

// app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: err
//  });
// });

// app.listen(3000);
```

この変更を保存した後、Node サーバーを再起動し、`localhost:3000/users` に移動します。ここで、「You are on the users page」 が表示されます。`Localhost:3000/yo` のように定義されていないルートに行くと、想定されたように 404 ページが表示されます。ここまでは、大丈夫ですね。ルートが正しく機能しているので、次は UI ビューを構築しましょう。

### **UI を構築する**

次はビューを構築しましょう。Node Js および Express は拡張性が非常に高く、アプリケーションのテンプレートエンジンを選択するとたくさんのオプションがあります。このチュートリアルでは、 [Jade](https://pugjs.org/api/getting-started.html)（名前を Pug に変更したばかり）を使用します。Jade はおそらく、最も古いビューエンジンですが、 [EJS](http://www.embeddedjs.com/)、 [Mustache](https://mustache.github.io/)、 [Dust](http://www.dustjs.com/) などのその他のオプションもあります。ビューエンジンは Jade を使うことを `app.js` ファイルですでに公表しており、このビューはビューと名付けられたディレクトリに保存されています。このチュートリアルでは、Jade/Pug 構文の詳細を述べることはしませんので、これらにあまり慣れていないのであれば、 [公式チュートリアル](https://pugjs.org/language/tags.html)をチェックしてください。

これから一意のビューを 5 つ構築します。Jade/Pug は 1 つのレイアウトを拡張してその上に構築することができるので、このシンプルなアプリケーションで行っていきます。`layout.jade` という名前のファイルを作りましょう。このビューがこのレイアウトを拡張し、その一意のプロパティの上に追加します。このファイルのコンテンツは以下の通りです。

```jade
doctype html
html
  head
    meta(charset="utf-8")
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    link(href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css", rel="stylesheet")
    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
    script(src="https://cdn.auth0.com/js/lock/10.3/lock.min.js")
  body
    block content
    ```

次に、ホームページを構築しましょう。このホームページにはアプリの名前だけが表示され、ユーザーにはログインするリンクが表示されます。`index.jade` という名前のファイルを作り、次に貼り付けます。

```jade
extends layout

block content  
  h1
    i.fa.fa-lg.fa-pie-chart
    span Awesome Polls
  h2 Welcome to the Awesome Polls Administrator website.
  p To access the polls, please login.
  br
  a(href="/login")
    button() Login
    ```

![Awesome Polls Homepage](https://cdn.auth0.com/blog/nodejs-awesome-polls/main.png)

次のページでは、ユーザーの詳細ページを構築しましょう。ここに、ログインユーザーの情報が表示されます。`user.jade` ファイルを作り、以下の通りに実装します。

```jade
extends layout

block content
  img(src="#{user.picture}")
  h2 Welcome #{user.nickname}!
  br
  a(href='/logout') Logout
```

![Awesome Polls User Details Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/user.png)

ユーザーページの作成が終わったら、次に投票ページを構築しましょう。`polls.jade` という名前のファイルを作ります。

```jade
extends layout

block content  
  div.clearfix
    div.pull-left
      i.fa.fa-lg.fa-pie-chart
      span Awesome Polls
    div.pull-right
      img(src="#{user.picture}", style="height:24px; border-radius: 30px;")  
      strong(style="margin: 0px 10px;") #{user.nickname}
      a(href="/logout") Logout
  br
  div.jumbotron
    h1.text-center 2016 Presidential Election
  each poll, index in polls
    if (poll.estimates.length > 0)
      div.col-sm-4
        div(class="panel panel-default", style="min-height: 150px;")
          div.panel-title
            div.panel-heading=poll.short_title
          div(class="panel-body", style="min-height: 100px;")
            ul.list-unstyled
              each person, index in poll.estimates
                li
                  if index == 0
                    p
                      strong #{person.choice}
                    div.progress
                      div(class="progress-bar progress-bar-success", style="width: #{person.value}%", role="progressbar")
                        span=person.value
                  else
                    p
                      span #{person.choice}
                    div.progress
                      div(class="progress-bar progress-bar-info", style="width: #{person.value}%", role="progressbar")
                        span=person.value
          div.panel-footer
            a.btn.btn-sm View Results  
            a.btn.btn-sm.write-report Write Report
```

![Awesome Polls Details Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/polls.png)

次に、エラーページをきれいにしましょう。`error.jade` という名前のファイルを作り、次のコードを貼り付けます。

```jade
extends layout

block content
  h1= message
  h2= error.status
  pre #{error.stack}
```

![Awesome Polls Error Page](https://cdn.auth0.com/blog/nodejs-awesome-polls/pretty-error.png)

最後に、`login.jade` という名前のファイルを作成してログインページのスタブを作りますが、現時点では空白のままにします。

### **ビューとコントローラーを紐づける**

最後に、これでビューとコントローラーの機能とを紐づける用意ができました。このコントローラーは `routes/index.js` ファイルに保存されています。そのファイルを開き、次のように調整をします。

```js
var express = require('express');
var passport = require('passport');
var router = express.Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');

// サーバと UI の間でデータを共有するので、そのデータを env 変数に渡すことができるかを確認します。
var env = {
};

router.get('/', function(req, res, next) {

  // ここで、「ホームページが表示されました」 というテキストを送信する代わりに、res.render メソッドを使って作成したビューを実際にレンダーします。2 つめの引数は、データをバックエンドからビューに動的に渡します。

  res.render('index', { env: env });
});

router.get('/login',function(req, res){
  // Same thing for the login page.
  res.render('login', { env: env });
});

router.get('/logout', function(req, res){

  // ログアウトページでは、ページをレンダーする必要はありませんが、ユーザーがこのページにヒットしたときにログアウトさせる必要があります。ログアウトメソッドで構築した ExpressJS を使い、ユーザーをリダイレクトしてホームページに戻します。

  req.logout();
  res.redirect('/');
});

router.get('/polls', ensureLoggedIn, function(req, res){

  // お気づきかもしれませんが、2 つの新規リクエストファイルを含んでおり、そのひとつはリクエストを受けたものです。リクエストは HTTP リクエストをするのが簡単です。この場合では、最新の選挙結果を引き出すために 『Huffington Post』 の API を使用し、そのデータをこの投票ビューに送信します。

  // 2 つめのリクエストは connect-ensure-loggedin ライブラリで、ここからは ensureLoggedIn と呼ばれるメソッドを必要とします。このメソッドは現在のユーザーがページをレンダリングする前にログインしているかをチェックします。ユーザーがログインしていなければ、ログインページにリダイレクトします。これをミドルウェアパターンで行いますが、まず、ensureLoggedIn メソッドを呼び出し、そのアクションの結果を待ち、最後に /polls コントローラーを実行します。

  request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var polls = JSON.parse(body);

      // このビューでは、環境情報だけではなく、投票やユーザー情報も送信します。

      res.render('polls', {env: env, user: req.user, polls: polls});
    } else {
      res.render('error');
    }
  })
})

router.get('/user', ensureLoggedIn, function(req, res, next) {
   // ユーザーページでも同様です。
  res.render('user', { env: env, user: req.user });
});

module.exports = router;
```

これで、コントローラーの実装が完了しました。このセクションではたくさんのことを実行しました。データをサーバーとフロントエンド間で送信する方法や、非常に良好な Node Js リクエストライブラリを使って外部 API を呼び出す方法、ルータをセキュアにして未承認のアクセスを防ぐ方法などについて学びました。ユーザー認証システムはまだ構築していませんが、これから学んでいきます。

このセクションを終える前に、`app.js` ファイルに 1 つ簡単な変更を加えます。この `app.js` ファイルでは、エラー ハンドラーを構築しました。最後のセクションでは、エラーのきれいなビューを作りましたので、そのビューを使うようにしましょう。

```js
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.send(err)
  res.render('error', {
    message: err.message,
    error: err
  });
});
```

## 備考：Node.js アプリケーションを Auth0 でセキュアする

Node.js アプリケーションを Auth0 でセキュアにすることは簡単です。また、たくさんの素晴らしい機能を提供します。 [Auth0](https://auth0.com/) を使うと数行のコード行を書くだけで、強固な [ID 管理ソリューション](https://auth0.com/user-management)、 [シングル サインオン](https://auth0.com/docs/sso/single-sign-on)、 [ソーシャル ID プロバイダー（Facebook、GitHub、Twitter など）](https://auth0.com/docs/identityproviders)のサポート、および [エンタープライズ ID プロバイダー（Active Directory、LDAP、SAML、カスタムなど）](https://auth0.com/enterprise)のサポートすることができます。

以下のセクションでは、 [Express](https://expressjs.com/) で書かれた Node.js API をセキュアにする Auth0 を使用する方法を学んでいきます。

### **Express API を作る**

Node.js API を定義することから始めましょう。Express および Node.js を使って、2 つのシンプルなステップでこれが可能になります。1 つめのステップでは [NPM](https://www.npmjs.com/) を使って 3 つの依存関係`npm i express body-parser cors`をインストールします。2 つめのステップでは次のコードで Node.js スクリプトを作ります。

```javascript
// 依存関係をインポートする
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express を構成する
const app = express();
app.use(bodyParser.json());
app.use(cors());

// 操作する連絡先配列とエンドポイントを定義する

    { name: 'Bruno Krebs', phone: '+555133334444' },
    { name: 'John Doe', phone: '+191843243223' }
];
app.get('/contacts', (req, res) => res.send(contacts));
app.post('/contacts', (req, res) => {
    contacts.push(req.body);
    res.send();
});

// Express 起動
app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

上記のコードは Express アプリケーションを作成し、次の 2 つのミドルウェアを追加します。JSON リクエストを分析する`body-parser`、およびアプリがいずれの送信元からリクエストを受け入れるというシグナルを出す`cors`。アプリは 2 つのエンドポイントを Express に登録し、POST および GET リクエストを処理します。両方のエンドポイントはある種のインメモリデータベースとして `contacts` 配列を使います。

`node index` をプロジェクトルートに発行することでアプリケーションを実行し、サブミットしたリクエストをテストすることができます。例えば、 [cURL](https://curl.haxx.se/) で `curl localhost:3000/contacts` を発行して GET リクエストを送信できます。このコマンドはアイテムを `contacts` 配列に出力します。

### **API を Auth0 で登録する**

アプリケーションを作成後に、セキュアにすることを注力することができます。このアプリを表す API を Auth0 に登録することから始めましょう。これをするには、 [管理ダッシュボードの API セクション](https://manage.auth0.com/#/apis)（必要であれば（ [無料アカウント](https://auth0.com/signup)を作ることができます）に移動し、「Create API」をクリックします。表示されたダイアログ上で、この API を 「Contacts API」 と定義し（名前はあまり重要ではありません）、`https://contacts.mycompany.com/` （後ほど、この値を使用します）としてそれを識別します。

作成後に、API の「Scopes」タブに移動し、必要なスコープを定義します。このサンプルでは、`read:contacts` および `add:contacts` の２つのスコープを定義します。これらは、同一エンティティ（Contacts）上で2つの異なる操作（読み取りおよび追加）を表します。

![Defining OAuth scopes in the new Auth0 API](https://cdn.auth0.com/blog/spring-boot-aside/defining-oauth-scopes.png)

### **Express を Auth0 でセキュアする**

API を Auth0 アカウントに登録したので、次にExpress API を Auth0 でセキュアしましょう。3 つの依存関係を次のNPMコマンドでインストールしましょう。`npm i express-jwt jwks-rsa express-jwt-authz`  続いて`auth0.js` と呼ばれるファイルを作り、これらの依存関係を使用しましょう。

```javascript
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

const tokenGuard = jwt({

  // ヘッダーの KID をベースにして、署名するキーおよび

  // JWKS エンドポイントによって提供された署名するキーをフェッチします。

   secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // 対象ユーザーと発行元を検証します。

  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = function (scopes) {
  const scopesGuard = jwtAuthz(scopes || []);
  return function mid(req, res, next) {
    tokenGuard(req, res, (err) => {
      err ? res.status(500).send(err) : scopesGuard(req, res, next);
    });
  }
};
```

このスクリプトの目標は、リクエストが信頼に値するパーティ、今回は Auth0 が発行した `access_token`があることを保証する [Express ミドルウェア](http://expressjs.com/en/guide/using-middleware.html) をエクスポートすることです。ミドルウェアはスコープの配列も受け入れます。リクエストをフィルター処理するとき、このミドルウェアはこれらのスコープが `access_token` に存在することをチェックします。このスクリプトは次の 2 つの環境変数を検索することが予測されます。

- `AUTH0_AUDIENCE`： API の識別子（`https://contacts.mycompany.com/`）
- `AUTH0_DOMAIN`： Auth0 でのドメイン（この場合 `bk-samples.auth0.com`）

これらの変数は後ほど設定しますが、ドメイン変数がミドルウェアがどのようにして署名するキーを検索するかを定義することを理解することが重要です。

このミドルウェアを作成した後で、`index.js` ファイルを更新してインポートし、以下のように使用します。

```javascript
// ... その他の要件

const auth0 = require('./auth0');

app.get('/contacts', auth0(['read:contacts']), (req, res) => res.send(contacts));
app.post('/contacts', auth0(['add:contacts']), (req, res) => {
  contacts.push(req.body);
  res.send();
});
```

ここでは前のエンドポイントの定義を、新規ミドルウエアを使用するために置き換えました。またそれらのアクセスは、スコープの正しい組み合わせを含むユーザーに制限しました。つまり、連絡先を得るにはユーザーは `read:contacts` スコープがあり、新規記録を作るにはユーザーは`add:contacts` スコープがなければなりません。

アプリケーションの実行は、以下のような環境変数を設定する必要があるので多少異なります。

```
export AUTH0_DOMAIN=bk-samples.auth0.com

export AUTH0_AUDIENCE='https://contacts.mycompany.com/';

node index
```

次に進む前に、この API を実行できるようにしましょう。

### **Auth0 クライアントを作成する**

このセクションの焦点は Node.js アプリケーションを Auth0 でセキュアすることなので、 [構成可能な Auth0 クライアントがある](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&amp;domain=bk-samples.auth0.com&amp;audience=https:%2F%2Fcontacts.mycompany.com%2F&amp;scope=read:contacts) [実際に動く](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&amp;domain=bk-samples.auth0.com&amp;audience=https:%2F%2Fcontacts.mycompany.com%2F&amp;scope=read:contacts) [の Angular アプリを使用します](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&amp;domain=bk-samples.auth0.com&amp;audience=https:%2F%2Fcontacts.mycompany.com%2F&amp;scope=read:contacts)。このアプリを使用する前に、それを務める Auth0 クライアントを作る必要があります。 [管理ダッシュボードの「](https://manage.auth0.com/#/clients) [Clients](https://manage.auth0.com/#/clients) [」セクション](file:///h) に移動し、「CREATE CLIENT」ボタンをクリックしてこのクライアントを作成します。

表示のポップアップ上で、この新規クライアントを「Contacts Client」と名付け、クライアントタイプとして「Single Page Web App」を選択しましょう。「CREATE」ボタンを押してから、このクライアントの「Settings」に移動し、「Allowed Callback URLs」フィールドに `http://auth0.digituz.com.br/callback` を設定します。

これでこのクライアントが保存できましたので、 [サンプル Angular アプリを Auth0 でセキュアする](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&amp;domain=bk-samples.auth0.com&amp;audience=https:%2F%2Fcontacts.mycompany.com%2F&amp;scope=read:contacts) に移動します。このアプリを使用するには、次の 4 つのプロパティの正しい値を設定しなければなりません。

- `clientID`：「Contacts Client」の「Settings」タブの「Client ID」フィールドからこの値を貼り付けます。
- `domain`：「Contacts Client」の「Settings」タブからこの値を貼り付けます。
- `audience`：このプロパティは以前作成した「Contacts API」の識別子を満たすように設定します。
- `scope`：このプロパティは `access_token` がバックエンド API にアクセスする authority を定義ます。例えば：`read:contacts` または `read:contacts add:contacts` の両方。

それから、「SIGN IN WITH AUTH0」ボタンを押します。

![Using the Angular app with the configurable Auth0 Client](https://cdn.auth0.com/blog/angular-generic-client/signing-in.png)

サインインした後、このアプリケーションを使ってセキュアした Node.js API にリクエストを送信します。例えば、 GET リクエストを `http://localhost:3000/contacts/` に発行するのであれば、Angular アプリは `Authorization` ヘッダーに `access_token` を含み、この API は連絡先のリストを返信します。

![Getting a response from a secure Spring API](https://cdn.auth0.com/blog/node-aside/client-app-issuing-request.png)

## まとめ

Node Js はモダン アプリケーションを構築する際の強力な言語でありフレームワークです。NPM を介したコミュニティ サポートは非常に素晴らしく、Auth0 は一般的なユーザー名/パスワード認証だけでなく、 [多要素認証](https://auth0.com/docs/multifactor-authentication)、 [異常検出](https://auth0.com/docs/anomaly-detection)、 [エンタープライズ フェデレーション](https://auth0.com/docs/identityproviders)、 [シングル サインオン（SSO）](https://auth0.com/docs/sso)などたくさんの認証認可に関する強化機能で、 Node Js アプリのセキュリティ向上に役立ちます。今すぐ [サインアップ](https://auth0.com/signup)して、あなたのアプリに固有の機能を構築することに集中しませんか。

{% include tweet_quote.html quote_text="Auth0 を使うと、数分で Node Js アプリに認証を追加できます。" %}

