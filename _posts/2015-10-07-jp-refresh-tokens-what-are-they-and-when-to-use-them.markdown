---
layout: post
title: "Refresh Token： どのような場合に使用し、どのように JWT と相互作用するか"
description: "Refresh Tokenがどのように最新の Web に適合するかについて学びましょう。 NodeJS を実装する方法をサンプルを使用して学びます"
date: 2015-10-07 09:00
category: Technical Guide, Identity, Refresh Tokens
author:
  name: Sebastián Peyrott
  url: https://twitter.com/speyrott?lang=en
  mail: speyrott@auth0.com
  avatar: https://en.gravatar.com/userimage/92476393/001c9ddc5ceb9829b6aaf24f5d28502a.png?size=200
design: 
  bg_color: "#415156"
  image: "https://cdn.auth0.com/blog/refresh-token/tokens.png"
tags:
- refresh-token
- authentication
- authorization
- oauth
- openid
- access-token
- token
- jwt
- sliding-sessions
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: refresh-tokens-what-are-they-and-when-to-use-them

---

本書では [OAuth2](https://tools.ietf.org/html/rfc6749) で定義されたRefresh Tokenの概念について学びます。また、Refresh Tokenと他のトークンタイプを比較して、その理由と方法を学びます。さらに、簡単な例を使ってRefresh Tokenの使い方について説明します。それでは、始めましょう！

**更新：** 本書を書いた時点では、Auth0 は [OpenID Connect 認証](http://openid.net/certification/)を取得していませんでした。本書では `access token` のような用語の一部は本仕様に準拠しませんが、 [OAuth2 仕様](https://tools.ietf.org/html/rfc6749#section-1.4)には準拠しています。OpenID Connect は `access token` （Authorization Server[認証サーバー]の API へのアクセスに使用）および `id token` （リソース サーバーに対するクライアント認証に使用）を明確に区別します。

## はじめに

先進的な認証および/または認可ソリューションは_トークン_の概念をそのプロトコルに導入しました。トークンは具体的に、 **ユーザーがアクションを実行することを認可するか承認** 、もしくはクライアントが **認可プロセスに関する追加情報を取得** し、完了するために十分な情報を含む特別に加工されたデータです。言い換えれば、トークンは認可プロセスが実行することを可能にする情報の構成物です。この情報がクライアント（または、Authorization Server以外のパーティ)によって読み取り可能か解析可能かは、実装によって定義されます。重要な点は、クライアントがこの情報を取得し、トークンを **リソースへのアクセスを**** する**ために使用することです。JSON Web Token (JWT) [仕様](https://tools.ietf.org/html/rfc7519)は共通のトークン情報が実装によって表される方法を定義します。

## JWT の 要約 簡単なまとめ

JWT は認証/認可プロセスに関する特定の共通情報を **表記する** 方法を定義しています。名前が示す通り、データ形式は **JSON** です。JWT はsubject(件名)、issuer(発行元)、expiration time(有効期限)など特定の **共通フィールド** を持ちます。JWTは、 [JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515)や [JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516)などのその他の仕様と組み合わせたときに非常に役に立ちます。これらの仕様を組み合わせることで、認証トークンに必要な全ての情報を提供するだけでなく、改ざんされなくなるようにトークンの **コンテンツを検証** する機能 (JWS)や、クライアントに対して **不透明さ** を維持できるように **情報を暗号化** する機能(JWT)を提供します。データ形式のシンプルさ（とその他の長所）のお陰で、JWT はトークンの最も一般的タイプのひとつになりました。JWT を Web アプリに実装する方法については、Ryan Chenkie 氏の素晴らしい [投稿](https://auth0.com/blog/2015/09/28/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/)をご覧ください。

## トークンのタイプ

本書の目的上、最も一般的タイプのトークン、_Access Token_ および _Refresh Token_ の 2 つのタイプについて学びます。

- **Access Token** はリソースに直接アクセスするために必要な情報を保持しています。つまり、クライアントがリソースを管理するサーバーにAccess Tokenをパスするとき、そのサーバーはそのトークンに含まれている情報を使用してクライアントが認可したものかを判断します。Access Tokenには通常、有効期限があり、存続期間は短いです。

![Access Token](https://cdn.auth0.com/blog/refresh-token/diag1.png)

- **Refresh Token** は新しいAccess Tokenを取得するために必要な情報を保持しています。つまり、特定リソースにアクセスする際に、Access Tokenが必要な場合には、クライアントはAuthorization Serverが発行する新しいAccess Tokenを取得するためにRefresh Tokenを使用します。一般的な使用方法は、Access Tokenの期限が切れた後に新しいものを取得したり、初めて新しいリソースにアクセスするときなどです。Refresh Tokenにも有効期限がありますが、存続期間はAccess Tokenよりも長くなっています。Refresh Tokenは通常、漏洩しないように厳しいストレージ要件が課せられます。Authorization Serverによってブラックリストに載ることもあります。

![Refresh Token](https://cdn.auth0.com/blog/refresh-token/diag2.png)

トークンが不透明かどうかは通常、実装によって定義されます。一般的な実装は、 **Access Token**** に対する ****直接認可**** チェック**を許可にします。つまり、Access Tokenがリソースを管理するサーバーに渡されると、そのサーバーはそのトークンに含まれる情報を読み取り、ユーザーが認可されているかを独自に判断します（Authorization Serverに対するチェックは不要です）。これが、トークンが署名されなければならない理由のひとつです（例えば、JWS を使う）。一方、Refresh Tokenは通常、Authorization Serverに対するチェックを要します。認可チェックの処理を分割することで、次の 3 つが可能になります。

1. Authorization Serverに対するアクセスパターンの改善（負荷の軽減、迅速なチェック）
2. Access Tokenの漏洩に対する短い有効期限（これらの有効期限が短いことで、漏洩したトークンを使用して保護されたリソースへのアクセスが許可されてしまう可能性が低減されます）
3. スライディング セッション（以下参照）

### **スライディング セッション**

スライディング セッションとは、 **一定期間使用しない** と期限切れになるセッションです。予想される通り、これはAccess TokenとRefresh Tokenを使って簡単に実装できます。ユーザーがあるアクションを実行すると、新しいAccess Tokenが発行されます。このユーザーが期限切れのAccess Tokenを使用すると、そのセッションは非アクティブと見なされて新しいAccess Tokenが必要になります。このトークンがRefresh Tokenで取得できるか、新しい認証ラウンドが必要となるかは、開発チームの要件によって定義されます。

### **セキュリティの考慮事項**

Refresh Tokenは **有効** **期間が長い** です。そのため、クライアントがサーバーからRefresh Tokenを取得した後、このトークンを潜在的な攻撃者が使用できないように、**セキュリティで保護** されなければなりません。Refresh Tokenが漏洩してしまうと、それがブラックリストに載るまで、あるいは期限切れになるまで（このようになるには時間を要するかもしれません）、新しいAccess Tokenを取得するために（そして、保護されたリソースにアクセスするために）使用されるかもしれません。Refresh Tokenは他のパーティが漏洩されたトークンを使用しないように、ひとつの認証クライアントに発行されなければなりません。Access Tokenは秘密にしなければなりませんが、存続期間が短いため、予想される通り、セキュリティの考慮事項の制限も緩くなります。

{% include tweet_quote.html quote_text="Access Tokenは秘密にしなければなりませんが、存続期間が短いため、セキュリティの考慮事項の制限も緩くなります。" %}

## 例：サーバー発行のRefresh Token

この例では、Access TokenとRefresh Tokenを発行するために [node-oauth2-server](https://github.com/thomseddon/node-oauth2-server) がベースの簡単なサーバーを使用します。Access Tokenは、保護されているリソースにアクセスするために必要となります。クライアントはシンプルな CURL コマンドです。この例のコードは [node-oauth2-server の例](https://github.com/thomseddon/node-oauth2-server/tree/master/examples)をベースにしています。Access Tokenを JWT で使用するためにベース例を修正しました。

Node-oauth2-server はモデル用事前定義されたAPI を使用します。このドキュメントは [こちらから](https://github.com/thomseddon/node-oauth2-server/blob/master/Readme.md)ご覧ください。以下のコードは JWT Access Tokenのモデルを実装する方法を示しています。

<span style="color: red">DISCLAIMER: </span><span style="color: #5c666f">以下の例にあるコードは本番環境用ではありませんので、ご注意ください。</span>

```javascript
model.generateToken = function(type, req, callback) {
  //refresh tokens に既定の実装を使用します
  console.log('generateToken: ' + type);
  if(type === 'refreshToken') {
    callback(null, null);
    return;
  }

  //access tokens に JWT を使用します
  var token = jwt.sign({
    user: req.user.id
  }, secretKey, {
    expiresIn: model.accessTokenLifetime,
    subject: req.client.clientId
  });

  callback(null, token);
}

model.getAccessToken = function (bearerToken, callback) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  try {
    var decoded = jwt.verify(bearerToken, secretKey, {
        ignoreExpiration: true //OAuth2 サーバー実装によって処理済み
    });
    callback(null, {
      accessToken: bearerToken,
      clientId: decoded.sub,
      userId: decoded.user,
      expires: new Date(decoded.exp * 1000)
    });
  } catch(e) {    
    callback(e);
  }
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveAccessToken (token: ' + token +
              ', clientId: ' + clientId + ', userId: ' + userId.id +
              ', expires: ' + expires + ')');

  //JWT tokens トークンを保存する必要はありません。
  console.log(jwt.decode(token, secretKey));

  callback(null);
};
```

OAuth2 トークンエンドポイント (/oauth/token) はあらゆるタイプのgrant（パスワードやRefresh Token）を発行・処理します。その他のエンドポイントはAccess Tokenをチェックする OAuth2 ミドルウェアによって保護されます。

```javascript
// リクエストを許可するトークンを処理します
app.all('/oauth/token', app.oauth.grant());

app.get('/secret', app.oauth.authorise(), function (req, res) {
  // 有効な access_token が必要です
  res.send('Secret area');
});
```


例えば、パスワードに 'test' を設定したユーザー 'test' と、client secretに 'secret' を設定した 'testclient' というクライアントがある場合、以下のように、新しいAccess Token/Refresh Tokenのペアをリクエストできます。


```sh
$ curl -X POST -H 'Authorization: Basic dGVzdGNsaWVudDpzZWNyZXQ=' -d 'grant_type=password&username=test&password=test' localhost:3000/oauth/token

{
    "token_type":"bearer",
    "access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiVlx1MDAxNcKbwoNUwoonbFPCu8KhwrYiLCJpYXQiOjE0NDQyNjI1NDMsImV4cCI6MTQ0NDI2MjU2M30.MldruS1PvZaRZIJR4legQaauQ3_DYKxxP2rFnD37Ip4",
    "expires_in":20,
    "refresh_token":"fdb8fdbecf1d03ce5e6125c067733c0d51de209c"
}
```

Authorization Headerには、client idとclient secretをBASE64 (testclient:secret) でエンコードした内容を含んでいます。

Access Tokenを使用して保護されたリソースにアクセスするには：

```sh
$ curl 'localhost:3000/secret?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiVlx1MDAxNcKbwoNUwoonbFPCu8KhwrYiLCJpYXQiOjE0NDQyNjI1NDMsImV4cCI6MTQ0NDI2MjU2M30.MldruS1PvZaRZIJR4legQaauQ3_DYKxxP2rFnD37Ip4'

Secret area

```

"secret area" にアクセスしても、JWTのおかげでデータベース検索によってAccess Tokenが検証されることはありません。

トークンが期限切れになると:

```sh
$ curl 'localhost:3000/secret?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiVlx1MDAxNcKbwoNUwoonbFPCu8KhwrYiLCJpYXQiOjE0NDQyNjI2MTEsImV4cCI6MTQ0NDI2MjYzMX0.KkHI8KkF4nmi9z6rAQu9uffJjiJuNnsMg1DC3CnmEV0'

{
    "code":401,
    "error":"invalid_token",
    "error_description":"The access token provided has expired."
}
```

これで、以下のようにトークンエンドポイントをヒットすることで、新しいAccess Tokenを取得するためにRefresh Tokenを使用することができます。

```sh
curl -X POST -H 'Authorization: Basic dGVzdGNsaWVudDpzZWNyZXQ=' -d 'refresh_token=fdb8fdbecf1d03ce5e6125c067733c0d51de209c&grant_type=refresh_token' localhost:3000/oauth/token

{
    "token_type":"bearer",
    "access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiVlx1MDAxNcKbwoNUwoonbFPCu8KhwrYiLCJpYXQiOjE0NDQyNjI4NjYsImV4cCI6MTQ0NDI2Mjg4Nn0.Dww7TC-d0teDAgsmKHw7bhF2THNichsE6rVJq9xu_2s",
    "expires_in":20,
    "refresh_token":"7fd15938c823cf58e78019bea2af142f9449696a"
}
```

<span style="color: red">DISCLAIMER: </span><span style="color: #5c666f"> 上記例で説明したコードは本番環境用ではありませんので、ご注意ください。.</span>

完全なコードについては [こちらから](https://github.com/auth0/blog-refresh-tokens-sample)ご覧ください。

## 補足 Auth0 アプリで Refresh Tokenを 使用する

Auth0 はユーザーにとって重要な難しい認証サービスを提供しています。Refresh Tokenも例外ではありません。Auth0 を使って [アプリをセットアップ](https://auth0.com/docs)したら、 [こちらから](https://auth0.com/docs/refresh-token)ドキュメントに従ってRefresh Tokenの取得方法を学びましょう。

## まとめ

Refresh Tokenはセキュリティを向上させ改善し、待機時間を削減し、Authorization Serverへのアクセスパターンを改善します。実装は JWT + JWS のようなツールを使って簡単にできます。トークン（そして、Cookie）についての詳細は [こちら](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/) [の記事](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/)をご覧ください。

詳細については、 [Refresh Token](https://auth0.com/learn/refresh-tokens) [ランディングページ](https://auth0.com/learn/refresh-tokens)でもご確認いただけます。