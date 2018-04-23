---
layout: post
title: "SSO ログイン：主な利点と実装"
description: シングル サインオンのログインの利点と Auth0 を使ってそれを実装する方法を学びましょう
date: 2016-10-18 08:30
category: Technical Guide, Identity, Single Sign On
banner:
  text: "The Definitive Guide to Single Sign-On"
  action: "https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog"
  cta: "Download eBook"
design:
  bg_color: "#305F96"
  image: https://cdn.auth0.com/blog/SSO-Logo.png
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- sso-login
- federated-identity
- single-sign-on
- credentials
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
- jp-securing-asp-dot-net-core-2-applications-with-jwts
lang: jp
alternate_locale_en: sso-login-key-benefits-and-implementation
---


**TL;DR:** 会社や組織が成長するにつれて、取扱わなければならないアプリケーションやサービスの数も増えていきます。多くの場合、これらのアプリケーションやサービスはアクセスを管理するために認証を求められます。組織内のさまざまなアプリケーションごとに、ログインするためのそれぞれ別の資格情報(ユーザー名やパスワードなど)を管理することは、非常に難しいです。 **SSO ログイン** を導入することで、その悩みを解消することができます。この記事では、 **SSO ログイン** がどのように機能するのか、またSSO ログインをアプリケーション開発のワークフローに統合することの主な利点について説明します。


## SSO ログインとは?

**シングル サインオン(SSO)のログイン**はユーザーが単一の資格情報を使ってアプリケーションにログインすることを言い、複数のアプリケーションに自動的にサインインします。SSOログインを使用すると、ユーザーはユーザー名やパスワードなどさまざまなログイン資格情報を使わなくても、複数のソフトウェアシステムにアクセスできます。

SSO ログインの非常に一般的な例は Google のソフトウェア製品への実装です。ユーザーが Gmail にログインすると、このユーザーは自動的に YouTube、Google Drive、Google フォト、およびその他の Google 製品にアクセスできます。

