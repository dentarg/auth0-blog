---
layout: post
title: "Vuejs 2 認証チュートリアル"
description: Vuejs 2 でアプリを素早く構築する方法や認証を正しく追加する方法について学びます。
date: 2017-04-18 8:30
category: Technical Guide, Frontend, VueJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#35495E"
  image: https://cdn2.auth0.com/blog/vuejs/logo.png
tags:
- vuejs
- javascript
- authentication
- web-app
- auth0
related:
- 2016-01-04-secure-your-react-and-redux-app-with-jwt-authentication
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
lang: jp
alternate_locale_en: 2017-04-18-vuejs2-authentication-tutorial
---

**TL; DR：** Vuejs はウェブ上のユーザーインタフェイスを構築するためのプログレッシブな JavaScript フレームワークです。ReactJS の後に追って発売され、時間と共に開発者が自分の日常業務に取り入れ始めました。実際、Vuejs 2.0 の発売に伴い、その採用と利用は世界的に急増しました。現在、Vuejs は [Github](https://github.com/vuejs/vue)で 49,000 個以上のスターがつけられています。本チュートリアルでは、Vuejs 2 を使って Web アプリケーションを構築する方法やそれに認証を追加する方法について説明します。コードを取得するには、 [レポジトリ](https://github.com/auth0-blog/vuejs2-authentication-tutorial)をチェックしてください。

---

[**Vuejs**](https://vuejs.org/)は元 Google ソフトウェア技術者、 [エバン・ユー](https://twitter.com/youyuxi)によって開発されました。彼は Vuejs 2.0 が発売される直前から常勤で働き始め、Vue.js 2 は大幅な負荷軽減、小型、高速になりました。現在、多くの人気製品がユーザーインタフェイスの構築で **Vuejs** を使用しています。そうのようなプラットフォームには _Laravel Spark_、_Grammarly_、_Statamic_、_Laracasts_ などたくさんあります。 [Github上にはVuejs を使用するプロジェクト](https://github.com/vuejs/awesome-vue#projects-using-vuejs)のリストがあります。Vuejs 2 の [ドキュメント](https://vuejs.org/v2/guide/)は非常に詳細に書かれており、活気のあるユーザーコミュニティがあります。

## _Vuejs 2、Angular 2 および React_

Vuejs は開発の初期段階で AngularJS の発想で作られたものなので、その構文は `v-show`、`v-if` および `v-for` など AngularJS に非常によく似ています。Angular 2 は API 設計や言語の基礎、多数のアドオンの面ではまったく新しいフレームワークとして登場したため、当初はたくさんの開発者の間で問題になりました。Vuejs 2 は、完全にリライトされましたがAPI は Vuejs 1.0 との互換性が高くなったため、デベロッパーは Vuejs 1.0 から 2.0 への移行がとても簡単になりました。

Vuejs 2.0 は次の主要な変更内容がバンドルされいます。

- レンダリングレイヤーは軽量の仮想 DOM 実装である、 [Snabbom](https://github.com/paldepind/snabbdom)をベースにしています。
- 最初のレンダリング後に絶対に差分を取ることがないように静的なクラス名と属性を検出します。
- 動的バインディングなしのサブツリーを検出し、render 関数からそれらを巻き上げます。このため、それぞれにおける再レンダリングは差分検出をスキップします。
- クライアントサイド hydration によるサーバサイドレンダリングをサポートします。React や Angular 2 もサーバサイドレンダリングを提供します。
- JSX のサポート。テンプレート構文は使用できますが、テンプレートの使用によって制約されていると感じるときはいつでも 仮想 DOM レイヤーにドロップダウンできます。
- テンプレートから仮想 DOM にするコンパイラとランタイムは分離することができるので、テンプレートをプリコンパイルしたり、ランタイムだけによるアプリケーションを提供できます。 ランタイムは12キロバイト未満です。

AngularJS(_Angular 1_) はスコープ間で両方向バインディングを使用しますが、Vue はコンポーネント間の一方向データフローを強化します。

Vuejs 2 および Angular 2 は両方ともコンポーネントベースのシステムなため似ています。

React および Vue.js にも多くの類似点があります。類似点は以下の通りです：

- 仮想 DOM を使用する。
- コンポーザブルな View のコンポーネントを提供する。
- コアライブラリと、ステート、ルーティング、ネットワークのリクエストなどを処理するライブラリがある。

**注：** jQuery の世界から来たり、Vuejs が初めての方は、 [こちら](https://medium.freecodecamp.com/vue-js-introduction-for-people-who-know-just-enough-jquery-to-get-by-eab5aa193d77)で最新情報をご覧ください。

### _パフォーマンス プロファイルを入力する_

Vue.js および React は仮想 DOM を利用していますが、Vue の仮想DOM の実装によってオーバーヘッドを伴うものが少ないため、UI のレンダリングが React で実装したものよりも速くなります。Vue.js チームが行ったパフォーマンス統計を見てみましょう。 [レポジトリはこちら](https://github.com/chrisvfritz/vue-render-performance-comparisons)をチェックしてください。

このベンチマークは、2014 MacBook Air の最高の状態で20回実行して得た結果です。

![Vuejs - React Metrics](https://cdn.auth0.com/blog/vuereact/metrics.png)
_Vue、React メトリック_

デフォルトではReact は状態が変化すると、コンポーネントのサブツリー全体を再度レンダリングします。不必要な再レンダリングを避けるためには、`shouldComponentUpdate`を手動で実行する必要があります。Vuejs ではそのレンダリング中にコンポーネントの依存関係を自動的に追跡するので、システムは再レンダリングが必要なコンポーネントを認識します。

この [ベンチマーク](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html)によると、Vue 2 のアプリサイズは Angular 2 のものよりも小さいです。

## _Vuejs 2 のキーコンセプトを理解する_

**Vuejs 2** は React および Angular 2 と類似する点がいくつかあります。キーコンセプトをいくつか知っておくと、作業の開始が簡単になります。 **Vuejs** をよくご理解いただくために、これらコンセプトの基本概念について説明します。基本概念は以下の通りです：

- **ディレクティブ**
- **コンポーネント**
- **テンプレート/JSX**

Vue インスタンスでメソッドを呼び出すか、コンポーネントの構成ルートに従って、_Vuejs 2_ の使用を開始します。

{% highlight html %}
{% raw %}
<div id="app">
  <p>{{ message }}</p>
</div>
{% endraw %}
{% endhighlight %}


```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, it is this easy!'
  }
})
```

ブラウザで上記のコードによって、_Hello, it is this easy!_ が表示されます。新しい Vue インスタンス内にあるデータオブジェクトのいかなるプロパティ値は DOM に簡単にレンダリングされます。中括弧は、Web ページ上にプロパティを表示するために使用します。

### _ディレクティブ_

Web ページ上のアイテムの表示を、次のように`v-if`、`v-show` などビルトイン・ディレクティブでトグルするのはとても簡単です。

{% highlight html %}
{% raw %}
  <div id="app">
    <p v-if="visible()">{{ message }}</p>
  </div>
{% endraw %}
{% endhighlight %}

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, it is this easy!'
  },
  methods: {
    visible: function() {
      return true;
    }
  }
});
```

何らかの理由で `visible` 関数が false を返したとき、パラグラフは Web ページ上に表示されません。繰り返しやループについてはどうでしょうか？以下のコードをチェックしてください。

{% highlight html %}
{% raw %}
  <div id="app">
    <ol>
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ol>
  </div>
{% endraw %}
{% endhighlight %}

```js
var app = new Vue({
  el: '#app',
  data: {
    items: [
      { name: 'Prosper Otemuyiwa' },
      { name: 'Goodness Kintakunte' },
      { name: 'Lynda' }
    ]
  }
});
```

ページ上では、シンプルに以下のように表示されます。

```bash
Prosper Otemuyiwa
Goodness Kintakunte
Lynda
```

### _コンポーネント_

Vuejs 2 もコンポーネントを利用します。これによって、内蔵されたより小型のコンポーネントで構成された大規模なアプリケーションを構築できます。

コンポーネントの例には `<header>` などの HTML5 タグがあります。ヘッダーには属性がある場合があり、スタイル付けしたり、独自の動作がある場合もあります。 **Vuejs 2** では、次のように登録することで、独自のカスタムコンポーネントを作成できます。

```js
Vue.component('app-nav', {
  template: "<li>This is the application's navbar</li>"
})
```

その後、次のように他のコンポーネントで使用できます。

{% highlight html %}
<div>
  <app-nav></app-nav>
</div>
{% endhighlight %}

ですから、コンポーネントは現時点では `<app-nav></app-nav>`. とします。

Vuejs 2 はコンポーネントを作成してコンポーネントが破棄されるまで、さまざまなポイントでトリガされる方法を提供します。これは **インスタンス ライフサイクル** 、または別名 **コンポーネンツ ライフサイクル** と呼ばれています。各 Vue インスタンスは作成されると、データ監視のセットアップ、テンプレートのコンパイル、インスタンスを DOM にマウント、データ変更のときに DOM のアップデートなど、一連の初期化ステップを実施します。ですから、これらのフックにカスタムロジックを実行できます。これらライフサイクルフックには `beforeCreate`、`created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`activated`、`deactivated`、`beforeDestroy` および `destroyed` があります。

![Vuejs 2 Lifeycycle hooks](https://vuejs.org/images/lifecycle.png)
_Vuejs 2 ライフサイクルフック_

- **beforeCreate()** ：このメソッドは データの監視とイベント/ウォッチャのセットアップより前の、Vue インスタンスが初期化された後、同期的に呼ばれます。
- **created()** ：このメソッドは Vue インスタンスが作成された後に同期的に呼ばれます。この段階では、データ監視、算出プロパティ、メソッド、イベントコールバックのセットアップ処理が完了したことを意味しますが、マウンティングの段階はまだ開始されていません。
- **beforeMount()** ：このメソッドはコンポーネントがマウンティングされる直前に呼ばれます。ですから、`render` メソッドが実行される前に呼び出します。
- **mounted()** ：このメソッドはコンポーネントがマウントされた直後に呼ばれます。
- **beforeUpdate()** ：このメソッドはデータが変更されるとき、仮想 DOM が再レンダリングとパッチが適用される前に呼ばれます。
- **updated()** ：このメソッドはデータが変更後、仮想 DOM が再レンダリングとパッチが適用されることによって呼ばれます。
- **activated()** ：このメソッドは生き続けたコンポーネントが活性化するとき呼ばれます。
- **deactivated()** ：このメソッドは生き続けたコンポーネントが非活性化されるとき呼ばれます。
- **beforeDestroy()** ：このメソッドは Vue インスタンスまたはコンポーネントが破棄された後に呼ばれます。この段階では、インスタンスはまだ完全に機能しています。
- **destroyed()** ：このメソッドは Vue インスタンスまたはコンポーネントが破棄された後に呼ばれます。このフックが呼ばれるとき、 Vue インスタンスの全てのディレクティブはバウンドしておらず、すべてのイベントリスナは削除され、全ての子の Vue インスタンスは破棄されています。

Vuejs 2 は `component`、`transition`、`transition-group`、`keep-alive` および `slot` などの組み込みコンポーネントを所有します。これらコンポーネントをご利用のアプリで利用できます。 [それらの使い方をチェック](https://vuejs.org/v2/api/#component)をご覧ください。

### _Props_

`Props は ``properties`の短い形式です。プロパティはコンポーネントの属性です。実際、`props` はコンポーネントが互いに伝達する方法です。`<img>` のような HTML のタグには、srcがpropを呼び出す属性があり、画像の場所にポイントします。

Vue.js 2 では、親スコープから子コンポーネントにデータを渡すことができます。一般例は次のとおりです。

```js
Vue.component('tag-list', {
  props: ['item'],
  template: '<li>{{ item.tag}}</li>'
})

var app = new Vue({
  el: '#app',
  data: {
    tagList: [
      { tag: '5kbae' },
      { tag: 'Based on Logistics' },
      { tag: 'Image management' }
    ]
  }
})
```

{% highlight html %}
<div id="app">
  <ol>
    <tag-list v-for="list in tagList" v-bind:item="list"></tag-list>
  </ol>
</div>
{% endhighlight %}

これらのアイテムは次のように Web ページ上に表示されます。

```bash
5kbae
Based on Logistics
Image management
```

### _テンプレート / JSX_

Vue.js 2 では HTML ベースのテンプレート構文を使用しているので、 Vue インスタンスのデータとレンダーされた DOM を宣言的に対応させることができます。すべての Vue.js テンプレートは、仕様に準拠しているブラウザや HTML パーサによってパースできる有効な HTML です。

またJSX を使用することもできます。JSX は同じファイル内で HTML と JavaScript コードを組み合わせたものです。ブラウザはそれを認識するものではありません。ブラウザが認識できるには、JavaScript 標準にトランスパイルしなければなりません。Vuejs での JSX 利用の例は次のとおりです。

```js
data: {
  text: 'Hello world'
},
render (h) {
  return (
    <div id='message'>
      { this.text }
    </div>
  );
}
```

デフォルトでは、Vue は JSX をサポートしませんが、 [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)の助けで、Vue で JSX を使用できます。エコシステムはこの素晴らしいツールに感謝すべきでしょう。

Vue 2 では、`render` 関数を使って再有効化要素を作成できます。 また、次のようにそれで JSX を使うことができます。

```js
new Vue({
  el: '#app',
  data: {
    msg: 'Click to see the message.'
  },
  methods: {
    hello () {
      alert('This is the message.')
    }
  },
  render: function render(h) {
    return (
      <span
        class={{ 'my-class-3': true }}
        style={{ cursor: 'pointer' }}
        on-click={ this.hello }
      >
        { this.msg }
      </span>
    )
  }
});
```

JSX 自体を Vue で表すそのパワーがわかりますか？素晴らしいです、[詳細についてはこちらのVueでの JSX に関する情報はをチェックしてください](https://github.com/vuejs/babel-plugin-transform-vue-jsx)。

次は、_Vuejs 2_. でアプリケーションを構築しましょう。

## _今回構築するアプリ：The Ultimate Satrtup Battle Ground_

![The Ultimate Startup Battle Ground](https://cdn.auth0.com/blog/vuejs/appscreenshot.png)

今回構築するアプリは `The Ultimate Startup Battle Ground` と呼ばれるものです。スタートアップ企業が世界中に次々に誕生しています。これらスタートアップ企業には革新的な技術がありますが、資金は限られています。このアプリは、世界中におけるスタートアップバトルについての最新リストやスポンサー、シードファンド額の詳細を提供して、その資金問題を軽減することを目指しています。The Ultimate Startup Battle Ground アプリはスタートアップバトルのリストを一般に対して表示しています。

興味があるスタートアップ起業家はこのリストを入手して、チームがそのチャンスを逃すことがないようにすることができます。ただし、アプリではスタートアップバトルの秘密リストも提供しています。このリストは登録メンバーだけが利用できます。

**注：** スタートアップバトルの秘密には大きなスポンサーが記載されています。このチャンスを逃すことはできません！絶対に逃せません！

## _バックエンドを構築する_

スタートアップバトルのリストをアプリに提供する API を構築しましょう。 [Node.js](https://nodejs.org/)で API を簡単に作成します。API はシンプルです。必要なものは以下のとおりです。

- パブリックスタートアップバトルを提供するエンドポイント - `/api/battles/public`
- シークレットスタートアップバトルを提供するエンドポイント - `/api/battles/private`
- シークレットスタートアップバトルを提供するエンドポイントをセキュアし、登録ユーザーだけがアクセスできるようにします

[GitHub の Node.js バックエンド](https://github.com/auth0-blog/vuejs2-authentication-tutorial/tree/master/server)に移動し、フェッチします。

**注：** 今回はAuth0 を使用してバックエンドをセキュアにしますので、Auth0アカウントを持っているか確認するか、 [サインアップ](javascript:signup(\))してアカウントを作成します。

`server.js` は次のように表示されます。

```js
'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://{{YOUR-AUTH0-DOMAIN}}/.well-known/jwks.json"
    }),
    // これが API を作成したときに設定した識別子です
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/",
    algorithms: ['RS256']
});

app.get('/api/battles/public', (req, res) => {
  let publicBattles = [
    // Array of public battles
  ];

  res.json(publicBattles);
})

app.get('/api/battles/private', authCheck, (req,res) => {
  let privateBattles = [
    // Array of private battles
  ];

  res.json(privateBattles);
})

app.listen(3333);
console.log('Listening on localhost:3333');
```
_server.js_

[server.js ファイルのすべての内容はこちら](https://github.com/auth0-blog/vuejs2-authentication-tutorial/blob/master/server/server.js)からチェックしてください。

**注：** `YOUR-AUTH0-DOMAIN` は auth0 ドメインに置き換えられているはずです。

`package.json` ファイルは次のように表示されます。

```js
{
  "name": "startup-battle",
  "version": "0.0.1",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "author": "Auth0",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.15.2",
    "cors": "^2.8.1",
    "express": "^4.14.0",
    "express-jwt": "^3.4.0",
    "jwks-rsa": "^1.1.1"
  }
}

```
_package.json_

**注：** [`nodemon`](https://github.com/remy/nodemon)がグローバルにインストールされていることを確認してください。

プロジェクトを複製したら、`npm install`を実行し、 [postman](https://www.getpostman.com/)を使って次のようにルートを提供します。

![API serving public startup battles](https://cdn.auth0.com/blog/vue/postmanpublic.png)
_パブリックスタートアップバトルを提供する API_

![API serving private startup battles](https://cdn.auth0.com/blog/vue/postmanprivate.png)
_プライベートスタートアップバトルを提供する API_

パブリックスタートアップバトルエンドポイントは `http://localhost:3333/api/battles/public` でなければなりません。

プライベートスタートアップバトルエンドポイントは `http://localhost:3333/api/battles/private` でなければなりません。

エンドポイントのセキュリティを管理するエンドポイントについては現時点では心配しないでください。それは後で処理します。それではフロントエンドを Vuejs 2 で作りましょう。

## _Vuejs 2 でフロントエンドを構築する_

**Vuejs** の初期には、_Vuejs_ アプリをセットアップする特定の推奨ツールや一般的な方法はありませんでした。しかし、Vuejs アプリを初期設定するツールができました。 [Vuejs CLI](https://github.com/vuejs/vue-cli)ツールと呼ばれるもので、Vuejs チームが管理しています。

vue-cli ツールを次のようにグローバルにインストールします。

```bash
npm install -g vue-cli

```

![Installation](https://cdn.auth0.com/blog/vuecli/installation.png)
_一連の質問が表示されます。_

グローバルにインストールしたら、次のように新しい **Vuejs 2** アプリを初期設定します。

```bash
vue init webpack ultimate-startup-battle

```

**注：** このコンテキストでは、`webpack` がテンプレートです。`vue-cli` がアプリを初期設定するテンプレートを選択できます。もうひとつの選択肢は `browserify`を使用することです。 [テンプレートのリストはこちら](https://github.com/vuejs-templates/)をチェックしてください。

新しいディレクトリ`ultimate-startup-battle`に移動し、`npm install` を実行してアプリに必要なすべての依存関係をインストールします。

端末から `npm run dev` を実行してアプリを起動します。`http://localhost:8080` で Web ブラウザを自動的に開き、新しいアプリを提供します。

![App recently scaffolded and showing at Localhost](https://cdn.auth0.com/blog/vuejs/newscaffoldedapp.png)

新しく初期設定したアプリの構造をチェックしましょう。

![Scaffolded App](https://cdn.auth0.com/blog/vuecli/boilerplate.png)

```bash
ultimate-startup-battle/
  build/ - 全てのビルドファイルはここです
  config/ - 全ての環境構成ファイルはここです
  node_modules/ - アプリに必要な全てのパッケージはここに存在します
  src/
    - assets - 全ての資産はここに存在します
    - components - 全ての Vue コンポーネントはここに存在します
    - router - ルーターはここで定義されます
    - App.vue - 親コンポーネント
    - main.js - ルーター、テンプレート、およびアプリコンポーネントがルートアプリ div にバインドされた場所のアプリの開始点
  static/ - 静的ファイルを含みます
  .babelrc
  .editorconfig
  .eslintignore
  .eslintrc.js
  .gitignore
  .postcssrc.js
  index.html - アプリコンポーネントがバインドされている場所のルート div を宣言するインデックスファイル
  package.json - フォルダーに存在する全てのパッケージの名前を含むファイル
  README.md
  node_modules/ - アプリ に必要な全てのパッケージがここに存在します
  package.json - フォルダーに存在する全てのパッケージの名前を含むファイル
```

この構造で作業しますが、一部変更します。

**注：** このアプリケーションのテストについては記述しません。これは、このチュートリアルのスコープ外だからです。ですから、インストール中にオプションなしを選択してオプトアウトしました。

以下の変更をしてください。

- `components` ディレクトリ内に `privateBattles.vue` ファイルを作成します。このコンポーネントはプライベートスタートアップバトルをフェッチし、ユーザーにそれらを表示することを管理します。
- `components` ディレクトリ内に `publicBattles.vue` ファイルを作成します。このコンポーネントはパブリックスタートアップバトルをフェッチし、ユーザーにそれらを表示することを管理します。
- `components` ディレクトリ内に `AppNav.vue` ファイルを作成します。このコンポーネントはアプリ中のナビゲーションを処理します。
- `utils` という名のフォルダを作成します。ここにヘルパー関数を保存します。


## _API データをフェッチする_

まず最初にしなければならないことは、Node バックエンドから API データをフェッチしてアプリに表示します。Node サーバーが実行中であることを確認します。

API のフェッチを処理するために、ヘルパーファイルを作成しましょう。`Utils`ディレクトリ内に `battles-api.js`ファイルを作成します。

このファイルを開き、以下のようにコードを追加します。

```js

import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export {getPublicStartupBattles, getPrivateStartupBattles};

function getPublicStartupBattles() {
  const url = `${BASE_URL}/api/battles/public`;
  return axios.get(url).then(response => response.data);
}

function getPrivateStartupBattles() {
  const url = `${BASE_URL}/api/battles/private`;
  return axios.get(url).then(response => response.data);
}

```

_battles-api.js_

**注：** `npm install axios --save` を実行してアプリに `axios` をインストールします。

プロミスベースが高い http クライアント、 [axios](https://github.com/mzabriskie/axios)を使っています。axiosの代わりに、 [superagent](https://github.com/visionmedia/superagent)を使うこます。

`getPublicStartupBattles` 関数と `getPrivateStartupBattles` 関数では、 axios が API エンドポイントからデータをフェッチします。それから、`export {getPublicStartupBattles, getPrivateStartupBattles}` を実行してコンポーネントで使用する用意をします。

## _Navコンポーネントを構築する_

`AppNav.vue` ファイルは Nav コンポーネントです。以下のようにコードを追加します。

{% highlight html %}
<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand"> The Ultimate Startup Battle Ground</router-link>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <button class="btn btn-danger log" @click="handleLogout()">Log out </button>
        <button class="btn btn-info log" @click="handleLogin()">Log In</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { isLoggedIn, login, logout } from '../../utils/auth';

export default {
  name: 'app-nav',
  methods: {
    handleLogin() {
      login();
    },
    handleLogout() {
      logout();
    },
    isLoggedIn() {
      return isLoggedIn();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}
</style>
{% endhighlight %}

`vue-router` からの `router-link` コンポーネントはページをリロードしなくても、ルート間のシームレスなクライアントサイド移動を可能にします。

## _PublicBattles および PrivateBattles コンポーネントを構築する_

デフォルトでは、これら２つのコンポーネントは機能が同じように見えます。両方とも異なるエンドポイントからデータを表示します。はじめに `PublicBattles` コンポーネントから始めましょう。

{% highlight html %}
{% raw %}
<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Daily Startup Battles</h3>
    <hr/>

    <div class="col-sm-4" v-for="battle in publicBattles">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ battle.name }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-info"> Sponsor: </span> {{ battle.sponsor }} </p>
          <p><span class="badge alert-danger"> SeedFund: </span><strong> ${{ battle.seedFund }} </strong></p>
        </div>
      </div>
    </div>

    <div class="col-sm-12">
      <div class="jumbotron text-center">
        <h2>View Private Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/private-battles">Private Startup Battles</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import { isLoggedIn } from '../../utils/auth';
import { getPublicStartupBattles } from '../../utils/battles-api';

export default {
  name: 'publicBattles',
  components: {
    AppNav,
  },
  data() {
    return {
      publicBattles: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getPublicStartupBattles() {
      getPublicStartupBattles().then((battles) => {
        this.publicBattles = battles;
      });
    },
  },
  mounted() {
    this.getPublicStartupBattles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
{% endraw %}
{% endhighlight %}

_publicBattles.vue_

上記のコードを分析しましょう。`publicBattles` コンポーネントは API からデータを収集するので、そのデータを保持する方法が必要です。Vuejs には何らかの状態としてデータを保持するためにプロパティを定義できる `data`メソッドがあります。上記のコードでは、`publicBattles` プロパティを宣言しました。

`methods` プロパティも Vuejs ではデフォルトです。このプロパティでは、カスタムロジックをこのプロパティ内にファンクションとして定義できます。ですから、`isLoggedIn`ファンクションおよび `getPublicStartupBattles`ファンクションを定義しました。

`getPublicStartupBattles` メソッドでは、`battles-api.js` ヘルパーファイルからエクスポートした `getPublicStartupBattles` メソッドを呼び出し、以下のように状態を設定します。

```js
...
 getPublicStartupBattles() {
      getPublicStartupBattles().then((battles) => {
        this.publicBattles = battles;
      });
  },
...
```

ここでは、マウントした **Vuejs 2** ライフサイクルフックのひとつを利用しました。このメソッドで定義したものはコンポーネントがブラウザスクリーン上にマウントされた後に適用されます。そこで、以下のようにフックに `getPublicStartupBattles` メソッドを呼び出しました。

```js
...
 mounted() {
    this.getPublicStartupBattles();
  }
...
```

ここでしようとしていることは、`publicBattles` コンポーネントがレンダーされたすぐ後に **Vuejs** が API からデータをロードするように操作することです。

**注：** データが API からロードされている間に、ユーザーに提示するために読み込みインジケーターまたはスピナーを追加できます。これによって空のスクリーンのフラッシングを避けます。 [データ読み込みのための vuejs 移行](https://laracasts.com/discuss/channels/vue/vuejs-transition-for-loading-data)をチェックしてください。

`AppNav` コンポーネントをインポートし、`components` プロパティの下に登録しました。 `name` プロパティには`publicBattles` 値があります。この意味は、このコンポーネントをテンプレートで使用するとき、`<publicBattles></publicBattles>` になります。

`<template>` タグ内に含まれているものをよく見てみましょう。これが、スクリーン上にレンダーされるものです。

`publicBattles` プロパティをループして、`v-for` 組み込みディレクティブのヘルプでアレイになり、スクリーン上にコンテンツを表示します。

{% highlight html %}
{% raw %}
<div class="col-sm-4" v-for="battle in publicBattles">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title"> {{ battle.name }} </h3>
      </div>
      <div class="panel-body">
        <p><span class="badge alert-info"> Sponsor: </span> {{ battle.sponsor }} </p>
        <p><span class="badge alert-danger"> SeedFund: </span><strong> ${{ battle.seedFund }} </strong></p>
      </div>
    </div>
</div>
{% endraw %}
{% endhighlight %}

```js
...
  data() {
    return {
      publicBattles: '',
    };
  },
...
```

ちょうどそれが、`publicBattles` プロパティです。Vuejs は自動的にそれを DOM にバインドします。ですから、`<template>` タグにはそれを使います。

では、`PrivateBattles` コンポーネントを同様に構築しましょう。

{% highlight html %}
{% raw %}
<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Secret Startup Battles</h3>
    <hr/>

    <div class="col-sm-4" v-for="battle in privateBattles">
      <div class="panel panel-danger">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ battle.name }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-info"> Sponsor: </span> {{ battle.sponsor }} </p>
          <p><span class="badge alert-danger"> SeedFund: </span><strong> ${{ battle.seedFund }} </strong></p>
        </div>
      </div>
    </div>

    <div class="col-sm-12">
      <div class="jumbotron text-center">
        <h2>View Public Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/"> Public Startup Battles </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import { isLoggedIn } from '../../utils/auth';
import { getPrivateStartupBattles } from '../../utils/battles-api';

export default {
  name: 'privateBattles',
  components: {
    AppNav,
  },
  data() {
    return {
      privateBattles: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getPrivateStartupBattles() {
      getPrivateStartupBattles().then((battles) => {
        this.privateBattles = battles;
      });
    },
  },
  mounted() {
    this.getPrivateStartupBattles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
{% endraw %}
{% endhighlight %}

_privateBattles.vue_

`AppNav` コンポーネント、`PublicBattles` コンポーネント、`PrivateBattles` コンポーネントを作成したので、ご自分をほめてください。やった！やった！

アプリが機能するには、もうひとつやることがあります。ルーティングです!!!

## _ルーターを構築する_

`src/router/index.js` ファイルを開きます。ここで vue ルーターを定義します。コードを次のように変更します。

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      component: PrivateBattles,
    },
  ],
});
```

_index.js_

各ルートにはパス、名前、およびユーザーがルートを呼び出したときにレンダーされるコンポーネントがあります。ちなみに、コンポーネントはすでにファイルの先頭にインポートされています。

```js

import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';

```

アプリケーションをブラウザーでチェックする前に、以下を実行します。

- ルートディレクトリで `index.html` を開き、 [bootstrap](http://getbootstrap.com/)を追加します。このときの html ファイルのコンテンツは次のように表示されます。

{% highlight html %}

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>startupbattle</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

{% endhighlight %}

アプリケーションをブラウザで自由にチェックしてください。この時点では、以下のように表示されます。

![Homepage](https://cdn.auth0.com/blog/vuejs2/homepage.png)
_ホームページ_

![Celebritypage](https://cdn.auth0.com/blog/vujes2/privatebattles.png)
_プライベートバトルページ_

## _Vuejs 2 アプリに認証機能を追加する_

日常的に使用するほとんどのアプリにはユーザーを認証する機能があります。では、 **Vuejs 2** アプリケーションに認証機能を追加する方法について説明します。認証サービスとして [Auth0](https://auth0.com/) を使用します。

Auth0 は [JSON Web トークン (JWTs)](https://jwt.io/)の発行を可能にします。Auth0 のアカウントを持っていない場合は、無料で [サインアップ](javascript:signup())してアカウントを作成してください。

[**Auth0 が提供するfreeアカウントを利用して**](https://auth0.com/pricing)で先進認証を開始します。

Auth0 [管理ダッシュボード](https://manage.auth0.com/)にログインし、新しい API クライアントを作成しましょう。API メニュー項目がない場合は、 [アカウント設定](https://manage.auth0.com/#/account/advanced)から **詳細設定** タブに行き、 **API 有効セクション** が表示されるまでスクロールダウンしてスイッチを入れます。

ここから、API メニュー項目をクリックして、 **API 作成** ボタンをクリックします。API にName(名前)とIdentifier(識別子)をつけます。この名前は何でもいいので、必要なだけ説明を加えます。識別子は API を識別するために使用され、このフィールドは一度設定したら変更できません。例として、API を **スタートアップバトル API** と名付け、識別子は **http://startupbattle.com** をセットします。署名アルゴリズムは RS256 のままにし、CREATEボタンをクリックします。

![Creating the startupbattle API](https://cdn2.auth0.com/blog/startupbattle/api.png)
_スタートアップバトル API を作成する_

次に、API のスコープを定義しましょう。スコープは API へのアクセス管理を可能にします。定義するスコープの数は必要に応じて行います。簡単な例として、単一スコープを作成し、これによって API へのフルアクセスがユーザーに許可されます。

![Locate scopes bar](https://cdn2.auth0.com/blog/startupbattles/scope.png)
_スコープバーを検索する_

![Adding Scope to API](https://cdn2.auth0.com/blog/startupbattles/scopes.png)
_スコープを追加する_

### _ノード API をセキュアする_

認証済みユーザーだけがプライベートバトルエンドポイントにアクセスできるように、API をセキュアにする必要があります。Auth0 で簡単にセキュアできます。

`server.js` ファイルを開き、`authCheck` ミドルウェアをプライベートバトルエンドポイントに次のように追加します。

```js

app.get('/api/battles/private', authCheck, (req,res) => {
  let privateBattles = [
    // Array of private battles
  ];

  res.json(privateBattles);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```

再度、Postman から `http://localhost:3333/api/battles/private` エンドポイントにアクセスします。以下のようにアクセスが拒否されます。

![Unauthorized Access](https://cdn.auth0.com/blog/vuejs2/unauthorized.png)
_承認されていないアクセス_

次に、フロントエンドに認証を追加しましょう。

### _Vuejs 2 フロントエンドに認証機能を追加する_

認証機能に関するすべてをアプリで処理するために認証ヘルパーを作成します。`Auth.js` ファイルを `utils` ディレクトリに作成します。

コードを追加する前に、`jwt-decode` と `auth0-js` ノードパッケージを次のようにインストールします。

```bash
npm install jwt-decode auth0-js --save

```

`auth.js` ファイルを開き、次のようにコードを追加します。

```js
import decode from 'jwt-decode';
import axios from 'axios';
import auth0 from 'auth0-js';
import Router from 'vue-router';
import Auth0Lock from 'auth0-lock';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = '{AUTH0_CLIENT_ID}';
const CLIENT_DOMAIN = '{AUTH0_DOMAIN}';
const REDIRECT = 'YOUR_CALLBACK_URL';
const SCOPE = '{SCOPE}';
const AUDIENCE = 'AUDIENCE_ATTRIBUTE';

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
}

var router = new Router({
   mode: 'history',
});

export function logout() {
  clearIdToken();
  clearAccessToken();
  router.go('/');
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// access_token と id_token を展開することを許可するヘルパー関数
function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// access_token をローカルストレージから取得し、保存します
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// id_token をローカルストレージから取得し、保存します
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
```

上記のコードでは、`login` メソッドで [Auth0 Lock](https://auth0.com/lock)のホストされるバージョンを使い、資格情報にパスします。

auth0 パッケージは Auth0 のauthorizeエンドポイントを呼び出します。メソッドにパスした詳細で認証を処理する検証および認可が行われます。認可メソッドにパスできる特定の値についての詳細は、 [こちら](https://auth0.com/docs/libraries/auth0js/v8#login)をご覧ください。

まだ持っていないパラメーターは `{YOUR-AUTH0-CLIENT-ID}` と `{YOUR-CALLBACK-URL}` です。これは、ユーザーを保留する Auth0 クライアントです。API を作成するとき、Auth0 はユーザーが使用できるテストクライアントも作成します。さらに、 [管理ダッシュボード](https://manage.auth0.com/#/clients)のクライアントセクションにある既存の Auth0 クライアントを使用できます。

ダッシュボードから API の `Test`パネルをチェックしてください。以下のようなテストクライアントが表示されます。

![Startup Client](https://cdn2.auth0.com/blog/app/startupclient.png)
_スタートアップ API クライアント_

では、クライアントメニューにアクセスし、テストクライアントをチェックしてください。クライアントのリストに以下のように表示されます。

![Startup Battle Client](https://cdn2.auth0.com/blog/startupbattleapi/client.png)

クライアントを開き、Client Typeを`Non Interactive Client` から `Single Page Application` に変更します。

**CLIENT ID** をコピーし、ログイン URL にある `YOUR-AUTH0-CLIENT-ID` の値と置き換えます。 **Allowed Callback URLsに** `http://localhost:8080/callback` を追加。

`getTokenExpirationDate` メソッドと `isTokenExpired` メソッドを介してトークンが期限切れになっていないかもチェックします。`isLoggedIn` メソッドはユーザー `id_token` のプレゼンスと有効性を基にして `true` または `false`を返します。

Vue ルーターをインポートし、そのインスタンスを作成しました。ログインやログアウトの後で、リダイレクトにそれが必要です。

最後に、ミドルウェアで`requireAuth` メソッドを実装しました。このメソッドを使用して、ログインしていないユーザーが `/private-battles` ルートにアクセスしないようにします。

`AppNav` コンポーネントを更新して、ユーザーの認証状態を基にして `login` ボタンと`logout` ボタンを非表示/表示しましょう。

これで、`AppNav` コンポーネントは以下のように表示されます。

{% highlight html %}
{% raw %}
<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand"> The Ultimate Startup Battle Ground</router-link>
    </div>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <button class="btn btn-danger log" v-show="isLoggedIn()" @click="handleLogout()">Log out </button>
        <button class="btn btn-info log" v-show="!isLoggedIn()" @click="handleLogin()">Log In</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { isLoggedIn, login, logout } from '../../utils/auth';

export default {
  name: 'app-nav',
  methods: {
    handleLogin() {
      login();
    },
    handleLogout() {
      logout();
    },
    isLoggedIn() {
      return isLoggedIn();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}
</style>
{% endraw %}
{% endhighlight %}

_AppNav.vue_

`auth` ヘルパー ファイルから`login` 関数、`logout` 関数、および `isLoggedIn` 関数をインポートしました。それから、`login()` 関数および `logout()` 関数をそれぞれ `login` ボタンおよび `logout` ボタンにアタッチします。

`PublicBattles` コンポーネントを開き、次のように変更します。

{% highlight html %}
{% raw %}
<template>
  <div>
    <app-nav></app-nav>
    <h3 class="text-center">Daily Startup Battles</h3>
    <hr/>

    <div class="col-sm-4" v-for="battle in publicBattles">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title"> {{ battle.name }} </h3>
        </div>
        <div class="panel-body">
          <p><span class="badge alert-info"> Sponsor: </span> {{ battle.sponsor }} </p>
          <p><span class="badge alert-danger"> SeedFund: </span><strong> ${{ battle.seedFund }} </strong></p>
        </div>
      </div>
    </div>

    <div class="col-sm-12">
      <div class="jumbotron text-center" v-if="isLoggedIn()">
        <h2>View Private Startup Battles</h2>
        <router-link class="btn btn-lg btn-success" to="/private-battles">Private Startup Battles</router-link>
      </div>
      <div class="jumbotron text-center" v-else>
        <h2>Get Access to Private Startup Battles by Logging In</h2>
      </div>
    </div>
  </div>
</template>

<script>
import AppNav from './AppNav';
import { isLoggedIn } from '../../utils/auth';
import { getPublicStartupBattles } from '../../utils/battles-api';

export default {
  name: 'publicBattles',
  components: {
    AppNav,
  },
  data() {
    return {
      publicBattles: '',
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getPublicStartupBattles() {
      getPublicStartupBattles().then((battles) => {
        this.publicBattles = battles;
      });
    },
  },
  mounted() {
    this.getPublicStartupBattles();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
{% endraw %}
{% endhighlight %}

_publicBattles.vue_

ユーザーのログイン状態を基に、`isLoggedIn()` メソッドを通してプライベートスタートアップバトルへのリンクを有効にします。

### _コールバックコンポーネントを追加する_

`allback.vue`という新しいコンポーネントを作成します。このコンポーネントは `localhost:8080/callback` ルートが呼び出されたときにアクティブ化され、Auth0 からリダイレクトを処理し、認証が成功したすぐ後に適切なデータの受信を確実にします。コンポーネントは `access_token` と `id_token` を保存します。

_callback.vue_

{% highlight html %}
<template>
</template>
<script>

import { setIdToken, setAccessToken } from '../../utils/auth';

export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>

{% endhighlight %}

ユーザーが認証されたら、Auth0 はアプリケーションにリダイレクトし、`/callback` ルートを呼び出します。この要求に対してAuth0 は `id_token` と `access_token` も追加し、コールバックコンポーネントはこれらのトークンを適切に処理し、localStorage に保存します。すべてがよければ、つまり `id_token`, `access_token`を受け取り、`nonce` が検証されれば、`/`ページにリダイレクトし、ログイン状態になります。

### _Auth0 ダッシュボードに値を追加する_

ログインまたはサインアップする前に、 [Auth0 ダッシュボード](https://manage.auth0.com/#/)に行き、`http://localhost:8080/callback` を **Allowed Callback URLs** に、`http://localhost:8080` を**Allowed Origins (CORS)** に追加します。

### _Private-battlesルートをセキュアする_

ブラウザーから`/private-battles` をタイプしてプライベートバトルルートにアクセスできないようにする必要があります。

`router/index.js` を開き、`requireAuth` 関数をインポートしてそれを変更し、`requireAuth` の値が付いた `beforeEnter` プロパティを次のように `/private-battles` ルートに追加します。

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';
import { requireAuth } from '../../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      beforeEnter: requireAuth,
      component: PrivateBattles,
    },
  ],
});

```

_index.js_

もうひとつあります。`/callback` ルートを次のようにルートファイルに登録しましょう。

```js
import Vue from 'vue';
import Router from 'vue-router';
import PrivateBattles from '@/components/privateBattles';
import PublicBattles from '@/components/publicBattles';
import Callback from '@/components/callback';
import { requireAuth } from '../../utils/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PublicBattles',
      component: PublicBattles,
    },
    {
      path: '/private-battles',
      name: 'PrivateBattles',
      beforeEnter: requireAuth,
      component: PrivateBattles,
    },
    {
      path: '/callback',
      component: Callback,
    },
  ],
});
```

では、ログインしてみてください。

![Lock Login Widget](https://cdn2.auth0.com/blog/startupbattle/login.png)
_ログインウィジェットをロックする_

利用可能なスコープが表示されているユーザーコンテンツダイアログが、初めてユーザーに表示されます。ユーザーを認可したら、ユーザーをログインし、スコープに基づいてアクセスを許可します。

![User consent dialog](https://cdn2.auth0.com/blog/startupbattle/authorize.png)
_ユー __ザーに認可に関するオプシ__ ョンが提示される_

**注：** ドメインに `localhost` を使っているので、ユーザーが初めてログインしたら、その後のログインではユーザーの認可同意ダイアログが必要ありません。この同意ダイアログは、ローカルホストでないドメインを使っており、クライアントはファーストパーティのクライアントの場合は表示されません。

![Logged In and Unauthorized to see the Private Startup Battle](https://cdn2.auth0.com/blog/startupbattle/unauthorized.png)
_ログインしたが、プライベートスタートアップバトルを __表示する認可__ がない_

無事にログインしましたが、プライベートスタートアップバトルのコンテントは表示されず、コンソールには `401 Unauthorized` エラーが表示されます。なぜでしょうか？

簡単です！以前、エンドポイントをセキュアしましたが、現時点では JWT をバックエンドにパスしていません。ヘッダーとして、要求とともに JWT を送信する必要があり、ログインしたユーザーのセキュアなエンドポイントの認識を有効にします。

### _Auth & バトル API ヘルパーを更新する_

`utils/battles-api.js` ファイルを開きます。`getPrivateStartupBattles` 関数を多少調整します。現在は、API からデータをフェッチするためだけに `GET` 要求を開始します。

ここで、`GET`要求と共にベアラー access\_token 付きの`Authorization`ヘッダーを送信するオプションを次のようにパスします。

```js
import { getAccessToken } from './auth';

function getPrivateStartupBattles() {
  const url = `${BASE_URL}/api/battles/private`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}

```

`/api/battles/private` エンドポイントはヘッダーでトークンを受信し、ユーザーを検証します。有効であれば、コンテンツがユーザーに提供されます。

では、もう一度ログインしてください。

すべてが問題なく機能しているはずです。よくできました。これまで、 **Vuejs 2** アプリを作り、それに認証を追加してきました。

## _まとめ_

**Vuejs 2** はユーザーインターフェースを構築するための軽量で高速の素晴らしいライブラリです。その習熟曲線はゆるやかで、その API を理解するには難しくありません。急速に拡大しているコミュニティで、さまざまな機能のコンポーネントが一般に提供されています。

また、Auth0 はユーザー名とパスワードによる認証だけでなく、 **Vuejs 2** アプリをセキュアにする助けになります。これは、 [多要素認証](https://auth0.com/docs/multifactor-authentication)、 [異常検出](https://auth0.com/docs/anomaly-detection)、組織連携、 [シングルサインオン (SSO)](https://auth0.com/docs/sso)、その他の機能を提供します。 [サインアップ](javascript:signup(/))して、アプリに固有な構築機能を活用してください。

> Auth0 はパスワードのリセット、作成とプロビジョニング、ユーザーのブロックと削除を含む、シンプルで非常に使いやすい [ユーザー ID を管理する管理者を助けるユーザーインターフェースツール](https://auth0.com/user-management)を提供しています