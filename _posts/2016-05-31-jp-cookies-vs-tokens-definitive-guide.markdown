---
layout: post
title: "Cookie vs トークン：最も確実なガイド"
description: "Cookie vs トークンに関する議論ではトークンベースの認証が有利です。トークン認証の利点について学び、共通の懸念事項についての疑問にお答えします。"
date: 2016-05-31 08:30
category: Technical Guide, Identity, Cookies vs Tokens
author: 
  name: "Ado Kukic"
  url: "https://twitter.com/kukicadnan"
  mail: "ado@auth0.com"
  avatar: "https://s.gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200"
design: 
  bg_color: "#08192D"
  image: "https://cdn.auth0.com/blog/cookies-vs-tokens/cvt-logo.png"
tags:
- Cookies-vs-Tokens
- Cookies
- Tokens
- JWT
- Progressive-Web-App
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: cookies-vs-tokens-definitive-guide
---


**TL;DR** トークンベースの認証はこれまで以上に重要です。Cookie とトークンベース認証の相違点および類似点、トークンを使う利点について調査し、トークンベースの認証に関してデベロッパーたちが持っている共通の疑問点や懸念事項について検討します。最後に、理論を実践してトークン認証を使用するアプリケーションを構築し、プログレッシブな Web アプリケーションにします。

