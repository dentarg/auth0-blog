---
layout: post
title: "Angular 2 認証チュートリアル"
description: "Angular 2.0 が正式にリリースされました。アプリを素早く構築する方法や認証を正しく追加する方法について学びます。"
date: 2016-09-29 08:30
category: Technical Guide, Angular, Angular2
banner:
  text: "Auth0 makes it easy to add authentication to your AngularJS application."
author:
  name: "Ado Kukic"
  url: "https://twitter.com/kukicado"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design:
  image: https://cdn.auth0.com/blog/angular/logo3.png
  bg_color: "#012C6C"
tags:
- angular2
- angular2-jwt
- angular2-authentication
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: angular-2-authentication
---

**このブログは2016/09/29に掲載されたものを翻訳したものです。**

---
TL; DR Angular 2.0 が正式にリリースされました。このチュートリアルでは、Angular 2 でアプリケーションを構築する方法やトークンベースの認証を Angular 2 アプリに正しく追加する方法を見てみましょう。[Github レポジトリ](https://github.com/auth0-blog/angular-2-authentication-tutorial)から完了したコード例をチェックします。

---

[Angular 2](https://angular.io/)はわずか数週間前に、ついに [2.0 リリース](http://angularjs.blogspot.com/2016/09/angular2-final.html) という大きなマイルストーンに達しました。Angular 2 の最終リリースは互換性を破る変更はあまりありませんでした。最終からわずか数週間前に入手可能になった Release Candidate 5 (RC5) は互換性を破る大きな変更や、 [@NgModule デコレータ](https://angular.io/docs/ts/latest/guide/ngmodule.html)、 [Ahead-of-Time (AOT)](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/)コンパイラなどの追加を導入しました。

今回のチュートリアルでは、これら新しい機能を活用して Angular 2 アプリケーション全体を構築します。コンポーネント、@NgModule、ルートガード、サービスなどはこれから触れるトピックの一部です。最後に、 [Auth0](https://auth0.com/)でトークンベースの認証を実装します。

## _Angular 2 エコシステム_

[Angular 1.x](https://angularjs.org/)はシングルページアプリケーション（SPA）の堅固なフレームワークとして高く評価されています。たくさんのことを実行し、一部下回りましたが、全般的にはデベロッパーは強力なアプリケーションを素早く構築できます。

Angular 1.x はひとつのフレームワークですが、 [Angular 2](https://angular.io/)はモダンアプリケーションを構築するためのプラットフォーム全体です。プラットフォームはコア Angular 2 ライブラリと一緒に、 [Angular CLI](https://cli.angular.io/)と呼ばれる強力なコマンドラインインターフェース（CLI）と共に提供されます。これによって、デベロッパーはアプリケーションを簡単にスキャフォールディングしたり、システム構築のコントロールができるようになります。 [Angular Universal](https://universal.angular.io/)はAngular 2 アプリケーションにサーバーサイドレンダリングをします。 [Angular Material 2](https://material.angular.io/)はデベロッパーによる素晴らしいアプリケーションの構築を簡単にする、 [Google Material Design](https://material.google.com/)の公式な実装です。

Angular 2.0 は公式に出荷されましたが、その他のプラットフォームのコンポーネントはまだアルファとベーダの段階にいます。今回のアプリケーションでは、Angular CLI およびコア Angular 2 フレームワークを活用しますが、その他コンポーネントはもう少し後になります。

{% include tweet_quote.html quote_text="Angular 1 はひとつのフレームワークですが、Angular 2 はモダンアプリケーションを構築するためのプラットフォーム全体です" %}

## _今回構築する__アプリ：Daily Deals_

![Daily Deals App](https://cdn.auth0.com/blog/angular2-auth-dd/daily-deals.png)

今回構築するアプリは Daily Deals というものです。Daily Deals アプリはさまざまな製品についての価格や割引価格のリストを表示します。誰もが見ることができ、一般に公開される価格のリストや、登録メンバーだけが利用できるプライベート価格のリストを用意します。プライベート価格は登録メンバーに限定するので、お手頃な価格になるでしょう。

### _販売価格を提供する_

毎日の価格をどこからか取得します。価格に使用する非常にシンプルな [Node.js](https://nodejs.org/)バックエンドを構築しましょう。パブリック価格で使用し、一般ユーザーが使用可能なルートと、認証済みユーザーだけが呼び出すことができる保護ルートを用意します。現時点では、両方のルートを公開し、認証は後ほど実行することにします。以下の実装をご覧ください。

```js
'use strict';
// Load dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// パブリック ルート
app.get('/api/deals/public', (req, res)=>{
  let deals = [
     // パブリック価格のアレイはここです
  ];
  res.json(deals);
})

// プライベート ルート
app.get('/api/deals/private', (req,res)=>{
  let deals = [
    // Array of Private Deals here
  ];
  res.json(deals);
})

app.listen(3001);
console.log('Serving deals on localhost:3001');
```

サーバーと構築する Angular 2 アプリの両方は Node.js および [NPM](https://npmjs.com/)を必要とするので、継続する前にそれらをインストールしてください。販売価格のリストを取得して自分で作成するために、[Github レポジトリ](https://github.com/auth0-blog/angular-2-authentication-tutorial)をチェックしてください。各取引のモデルは以下のとおりです。

```js
 {
    id: 1234,
    name: 'Name of Product',
    description: 'Description of Product',
    originalPrice: 19.99, // Original price of product
    salePrice: 9.99 // Sale price of product
}
```

一般小売価格と特別価格の準備ができたら、`node server` を実行してサーバーを開始し、`localhost:3001/api/deals/public` および `localhost:3001/api/deals/private` の両方に移動し、追加した取引リストが見えるようにします。 次に、Angular 2 フロントエンドをセットアップしましょう。

### _Angular 2 フロントエンドをセットアップする_

新しい Angular 2 アプリを構築し始める最適な方法のひとつは公式 Angular 2 CLI を使うことです。CLI は初期アプリのスキャフォールディング、追加コンポーネントの追加、ビルドシステムの処理などが可能です。このチュートリアルでは、CLI で最初のアプリを初期設定します。

まだAngular CLIをインストールしていないのであれば、`npm install angular-cli -g`を実行してAngular CLI をインストールします。`ng`コマンドを使って、CLI と対話します。 新しいアプリケーションを作成するには、ディレクトリを選択し、`ng init` を実行します。これによって、新しい Angular 2 アプリケーションが選択されたディレクトリに作成され、必要な NPM パッケージをすべてダウンロードし、すべてをセットアップします。

`ng init` が終了したら、`ng serve` コマンドを実行し、ビルドシステムベースの Webpack が TypeScript から JavaScript にアプリをコンパイルし、`localhost:4200`でアプリを提供します。`ng serve`コマンドも`live sync`プロセスをキックオフするので、変更を加えるといつでもアプリは自動的に再コンパイルします。

`localhost:4200`に移動して、これまで予想通りにすべてが処理されているか確認します。「App Works!」というメッセージが表示されれば正常です。次に、Angular 2 アプリが初期設定されたかを確認してみましょう。

`ng init` コマンドは Angular 2 アプリを初期設定し、たくさんのファイルを追加します。現時点では、エンドツーエンドテストを含む `e2e` フォルダのようなものを無視します。`src` ディレクトリを開いてみるとsrc ディレクトリには、`index.html`、`styles.css`などのような見慣れたファイルが表示されます。`app`ディレクトリを開いてみましょう。

`app` ディレクトリにはアプリケーションのほとんどのファイルがあります。デフォルトで、次のファイルが提示されます (最新版ではファイル名が異なっていたり足りないファイルがあるかもしれません)。

```
- app.component.css - // ルートコンポーネントの CSS スタイルを保持します
- app.component.html - // ルートコンポーネントの HTML ビューを保持します
- app.component.spec - //ルートコンポーネントのテストを保持します
- app.component.ts - // ルートコンポーネントの TypeScript ロジックを保持します
- app.module.ts - // アプリの依存関係を定義します
- index.ts - // アプリケーションをエクスポートします
- shared - // このディレクトリは持っている全ての共有コンポーネントを保持します
```

我々が書いたそれぞれのAngular 2 コンポーネントには少なくとも `*.component.ts` ファイルがあり、その他はオプションです。アプリケーションには3つのコンポーネントがあります。メインまたはルートコンポーネント、一般販売価格を表示するコンポーネント、そして特別価格を表示するコンポーネントです。ルート コンポーネントでは、テンプレートを埋め込みますが、テスト書き込みはしません。以下のように編集をしましょう。

- `app.component.css`、`app.component.html` および `app.component.spec` ファイルを削除します。`app.component.ts` ファイルでルートコンポーネントに必要なすべてを定義します。
- `public-deals.component.ts`、`public-deals.component.html`、および `public-deals.component.css` ファイルを作成する。このコンポーネントはパブリック取引データを取得し、表示する処理をします。
- `private-deals.component.ts`、`private-deals.component.html`、および`private-deals.component.css` ファイルを作成する。このコンポーネントはプライベート取引データを取得し、表示する処理をします。
- `deal.ts` ファイルを作成する。このコンポーネントは `deal` クラスを保留し、`deal` の構造をAngular 2 に表示します。
- `deal.service.ts` ファイルを作成する。ここでは、API からデータを入手・取得する機能を追加します。
- 最後に、ルートを処理する `routing.ts` ファイルを作成する。

### _ルート コンポーネントを構築する_

Angular 2 アプリケーションにはルートコンポーネントが必要です。名前は何でも構いませんが、重要なことは名前があることです。このアプリケーションでは、`app.component.ts` ファイルがルートコンポーネントになります。このコンポーネントの実装を見てみましょう。

```js
// コンポーネントデコレーターをインポートします
import { Component } from '@angular/core';

@Component({
  // ルートコンポーネントを販売価格と呼びます
  selector: 'daily-deals',
  template: `
  <div class="container">
    <nav class="navbar navbar-default">
        <div class="navbar-header">
          <a class="navbar-brand" routerLink="/dashboard"></a>
        </div>
        <!-- On the left side of our navbar we'll display the two links for public and private deals -->
        <ul class="nav navbar-nav">
          <li>
            <a routerLink="/deals" routerLinkActive="active">Deals</a>
          </li>
          <li>
            <a routerLink="/special" routerLinkActive="active">Private Deals</a>
          </li>
        </ul>
        <!-- ナビゲーションバーの右側に、ユーザー状態に基づいてログインとログアウトのアクションが表示されます -->
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a>Log In</a>
          </li>
          <li>
            <a>Log Out</a>
          </li>
        </ul>
    </nav>
    <div class="col-sm-12">
      <!-- router-outlet ディレクティブはルートに基づいてコンポーネントを表示します。この詳細は後日説明します  -->
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  // ナビゲーションバーを正しく表示するためにインラインスタイルを追加します
  styles : ['.navbar-right { margin-right: 0px !important}']
})
export class AppComponent {

  title = 'Daily Deals';

  constructor() {}
}
```

ルートコンポーネントを作成しました。インラインテンプレートやインラインスタイルの一部を追加しました。全ての機能をまだ追加していませんので、全てのユーザーが全てのリンクや、ログインおよびログアウトボタンを見ることができます。それらの実装は後で行います。

このコンポーネントを使用するには、ディレクトリの `index.html` ファイルを開き、`<my-app></my-app>` と `<daily-deals></daily-deals>` を交換します。クラス名 `AppComponent` をそのままにしたので、`app.module.ts` ファイルを編集する必要はありません。localhost:4200 にアクセスし、表示したアプリを見ることができます。表示されているのはトップ ナビゲーションバーだけで、それ以外はまだ見ることはできません。

### _価格のタイプ_

[TypeScript](https://www.typescriptlang.org/)でオブジェクトの構造またはタイプの定義が可能になります。これには役に立つ目的がたくさんあります。ひとつは、オブジェクトの構造を定義すれば、intellisense を通してオブジェクトのデータをすべて取得できます。データ構造または取引するオブジェクトのタイプを知ることで、コンポーネントのテストがさらに簡単になります。

このアプリでは、そのようなタイプを作成します。`deal.ts` ファイルでは、価格のタイプを定義します。これをどのようにして実現をするか見てみましょう。

```
export class Deal {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
}
```

これで、Angular 2 アプリケーションのオブジェクトが `deal` のタイプになることを宣言できます。これらのオブジェクトはdealタイプのプロパティとメソッドをすべて得ます。ここではプロパティだけを定義し、ほかのメソッドはありません。

### _パブリックおよびプライベート価格コンポーネント_

パブリックおよびプライベート価格コンポーネントはよく似ています。実際に、２つのコンポーネントの唯一の違いは、ひとつはパブリック API から価格を表示し、もうひとつはプライベート API から価格を表示することです。将来のために、コンポーネント実装のひとつだけを表示します。`public-deals.component.ts` を実装しましょう。

```js
import { Component, OnInit } from '@angular/core';
import { Deal } from './deal';
// これらのサービスはまだ定義していません
import { AuthService } from './auth.service';
import { DealService } from './deal.service';

@Component({
  selector: 'public-deals',
  // CSS スタイルと HTML ビューの両方に外部ファイルを使用します
  templateUrl: 'public-deals.component.html',
  styleUrls: ['public-deals.component.css']
})
export class PublicDealsComponent implements OnInit {
  publicDeals: Deal[];
  
  // 注：価格または Auth サービスはまだ実装していません。
  constructor(
    private dealService: DealService,
    private authService: AuthService) {
  }
  // このコンポーネントが読み込まれたら、dealService を呼び出し、パブリック価格を取得します。
  ngOnInit(): void {
    this.dealService.getPublicDeals()
      .then(deals => this.publicDeals = deals);
  }
  
  purchase(item){
    alert("You bought the: " + item.name);
  }
}
```

次に、パブリック価格コンポーネントのビューを構築しましょう。`public-deals.component.html` ファイルでこれを処理します。ビューは HTML と Angular 2 sugar の混合になります。どのように実現するか見てみましょう。


```html
  <h3 class="text-center">Daily Deals</h3>

  <!-- publicDeals 変数に保存されている価格のアレイを取得します。ngFor ディレクティブを使ってその変数をここにループします。  -->
  <div class="col-sm-4" *ngFor="let deal of publicDeals">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">{{deal.name}}</h3>
      </div>
      <div class="panel-body">
        {{deal.description}}
      </div>
      <div class="panel-footer">
        <ul class="list-inline">
          <li>Original</li>
          <li class="pull-right">Sale</li>
        </ul>
        <ul class="list-inline">
          <li><a class="btn btn-danger">${{deal.originalPrice | number}}</a></li>
          <li class="pull-right"><a class="btn btn-success">${{deal.salePrice | number}}</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- authService.loggedIn() メソッドを使ってユーザーがログインしているかどうかを確認します。ユーザーがログインしていなければ、ログインするように奨励します。ログインしていれば、プライベート価格への便利なリンクを提供します。authService はまだ実装していないので、ファンクションはまだ心配しないでください  -->
  <div class="col-sm-12" *ngIf="!authService.loggedIn()">
    <div class="jumbotron text-center">
      <h2>Get More Deals By Logging In</h2>
    </div>
  </div>

  <div class="col-sm-12" *ngIf="authService.loggedIn()">
    <div class="jumbotron text-center">
      <h2>View Private Deals</h2>
      <a class="btn btn-lg btn-success" routerLink="/special">Private Deals</a>
    </div>
  </div>
```

最後に、ユーザー設定のスタイルを追加しましょう。`public-deals.component.css` ファイルには以下を追加します。

```css
.panel-body {
	min-height: 100px;
}
```

これで、各製品がページ上にきちんと表示されます。

プライベート価格コンポーネントはとてもよく似ています。将来のために、初期設定は表示しません。後ほど、その変更について説明します。確認してみたい場合には、 [Github レポジトリ](https://github.com/auth0-blog/angular-2-authentication-tutorial)から表示できます。

### _価格 API にアクセスする_

チュートリアルの始めで、２つのルートを公開する非常にシンプルな API について説明しました。では、これら２つのエンドポイントと対話する Angular 2 サービスを作成しましょう。これを `deal.service.ts` ファイルで処理します。実装は以下のとおりです。

```
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Deal } from './deal';

@Injectable()
export class DealService {
  // 対話するルートを定義します
  private publicDealsUrl = 'http://localhost:3001/api/deals/public';
  private privateDealsUrl = 'http://localhost:3001/api/deals/private';

  constructor(private http: Http) { }
  
  // パブリック価格を取得するためにメソッドを実装します
  getPublicDeals() {
    return this.http
      .get(this.publicDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }

  // プライベート価格を取得するためにメソッドを実装します
  getPrivateDeals() {
    return this.http
      .get(this.privateDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }

  // エラーがあれば処理するためにメソッドを実装します
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
```

getPublicDeals() メソッドが `public-deals.component.ts` ファイルのどこにフィットするかご覧ください。プライベート価格のリストを取得する `getPrivateDeals()` メソッドも書きました。このメソッドは `private-deals.component.ts` ファイルで実装します。

### _ルートを実装する_

これで、２つのコンポーネントを作成しました。ルーティングを実装して、適切なコンポーネントを表示できるようにしましょう。Angular 2 のルーティングは何度か変更されました。最新ルーターは本当に素晴らしく、遅延読み込みなど開発者が求めているたくさんの機能をサポートしています。

アプリケーションのために、２つのルートを作成します。`/deals` ルートは一般小売価格を表示し、`/special` ルートは登録ユーザーだけがアクセスするの特別価格を表示します。リダイレクトも追加し、ユーザーがホームページにランディングしたとき、自動的に価格ページにリダイレクトされるようにします。これをどのように実装するか見てみましょう。

```js
import { Routes, RouterModule} from '@angular/router';

// コンポーネントをインポートします
import { PublicDealsComponent } from './public-deals.component';
import { PrivateDealsComponent } from './private-deals.component';

const appRoutes: Routes = [
  // リダイレクトを追加します
  {
    path: '',
    redirectTo: '/deals',
    pathMatch: 'full'
  },
  // ルートを追加します
  {
    path: 'deals',
    component: PublicDealsComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent
  }
];
// ここで、ルートをエクスポートします
export const routing = RouterModule.forRoot(appRoutes);
// ここで、ルーティングコンポーネントを単一アレイに結合します。これは後ほど、ルートモジュールを更新するときに使用します
export const routedComponents = [PublicDealsComponent, PrivateDealsComponent];
```

ルーティングは良好のようです。アプリケーション全体をテストする用意ができました。アプリケーションのテストを開始する前に、すべてが正しく機能するためにもうひとつ実行することがあります。_注：チュートリアルを終える前にアプリケーションのテストをする場合は、_価格_コンポーンエントから_ `AuthService` _を削除してください。この作業を実行しないと、Angular はエラーを返します。_

ルート @NgModule を更新して、新しいコンポーネントと書き込んだサービスのすべてを含みます。このためには、`app.module.ts` ファイルを開きます。このファイルには、Angular ブートストラップが作成したルートモジュールが表示されます。それを以下のように編集します。

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// 依存関係をインポートします
import { AppComponent } from './app.component';
import { routing, routedComponents } from './app.routing';

import { DealService } from './deal.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    // ルーティングモジュールを含みます
    routing,
    HttpModule,
  ],
  declarations: [
    AppComponent,
    // ルーティングコンポーネントのアレイを含みます。これで、コンポーネントのリスト全体を2度タイプしなくて済みます
    routedComponents
  ],
  providers: [
    // 前に作成した価格サービスを追加します
    DealService
  ],
  // AppComponent であるルートコンポーネントを宣言します
  bootstrap: [AppComponent]
})
export class AppModule { }
```

これで、アプリのテストをする用意ができました。@NgModule がどのように機能するかについて詳細を知りたければ、この投稿をチェックしてください。`localhost:4200` にアクセスすると、価格ページに自動的にリダイレクトされます。自由に `/secret` ルートに移動して、特別価格も表示されるのが分かります。まだユーザー認証を追加していないので、これが可能です。では、それを実行しましょう。

## _Angular 2 アプリに認証を追加する_

大部分のアプリは何らかのタイプの認証が必要です。今回のアプリケーションも例外ではありません。次のセクションでは、Angular 2 アプリケーションに認証を正しく追加する方法について説明します。ID プラットフォームとして [Auth0](https://auth0.com/)を使用します。Auth0 は [JSON Web トークン (JWT)](https://jwt.io/)の発行が簡単なのでこれを使用しますが、これから説明するコンセプトは認証システムをベースとするどんなトークンにも適用できます。Auth0 アカウントを持っていない場合は、無料で [サインアップ](javascript:signup\(\))してアカウントを作成してください。

Auth0 [管理ダッシュボード](https://manage.auth0.com/)にログインし、新しい API クライアントを作成しましょう。API のメニュー項目がない場合、 [アカウント設定](https://manage.auth0.com/#/account/advanced)に移動してそれを可能にします。 **詳細設定** タブでは、 **API を有効にするセクション** が表示されるまでスクロールダウンして、スイッチを入れます。

ここから、API メニュー項目をクリックして、 **API 作成** ボタンをクリックします。API にName(名前)とIdentifier(識別子)をつけます。この名前は何でもいいので、必要なだけ説明を加えます。識別子は API を識別するために使用され、このフィールドは一度設定したら変更できません。例として、API を **Daily Deals API** と名付け、識別子には **daily-deals-api**.を設定します。署名アルゴリズムは RS256 のままにし、CREATEボタンをクリックします。

 ![Creating Auth0 API](https://cdn.auth0.com/blog/angular2-auth-dd/creating-api.png)

次に、API のスコープを定義しましょう。スコープは API へのアクセス管理を可能にします。定義するスコープの数は必要に応じて行います。簡単な例として、単一スコープを作成し、これによって API へのフルアクセスがユーザーに許可されます。

 ![Adding Scope to API](https://cdn.auth0.com/blog/angular2-auth-dd/adding-scope.png)


現時点でやることはこれだけです。作成したこの新しい API を使ってサーバーをセキュアしましょう。

### _サーバーをセキュアする_

Angular 2 アプリケーションのフロントエンドに認証を実装する前に、バックエンドサーバーをセキュアしましょう。`server` ディレクトリにある `server.js` ファイルを開き、以下の編集をします。

```js
'use strict';

const express = require('express');
const app = express();
// 必要な依存関係をインポートします
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// トークンの有効性を確保する JWT ミドルウエアを実装します。それぞれ保護されたルートには認可ヘッダーに送信する有効な access_token が必要です
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/.well-known/jwks.json"
    }),
    // これは API を作成したときに設定した識別子です
    audience: '{YOUR-API-AUDIENCE-ATTRIBUTE}',
    issuer: "https://{YOUR-AUTH0-DOMAIN}.auth0.com/",
    algorithms: ['RS256']
});

app.get('/api/deals/public', (req, res)=>{
  let deals = [
     // パブリック価格のアレイ
  ];
  res.json(deals);
})

// プライベートルートには、この authCheck ミドルウェアを追加します
app.get('/api/deals/private', authCheck, (req,res)=>{
  let deals = [
    // プライベート価格のアレイ
  ];
  res.json(deals);
})

app.listen(3001);
console.log('Listening on localhost:3001');
```

サーバーの編集はこれだけです。サーバーを再起動し、`localhost:3001/api/deals/private` に移動しようとすると、「承認ヘッダーが見つかりません」というエラーメッセージが表示されます。プライベート API ルートがこれでセキュアになりました。Angular 2 アプリの認証実装に移りましょう。

 ![API with No Auth Token](https://cdn.auth0.com/blog/angular2-auth-dd/no-auth-token.png)

### _フロントエンドに認証を追加する_

[Angular 2 JWT ライブラリ](https://github.com/auth0/angular2-jwt)を活用して、アプリの認証実装をする基盤を作ります。`npm install angular2-jwt --save` を実行して、アプリのライブラリを取得します。

まず、アプリ中で使用できる認証サービスを作成することから始めます。タイトルが `auth.service.ts` という新しいファイルを作成します。 認証サービスの実装は以下のとおりです。

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth0-variables';
import { tokenNotExpired } from 'angular2-jwt';

// 警告にない名前は避けてください
declare var auth0: any;

@Injectable()
export class AuthService {
  // Auth0 web auth インスタンスを作成します
  // @TODO:AUTH_CONFIG を更新し、src/app/auth/auth0-variables.ts.example にある .example 拡張子を削除します
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN
  });

  // アプリ全体で通信するためにログイン状態のストリームを作成します
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // 認証されたら、ローカルプロファイルプロパティを設定し、ログイン状態の件名を更新します
    if (this.authenticated) {
      this.setLoggedIn(true);
    }
  }

  setLoggedIn(value: boolean) {
    // ログイン状態の件名を更新します
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 認可要求
    // 注：nonce は自動的に次を生成します：https://auth0.com/docs/libraries/auth0js/v8#using-nonce
    this.auth0.authorize({
      responseType: 'token id_token',
      redirectUri: AUTH_CONFIG.REDIRECT,
      audience: AUTH_CONFIG.AUDIENCE,
      scope: AUTH_CONFIG.SCOPE
    });
  }

  handleAuth() {
    // Auth0 ハッシュが解析されたら、プロファイルを取得します
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._getProfile(authResult);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.error(`Error: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // ユーザーのプロファイルを取得してセッションを設定するために、アクセストークンを使用します
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    // セッションデータを保存し、ログイン状態の件名を更新します
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.setLoggedIn(true);
  }

  logout() {
    // トークンとプロファイルを削除し、ログイン状態の件名を更新します
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }

  get authenticated() {
    // 有効期限切れのアクセストークンがないか、チェックします
    return tokenNotExpired('token');
  }

}
```

ユーザーの認証に、Auth0 Hosted Lock オプションを使います。これはユーザーを認証する最もセキュアな方法で、OAuth に準拠した方法で `access_token` を取得します。認証サービスを作成したので、続けて認証ワークフローを構築しましょう。

### _Angular 2 認証機能を全て組み込む_

Angular 2 ルーターは [ルートガード](https://angular.io/docs/ts/latest/guide/router.html#!#guards)と呼ばれる強力な機能を搭載しており、これはユーザーがルートをアクセスできるか否かをプログラムで決定します。Angular 2 のルートガードは Express.js のミドルウェアのようなものと比較されます。

認証ルートガードを作成し、ルートが表示される前にユーザーがログインしているかをチェックします。タイトルが `auth-guard.service.ts`  という新しいファイルを作成し、次のコードを追加します。

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
// 認証サービスをインポートします
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    // ユーザーがログインしていなければ、ホームページに送り返します
    if (!this.auth.authenticated) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
```

ルートでこのルートガードを実装するには、`app.routing.ts` ファイルを開きましょう。ここでは、認証ガードサービスを含み、シークレットルートでそれを有効にします。実装について見てみましょう。

```js
// ここでは、CanActivate API も含んでいます
import { Routes, RouterModule, CanActivate } from '@angular/router';
// AuthGuard サービスを追加します
import { AuthGuard } from './auth-guard.service';

import { PublicDealsComponent } from './public-deals.component';
import { PrivateDealsComponent } from './private-deals.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/deals',
    pathMatch: 'full'
  },
  {
    path: 'deals',
    component: PublicDealsComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent,
    // canActivate API を使って AuthGuard にパスします。これで /special ルートがヒットしたら AuthGuard がまず実行され、このルートがアクティブ化して読み込む前に、ユーザーが確実にログインするようにします。
    canActivate: [AuthGuard]
  }
];

export const routing = RouterModule.forRoot(appRoutes);

export const routedComponents = [PublicDealsComponent, PrivateDealsComponent];
```

実装はこれだけです。このアプリの画面推移はルーティングレベルで保護されています。

前に、取引コンポーネントに AuthService のスタブを含みました。認証サービスが実装されたので、プレースホルダーは正しく機能するでしょう。ユーザー状態に基づいて表示される正しい動作が表示されます。

認証の固有機能を含まなかったので、ルートコンポーネントを更新する必要があります。この例を1行1行確認することができるように、故意にこのようにしました。次にそれを確認しましょう。

```js
import { Component } from '@angular/core';
// 何よりもまず、認証サービスを含みます
import { AuthService } from './auth.service';

@Component({
  selector: 'daily-deals',
  template: `
  <div class="container">
    <nav class="navbar navbar-default">
        <div class="navbar-header">
          <a class="navbar-brand" routerLink="/dashboard">{{title}}</a>
        </div>
        <ul class="nav navbar-nav">
          <li>
            <a routerLink="/deals" routerLinkActive="active">Deals</a>
          </li>
          <li>
            <a routerLink="/special" *ngIf="authService.authenticated" routerLinkActive="active">Private Deals</a>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a *ngIf="!authService.authenticated" (click)="authService.login()">Log In</a>
          </li>
          <li>
            <a (click)=authService.logout() *ngIf="authService.authenticated">Log Out</a>
          </li>
        </ul>
    </nav>
    <div class="col-sm-12">
      <router-outlet></router-outlet>
    </div>
  </div>
  `,
  styles : ['.navbar-right { margin-right: 0px !important}']
})
export class AppComponent {
  title = 'Daily Deals';

  // ビューにある API へのアクセスを得るためにコンストラクターの authService に参照を含む必要があります
  constructor(private authService: AuthService) {
  }
}
```

ユーザーがログインリンクをクリックすると、Auth0 ドメイン上でホストされた Lock ログインページに移動します。ここで資格情報を入力し、正しければ、アプリケーションにリダイレクトされます。

この機能をテストする前に、資格情報が正しいことを確認し、認証サービスがどのパラメータをホストされたページに渡すかを認識できるようにします。`auth0-variables.ts` という新ファイルを作成し、以下をペーストします。

```js
interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'YOUR-AUTH0-CLIENT-ID',
  CLIENT_DOMAIN: 'YOUR-AUTH0-DOMAIN.auth0.com',
  AUDIENCE: 'YOUR-AUTH0-API-IDENTIFIER',
  REDIRECT: 'http://localhost:4200/callback',
  SCOPE: 'openid'
};

```

このファイルは `auth.service.ts` ファイルにすでにインポートしているので、それを作成したら、`YOUR-AUTH0-CLIENT-ID`、`YOUR-AUTH0-DOMAIN`、および `YOUR-AUTH0-API-IDENTIFIER` を実際の値に変更する以外は何もする必要はありません。`YOUR-AUTH-CLIENT-ID` は Auth0 クライアントになり、ユーザーを保留します。API を作成するとき、Auth0 はユーザーが使用できるテストクライアントも作成します。さらに、 [管理ダッシュボード](https://manage.auth0.com/#/clients)のクライアントセクションにある既存の Auth0 クライアントを使用できます。

このアプリのために作成したクライアントは **Daily Deals API (テストクライアント)** と呼ばれ、API で機能するように設定されているので、このクライアントをアプリケーションに使用します。クライアントを開き、 **クライアント ID** をコピーします。この値を `YOUR-AUTH0-CLIENT-ID` パラメータと交換します。その他２つのプレースホルダーも同様に、処理します。

![Daily Deals API Test Client](https://cdn.auth0.com/blog/angular2-auth-dd/dd-client.png)

Auth0 ダッシュボードのクライアントを表示しながら、Allowed Callback URLs(**許可されたコールバック URL)** というタイトルのセクションまでスクロールダウンします。ここで URL を追加し、ユーザーの認証または作成が正常に終わったら、Auth0 がリダイレクトします。Angular CLI を使っているので、`localhost:4200` にデフォルトにし、 **許可されたコールバック URL** セクションでは以下を追加します。

```
http://localhost:4200/callback
```

### _コールバックコンポーネントを作成する_

`CallbackComponent` と呼ばれる新しいコンポーネントを作成します。このコンポーネントは `localhost:4200/callback` ルートが呼び出されたときにアクティブ化され、Auth0 からリダイレクトを処理し、認証が成功したすぐ後に適切なデータの受信を確実にします。コンポーネントは先ほど作成した `AuthService` を最大限に活用します。 実装について見てみましょう。

```js
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  template: ``
})
export class CallbackComponent {

  constructor(private authService: AuthService) {
    this.authService.handleAuth();
  }
}
```

ユーザーを認証したら、Auth0 はアプリケーションにリダイレクトし、 `/callback` ルートを呼び出します。この要求に対して Auth0 は `id_token` と `access_token` も追加し、CallbackComponent がこれらトークンを正しく処理し、localStorage に保存します。すべてがよければ、つまり `id_token`と `access_token` を受け取れば、/dealsページにリダイレクトし、ログイン状態になります。

次に進む前に、`/callback` ルートをルートファイルに登録しましょう。

```js
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

import { PublicDealsComponent } from './public-deals.component';
import { PrivateDealsComponent } from './private-deals.component';
import { CallbackComponent } from './callback.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/deals',
    pathMatch: 'full'
  },
  {
    path: 'deals',
    component: PublicDealsComponent
  },
  {
    path: 'special',
    component: PrivateDealsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'callback',
    component: CallbackComponent,
  }
];

export const routing = RouterModule.forRoot(appRoutes);

export const routedComponents = [PublicDealsComponent, PrivateDealsComponent, CallbackComponent];
```

最終的な更新が必要なものがもうひとつあります。`/secret`ルートにアクセスしようとするとき、ログインしたとしても、特別価格リストを入手することはできません。これは、`access_token` をバックエンドに渡していないからです。価格サービスを更新する必要があります。

### _価格サービスを更新する_

この呼び出しを `/api/deals/private` に更新して、`access_token`を含む必要があります。これを完了するにはいくつかの方法があります。既存の `http` 呼び出しを使い、正しいヘッダーを追加しますが、これをするには簡単な方法があります。Angular 2 JWT ライブラリは AuthHTTP メソッドを搭載しており、これを処理してくれます。これをアプリケーションにどのように実装するか見てみましょう。

```js
  // Angular 2 JWT ライブラリから HttpAuth API を必ず含みます
  import { AuthHttp } from 'angular2-jwt';

  ...

  // コンストラクターに AuthHTTP メソッドを含む必要があります
  constructor(private http: Http, private authHttp: AuthHttp) { }

  ...
  getPrivateDeals() {
    // .http の代わりに、この.authHttp メソッドを使用します。他は全て同じです。
    return this.authHttp
      .get(this.privateDealsUrl)
      .toPromise()
      .then(response=>response.json() as Deal[])
      .catch(this.handleError);
  }
```

`authHttp` サービスで API に呼び出されると、`access_token` は自動的に`Authorization`ヘッダーの呼び出しに正しい形式で追加されます。次のセクションで実行して、その機能を確認します。

### _これで完成です_


 ![Auth0 Hosted Lock](https://cdn.auth0.com/blog/angular2-auth-dd/hosted-lock.png)


そうです。これで、アプリケーションをテストする用意ができました。Node.js サーバーが実行していなければ、まずそれを起動してください。`localhost:4200` に移動すると、自動的に `localhost:4200/deals` にリダイレクトされ、一般小売価格のリストが表示されます。

次に、ログインスクリーンをクリックすると、Auth0 ドメインにリダイレクトされ、ホストされた Lock ログインウィジェットが表示されます。ログインまたはサインアップすると、コールバックルート、それから価格ページにリダイレクトされますが、UI は多少異なります。特別価格のメインメニューには新しいオプションがあり、下部のメッセージにも特別価格へのリンクが表示されます。ナビゲーションバーにはログインリンクの代わりに、ログアウトリンクが表示されます。最後に、特別価格のリンクをクリックし、専用特別価格のリンクを表示します。

![Consent Dialog](https://cdn.auth0.com/blog/angular2-auth-dd/consent.png)

**注：** ドメインに `localhost` を使用しているので、ユーザーが初めてログインすると、または将来、スコープを変更すると、ユーザーが API へのアクセスを許可するかという同意ダイアログが表示されます。この同意ダイアログは、ローカルホストでないドメンを使っている場合は表示されず、クライアントはファーストパーティのクライアントです。

![Exclusive Daily Deals](https://cdn.auth0.com/blog/angular2-auth-dd/secret-deals.png)

これで、Angular 2.0 アプリの作成と認証が終わりました。おめでとうございます！

## _結論_

Angular 2 がついに公表され、ゴールデンタイムの用意ができました。ここまでかなり時間がかかりましたが、ついに市場に出ました。とてもワクワクしています。このチュートリアルでは、Angular 2 コンポーネントとサービスの書き方をいくつか見てきました。Auth0 および Lock で認証ベースのトークンを実装しました。しかし、これはほんの一部です。

Angular 2 はパイプや i18n などこれ一つでたくさんの機能を提供します。Auth0 は最先端の認証だけでなく、 [多要素認証](https://auth0.com/docs/multifactor-authentication)、 [異常検出](https://auth0.com/docs/anomaly-detection)、 [企業連盟](https://auth0.com/docs/identityproviders)、 [シングルサインオン (SSO)](https://auth0.com/docs/sso)その他の機能を拡張して、Angular 2 アプリをセキュアにします。 [サインアップ](javascript:signup\(\))して、アプリに固有な構築機能を活用してください。

Angular 2 はパイプや i18n などこれ一つでたくさんの機能を提供します。Auth0 は最先端の認証だけでなく、多要素認証、異常検出、企業連盟、シングルサインオン (SSO)その他の機能を拡張して、Angular 2 アプリをセキュアにします。サインアップして、アプリに固有な構築機能を活用してください。
