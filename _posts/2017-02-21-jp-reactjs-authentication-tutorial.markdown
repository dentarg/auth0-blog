---
layout: post
title: "ReactJS 認証チュートリアル"
description: ReactJS でアプリを素早く構築する方法や認証を正しく追加する方法について学びます。
date: 2017-02-21 8:30
category: Technical Guide, Frontend, ReactJS
author:
  name: Prosper Otemuyiwa
  url: https://twitter.com/unicodeveloper?lang=en
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
  mail: prosper.otemuyiwa@auth0.com
design:
  bg_color: "#222425"
  image: https://cdn.auth0.com/blog/blog/React-logo.png
tags:
- reactjs
- redux
- javascript
- authentication
- web-app
- auth0
related:
- jp-vuejs2-authentication
- jp-angular-2-authentication
lang: jp
alternate_locale_en: reactjs-authentication-tutorial
---

**このブログは2017/02/21に掲載されたものを翻訳したものです。**

---

**TL;DR：** ReactJS は効率的で、可変可能な ユーザーインターフェースを構築する宣言型のJavaScript ライブラリです。現在、ReactJSは [GitHub](https://github.com/facebook/react)で58,000個以上のスターがつけられています。ReactJS は Webアプリケーションを独自の状態で管理するカプセル化されたコンポーネントの形態に構築するのが簡単になります。このチュートリアルでは、ReactJS を使って Webアプリケーションを構築する方法やそれに認証機能を追加する方法について説明します。チュートリアルで使用するコードを取得するには、 [レポジトリ](https://github.com/auth0-blog/reactjs-authentication-tutorial) をチェックしてください。


---

**ReactJS** はJavaScriptライブラリで、Facebookが構築・管理しています。　ReactJSはFacebook のソフトウェア技術者、 [ジョーダン・ウォーク](https://twitter.com/jordwalke)によって開発され、2015年3月に開発者コミュニティに対してオープンソースで発表されました。それ以来、ReactJSは大きな成長を遂げ、開発者コミュニティで広く採用されてきました。実際、作成段階では **ReactJS** はGitHubで5番目に最もスターの数が多いプロジェクトでした。

現在では、たくさんの Web プラットフォームがユーザーインターフェースを構築するために **ReactJS** を使っています。そのようなプラットフォームには、

_Netflix_、_Instagram_、_Airbnb_、_KhanAcademy_、_Walmart_ などがあります。 [ドキュメント](https://facebook.github.io/react)は非常に詳細に書かれており、活気のあるユーザーコミュニティがあります。また、大量の **ReactJS** アドオンが GitHub にあり、構築しようとしている機能をプロジェクトに簡単に含むことができます。

## _ReactJS のキーコンセプトを理解する_

**ReactJS** は [PHP](https://github.com/php/php-src) およびHack の拡張、 **XHP** によって影響され、 カスタムで再利用可能な HTML 要素を作成する目的の XML 構文が可能になります。 [jQuery](https://jquery.com/)の世界に慣れていて、アンギュラー、Ember、または VueJS のようなフレームワークの経験がないのであれば、 **ReactJS** は混乱するかもしれません。次のような質問が浮かぶかもしれません。

- JavaScript と HTML が１つのスクリプトにあるのはなぜか？
- JSX とは何か？構文がこんなに奇妙なのはなぜか？
- state とは何か？
- props が必要な理由は何か？
- アプリに必要なコンポーネントは何で、なぜ必要か？

ご心配ありません。これからこのような疑問に対してお答えしていきます。React について学ぶとき、知っておくべきキーコンセプトがいくつかあります。これら基本的なコンセプトを理解されますと、壁にぶちあたることなく **ReactJS** アプリを作ることができます。

キーコンセプトは次のとおりです。

- **コンポーネント - タイプと API**
- **Props**
- **State**
- **JSX**

**ReactJS** をよくご理解いただくために、これらコンセプトの基本概念について説明します。

### _コンポーネント - そのタイプと API_

React は基本的にはコンポーネントです。ReactJS アプリは相互運用可能な小さなコンポーネントが集合したひとつの大きなコンポーネントです。ReactJS で作業することはほとんどの時間、コンポーネントについて考えることです。

コンポーネントの例は、HTML 5 タグの`<header>`としましょう。ヘッダーには属性がある場合がありスタイル付けしたり、独自の動作がある場合もあります。 **ReactJS** では、 [**ES6**](https://auth0.com/blog/a-rundown-of-es6-features/)を使って次のようなユーザー独自のカスタムコンポーネントを作成できます。

```js

class CustomComponent extends React.Component {
   render() {
      return '<h3> This is my custom component!!!</h3>';
   }
}

```

この例では、コンポーネントは現時点では`<CustomComponent></CustomComponent>`となります。

React はコンポーネントの作成からコンポーネントの破棄までのさまざまなポイントでトリガーされたメソッドを提供します。これを [コンポーネントのライフサイクル](https://facebook.github.io/react/docs/state-and-lifecycle.html)と呼びます。コンポーネントの動作をアプリでコントロールするために、コンポーネントのライフサイクルにフックするメソッドを宣言できます。これらライスサイクル・フックの例には、`componentDidMount()`、`componentWillMount()`、`componentWillUnmount()`、`shouldComponentUpdate()`、`componentWillUpdate()` などがあります。

- **componentWillMount()**：このメソッドはコンポーネントが最初にレンダーされる前に呼び出されます。ですから、`render` メソッドが実行される前に呼び出します。ここでは、コンポーネントを DOM で利用できないため、どんなタイプの DOM 操作もできません。
- **componentDidMount()**：このメソッドはコンポーネントがレンダーされたすぐ後に呼び出しされます。ですから、`render` メソッドが実行された直後に呼び出されます。ネットワークの呼び出しおよび AJAX の呼び出しを実行するには最適です。
- **componentWillUnmount()**：このメソッドはコンポーネントが DOM から削除される直前に呼び出されます。
- **shouldComponentUpdate()**：このメソッドは再レンダリングをするかしないかを決定します。初期レンダリングでは絶対に呼び出されず、いつもレンダーメソッドの前に呼び出されます。
- **componentWillUpdate()**：このメソッドは `shouldComponentUpdate` が true を返したらすぐに呼び出されます。コンポーネントが新しいデータでレンダーする直前に呼び出します。

DOM で要素をレンダーし、コンポーネントの状態をそれぞれ設定するために使用できる [`render`](https://facebook.github.io/react/docs/rendering-elements.html) および [`setState`](https://facebook.github.io/react/docs/state-and-lifecycle.html)のようなメソッドもあります。

以下のスピンの例を見て、ライフサイクル・フックの使い方をご覧ください。ブラウザー コンソールでログのシーケンスを観察します。

```js

import React, { Component } from 'react';
import { render } from 'react-dom';

class Experiment extends Component {

  componentWillMount() {
    console.log("This will mount");
  }

  componentDidMount() {
    console.log("This did mount");
  }

  componentWillUnmount() {
    console.log("This will unmount");
  }

  render() {
    console.log("I am just rendering like a boss");
    return <div>I got rendered!</div>;
  }

}

render(
  <Experiment />,
  document.getElementById("root")
);

```

### _Props_

`Props` は `properties` の短い形式です。プロパティはコンポーネントの属性です。実際、`props` はコンポーネントが互いに伝達する方法です。`<img>`のようなHTMLのタグには、`prop` が `src` を呼び出す属性があり、画像の場所にポイントします。

Reactでは、`FatherComponent`と`SonComponent` の２つのコンポーネントを持つことができます。互いにどのように伝達するかを見てみましょう。

```js

class FatherComponent extends React.Component {
   render() {
      return <SonComponent quality="eye balls" />;
   }
}

```

_FatherComponent_

```js

class SonComponent extends React.Component {
    render() {
      return <p> I am a true son. I have my father's "{ this.props.quality }" . </p>;
    }
}

```

_SonComponent_

さて、ページが提供されると、`<FatherComponent>` が呼び出され、`I am a true son. I have my father's eyes` がページ上にレンダーされます。

### _State_

_ReactJS_ アプリケーションを開発中のとき、コンポーネントの状態を使用するときと使用しないときを知ることが重要です。次の質問が考えられます。_State を使用するときはいつか？ Props を使用するときはいつか？_ Props は、コンポーネントが正しくレンダーするために依存するデータです。ほとんどの場合、親コンポーネントから子コンポーネントに渡しています。`props` のように、`state` はコンポーネントの情報を保留しますが、異なる方法で処理されます。例えば、ボタンをクリックした回数やフォームからのユーザー入力などです。状態がコンポーネントで変更すると、そのコンポーネントは自動的に再レンダーし、DOM を更新します。

コンポーネント内で、状態は `setState` 関数を使って管理されます。

```js

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {
      position: "right"
    };
  }

  render() {
    return (
      { this.state.position }
    )
  }
}

```

```js

class Button extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  updateCount() {
    this.setState((prevState, props) => {
      return { count: prevState.count + 1 }
    });
  }

  render() {
    return (
      <button onClick={() => this.updateCount()} >
        Clicked {this.state.count} times
      </button>
    );
  }
}

```

これは、このチュートリアルで構築したもののようにシンプルなアプリケーションに適しています。中型や大型アプリには、面倒なコードの混乱を避け、アプリ内で起きるイベントを全部追跡できるように、 [Redux](http://redux.js.org/) または [MobX](https://github.com/mobxjs/mobx)のような状態管理ライブラリを使用することを推奨します。

### _JSX_

最初は JSX を見ると使いにくく感じます。JSX は同じファイル内で HTML と JavaScript コードを組み合わせたものです。ファイルの拡張子を `.jsx` にするか、または `.js` だけにするかを決めることができます。JSX の例は下記のとおりです。

```js

class Layout extends React.Component {
  render() {
    return <p>Hello {this.props.layoutStructure ?  'Frontend layout' : 'Backend Layout'}</p>;
  }
}

```

詳細については、 [JSX についての情報はこちら](https://facebook.github.io/react/docs/introducing-jsx.html)をチェックしてください。

次に、_ReactJS_  でアプリケーションを構築しましょう。

## _今回構築するアプリ__：Chuck Norris World_

![Chuck Norris World](https://cdn.auth0.com/blog/react/app.png)

今回、構築するアプリは Chuck Norris World と呼ばれるものです。このアプリは Chuck Norris と彼の偉大さの世界を見せてくれます。Chuck Norris World アプリでは、巨匠に関するさまざまなジョークを表示します。食べ物に関する一般的なジョークのリストは一般に公開されていますが、有名人に関するジョークは登録メンバーだけに限られています。

**注：** 近頃、有名人たちは自分の費用で作ったジョークに対して多額の金額を要求しており、Chuck Norris も状況をよくしていません。いつも自分たちについての皮肉の冗談を言っています。

## _バックエンドを構築する_

ジョークのリストをアプリで使うために API を構築しましょう。 [Node.js](https://nodejs.org/)で API を簡単に作成します。API はシンプルです。必要なものは以下のとおりです。

- 食べ物についてのジョークを供給するエンドポイント - `/api/jokes/food`
- 有名人についてのジョークを供給するエンドポイント - `/api/jokes/celebrity`
- 有名人ジョークを供給するエンドポイントをセキュアし、登録ユーザーだけがアクセスできるようにする

[GitHub の Node.js バックエンド](https://github.com/auth0-blog/reactjs-authentication-tutorial/tree/master/server)に移動し、フェッチしてみましょう。

`server.js` は以下のように表示されます。

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
        // YOUR-AUTH0-DOMAIN name e.g prosper.auth0.com
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: '{YOUR-AUTH0-DOMAIN}',
    algorithms: ['RS256']
});

app.get('/api/jokes/food', (req, res) => {
  let foodJokes = [
  {
    id: 99991,
    joke: "When Chuck Norris was a baby, he didn't suck his mother's breast. His mother served him whiskey, straight out of the bottle."
  },
  {
    id: 99992,
    joke: 'When Chuck Norris makes a burrito, its main ingredient is real toes.'
  },
  {
    id: 99993,
    joke: 'Chuck Norris eats steak for every single meal. Most times he forgets to kill the cow.'
  },
  {
    id: 99994,
    joke: "Chuck Norris doesn't believe in ravioli. He stuffs a live turtle with beef and smothers it in pig's blood."
  },
  {
    id: 99995,
    joke: "Chuck Norris recently had the idea to sell his urine as a canned beverage. We know this beverage as Red Bull."
  },
  {
    id: 99996,
    joke: 'When Chuck Norris goes to out to eat, he orders a whole chicken, but he only eats its soul.'
  }
  ];
  res.json(foodJokes);
})

app.get('/api/jokes/celebrity', (req,res) => {
  let CelebrityJokes = [
  {
    id: 88881,
    joke: 'As President Roosevelt said: "We have nothing to fear but fear itself. And Chuck Norris."'
  },
  {
    id: 88882,
    joke: "Chuck Norris only lets Charlie Sheen think he is winning. Chuck won a long time ago."
  },
  {
    id: 88883,
    joke: 'Everything King Midas touches turnes to gold. Everything Chuck Norris touches turns up dead.'
  },
  {
    id: 88884,
    joke: 'Each time you rate this, Chuck Norris hits Obama with Charlie Sheen and says, "Who is winning now?!"'
  },
  {
    id: 88885,
    joke: "For Charlie Sheen winning is just wishful thinking. For Chuck Norris it's a way of life."
  },
  {
    id: 88886,
    joke: "Hellen Keller's favorite color is Chuck Norris."
  }
  ];
  res.json(CelebrityJokes);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```
_server.js_

`package.json` ファイルはこのように表示されます。

```js

{
    "name": "chuck-norris-jokes",
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
        "express-jwt": "^3.4.0"
    }
}

```

_package.json_

> **注：** [`nodemon`](https://github.com/remy/nodemon)がグローバルにインストールされていることを確認してください。


プロジェクトを複製したら`npm install` を実行し、 [postman](https://www.getpostman.com/) を使って以下のようにルートを提供します。

![API serving food jokes](https://cdn.auth0.com/blog/react/postman.png)

_食べ物ジョークを提供する API_

![API serving celebrity jokes](https://cdn.auth0.com/blog/react/postmanfood.png)

_有名人ジョークを提供する API_

食べ物ジョークのエンドポイントは `http://localhost:3333/api/jokes/food` です

有名人ジョークのエンドポイントは `http://localhost:3333/api/jokes/celebrity` です

エンドポイントのセキュリティを管理するエンドポイントについては後ほど処理をするので現時点では心配しないでください。それでは、ReactJS フロントエンドを構築しましょう。

## _ReactJS でフロントエンドを構築する_

**ReactJS** の初期には、_ReactJS_ アプリをセットアップするツールや一般的な方法がありませんでしたが、React がさらに開発され、ボイラープレートやスタータが増え、現在ではアプリをセットアップするときにオープンソースツールが利用できるようになりました。その中でもシンプルさが優れているツールがあります。 [Create-React-App (CRA) CLI](https://github.com/facebookincubator/create-react-app)ツールと呼ばれるものです。これは Facebook が管理しています。

**注：** Auth0 認証がバンドルされているカスタムされた React スクリプトがあります。ですから、`create-react-app my-app --scripts-version auth0-react-scripts` のように認証をサポートするアプリをブーストトラップする Create-React-App を使用できます。

CRA ツールを以下のようにグローバルにインストールしてください。

```bash
npm install -g create-react-app

```

グローバルにインストールしたら、新しい **ReactJS** アプリを以下のように初期設定します。

```bash
create-react-app chucknorrisworld

```

次に [`http://localhost:3000`](http://localhost:3000/)にアクセスし、アプリを表示します。

![App recently scaffolded and showing at Localhost](https://cdn.auth0.com/blog/react/ready-app.png)

**注：** `create-react-app` はインストールの際は、自動的に Yarn を呼び出します。Yarn をインストールしていないときは、npm を使用します。

新しく初期設定したアプリの構造をチェックしましょう。

![Scaffolded App](https://cdn.auth0.com/blog/react/folder-structure.png)

```bash
my-app/
  README.md
  node_modules/ - react アプリ に必要な全てのパッケージがここに存在します
  package.json - node_modules フォルダーに存在する全てのパッケージの名前を含むファイル
  public/
    index.html -  アプリコンポーネントがバインドされている場所のルート div を宣言するインデックスファイル
    favicon.ico - アプリのファビコン
  src/
    App.css - アプリコンポーネント のスタイルを含むファイル
    App.js - 基本アプリコンポーネント
    App.test.js - アプリコンポーネントのテストを含むテストファイル
    index.css - ルート div のスタイルを含むファイル
    index.js - ルート div を親アプリコンポーネントにバインドする JavaScript ファイル
    logo.svg
```

この構造で作業しますが、一部変更を行います。はじめに`App.test.js` ファイルを削除します。

**注：** このアプリケーションのテストについては記述しません。これはチュートリアルのスコープ外だからです。 **ReactJS** アプリケーションのテストについて知りたい場合は、 [react アプリケーションを Jest でテストする](https://auth0.com/blog/testing-react-applications-with-jest/)をチェックしてください。

以下のように変更をしてください：

- `src`ディレクトリに `components` というフォルダを作成します。ここにコンポーネントを保存します。
- `components` ディレクトリに `CelebrityJokes.js` ファイルを作成します。このコンポーネントは有名人ジョークをフェッチし、それらをユーザーに表示することを管理します。
- `components` ディレクトリに `FoodJokes.js` ファイルを作成します。このコンポーネントは食べ物ジョークをフェッチし、それらをユーザーに表示することを処理します。
- `components` ディレクトリに `Nav.js` ファイルを作成します。このコンポーネントはアプリ中のナビゲーションを処理します。
- `src`ディレクトリに `utils` というフォルダを作成します。ここにヘルパー関数を保存します。
- `App.js` ファイルを削除します。（驚きましたか？ご心配なく。これは必要ありません。）

## _API データをフェッチする_

まず最初にしなければならないことは、Node バックエンドから API データをフェッチしてアプリに表示します。Node サーバーが実行中であることを確認します。

APIのフェッチを処理するために、ヘルパーファイルを作成しましょう。`utils`ディレクトリに`chucknorris-api.js` ファイルを作成します。

このファイルを開き、以下のようにコードを追加します。

```js

import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export {getFoodData, getCelebrityData};

function getFoodData() {
  const url = `${BASE_URL}/api/jokes/food`;
  return axios.get(url).then(response => response.data);
}

function getCelebrityData() {
  const url = `${BASE_URL}/api/jokes/celebrity`;
  return axios.get(url).then(response => response.data);
}

```

_chucknorris-api.js_

**注：** `npm install axios --save`を実行してアプリに `axios` をインストールします。

プロミスベースが高い http クライアント、 [axios](https://github.com/mzabriskie/axios)を使用します。この代わりに [superagent](https://github.com/visionmedia/superagent)を使うこともできます。

`getFoodData` 関数および `getCelebrityData` 関数では、axios が API エンドポイントからデータをフェッチします。次に`export {getFoodData, getCelebrityData};`を実行し、コンポーネントで使用する準備をします。

## _Navコンポーネントを構築する_

`Nav.js` ファイルがNavコンポーネントです。以下のようにコードを追加します。

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import '../App.css';

class Nav extends Component {

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Chuck Norris World</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Food Jokes</Link>
          </li>
          <li>
           <Link to="/special">Celebrity Jokes</Link>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><button className="btn btn-info log">Log In</button></li>
          <li><button className="btn btn-danger log">Log out </button></li>
        </ul>
      </nav>
    );
  }
}

export default Nav;

```

**注：** ターミナルを起動し、`npm install react-router@3.0.0 --save` のように `react-router` をインストールします。このブログを作成したタイミングでは、`react-router` は 4.0 アルファのため、その機能を利用することができます。

`react-router`の `Link` コンポーネントはページをリロードしないで、ルート間でシームレスなクライアントサイドの移行を可能にします。

## _CelebrityJokes および FoodJokes コンポーネントを構築する_

デフォルトでは、これら２つのコンポーネントは機能が同じように見えます。両方とも異なるエンドポイントからデータを表示します。`FoodJokes`コンポーネントから始めましょう。

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { getFoodData } from '../utils/chucknorris-api';


class FoodJokes extends Component {

  constructor() {
    super()
    this.state = { jokes: [] };
  }

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render() {

    const { jokes }  = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
          <div className="jumbotron text-center">
            <h2>Get Access to Celebrity Jokes By Logging In</h2>
          </div>
        </div>

        <div className="col-sm-12">
            <div className="jumbotron text-center">
              <h2>View Celebrity Jokes</h2>
              <Link className="btn btn-lg btn-success" to='/special'> Celebrity Jokes </Link>
            </div>
        </div>
      </div>
    );
  }
}

export default FoodJokes;

```

_FoodJokes.js_

**注：** [Class コントラクタの `super()`](http://cheng.logdown.com/posts/2016/03/26/683329)を使用する理由をご覧ください。

上記のコードを分析しましょう。`FoodJoke` コンポーネントは API からデータをpullするので、そのデータを保持する方法が必要です。そこで `state` を使用します。 **ReactJS** では、データを送信する `props` を使用し、そのデータを保持/管理する `state` を使用できます。

コンストラクターでは、以下のコードで表示したように初期状態を定義します。

```js
...
 constructor() {
    super()
    this.state = { jokes: [] };
  }
...
```

`getFoodJokes` メソッドでは、`chucknorris-api.js` ヘルパーファイルからエクスポートする`getFoodData`メソッドを呼び出し、以下に表示のように状態を設定します。

```js
...
 getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }
...
```

ここでは、 **ReactJS** ライフサイクル・フックのひとつ`componentDidMount` を利用しました。 このメソッドで定義したものを、コンポーネントがブラウザスクリーン上にマウントした直後に適用します。そこで、以下に表示のようにフックにある `getFoodJokes` を呼び出します。

```bash
...
 componentDidMount() {
    this.getFoodJokes();
  }
...
```


ここで実行しようとしているのは、`FoodJokes` コンポーネントがレンダーされた直後に API からデータをロードするために **ReactJS** を操作することです。

最後に、 **ReactJS** `render` メソッドでコンポーネントをレンダーします。これは、スクリーン上で実際にレンダリングするメソッドです。以下のコードのように、stateからロードしたジョークを `jokes` 定数に抽出しました。

スクリーン上に定数を表示する配列になる `jokes`定数をループスルーしました。

**注：**** ReactJS**では、何らかのデータをループスルーするとき、`key` プロパティを提供し、一意の値がなければなりません。そうでなければ、エラーが出力されます。

```js
...
 const { jokes }  = this.state;
...

{ jokes.map((joke, index) => (
            <div className="col-sm-6" key={index}>
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                </div>
                <div className="panel-body">
                  <p> { joke.joke } </p>
                </div>
              </div>
            </div>
))}

.....

```

では、`CelebrityJokes` コンポーネントを同様に構築しましょう。

```js

import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { getCelebrityData } from '../utils/chucknorris-api';

class CelebrityJokes extends Component {

  constructor() {
    super();
    this.state = { jokes: [] };
  }

  getCelebrityJokes() {
    getCelebrityData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getCelebrityJokes();
  }

  render() {

    const { jokes } = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Privileged Chuck Norris Celebrity Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-danger">
                  <div className="panel-heading">
                    <h3 className="panel-title"><span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
          <div className="jumbotron text-center">
            <h2>View Food Jokes</h2>
            <Link className="btn btn-lg btn-success" to='/'>Chuck Norris Food Jokes </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CelebrityJokes;

```

_CelebrityJokes.js_

`Nav`,`CelebrityJokes`, 及び `FoodJokes` コンポーネントを無事に作成できたので、一休みしましょう。

アプリが機能するためには、もうひとつのコンポーネントを処理する必要があります。それは何だと思いますか？そうです、ルート コンポーネントです。

## _ルート コンポーネントを構築する_

これは、ルーティングがアプリケーションでどのように機能すべきかを定義するコンポーネントで、アプリ全体を保留する `rootdiv` にバインドもします。

```js

import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import { Router, Route, browserHistory } from 'react-router';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes}/>
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));

```

_index.js_

お気づきかもしれませんが、ここではクラスを定義するのではなく、`Root` 関数を定義するだけです。 **ReactJS** がそれを許可します。続いて`react-router` からルーターをインポートします。


```js
...
<Router history={browserHistory}>
  <Route path="/" component={FoodJokes}/>
  <Route path="/special" component={CelebrityJokes}/>
</Router>
...
```

ルーティングはシンプルです。ユーザーが `/`ルートをヒットしたら、`FoodJokes`コンポーネントを表示するように定義しました。ユーザーが `/special` ルートをヒットしたら、`CelebrityJokes`コンポーネントを表示します。[The Beginner's guide to react router](https://medium.com/@dabit3/beginner-s-guide-to-react-router-53094349669#.7kmmo5n9a)を読むことでルーティングが **ReactJS** でどのように作用するかについてよく理解できます。

この `ReactDOM.render(<Root />, document.getElementById('root'));`は `root` div, のルートコンポーネントをレンダーします。これは **ReactJS** アプリケーションの開始ポイントです。

以下のように、必要なコンポーネントをすべてインポートします。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import { Router, Route, browserHistory } from 'react-router';

```

アプリケーションをブラウザーでチェックする前に、以下の数点を実行します。

- `public/index.html` を開き、 [ブートストラップ](http://getbootstrap.com/)を追加します。このときの html ファイルのコンテンツは以下のように表示されます。

{% highlight html %}

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
      <!--
        Notice the use of %PUBLIC_URL% in the tag above.
        It will be replaced with the URL of the `public` folder during the build.
        Only files inside the `public` folder can be referenced from the HTML.

        Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
        work correctly both with client-side routing and a non-root public URL.
        Learn how to configure a non-root public URL by running `npm run build`.
      -->
      <title>React App</title>
    </head>
    <body>
      <div id="root"></div>
      <!--
        This HTML file is a template.
        If you open it directly in the browser, you will see an empty page.

        You can add webfonts, meta tags, or analytics to this file.
        The build step will place the bundled scripts into the <body> tag.

        To begin the development, run `npm start`.
        To create a production bundle, use `npm run build`.
      -->
    </body>
  </html>

{% endhighlight %}

- App.css を開き、以下のようにこのスタイルを追加します。

{% highlight css %}

.navbar-right { margin-right: 0px !important}
.log {
  margin: 5px 10px 0 0;
}

{% endhighlight %}

アプリケーションをブラウザで自由にチェックしてください。この時点では以下のように表示されます。

![Homepage](https://cdn.auth0.com/blog/react/homepage.png)
_ホームページ_

![Celebritypage](https://cdn.auth0.com/blog/react/celebritypage.png)
_CelebrityPage_

![Chuck Norris World Demo](https://cdn.auth0.com/blog/react/chuck_norris_world.gif)
_現在のアプリケーション_

## _ReactJS アプリに認証機能を追加する_

日常的に使用するほとんどのアプリにはユーザーを認証する機能があります。 **ReactJS** アプリケーションに認証機能を簡単に追加する方法について説明します。認証サービスとして [Auth0](https://auth0.com/)を使用します。

Auth0 は [JSON Web トークン (JWTs)](https://jwt.io/)の発行を可能にします。Auth0 のアカウントを持っていない場合は、無料で [サインアップ](javascript:signup\(\))してアカウントを作成してください。

[**Auth0 が提供するFree アカウント**](https://auth0.com/pricing) **を利用して** 先進認証を開始します。

Auth0 [管理ダッシュボード](https://manage.auth0.com/)にログインし、新しい API クライアントを作成しましょう。API のメニュー項目がない場合、 [アカウント設定](https://manage.auth0.com/#/account/advanced)に移動してそれを可能にします。 **詳細設定** タブでは、 **API を有効にするセクション** が表示されるまでスクロールダウンして、スイッチを入れます。

ここからは、API メニュー項目をクリックして、 **API 作成** ボタンをクリックします。API にName(名前)とIdentifier(識別子)をつけます。この名前は何でもいいので、必要なだけ説明を加えます。識別子は API を識別するために使用され、このフィールドは一度設定したら変更できません。例として、API を **Chuck Norris World API** と名付け、識別子には **http://chucknorrisworld.com** を設定します。署名アルゴリズムは RS256 のままにし、CREATEボタンをクリックします。

![Creating the Chuck Norris World API](https://cdn2.auth0.com/blog/chucknorris/api.png)
_Chuck Norris World API を作成する_

次に、API のスコープを定義しましょう。スコープは API へのアクセス管理を可能にします。定義するスコープの数は必要に応じて行います。簡単な例として、単一スコープを作成し、これによって API へのフルアクセスがユーザーに許可されます。

![Locate scopes bar](https://cdn2.auth0.com/blog/chucknorris/scopes.png)
_スコープバーを検索する_

![Adding Scope to API](https://cdn2.auth0.com/blog/chucknorris/scopealljokes.png)
_スコープを追加する_

### _ノード API をセキュアする_

有名人エンドポイントが認証されたユーザーのみがアクセスできるようにするために、API をセキュアにする必要があります。Auth0 で簡単にセキュアできます。

`server.js` ファイルを開き、`YOUR-API-AUDIENCE-ATTRIBUTE` 変数および `YOUR-AUTH0-DOMAIN` 変数を API の視聴者属性および auth0 ドメインをそれぞれ定義します。続いて、`authCheck` ミドルウェアを以下のように有名人エンドポイントに追加します。

```js
app.get('/api/jokes/celebrity', authCheck, (req,res) => {
  let CelebrityJokes = [
  {
    id: 88881,
    joke: 'As President Roosevelt said: "We have nothing to fear but fear itself. And Chuck Norris."'
  },
  {
    id: 88882,
    joke: "Chuck Norris only let's Charlie Sheen think he is winning. Chuck won a long time ago."
  },
  {
    id: 88883,
    joke: 'Everything King Midas touches turnes to gold. Everything Chuck Norris touches turns up dead.'
  },
  {
    id: 88884,
    joke: 'Each time you rate this, Chuck Norris hits Obama with Charlie Sheen and says, "Who is winning now?!"'
  },
  {
    id: 88885,
    joke: "For Charlie Sheen winning is just wishful thinking. For Chuck Norris it's a way of life."
  },
  {
    id: 88886,
    joke: "Hellen Keller's favorite color is Chuck Norris."
  }
  ];
  res.json(CelebrityJokes);
})

app.listen(3333);
console.log('Listening on localhost:3333');

```

**注：** セキュリティの理由により、環境変数からこれらの値をロードします。Auth0 シークレットへのアクセスは誰にもありません。

もう一度 Postman から `http://localhost:3333/api/jokes/celebrity` エンドポイントにアクセスしてください。以下のようにアクセスが拒否されます。

![Unauthorized Access](https://cdn.auth0.com/blog/react/unauthorized.png)
_承認されていないアクセス_

次に、フロントエンドに認証を追加しましょう。

### _ReactJS フロントエンドに認証機能を追加する_

認証サービスを作成し、認証機能に関するすべてをアプリで処理します。`AuthService.js` ファイルを utilsディレクトリに作成します。

コードを追加する前に、`jwt-decode` パッケージおよび `auth0-js` node パッケージを以下のようにインストールする必要があります。

```bash
npm install jwt-decode auth0-js --save

```

`AuthService.js` ファイルを開き、以下のようにコードを追加します：

```js
import decode from 'jwt-decode';
import { browserHistory } from 'react-router';
import auth0 from 'auth0-js';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

const CLIENT_ID = '{AUTH0_CLIENT_ID}';
const CLIENT_DOMAIN = 'AUTH0_DOMAIN';
const REDIRECT = 'YOUR_CALLBACK_URL';
const SCOPE = 'YOUR_SCOPE';
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

export function logout() {
  clearIdToken();
  clearAccessToken();
  browserHistory.push('/');
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
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

上記のコードでは、`login` メソッドで [Auth0 Lock のホストされるバージョン](https://auth0.com/lock)を使い、資格情報にパスします。

Auth0 パッケージは Auth0 の`authorize`エンドポイントを呼び出します。メソッドにパスした詳細で認証を処理する検証および認可が行われます。認可メソッドにパスできる特定値についての詳細は [こちら](https://auth0.com/docs/libraries/auth0js/v8#login)をご覧ください。

まだ持っていないパラメータは `{AUTH0_CLIENT_ID}` と `{YOUR_CALLBACK_URL}` です。API を作成するとき、Auth0 はユーザーが使用できるテストクライアントも作成します。さらに、 [管理ダッシュボード](https://manage.auth0.com/#/clients)のクライアントセクションにある既存の SPA Auth0 クライアントを使用できます。

ダッシュボードから API の `Test` パネルをチェックしてください。以下のようなテストクライアントが表示されます。

![Chuck Norris World Client](https://cdn2.auth0.com/blog/app/chucknorrisclient.png)
_Chuck Norris World API クライアント_

では、クライアントメニューにアクセスし、テストクライアントをチェックしてください。クライアントのリストに以下のように表示されます。

![Chuck Norris World Test Client](https://cdn2.auth0.com/blog/chucknorris/testclient.png)

クライアントを開き、Client TypeをSingle Page Applicationに変更します。

> Non interactive Clientはコンピュータとコンピュータの対話で使用することを目的としています。API との対話に SPA を使用しているので、クライアントは SPA クライアントとなります。詳細については、Implicit Grantおよび [Client Credential exchange](https://auth0.com/docs/api-auth/grant/client-credentials)を参照してください。

クライアントのタイトルを `Chuck Norris World` に変更しましょう。

![Client Name Change](https://cdn2.auth0.com/blog/chucknorris/clientnamechange.png)

> クライアント名の変更はまったくのオプションです。

**CLIENT ID** をコピーして、変数 `CLIENT_ID` の `AUTH0_CLIENT_ID` の値と交換します。コールバック url を `http://localhost:3000/callback` に変更します。それを **Allowed Callback URLs** と、`http://localhost:3000` を**Allowed Origins (CORS)**に追加するのを忘れないようにしてください。

`getTokenExpirationDate` メソッドと `isTokenExpired` メソッドを介してトークンが期限切れになっていないかもチェックします。`isLoggedIn`メソッドはユーザー `id_token` メソッドンスと有効性を基にして `true`または `false`を返します。

最後に、ミドルウェアで`requireAuth` メソッドを実装しました。このメソッドを使用して、ログインしていないユーザーが `/special` ルートにアクセスしないようにします。

`Nav`コンポーネントを更新して、ユーザーの認証状態を基にして `login` ボタンと `logout` ボタンを非表示/表示しましょう。

これで、`Nav`コンポーネントは以下のように表示されます。

```js
import React, { Component } from 'react';
import { Link } from 'react-router';
import { login, logout, isLoggedIn } from '../utils/AuthService';
import '../App.css';

class Nav extends Component {

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">Chuck Norris World</Link>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Food Jokes</Link>
          </li>
          <li>
            {
             ( isLoggedIn() ) ? <Link to="/special">Celebrity Jokes</Link> :  ''
            }

          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
           {
             (isLoggedIn()) ? ( <button className="btn btn-danger log" onClick={() => logout()}>Log out </button> ) : ( <button className="btn btn-info log" onClick={() => login()}>Log In</button> )
           }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;

```

_Nav.js_

**注：** アロー関数を使って次のように onClick ハンドラーをラップし、実行します：`{() => login()}` [アロー関数で対応するイベントを処理](https://medium.com/@machnicki/handle-events-in-react-with-arrow-functions-ede88184bbb#.ekwwbituw)する方法をチェックしてください。

`AuthService`から `login`関数、`logout` 関数および `isLoggedIn` 関数をインポートします。 それから、`login()` および `logout()`関数を `login` および `logout` ボタンにそれぞれにアタッチします。

ユーザーの認証状態を `isLoggedIn()`関数を通してチェックして `/special` リンクを非表示にします。

`FoodJokes` コンポーネントを開き、以下のようにそれを変更します。

```js
import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from './Nav';
import { isLoggedIn } from '../utils/AuthService';
import { getFoodData } from '../utils/chucknorris-api';

class FoodJokes extends Component {

  constructor() {
    super()
    this.state = { jokes: [] };
  }

  getFoodJokes() {
    getFoodData().then((jokes) => {
      this.setState({ jokes });
    });
  }

  componentDidMount() {
    this.getFoodJokes();
  }

  render() {

    const { jokes }  = this.state;

    return (
      <div>
        <Nav />
        <h3 className="text-center">Chuck Norris Food Jokes</h3>
        <hr/>

        { jokes.map((joke, index) => (
              <div className="col-sm-6" key={index}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h3 className="panel-title"> <span className="btn">#{ joke.id }</span></h3>
                  </div>
                  <div className="panel-body">
                    <p> { joke.joke } </p>
                  </div>
                </div>
              </div>
          ))}

        <div className="col-sm-12">
          { isLoggedIn() ?
          <div className="jumbotron text-center">
            <h2>View Celebrity Jokes</h2>
            <Link className="btn btn-lg btn-success" to='/special'> Celebrity Jokes </Link>
          </div> : <div className="jumbotron text-center"><h2>Get Access to Celebrity Jokes By Logging In</h2></div>
          }
        </div>
      </div>
    );
  }
}

export default FoodJokes;

```

`isLoggedIn()`メソッドを通し、ユーザーのログイン状態を基にして有名人ジョークへのリンクを有効にします。

### コールバックコンポーネントを追加する

`Callback.js` という新しいコンポーネントを作成します。このコンポーネントは `localhost:3000/callback` ルートが呼び出されたときにアクティブ化され、Auth0 からリダイレクトを処理し、認証が成功したすぐ後に適切なデータの受信を確実にします。コンポーネントは `access_token` および `id_token` を保存します。

_Callback.js_

```js
import { Component } from 'react';
import { setIdToken, setAccessToken } from '../utils/AuthService';

class Callback extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    setAccessToken();
    setIdToken();
    window.location.href = "/";
  }

  render() {
    return null;
  }
}

export default Callback;

```

ユーザーが認証されたら、Auth0 はアプリケーションにリダイレクトし、 `/callback` ルートを呼び出します。この要求に対して Auth0 は `id_token` と `access_token` も追加し、コールバックコンポーネントはこれらのトークンを適切に処理し、localStorage に保存します。すべてがよければ、つまり `id_token` と `access_token` を受け取れば、`/`ページをリダイレクトし、ログイン状態になります。

### Auth0 ダッシュボードに値を追加する

ログインまたはサインアップする前に、 [Auth0 ダッシュボード](https://manage.auth0.com/#/)に行き、`http://localhost:3000/callback` を **Allowed Callback URLs URL** に、`http://localhost:3000` を**Allowed Origins (CORS)**に追加します。

### _Specialルートをセキュアする_

ブラウザーから `/special` をタイプしても、誰からも有名人ルートにアクセスできないようにする必要があります。

`index.js` を開き、 `requireAuth` の値で `onEnter` プロパティを `/special` ルートを以下のように追加します。

```js
...

import { requireAuth } from './utils/AuthService';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes} onEnter={requireAuth} />
      </Router>
    </div>
  )
}

```

_index.js_

アプリをテストする前にもうひとつすることがあります。`/callback` ルートを以下のようにルートファイルに登録します。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import CelebrityJokes from './components/CelebrityJokes';
import FoodJokes from './components/FoodJokes';
import Callback from './components/Callback';
import { Router, Route, browserHistory } from 'react-router';
import { requireAuth } from './utils/AuthService';

const Root = () => {
  return (
    <div className="container">
      <Router history={browserHistory}>
        <Route path="/" component={FoodJokes}/>
        <Route path="/special" component={CelebrityJokes} onEnter={requireAuth} />
        <Route path="/callback" component={Callback} />
      </Router>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));

```

では、ログインしてみてください。

![Lock Login Widget](https://cdn2.auth0.com/blog/chucknorris/loginbox.png)
_ホストされた Lock ログインウィジェット_

利用可能なスコープが表示されているユーザーコンテンツダイアログが、初めてユーザーに表示されます。ユーザーを認可したら、ユーザーをログインし、スコープに基づいてアクセスを許可します。

![User consent dialog](https://cdn2.auth0.com/blog/chucknorris/clientconsent.png)
_ユーザ __ーに認可に関するオプション__ が提示される_

**注：** ドメインに`localhost` を使っているので、ユーザーが初めてログインしたら、その後のログインではユーザーの認可同意ダイアログが必要ありません。この同意ダイアログは、ローカルホストでないドメインを使っており、クライアントはファーストパーティのクライアントの場合は表示されません。

![Logged In and Unauthorized to see the celebrity content](https://cdn2.auth0.com/blog/chucknorris/unauthorized.png)
_ログインしたが、有名人コンテンツを__表示する認可がない_

おっと！無事にログインしましたが、有名人ジョークのコンテンツが表示されず、コンソールには`401 Unauthorized` エラーが表示されます。 なぜでしょうか？

簡単です！以前、エンドポイントをセキュアしましたが、現時点では `access_token`をバックエンドにパスしていません。ヘッダーとして、要求とともにアクセストークンを送信する必要があり、ログインしたユーザーのセキュアなエンドポイントの認識を有効にします。

### _ChuckNorris API ヘルパーを更新する_

`utils/chucknorris-api.js` ファイルを開きます。`getCelebrityData` 関数を多少調整します。現在は、API からデータをフェッチするためだけに`GET`要求を開始します。

では、 以下のような `GET` 要求と共にベアラーアクセストークンで `Authorization` ヘッダーを送信するオプションをパスします。

```js
...
import { getAccessToken } from './AuthService';


function getCelebrityData() {
  const url = `${BASE_URL}/api/jokes/celebrity`;
  return axios.get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` }}).then(response => response.data);
}

```

`/api/jokes/celebrity` エンドポイントはヘッダーでトークンを受信し、ユーザーを検証します。有効であれば、コンテンツがユーザーに提供されます。

では、もう一度ログインしてください。

![Working Chuck Norris World App](https://cdn.auth0.com/blog/react/working_chuck_norris_app.gif)
_Chuck Norris World アプリを処理する_

すべてが順調です。よくできました。これまで、 **ReactJS** アプリを作り、それに認証を追加しました。

## _まとめ_

**ReactJS** は素晴らしいフロントエンドのライブラリで、ユーザーインターフェイスの構築に使用されます。仮想 DOM を利用し、高速で盛んなコミュニティがあります。React プラグイン/アドオンが複数あり、コミュニティはユーザーが **ReactJS** でほとんどすべてができるようにします。

また、Auth0 はユーザー名とパスワードによる認証だけでなく、 **ReactJS** アプリをセキュアにする助けになります。これは、 [多要素認証](https://auth0.com/multifactor-authentication), [異常検出](https://auth0.com/breached-passwords)、 [組織連携](https://auth0.com/docs/identityproviders)、 [シングルサインオン (SSO)](https://auth0.com/docs/sso)、その他の機能を提供します。 [サインアップ](javascript:signup(/))して、アプリに固有な構築機能を活用してください。

Auth0 はパスワードのリセット、作成やプロビジョニング、ユーザーのブロックと削除を含む、シンプルで非常に使いやすい [ユーザー ID を管理する管理者を助けるユーザーインターフェースツール](https://auth0.com/user-management)を提供しています。