本書では認証に JWT を使用する Angular 2 アプリを作成します。その手順に従って行う場合は、 [Github](https://github.com/auth0-blog/angular-auth0-aside) [リ](https://github.com/auth0-blog/angular-auth0-aside) [ポジトリ](https://github.com/auth0-blog/angular-auth0-aside)に移動します。

[前回のアーティクル](https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/)で Cookie とトークン認証を比較してから 2 年以上になります。それ以降、さまざまな言語やフレームワークでトークン認証を統合する方法について。

シングルページアプリケーション(SPA)の増加とバックエンドからフロントエンドの分離は完全に機能しています。 [Angular](file:///h)、 [React](file:///h)、および [Vue](https://vuejs.org/) のようなフレームワークを使用することで、開発者はより大きく、より良く、よりパフォーマンスの高いシングルページアプリケーションを構築することができるようになります。トークンベースの認証はこれらのフレームワークと連携して動作します。

{% include tweet_quote.html quote_text="トークンベースの認証は Angular、React および Vue のような SPA フレームワークと連携して動作します。" %}

## Cookie vs トークン認証 - 要約

さらに前に進む前に、これら 2 つの認証システムの仕組みを簡単に説明します。Cookie およびトークンの認証機能についてすでにご存じの方は、次の章に進んでください。そうでない方は詳細な説明をお読みください。

下の図は Cookie とトークンの認証へのアプローチの違いを簡単に紹介したものです。

[Cookie vs Token-Based Authentication](https://cdn.auth0.com/blog/cookies-vs-tokens/cookie-token-auth.png)

### **Cookie ベース認証**

Cookie ベース認証はこれまで長い間使われてきた、ユーザー認証を処理するときのデフォルトの実証済みの方法です。

Cookie ベース認証は **ステートフル** です。つまり、認証の記録またはセッションはサーバーとクライアント側の両方で保持しなければなりません。サーバーはデータベース内のアクティブなセッションを追跡する必要がありますが、フロントエンドではセッション識別子を保持するCookieが作成されるため、 Cookie ベース認証と呼ばれます。従来型の Cookie ベース認証のフローを見てみましょう。

1. ユーザーがログイン資格情報を入力します
2. サーバーがその資格情報が正当かどうかを検証し、セッションを作成し、データベースにセッションを保存します
3. セッション IDを含んだ Cookie がユーザーのブラウザーに配置されます
4. その後のリクエストでは、そのセッション ID はデータベースに対して検証され、有効であればそのリクエストが処理されます
5. ユーザーがアプリからログアウトすると、そのセッションはクライアント側とサーバー側の両方で破棄されます

### **トークンベース認証**

トークンベース認証はシングルページアプリケーション、Web API、および モノのインターネット (IoT) の増加によりここ数年で、普及されました。トークンの認証について話すときは、一般的には [JSON Web Tokens](https://jwt.io/introduction)(JWT)の認証についてです。トークンを実装するにはさまざまな方法がありますが、JWT がデファクトスタンダードになりました。この点を念頭に置いて、これからはトークンと JWT をほとんど同じ意味で使用していきます。

トークンベース認証は **ステートレス** です。サーバーはユーザーがログインした記録、あるいはどのJWTが発行されたかという記録を保持しません。その代わりに、サーバーへの全リクエストにはトークンが添付され、サーバーはリクエストの認証を確認するためにそれを使用します。トークンは一般的に、`Bearer {JWT}` の形で追加の Authorization ヘッダーとして送られますが、追加的に POST リクエストの本文で送られたり、あるいはクエリ パラメーターとしても送られます。このフローの流れを見てみましょう。

1. ユーザーがログイン資格情報を入力します
2. サーバーが資格情報が正当かどうかを検証し、署名付きトークンを返します
3. このトークンはクライアント側、よく使われるのはローカル ストレージに保存されますが、セッション ストレージまたは Cookie にも保存できます
4. サーバーへのその後のリクエストは追加 Authorization ヘッダーとして、もしくは上記の他の方法のいずれかを通してこのトークンを添付します
5. サーバーは JWT をデコードし、トークンが有効であればそのリクエストを処理します
6. ユーザーがログアウトしたら、そのトークンはクライアント側で破棄されますので、サーバーとの対話は必要ありません

## トークンベース認証の利点

それぞれが **どのように** 機能するかを理解すれば、半分勝ったも同然です。次に、トークン認証の方が、従来型 Cookie ベースのアプローチよりも **なぜ** 望ましいのかその理由を見ていきましょう。

### **ステートレス、スケーラブル、および分離**

Cookie よりもトークンを使うことの最大の利点はおそらく、トークン認証はステートレスだということです。バックエンドではトークンの記録を保持する必要がありません。各トークンは自己完結型内蔵型で、その有効性を確認するために必要なすべてのデータを含み、クレーム(Claims)を通じてユーザー情報を伝達します。

サーバーの唯一のジョブはログインリクエストが成功した後にトークンを署名し、受け取ったトークンが有効であることを確認することです。実際には、サーバーはトークンに署名する必要はありません。Auth0 のようなサードパーティのサービスがトークンの発行を処理しますので、サーバーはそのトークンの有効性を確認するだけです。

### **クロスドメインおよび CORS**

Cookie は単体のドメインおよびサブドメインとうまく機能しますが、異なるドメイン間で Cookie を管理することは非常に大変です。対照的に、CORSを有効にしたトークンベースのアプローチは API をさまざまなサービスやドメインに公開することが簡単です。JWTはバックエンドへの全ての呼び出しに対して必要とされ、チェックを行います。トークンが正当である限り、リクエストは処理することができます。これにはいくつかの注意事項があり、以下の一般的な質問と懸念事項セクションで説明いたします。

### **データを JWT に格納する**

Cookie ベースのアプローチでは、単にセッション ID を Cookie に格納するだけです。その一方、JWT のアプローチは有効な JSON である限り、どのようなタイプのメタデータでも格納できます。 [JWT 仕様](https://tools.ietf.org/html/rfc7519)は予約済み、パブリック、およびプライベートなど、含むことができるさまざまなタイプのクレームが指定されています。クレームタイプの仕様やタイプごとの違いについては [jwt.io](https://jwt.io/introduction/) Web サイトでさらに詳しく知ることができます。

実際のところ、JWT はどのようなタイプのデータでも含めることを意味します。ユースケースによっては、ユーザーIDやトークンの有効期限などの最小限のクレームに制限することを選択することもできますし、ユーザーのemailアドレスやトークン発行者、ユーザーのスコープや権限などの追加クレームを含めることもできます。

### **パフォーマンス**

Cookie ベースの認証を使用するとき、従来の SQL データベースあるいは別の NoSQL データベースを使おうともバックエンドはルックアップしなければなりません。また、ラウンドトリップはトークンのデコードと比較すると時間がかかります。さらにユーザー権限レベルなどの追加データーをJWT内に格納できるため、追加のルックアップコールを保存してリクエストされたデータを取得・処理できます。

たとえば、アプリを介して発行された最新の注文を取得する API リソース `/api/orders` があるとします。しかし、 **管理者** ロールを持つユーザーのみがこのデータにアクセスして見ることができます。Cookie ベースのアプローチでは、リクエストが行われると、そのセッションが有効であることを確認するためにデータベースへの呼び出しが 1 回行われ、ユーザーのデータを取得してユーザーが **管理者** の役割があることをもう 1回確認し、3回めの呼び出しでやっとデータを取得できます。一方、JWT のアプローチでは、ユーザーのロールを JWT に保存できるので、リクエストが行われ、JWT　が検証されると、データベースへ1回の呼び出し注文を取得できます。

### **モバイル対応**

モダン API はブラウザーだけと対話するものではありません。APIが適切に記述されていれば、1つのAPIでブラウザやiOS、Androidなどのネイティブモバイルプラットフォームの両方に対応することができます。ネイティブ モバイル プラットフォームと Cookie はうまく付き合うことはできません。可能ではありますが、モバイルプラットフォームでクッキーを使用するには多くの制限と懸念事項があります。一方トークンは iOS や Android の両方に実装することは非常に簡単です。トークンはモノのインターネット (IoT) アプリケーションや、Cookie ストアの概念がないサービスへの実装も簡単です。

## 一般的な質問と懸念事項

本章では、トークン認証が話題になったときに、よく聞かれる質問や懸念事項の一部を見てみましょう。ここで重要なのはセキュリティですが、トークンサイズやストレージ、暗号化に関するユースケースについて検討します。

### **JWT サイズ**

トークン認証の最大の欠点は JWT のサイズです。セッション Cookie は最小の JWT と比較しても相対的に小さいです。ユースケースにもよりますが、トークンのサイズはクレームをたくさん追加した場合に、問題が発生する可能性があります。サーバーへの各リクエストには JWT も含まなければならないことを忘れないでください。

### **トークンをどこに保存するか？**

トークンベースの認証では、JWTの保存場所を選択できます。一般的に、JWT はブラウザーのローカルストレージに保存されます。これはほとんどのユースケースで有効ですが、JWT をローカルストレージに保存するときに覚えておくべき問題がいくつかあります。ローカルストレージは Cookie とは異なり、特定のドメインにサンドボックス化されており、そのデータはサブドメインを含む他のドメインからはアクセスできません。

代わりに、Cookie にトークンを保存することができますが、 Cookie の最大サイズはわずか 4KB であるため、トークンにたくさんのクレームが添付されていると問題になる場合があります。さらに、トークンをローカル ストレージと同様なセッション ストレージに保存することができますが、ユーザーがブラウザーを閉じるとすぐに消去されます。

### **XSS および**  **CSRF**  **対策**

ユーザーやサーバーの保護は常に最優先事項です。デベロッパーがトークンベース認証を使用すべきかどうかを決定する際に挙げられる最も一般的な懸念事項のひとつはセキュリティの影響です。Web サイトが直面する最も一般的な攻撃ベクトルはクロスサイト スクリプト(XSS)とクロスサイト リクエスト フォージェリ（CSRF または XSRF）のふたつです。

[クロスサイト スクリプト](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)攻撃は外部エンティティが Web サイトやアプリ内でコードを実行できるときに発生します。ここでの最も一般的な攻撃ベクトルは Web サイトが適切にサニタイズされていない入力が可能になったときです。攻撃者があなたのドメイン上でコードを実行すると、JWT トークンは攻撃を受けやすくなります。当社の CTO は過去に、XSS 攻撃は一般的に認識が高いため、XSRF 攻撃と比較すると、扱いが簡単だと [主張](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/#xss-xsrf) しています。Angular を含む多くのフレームワークでは入力が自動的にサニタイズされ、任意のコードの実行をさせないようにします。入力/出力を追加設定なしでサニタイズするフレームワークを使用していない場合は、Google が開発した [caja](https://github.com/google/caja) のようなプラグインの導入を検討してください。入力をサニタイズすることは多くのフレームワークや言語で解決されている問題ですので、独自に構築するよりもフレームワークまたはプラグインを使用することをお勧めします。

クロスサイト リクエスト フォージェリ攻撃は、ローカルストレージで JWT を使用しているのであれば問題ありません。一方、ユース使用ケースで JWT を Cookie に保存する必要がある場合は、CSRF に対する保護が必要です。CSRF は XSS 攻撃ほど簡単に理解できるものではありません。CSRF 攻撃がどのようにして起きるかを説明するのは時間がかかりますので、その代わりに [こちら](https://en.wikipedia.org/wiki/Cross-site_request_forgery)のガイドで CSRF 攻撃について詳しく説明していますのでご参照ください。幸いなことに、CSRF 攻撃を防ぐことはかなり簡単です。CSRF 攻撃に対する保護をかなり簡単にすると、クライアントとのセッションを確立するとサーバーが固有のトークンを生成します（これは JWT ではありません）。その後データがサーバーに送信されるたびに、非表示の入力フィールドにこのトークンが含まれ、サーバーはトークンが一致しているかどうかをチェックします。ここでも、JWT をローカルストレージに保存することが推奨されているため、おそらく CSRF 攻撃について心配する必要はありません。

ユーザーやサーバーを保護する最適な方法のひとつはトークンの有効期限を短くすることです。こうすることで、トークンが漏洩しても、すぐに役に立たなくなります。また、危害を受けたトークンの [ブラックリスト](https://auth0.com/blog/2015/03/10/blacklist-json-web-token-api-keys/)を作成・管理し、これらのトークンでシステムにアクセスできないようにするのもいいでしょう。最後に、原子力的アプローチは署名アルゴリズムを変えることので、全てのアクティブなトークンを無効化し、全てのユーザが再度ログインする必要となります。このアプローチは簡単に推奨できるものではありませんが、重大な侵害のときに利用できます。

### **トークンは暗号化ではなく、署名付き**

JSON Web トークンはヘッダー、ペイロード、およびシグネチャ(署名)の 3 つのパーツからなります。JWT の形式は `header.payload.signature` です(ピリオド. で各パーツを分離しています)。JWT を HMACSHA256 アルゴリズム、秘密鍵「shhhh」および以下のペイロードで署名すると、

```
{
  "sub": "1234567890",
  "name": "Ado Kukic",
  "admin": true
}
```

生成される JWT は以下のようになります。

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbyBLdWtpYyIsImFkbWluIjp0cnVlLCJpYXQiOjE0NjQyOTc4ODV9.Y47kJvnHzU9qeJIN48_bVna6O0EDFiMiQ9LpNVDFymM
```

ここで注意すべき **非常に** 重要な点は、このトークンは HMACSHA256 アルゴリズムで署名され、ヘッダーとペイロードはBase64URLでエンコードされますが、暗号化はされて **いません** 。 [jwt.io](https://jwt.io/) に移動し、このトークンを貼り付けて HMACSHA256(HS256) アルゴリズムを選択すると、そのトークンを解読してそのコンテンツを読むことができます。ですから、パスワードのような機微なデータはペイロードに保存すべきでないことは言うまでもありません。

機微なデータをペイロードに保存する必要がある場合、あるいはユースケースで JWT を隠さなければならない場合は、JSON Web Encryption(JWE)を使用できます。JWE は JWT の内容を暗号化し、サーバー以外による読み取りをできなくします。 [JOSE](http://jose.readthedocs.io/en/latest/) は素晴らしいフレームワークと JWE のさまざまなオプションを提供し、 [NodeJS](https://github.com/cisco/node-jose) および [Java](https://bitbucket.org/connect2id/nimbus-jose-jwt/wiki/Home) を含むたくさんの人気のフレームワーク用の SDK があります。とにかく、 [AngularJS 認証](https://auth0.com/learn/angularjs-authentication/)について学ぶことをお勧めします。

## トークンベースの認証を Auth0 で実行する

Auth0 では [NodeJS](https://github.com/auth0/express-jwt)、 [Java](https://github.com/auth0/java-jwt)、 [Python](https://github.com/auth0/auth0-python)、 [GoLang](https://github.com/auth0/go-jwt-middleware)、および [その他多数](https://auth0.com/docs)を含むたくさんの言語やフレームワークで JWT に取り組むために、SDK、ガイド、クイックスタートを書いてきました。今回のコードサンプルでは Angular 2 を使用します。

[GitHub レポジトリ](https://github.com/auth0-blog/angular-auth0-aside)から [Kim Maida](https://twitter.com/kimmaida)が作成したサンプルコードをダウンロードできます。Angular 2 を始めるためにはたくさんの初期セットアップが必要ですから、コードサンプルのダウンロードをお勧めします。Auth0 アカウントをお持ちでない方は、無料で [サインアップ](https://auth0.com/signup)してご自分で実装したりさまざまな機能やオプションをご体験ください。それでは、始めましょう。

## 補足：Angular アプリと Node API を Auth0 で認証する

認証済みユーザーだけがアクセスできるように、アプリケーションや API を保護することができます。では、 [Auth0](https://auth0.com/) を使って Angular アプリケーションや Node API をどのように保護するかを学びましょう。 [GitHub 上の angular-auth0-aside レポジトリ](https://github.com/auth0-blog/angular-auth0-aside) からこのサンプルアプリや API を複製します。

![Auth0 login screen](https://cdn.auth0.com/blog/resources/auth0-centralized-login.jpg)

### **機能**

[サンプル Angular アプリケーションおよび API](https://github.com/auth0-blog/angular-auth0-aside) には以下の機能があります。

- [Angular CLI](https://github.com/angular/angular-cli) で生成され、 [http://localhost:4200](http://localhost:4200/)で運用される Angular アプリケーション
- ログインページを使って [js](https://auth0.com/docs/libraries/auth0js/v8) で認証
- API ルートを保護する Node サーバー `http://localhost:3001/api/dragons` は認証済み `GET` リクエストの JSON データを返す
- ユーザーが Auth0 で認証されると、Angular アプリは API からデータをフェッチする
- プロファイル ページはルートガードを使ってアクセスの認証を必要とする
- 認証サービスはサブジェクトを使って認証ステータスイベントをアプリ全体に伝達する
- ユーザー プロファイルは認証に対してフェッチされ、認証サービスに保存される
- Access Tokenプロファイル、トークンの有効期限はローカルストレージに保存され、ログアウトすると削除される

### **Auth0**  **にサインアップする**

認証の管理をするには、 [Auth0](https://auth0.com/) アカウントが必要です。 [無料アカウントはこちら](https://auth0.com/signup)ページからサインアップできます。次に、Auth0 クライアントアプリと API をセットアップし、Auth0 が Angular アプリや Node API と相互作用できるようにします。

### **クライアントアプリをセットアップする**

1. [**Auth0 ダッシュボード**](https://manage.auth0.com/#/)に移動し、[ボタンをクリックします](https://manage.auth0.com/#/clients/create)。
2. 新しいアプリに名前を付け、「Single Page Web Applications」を選択します。
3. 新しい Auth0 クライアントアプリの **Settings** で、 `http://localhost:4200/callback` を に追加します。「SAVE CHANGES」ボタンをクリックします。
4. ご希望であれば、 [Social Connectionsの設定](https://manage.auth0.com/#/connections/social)をします。設定したいソーシャルメディアをクリックし、 **Clients** オプションで連携したいクライアントアプリを選択するか、左ペインの **Clients** メニューから設定したいアプリを選択し、 **Connections** オプションで連携したいソーシャルメディアのフリッピングスイッチをONにします。上記のスクリーンショットに表示されている例はユーザー名/パスワードのデータベース、Facebook、Google、および Twitter を利用します。本番環境には、必ず独自のソーシャルキーをセットアップし、ソーシャルメディアのつながりが Auth0 デベロッパーキーを使用するように設定したままにしないでください。

**注意：** クライアントの **Settings** オプションの一番下にある **Show Advanced Settings** をクリックすることで表示される **OAuth** タブの下（ **設定** セクションの下部）で、 **JsonWebToken** **Signature Algorithm (JWTの署名アルゴリズム****)**が `RS256` に設定されていることを確認します。これは新しいクライアントの既定です。`HS256` に設定されていた場合には、`RS256` に変更します。 [RS256 vs. HS256 JWT 署名アルゴリズムについての詳細はこちらから](https://community.auth0.com/questions/6942/jwt-signing-algorithms-rs256-vs-hs256)ご覧ください。

### **API をセットアップする**

1. Auth0 ダッシュボードの [**API**](https://manage.auth0.com/#/apis)s に移動し、「CREATE API」ボタンをクリックします。API の名前を入力します。 **Identifier** にAPI エンドポイント URL を設定します。この例では、http://localhost:3001/api/ です。 **Signing Algorithm** は `RS256` です。設定が完了したら「 **CREATE** 」ボタンをクリックします。
2. 作成した API の設定にある **Quick Start** タブの下で、Node.js の例を閲覧することができます。 [Express](https://expressjs.com/)、 [express-jwt](https://github.com/auth0/express-jwt)、および [jwks-rsa](https://github.com/auth0/node-jwks-rsa)を使って、Node API を実装してみます。

これで、Angular クライアントおよび Node バックエンド API の両方で Auth0 認証を実装する用意ができました。

### **依存関係とセットアップ**

Angular アプリは [Angular CLI](https://github.com/angular/angular-cli) を利用します。CLI がグローバルにインストールされていることを確認してください。

```bash
$ npm install -g @angular/cli
```

[プロジェクト](https://github.com/auth0-blog/angular-auth0-aside)を複製したら、プロジェクトフォルダーのルートにある、以下のコマンドを実行して Angular アプリと Node サーバーの両方の Node 依存関係モジュールをインストールします。

```bash
$ npm install
$ cd server
$ npm install
```

Node API はサンプルアプリケーションのルートの [`/server`](https://github.com/auth0-blog/angular-auth0-aside/tree/master/server) [フォルダー](https://github.com/auth0-blog/angular-auth0-aside/tree/master/server)にあります。

[`config.js.example`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/server/config.js.example) [ファイル](https://github.com/auth0-blog/angular-auth0-aside/blob/master/server/config.js.example)を検索し、そのファイル名から `.example` 拡張子を **削除** します。そして、リネームしたファイルを開きます。


```js
// server/config.js (元 config.js.example)
module.exports = {
  CLIENT_DOMAIN: '[AUTH0_CLIENT_DOMAIN]', // 例 'you.auth0.com'
  AUTH0_AUDIENCE: 'http://localhost:3001/api/'
};
```


`AUTH0_CLIENT_DOMAIN` 識別子を Auth0 クライアントドメインに変更し、`AUTH0_AUDIENCE`にAPIsメニューで作成したAPIのaudienceの値を設定します（この例では、これは `http://localhost:3001/api/` です）。`/api/dragons` ルートは [express-jwt](https://github.com/auth0/express-jwt) および [jwks-rsa](https://github.com/auth0/node-jwks-rsa) で保護されます。

**注意：** RS256 および JSON Web Key Set についての詳細は [RS256 および JWKS をナビゲートする](https://auth0.com/blog/navigating-rs256-and-jwks/)をご覧ください。

これでAPI は保護されましたので、Angular アプリケーションが Auth0 でも連携することを確認しましょう。このためには、ファイル拡張子から `.example` を削除して [`src/app/auth/auth0-variables.ts.example`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth0-variables.ts.example) [ファイル](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth0-variables.ts.example) をアクティブにします。それからファイルを開き、 `[AUTH0_CLIENT_ID]` および `[AUTH0_CLIENT_DOMAIN]` 文字列を以下のように Auth0 情報に変更します。


```js
// src/app/auth/auth0-variables.ts (元 auth0-variables.ts.example)
...
export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '[AUTH0_CLIENT_ID]',
  CLIENT_DOMAIN: '[AUTH0_CLIENT_DOMAIN]',
  ...
```


これで、アプリと API がセットアップされました。これらはルート フォルダーから `ng serve`、`/server` フォルダーから `node server.js`を実行することで提供されます。

Node API と Angular アプリが実行中なので、認証がどのように実装されているか見てみましょう。

### **認証サービス**

フロントエンドの認証ロジックは `AuthService` 認証サービスである [`src/app/auth/auth.service.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts) [ファイル](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts)で処理されます。

```js
// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import { UserProfile } from './profile.model';

@Injectable()
export class AuthService {
  // Auth0 web auth インスタンスを作成します
  // @TODO: AUTH_CONFIG を更新し、src/app/auth/auth0-variables.ts.example にある .example 拡張子を削除します
  private _auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: UserProfile;
  accessToken: string;

  // アプリ全体で通信するためにログイン状態のストリームを作成します
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor() {
    // You can restore an unexpired authentication session on init
    // by using the checkSession() endpoint from auth0.js:
    // https://auth0.com/docs/libraries/auth0js/v9#using-checksession-to-acquire-new-tokens
  }

  private _setLoggedIn(value: boolean) {
    // ログイン状態のサブジェクトを更新します
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 認証リクエスト
    this._auth0.authorize();
  }

  handleLoginCallback() {
    // Auth0 ハッシュが解析されたら、プロファイルを取得します
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.getUserInfo(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
    });
  }

  getUserInfo(authResult) {
    // ユーザーのプロファイルを取得してセッションを設定するために、Access Tokenを使用します
    this._auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // セッションデータを保存し、ログイン状態のサブジェクトを更新します
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.accessToken = authResult.accessToken;
    this.userProfile = profile;
    this._setLoggedIn(true);
  }

  logout() {
    // トークンとプロファイルを削除し、ログイン状態のサブジェクトを更新します
    localStorage.removeItem('expires_at');
    this.accessToken = undefined;
    this.userProfile = undefined;
    this._setLoggedIn(false);
  }

  get authenticated(): boolean {
    // 現在の日付が有効期限よりも大きいことをチェックします
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return (Date.now() < expiresAt) && this.loggedIn;
  }

}
```


このサービスは `auth0-variables.ts` から構成変数を使用して `auth0.js` WebAuth インスタンスを作成します。

[RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md)はアプリのどこにでもサブスクライブできる認証状態イベントのストリームを提供するために使用されます。

`Login()` メソッドは構成変数を使用して Auth0 で認証リクエストを認可します。ログインページがユーザーに表示され、ログインできるようになります。

**注意：** ユーザーが初めてアプリにアクセスし、かつコールバックURLが`localhost`の場合、APIにアクセスできるように同意を求める画面が表示されます。ローカルホストでないドメインのファーストパーティ クライアントは信頼度が高いため、同意画面のダイアログは表示されません。 [Auth0 ダッシュボード](https://manage.auth0.com/#/apis) [の](https://manage.auth0.com/#/apis) [API](https://manage.auth0.com/#/apis) [s](https://manage.auth0.com/#/apis)画面の **Settings** でこれを変更できます。「Allow Skipping User Consent」トグルを探します。

アプリに戻ると、Auth0 からハッシュで `accessToken`と`expiresIn` を受け取ります。`handleLoginCallback()` メソッドは Auth0の`parseHash()` メソッドのコールバックを使ってユーザーのプロファイル (`getUserInfo()`)を取得し、トークン、プロファイル、およびトークンの有効期限をローカルストレージに保存して、`loggedIn$` サブジェクトを更新してセッション(`_setSession()`) を設定し、ユーザーが認証されたという情報をアプリに登録されたコンポーネントに通知できるようにします。

**注：** プロファイルは [OpenID](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) [標準クレーム](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)から [`profile.model.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/profile.model.ts) の形状で現れます。

最後に、`logout()` メソッドでローカルストレージからデータを消去し、`loggedIn$` サブジェクトを更新します。Access Tokenの有効期限を基にして現在の認証状況を返すに戻る `authenticated` アクセサリもあります。

[`AuthService`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32) [が](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32) [`app.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32)で提供されたら、そのメソッドとプロパティ は [ホーム コンポーネント](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/home)のようにアプリのどこででも使用できます。

### **コールバック コンポーネント**

[コールバック コンポーネント](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/callback)は認証後にアプリがリダイレクトされる場所です。このコンポーネントはログインプロセスが完了するまで、ローディングメッセージを表示します。ハッシュを解析して認証情報を抽出する `handleLoginCallback()` メソッドを実行します。以下のように、ユーザーがログインしたら、ホームページにリダイレクトするために、認証サービスから `loggedIn$` 動作のサブジェクトにサブスクライブします。

```js
// src/app/callback/callback.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit, OnDestroy {
  loggedInSub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    // 認証ハッシュを解析します
    auth.handleLoginCallback();
  }

  ngOnInit() {
    this.loggedInSub = this.auth.loggedIn$.subscribe(
      loggedIn => loggedIn ? this.router.navigate(['/']) : null
    )
  }

  ngOnDestroy() {
    this.loggedInSub.unsubscribe();
  }

}
```

### **認証済み API リクエスト**

HTTP リクエストを認証するためには、 [`api.service.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts) [ファイル](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts)でAccess Tokenに対して`Authorization`ヘッダーを加える必要があります。

```js
// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { AuthService } from './auth/auth.service';

@Injectable()
export class ApiService {
  private baseUrl = 'http://localhost:3001/api/';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  getDragons$(): Observable<any[]> {
    return this.http
      .get(`${this.baseUrl}dragons`, {
        headers: new HttpHeaders().set(
          'Authorization', `Bearer ${this.auth.accessToken}`
        )
      })
      .pipe(
        catchError(this._handleError)
      );
  }

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Unable to retrieve data';
    return Observable.throw(errorMsg);
  }

}
```


### **最終仕上げ：ルートガードおよびプロファイルページ**

[プロファイルページ コンポーネント](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/profile)では認証されたユーザーのプロファイル情報を表示できます。ただし、このコンポーネントはユーザーがログインしたときのみにアクセス可能にしてください。

[認証済み API リクエストおよびログイン/ログアウト](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/home/home.component.ts)を実装したので、最終仕上げはプロファイル ルートを認証されていないアクセスから守ることです。 [`auth.guard.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.guard.ts) [ルートガード](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.guard.ts)は認証をチェックし、ルートを条件付きでアクティベートします。ガードは以下のように、 [`app-routing.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app-routing.module.ts) [ファイル](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app-routing.module.ts) で選択した特定ルートで実装されます。


```js
// src/app/app-routing.module.ts
...
import { AuthGuard } from './auth/auth.guard';
...
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
          AuthGuard
        ]
      },
...
```

### **その他のリソース**

以上です！ログイン、ログアウト、プロファイル情報、および保護されたルートで Node API および Angular アプリケーションを認証してきました。詳細については以下のリソースをチェックしてください。

- [API をセキュアにするために必ず](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/) [Access Token](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/) [を使用すべき理由](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
- [RS256 および JWKS をナビゲートする](https://auth0.com/blog/navigating-rs256-and-jwks/)
-   [Access Token](https://auth0.com/docs/tokens/access-token)
- [Access Token](https://auth0.com/docs/api-auth/tutorials/verify-access-token) [を確認する](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
- [クライアント側 Web アプリから API を呼び出す](https://auth0.com/docs/api-auth/grant/implicit)
- [Implicit Grant の実装方法](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
- [js 説明書](https://auth0.com/docs/libraries/auth0js)
- [OpenID 標準](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims) [クレーム](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

## まとめ

本書では Cookie およびトークンベースの認証の違いを比較しました。トークンを使用したときの利点と懸念事項を取り上げ、JWT が実際にどのように機能するかを紹介するために簡単なアプリも書きました。トークンを使用する理由はたくさんありますが、Auth0 はトークン認証の実装が簡単でセキュアにするためにあります。最後に、Web アプリケーションがモバイルデバイスでネイティブ感を増すことができるように、プログレッシブ Web アプリケーションを紹介しました。無料アカウントは [こちらからサインアップ](https://auth0.com/signup)してください。簡単にアカウントを作成できます。