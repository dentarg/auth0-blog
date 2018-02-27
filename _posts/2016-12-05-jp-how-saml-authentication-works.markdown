---
layout: post
title: "SAML 認証はどのように機能するか？"
description: SAML 認証の基本を学びましょう。
date: 2016-12-05 08:30
category: Technical Guide, Identity, SAML
design:
  bg_color: "#9F2324"
  image: https://cdn.auth0.com/blog/SAMLLogo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- saml
- authentication
- sso
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: how-saml-authentication-works
---

**TL;DR:** ユーザー認証はほとんどのアプリケーションシステムに不可欠なもので、さまざまな認証方式やプロトコルの対応が求められています。求められているプロトコルのひとつが SAML で、本書ではその機能について学びます。

## SAML とは何か？

SAML(Security Assertion Markup Language)はService ProviderとIdentity Provider の 2 つの企業間の行われる認証と許可のための XML ベースのフレームワークです。Service Providerはユーザーを認証するIdentity Provider を信頼して同意します。引き換えに、Identity Provider はユーザーが認証されたことを示す_認証アサーション_ を生成します。

SAML は標準 [シングル サインオン(SSO)](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog)形式です。認証情報はデジタル署名した XML 文書を通じて交換します。複雑なシングル サインオン(SSO)の実装で、主にビジネスと企業間でのシームレスな認証を可能にします。

SAML では、認証資格情報のタイプやパスワードのリセットについて心配する必要はありません。

## SAML 認証のメリット

あまり面倒がない SAML 認証のメリットとして以下が挙げられます。

- **標準化：** SAML はシステム間のシームレスな相互運用、非依存実装を可能にする標準フォーマットです。ベンダーやプラットフォーム特定のアーキテクチャ、実装に関係する共通問題を取り除きます。
- **ユーザー エクスペリエンスの向上：** ユーザーは一度だけサインインするだけで、追加認証を必要とせずに複数のService Providerにアクセスでき、それぞれのService Providerでのエクスペリエンスも高速化され、改善されます。これによって、パスワードのリセットや回復などの問題が取り除かれます。
- **セキュリティの強化：** セキュリティはソフトウェア開発の重要な点で、エンタープライズアプリケーションでは特に重要になります。SAML はセキュアな Identity Provider でシングルポイントでの認証を実施します。続いて、SAML はユーザー情報をService Providerに転送します。この認証方式は、資格情報をファイアウォール境界線に委ねることはいたしません。
- **広いディレクトリ結合：** SAML はユーザー情報の管理やディレクトリ間での同期を必要としません。
- **Service Provider**** のコスト削減：**SAML では複数のサービス間でテナント情報を維持する必要がありません。Identity Provider がこの責任を担います。

## SAML 認証は、どのように機能するか？

アプリケーションでの SAML 認証のプロセスフローをよく見てみましょう。SAML シングル サインオン認証は通常、Service Providerと Identity Provider が関与します。このプロセスフローは一般的に、_信頼確立_ と _認証フロー_ のステージが関係します。

以下の例を見てみましょう。

- Identity Provider は **Auth0**
- Service Providerは **Zagadat** と呼ばれる企業 HR ポータル

**注:** この Identity Provider はどんな ID 管理プラットフォームでも結構です。

さて、あるユーザーが SAML 認証を使って **Zagadat** へのアクセスを取得しようとしています。

このプロセスフローは以下の通りです。

1. ユーザーはブラウザーから **Zagadat** にログインしようとしています。
2. **Zagadat** は SAML リクエストを生成して返信します。