![SSO login example - Google apps](https://cdn.auth0.com/blog/sso-google-upload.png)
Gmail にサインインすると、赤いマーカーの製品にアクセスでるようになります。


## SSO ログインの主な利点

**SSO ログイン** を実装すべき理由は何ですか？SSO ログインの利点は何ですか？これを使ってどのようにして製品のコンバージョン率を上げますか？以下に SSO ログインの利点の一部を列記します。

- ユーザー資格情報を再入力する時間を無くすことでユーザーの生産性が向上し、製品所有者のコンバージョン率を向上させることができます。これにより、社内の従業員や外部ユーザーは別の資格情報を維持したり記憶したりという面倒なことを行う必要がなくなります
- さまざまなユーザー名やパスワードを保存したり記憶したりというパスワードの苦労から解放されます
- パスワード問題の苦情が減るので、パスワードリセットの問題や無効な資格情報などへのヘルプデスクシステムの設定に伴うコストを低減できます
- [フィッシング](https://en.wikipedia.org/wiki/Phishing)を最小限に抑え、セキュリティを向上させます
- ローカル、デスクトップ、およびリモートアプリケーションのワークフローを合理化し、ユーザーの生産力を向上させます


## SSO ログインの機能

SSO ログインがどのように機能するかを説明する前に、まずは理想的なシナリオを見てみましょう。 **App FOO** 、 **App BAR** 、および **App BAZ** と言う３つのアプリが別々に開発されています。これらはそれぞれ違うドメインの   **foo.com** 、 **bar.com** および **baz.com** で各々ホストされています。

**課題** ：ユーザーは特定のリソースにアクセスするために 3 つの違うアプリの異なるユーザー名とパスワードを入力する必要があります。

**提案されたソリューション** ：現在の異なるログインシステムを廃除します。ユーザーは **foo.com** にログインすると、認証資格情報を再入力しなくても自動的に **bar.com** および **baz.com** にサインインできるようにすべきです。

**解決策である** ** SSO ログイン **：SSO ログインには _セントラル認証サーバー_ の存在が必要です。セントラル認証サーバーの **foobarbaz.com**を呼び出しましょう。このシナリオの場合、プロセスフローは次のようになります。

1. ユーザーは **foo.com** にアクセスします。
2. ユーザーは **foobarbaz.com** にリダイレクトされ、ここで認証関連の Cookie が生成されます。
3. ユーザーは **bar.com** に移動します。
4. ユーザーは **foobarbaz.com** にリダイレクトされます。
5. **foobarbaz.com** はユーザーが認証関連の Cookie があるかどうかをチェックし、ユーザーを **bar.com** に戻し、その機能とコンテンツを提供します。
6. 同じプロセスが **baz.com** にも適用されます。

シンプルテイクアウェイ・コンセプトは、認証が実行される 1 つのセントラルドメインがあり、セッションが、例えば署名付き JSON Web Token(JWT)のようなある程度セキュアな方法で他のドメインと共有されることです。

![A typical SSO example](https://cdn.auth0.com/blog/typical-sso.png)
_標準的な SSO 図解 例_

## SSO 統合

SSO ログイン統合にはさまざまなものがあります。これらはシングルサインオン ログインで使用できる外部サービスです。_Salesforce_、_Dropbox_、_Microsoft Azure Active Directory_、_Slack_, _SharePoint_、_New Relic_、_Zendesk_ などのような企業アプリケーションに対する SSO ログインを有効にすることができます。


## 補足：Auth0 で SSO ログイン

セントラル認証サーバーとして Auth0 を使ったプロセスフローは以下の通りです。

![Using Auth0 as the central authentication domain](https://cdn.auth0.com/blog/auth0-sso-flow/japanese.png)
_セントラル認証ドメインとして Auth0 を使用する_

Auth0 を使用すると、数回のクリックでSSOログインが可能です。 **Auth0** は、以 **Microsoft Azure Active Directory** 、 **Box** 、 **CloudBees** 、 **Concur** 、 **Dropbox** 、 **Microsoft Dynamics CRM** 、 **Adobe Echosign** 、 **Egnyte** 、 **New Relic** 、 **Office 365** 、 **Salesforce** 、 **SharePoint** 、 **Slack** , **Springcm** 、 **Zendesk** 、および **Zoom** などを含む15以上のクラウドアプリケーションを標準サポートしています。

上記以外にも、Auth0 は **SAML** 、 **WS-Fed** 、および **OAuth 2.0** のような業界標準プロトコルをサポートしていますので、ユーザーが必要とするサード パーティ アプリケーションも利用できます。

Auth0 アカウントをお持ちでない方は、 [こちらからサインイン](https://auth0.com/signup)していただければ、アプリケーションへの SSO ログインが可能になります。アプリで SSO を実装する方法などについては、包括的な [SSO ログイン ドキュメント](https://auth0.com/docs/sso)をご覧ください。また、Auth0 を使って_シングルページアプリ_や_標準 Web アプリ_ で SSO を実装する方法を示す [コードサンプル](https://github.com/auth0-samples/auth0-sso-sample)も提供していますのでご覧ください。

## まとめ

アプリケーションやサービスの大規模なエコシステムを管理するためにSSOログインを使う利点は数え切れないほどあります。モダンなアプリケーション開発は分散システムをサポートしています。効率的な SSO ログインを導入することで、毎回認証を心配することなく、既存のサービススイートにアプリケーションを追加することが簡単になります。Google が SSO ログインを実装して成功しているのであれば、お客様も Auth0 でも同じようにできます！

{% include tweet_quote.html quote_text="Google が SSO ログインを実装して成功しているのであれば、お客様も Auth0 で同じようにできます！" %}


[シングル サインオンの詳細をご存知ですか？](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog) [より詳細な](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog) [SSO ガイドブック（74ページ 無料電子ブック）はこちらから](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog) [入手できます](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog) [。](https://resources.auth0.com/definitive-guide-to-single-sign-on/?utm_source=blog)