![Typical SAML Authentication request](https://cdn.auth0.com/blog/samlrequestzg.png)

_SAML リクエストの例_

1. ブラウザーはユーザーを SSO URL の **Auth0** にリダイレクトします。
2. **Auth0** は SAML リクエストを解析し、ユーザーを認証（これはユーザー名およびパスワードを用いてか、あるいは 2 要素認証を用いて実行。(ユーザーが auth0 ですでに認証されていれば、このステップはスキップします）し、SAML レスポンスを生成します。

![Typical SAML Authentication response](https://cdn.auth0.com/blog/SAMLResponse.png)

_SAML 応答の例_

1. **Auth0** はエンコード済みの SAML レスポンスをブラウザーに返します。
2. ブラウザーは検証のために SAML レスポンスを **Zagadat** に送信します。
3. 検証が成功すれば、そのユーザーは **Zagadat** にログインし、さまざまなリソース全部へのアクセスが許可されます。

![Process flow diagram](https://cdn.auth0.com/blog/flow-process/saml-flow-diagram.png)

_プロセスフロー図_

SAML リクエストおよびレスポンスで強調表示されている属性にご注意ください。以下はこれらパラメーターの用語です。

- **ID:** 識別のために新たに生成された番号
- **IssueInstant:** 生成された時間を示すタイムスタンプ
- **AssertionConsumerServiceURL：** Identity Provider が認証トークンを送信するService Providerの SAML URL インターフェイス。
- **Issuer:** Service Providerの名前(ID)
- **InResponseTo:** この返答が属する SAML リクエストの ID
- **Recipient:** Service Providerの名前(ID)

## 補足：Auth0 での SAML 認証

Auth0 での SAML 認証の実装は極めて簡単です。 **Auth0 Lock** を使って SAML 認証のアプリケーションを簡単に構成できます。

以下の例では、Service Provider として Auth0 テナント（テナント 1）を使い、 _Identity Provider_ として機能を果たす二つめの Auth0 テナント（テナント 2）に対するユーザーを認証します。以下のステップに従います。

## 1. つの Auth0 テナントを作成する


Auth0 テナントを 2 つ持っていなければ、作成します。テナントを 2 つ持っている場合は、ステップ #2 をスキップします。

_Auth0 ダッシュボードで：_

右上にあるテナントの名前をクリックし、表示されたポップアップメニューで、「Create Tenant」を選択します。

![Create New Account](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-01.png)

表示されたウィンドウで、2 つめのテナントの名前を **「**** Tenant Domain ****」** フィールドに入力し、Regionを選択し **「**** CREATE ****」** ボタンを押します。

ダッシュボードの右上で、現在のテナントの名前をクリックしてテナント間を切り替えることができます。また、表示されるポップアップメニューを使ってテナントを切り替えることもできます。


## 2. Auth0 IDP （テナント 2）を設定する


このセクションでは、Identity Provider として機能を果たす Auth0 テナント（テナント 2）を 1 つ設定します。クライアントを登録してテナントを設定できますが、この場合の登録するクライアントはテナント 1 の SAML Service Providerです。

**テナント**  **2** にログインする

**Auth0 ダッシュボードで：**

- 左にある **「**** Clients ****」** リンクをクリックします。
- 右にある赤色の **「+**  **CREATE CLIENT**** 」** ボタンをクリックします。

![Create Client Button](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-02.png)

- **Name** フィールドに 「My-Auth0-IDP」 のように名前を入力します。
- 青色の **「**** CREATE ****」** ボタンを押します。
- **「**** Settings ****」** タブをクリックします。
- **「**** Show Advanced Settings ****」** リンクまで下にスクロールしてクリックします。
- 拡張ウィンドウで、 **「**** Certificates ****」** セクションまで下にスクロールして **「**** DOWNLOAD CERTIFICATE ****」** リンクをクリックし、 ドロップダウンから PEM を選択して PEM フォーマットの証明書をダウンロードします。この証明書は 「&lt;テナント名&gt;.pem」 という名前のファイルでダウンロードされます。このファイルは、他の Auth0 テナントのテナント 1 を作成するときにこのファイルをアップロードする必要がありますので、保存しておいてください。

![Download Certificate](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-03.png)

- **「**** Endpoints ****」** タブをクリックし、 **「SAML」** セクションに移動します。次のステップで他の Auth0 テナントのテナント 1 に貼り付ける必要がありますので、 **「SAML**  **Protocol**  **URL」** フィールドのコンテンツ全体をコピーして保存してください。

![Save Changes in Endpoint](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-04.jpg)

次に、SAML SSO シーケンスのテストで使用するユーザーを作成します。_Auth0 ダッシュボード_ _> Users__で：_

- **「+**  **CREATE USER**** 」** ボタンをクリックします。

![Create your First User](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-05.png)

- **Email** フィールドにテストユーザーの電子メールを入力します。その電子メールのドメイン名は以下のセクション 3 に入力するものと同じでなければなりません。例えば、ユーザーの電子メールが _john.doe@abc-example.com_ だとすると、それをここに入力し、以下のステップ 3 の電子メールのドメインに 「abc-example.com」 を入力します。
- そのユーザーのパスワードを入力します。
- 接続については既定値のままにします。（ユーザー名-パスワード-認証）
- 青色の **「**** SAVE ****」** ボタンを押します。

## 3. Auth0 Service Provider（テナント1）を設定する


このセクションでは、2 つめの Auth0 テナント（テナント 2）が SAML プロトコルを通したシングルサインオンで通信できるように、もう一つの Auth0 テナント（テナント 1）を作成します。

テナント **2** をログアウトし、テナント **1** にログインします。

**Auth0 ダッシュボードで：**

- 左にある **「**** Connections ****」** リンクをクリックします。
- 以下のオプションリストにある「Connections」で、 **「**** Enterprise ****」** をクリックします。
- スクリーンの中央にある **「SAMLP**  **Identity Provider**** 」** をクリックします。

![Create new connection](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-06.jpg)

- 青色の **「**** + CREATE NEW CONNECTION ****」** ボタンをクリックします。

![Create new connection button](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-07.jpg)

**「**** Create SAMLP Identity Provider ****」** 接続ウィンドウで、以下の情報を「Settings」タブに入力します。

**Connection Name**** ：**「SAML-Auth0-IDP」 などどんな名前でも入力できます。

**Email domains**** ：**ここでは、電子メール ドメインのフィールドに、この接続を通してグロインするユーザーの電子メール ドメイン名が入力されるように、「Lock ウィジェット」を使います。例えば、ユーザーの電子メール ドメインが 「abc-example.com」 であれば、このフィールドにそれを入力します。必要であれば、複数の電子メールドメインを入力できます。セクション 2 で作成したテストユーザーの電子メールアドレスが、ここで入力するものと同じ電子メールドメインであるようにしてください。

**Sign In**  **URL：** 上記のセクション 2 でコピーしたものを **「SAML Protocol URL」** フィールドに入力します。（テナント 2 ダッシュボードから、アプリ/API リンク、設定タブ、詳細設定、ENDPOINTS セクション、SAML タブ、「SAML プロトコル URL」 フィールド）

**Sign Out**  **URL：** 上記のサインイン URL と同じ URL を入力します。

**X509 Signing Certificate**** ： **赤色の** 「 ****UPLOAD CERTIFICATE****...」** ボタンをクリックし、上記のセクション 2 のテナント 2 からダウンロードした _.pem_ ファイルを選択します。

残りのフィールドは現時点では、そのままにします。

**SAVE**** ： **下部の青色の** 「 ****SAVE**** 」** ボタンをクリックします。

**「**** SAVE ****」** ボタンを押した後、ウィンドウに赤色の **「**** CONTINUE ****」** ボタンが表示されます。（表示されるまで、上にスクロールしなければならないかもしれません）

その **「**** CONTINUE ****」** ボタンをクリックします。

表示されたウィンドウに、この SAML プロバイダー（テナント 1）のメタデータが表示されます。この Auth0 テナント（Service Provider）についての情報を 2 つ収集し、設定した他の Auth0 テナント（Identity Provider ）に貼り付けます。

![SAML Identity Provider Configuration](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-08.jpg)

まず、 **「**** Entitiy **** ID」** を示す情報リストの 2 つめの項目を見つけます。これは、_urn:auth0:YOUR\_TENANT:YOUR\_CONNECTION\_NAME_ のような形式です。

「URN」 から接続名までこの企業 ID フィールド全体をコピーして保存します。

同じウィンドウの下部近くに、_「 __You can access the metadata for your connection in Auth0 here:__ 」_ という行があります。

その行の下にある URL をコピーし、ブラウザーのアドレス バーに貼り付けます。

一般的に、Auth0 に SAML 接続するメタデータには次からアクセスできます：

**https://YOUR\_AUTH0\_DOMAIN/samlp/metadata?connection=YOUR\_CONNECTION\_NAME**

メタデータの URL に移動すると、Auth0 テナント 1 （フェデレーションのService Provider側）のメタデータが表示されます。以下のように、「xxxxx」の部分にテナント名が表示されます。

![Metadata URL key](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-09.jpg)

**「AssertionConsumerService」** で始まる行を検索し、 **「**** Location ****」** フィールドの値をコピーします。次のような URL 形式で表示されます： **https://YOUR\_AUTH0\_DOMAIN.auth0.com/login/callback?connection=YOUR\_CONNECTION\_NAME**

この URL をコピーし、保存します。これは、IDP から SAML アサーションを受け取るテナント 1 の URL です。次のセクションでは、SAML アサーションをどこに送信するかが分かるようにこの URL を IDP に渡します。

## 4. Service Provider のメタデータを Identity Provider に追加する


このセクションでは、Identity Provider Auth0 テナントがService Provider Auth0 テナントから SAML ベースの認証リクエストを受け取り、応答できるように、Service Provider（テナント 1）に戻り、その情報を Identity Provider （テナント 2）に追加します。

- テナント 1 をログアウトし、テナント 2 に再度ログインします。

**Auth0 ダッシュボードで：** テナント2 用

- 左にある **「**** Clients ****」** リンクをクリックします。
- 上記で作成したクライアントの行を検索し、クライアント名の右にある **「**** Addons ****」** アイコンをクリックします。（山かっこおよびスラッシュアイコン）
- **「SAML2 WEB APP」** ラベルが付いたボックスを検索し、サークルをクリックして緑色にします。

![Addons](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-10.jpg)

- 次に、 **「Addon：SAML2 Web App」** 用の構成ウィンドウがポップします。 **「**** Settings ****」** タブが開いていることを確認します。

![Addon: SAML2 Web App Settings Tab](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-11.png)

- 上記のセクション 3 でコピーし、保存した（最後のステップ） Assertion Consumer Service **URL** を **「**** Application Callback **** URL」** フィールドに貼り付けます。

![Assertion Consumer Service URL](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-12.png)

- 以下の設定フィールドで、「audience」の属性がある行 2 に移動します。

まず、行の始めにある &quot;//&quot; を削除してそのコメントを解除します。次に、元の値(urn:foo)を、上記のステップ 3 でコピーし、保存した **Entity ID** 値と置換します。新しい行 2 は以下のように表示されます。

```bash
    "audience":"urn:auth0:YOUR_TENANT:YOUR_CONNECTION_NAME"
 ```

- スクリーンの下部にある青色の **「**** SAVE ****」** ボタンをクリックします。

## 5. Identity Provider をテストする


同じスクリーンで、赤色の **「**** DEBUG ****」** ボタンをクリックします。これで、Identity Provider のテナント 2 からログインスクリーンをトリガーします。ここで、テナント 2 の資格情報でログインします。

![Test Identity Provider](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-13.png)

構成が正しければ、 **「**** It Works! ****」** というタイトルのスクリーンが表示されます。

このスクリーンでは、Identity Provider が送信するエンコード済みおよびデコード済みの SAML 応答が表示されます。

デコード済みの SAML 返答をチェックし、 **「&lt;saml:Audience&gt;」** タグを検索（半分くらいが過ぎたところ）し、前のスクリーンで入力した（ステップ 3 で取得） **Entity ID** と同じであることを確認します。

スクリーンの下部にある **「**** Close this windows ****」** をクリックします。

## 6. シンプルな HTML アプリケーションを登録し、エンドツーエンド接続をテストする


このセクションでは、アプリケーションを Auth0 に登録し、上記のステップで設定した SAML 接続を使います。

テナント **1 Auth0 ダッシュボード** にログインしていることを確認します。

- **Auth0 ダッシュボード** の左にある **「**** Clients ****」** リンクをクリックします。
- 右にある赤色の **「+**  **CREATE CLIENT**** 」** ボタンをクリックします。
- **Name** フィールドに 「My-HTML-SAML-App」 のように名前を入力します。
- 青色の **「**** SAVE ****」** ボタンを押します。
- **「**** Settings ****」** タブをクリックします。
- **「**** Allowed Callback URLs ****」** フィールドに [http://jwt.io](http://jwt.io/) を入力します。
- Allowed Callback URLs のリストは URL のリストで、ユーザーが認証の後にリダイレクトされます。ここに入力した URL は次のステップで作成する HTML コードの「コールバックCallback URL」 と同じでなければなりません。通常はアプリケーションの URL を入力しますが、この例をシンプルにするために、ユーザーは Auth0 JWT オンラインツールに送信されます。このツールは認証手順の終わりに返される JASON Web Token についての情報を提供します。
- スクリーンの下部にある青色の **「**** SAVE CHANGES ****」** ボタンを押します。
- 同じスクリーンで、青色の **「**** Connections ****」** タブ（クイック スタート、設定などと同じ行）をクリックします。
- **「**** Enterprise ****」** ボタンの近くのセクションまで下にスクロールします。

![Connections Configuration](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-17.png)

- 上記で作成した SAML 接続の行を検索し、右にあるトグル ボタンのオン/オフをクリックして、「オン」で緑色になるようにします。これで、このアプリケーションの SAML 接続が有効になります。

## 7. Service Provider から Identity Provider までの接続をテストする


このセクションでは、Auth0 テナント 1 （Service Provider）と Auth0 テナント 2 （Identity Provider）間の SAML 構成が機能しているかをテストします。

- **Auth0 ダッシュボード** で、次のように移動します： **Connections -> Enterprise -> SAMLP Identity Provider** 。

![SAMLP Identity Provider](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-14.jpg)

- 上記で作成した SAML 接続用の三角形の **「**** Try ****」** ボタンをクリックします。このボタンは接続の名前の右にあります。ボタンの上にマウスを移動してテキスト ラベルを表示します。

![Lock Login Widget Testing](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-15.png)

- 最初に、Service Providerによってトリガーされた「 Lock ログインウィジェット」 が表示されます。上記で作成したテストテナントのユーザー名を入力します。

Identity Provider の Lock ログインウィジェットにリダイレクトされます。作成したテストユーザーの資格情報でログインします。

![Connection testing](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-16.png)

SAML 構成が機能するのであれば、ブラウザーは Auth0 ページにリダイレクトされ、 **「**** It Works! ****」** が表示されます。このページには、 Auth0 Identity Provider が Auth0 Service Providerに送信した SAML 認証アサーションのコンテンツが表示されます。これは、Auth0 Service Providerから Auth0 Identity Provider までの SAML 接続が機能しているということです。

**注:** Tryボタンは Auth0 ダッシュボードにログインしたユーザーだけに機能します。これを匿名ユーザーに送信して試用することはできません。

## 8. テストアプリケーション用の HTML ページを作成する


このセクションでは、SAML ログインシーケンスをトリガーする _Auth0 Lock ウィジェット_ に関連した非常に簡単な HTML ページを作成します。これは SAML SSO のエンドツーエンドテストを可能にします。

HTML ページを作り、以下を挿入します。

 {% highlight html %}
<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">
<HTML>
<BODY>
<p> Click on the button to log in </p>

    <script src="http://cdn.auth0.com/js/lock/10.2/lock.min.js"></script>
    <script type="text/javascript">
      var lock = new Auth0Lock('YOUR_CLIENT_ID', 'YOUR_AUTH0_DOMAIN',{
            redirectUrl: 'http://jwt.io',
            responseType: 'token',
            auth: {
              params: {scope: 'openid'}
            }
        });

      function signin() {
        lock.show();
      }
    </script>

<button onclick="signin()">Login</button>
</BODY>
</HTML>
{% endhighlight %}

_YOUR-APP-CLIENT-ID_ を、上記のステップ 7 で登録したクライアントに設定されたClient IDに置換します。クライアントのClient ID は、テナント _1_ の _Auth0 ダッシュボード_ で「Clients」 に移動し、クライアントの名前の右にある「Settings」（ギア）アイコンをクリックすると確認することができます。

ブラウザーを介してアクセスできる場所にこのファイルを保存します。この例では、_「hello-saml.html」_ と呼ぶことにします。

**API セキュリティについての重要注意点：** Auth0 認証を使って _API リクエスト_ を認証する場合、 [使用事例によって異なるフロー](https://auth0.com/docs/api-auth/which-oauth-flow-to-use)を使うように注意してください。Auth0 idToken はクライアント側だけで使用します。 [アクセス トークンは API を認証するために使用すべきです](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)。 [Auth0 で API 呼び出しする](https://auth0.com/docs/apis)ことについての詳細は [こちらから](https://auth0.com/docs/apis) ご覧ください。

## 9. サンプルアプリケーションをテストする


このステップでは、SAML Identity Provider として提供するテナント 2 に対して SAML を介して SSO を実行するために、テナント 1 で設定した Auth0 SAML 接続を使用するサンプル HTML アプリケーションをテストします。

- 上記で作成した HTML ファイルをブラウザーで開きます。最初に、ホワイトページにログインボタンが表示されます。
- その **Login** ボタンをクリックします。

ログインオプションの一つである **Auth0 Lock** ウィジェットが表示されます。

![Test Sample Application](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-18.png)

クライアントの他の接続がオンになっているときは、 **Auth0 Lock ウィジェット** が多少異なって見えるかもしれません。「電子メールアドレスを入力する」という要求がある場合は、入力する電子メールアドレスは、テナント 1 Auth0 ダッシュボードのクライアントの **設定** タブで入力したドメインと同じ名前のドメインを入力します。（ **Apps/APIs -&gt; Settings** ）

![SAML SSO Auth0](https://cdn.auth0.com/docs/media/articles/saml/samlsso-auth0-to-auth0/samlsso-auth0-19.png)

電子メールアドレスを入力した後、Lock ウィジェット上の青色のボタンに新しいラベルが表示されます。 **「saml」** または **アクセス** のラベルが付いているボタンをクリックします。または、ログインしている電子メールアドレスの電子メールドメインでクリックし、Auth0 Identity Provider の SAML SSO シーケンスを開始します。

- ログインするために Identity Provider にリダイレクトされます。

この時点で資格情報の要求があるか否かは、Identity Provider でアクティブなセッションがあるか否かによることに注意してください。上記で行った試用テストから、Identity Provider でのアクティブなセッションがまだあるかもしれません。この場合、再度ログインの要求はありません。 HTML ファイルで指定されたCallbackURL にリダイレクトされます。（このCallbackURL は Auth0 ダッシュボードのClientsのSettingsタブにある **Allowed Callback URLs** にあります。）

十分な時間が経過したか、もしくはテストを開始する前にブラウザーの Cookie を消去したのであれば、Identity Provider にリダイレクトされたときにログインの要求があります。Auth0 テナント 2 で作成したテストユーザーの資格情報を使って、Identity Provider にログインします。

認証が成功したら、HTML ファイル(jwt.io)で指定されたCallbackURL にリダイレクトされます。

## 10. トラブルシューティング


このセクションには、サンプルが機能しないときにチェックする事柄が記載されています。

アプリケーションが初回で機能しない場合は、ブラウズ履歴を消去し、できればテストする前に Cookie を毎回消去します。これをしなければ、ブラウザーは HTML ページの最新バージョンを拾わないか、あるいは古い Cookie を使用して実行に影響させるかもしれません。

SSO のトラブルシューティングは相互作用の HTTP トレースを取り込みするのに役立ちます。解析のためにブラウザーから HTTP トラフィックをキャプチャするツールはたくさんあります。「HTTP トレース」で検索すると見つかります。HTTP トレースが見つかったら、最初から最後までのログイン シーケンスをキャプチャし、 GET のシーケンスを見て想定されるシーケンスのどこまでかをそのトレースで解析します。元のサイトからService Providerまで、それから Identity Provider までのリダイレクト、ログインしなければならないのであれば資格情報の投稿、CallbackURL またはService Providerに戻るリダイレクト、そして最後に、クライアントで指定されたCallbackURL へのリダイレクトを見てみます。

ブラウザーで Cookie と JavaScript が使用できるかを確認します。

HTML ファイルで指定されているCallbackURL が、Auth0 ダッシュボードで登録されたクライアントの「Settings」 タブにある許可されたCallbackURL に記載されているかも確認します。（ダッシュボードで、Clientsをクリックし、クライアントの名前の右にある「Settings」 アイコンをクリックします。）

[http://samltool.io](http://samltool.io/) ツールは SAML アサーションを解読でき、役に立つデバッグ ツールです。

Auth0 も以下の複数のオプションを提供します。

- [Identity Provider](https://auth0.com/docs/saml-idp-generic) [ID プロバイダー](https://auth0.com/docs/saml-idp-generic) [として SAML フェデレーションで機能を果たす Auth0 をどのように構成するか](https://auth0.com/docs/saml-idp-generic)
- [Service Provider](https://auth0.com/docs/saml-sp-generic) [サービスプロバイダー](https://auth0.com/docs/saml-sp-generic) [として SAML フェデレーションで機能を果たす Auth0 をどのように構成するか](https://auth0.com/docs/saml-sp-generic)
- Google Apps、Hosted Graphite、 [Litmos](https://auth0.com/docs/protocols/saml/saml-apps/litmos)、 [Cisco Webex](https://auth0.com/docs/protocols/saml/saml-apps/cisco-webex)、 [Sprout Video](https://auth0.com/docs/protocols/saml/saml-apps/sprout-video)、 [FreshDesk](https://auth0.com/docs/protocols/saml/saml-apps/freshdesk)、Tableau Server、 [Datadog](https://auth0.com/docs/protocols/saml/saml-apps/datadog)、Egencia、Workday および Pluralsight などの SSO 統合用 SAML 構成
- [https://auth0.com/docs/saml-sp-generic](https://auth0.com/docs/saml-sp-generic)、 [OneLogin](https://auth0.com/docs/protocols/saml/identity-providers/onelogin)、 [PingFederate 7](https://auth0.com/docs/protocols/saml/identity-providers/ping7)、 [SalesForce](https://auth0.com/docs/protocols/saml/identity-providers/salesforce)、 [SiteMinder](https://auth0.com/docs/protocols/saml/identity-providers/siteminder) および [SSOCircle](https://auth0.com/docs/protocols/saml/identity-providers/ssocircle) などその他の Identity Provider を使用する Auth0 をどのように構成するか

## まとめ

SAML 認証がどのように機能するかのほかに、アプリケーションに認証を実装するステップについても説明しました。SAML 認証をアプリで実装しませんか？ [Auth0 にサインアップ](https://auth0.com/signup)し、SAML 認証を今すぐ、シームレスに実装しましょう！

[シングル サインオンの詳細をご存知ですか？ SSO ガイドブック（74ページ 無料電子ブック）はこちらから。](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog)