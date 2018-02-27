---
layout: post
title: "ASP.NET Core 2.0 アプリケーションを JWT でセキュアする"
description: "JSON Web Token を ASP.NET Core 2 アプリケーションで使用する方法を表示する実用的なチュートリアルです。"
date: 2017-12-07 08:30
category: Technical Guide, Microsoft, ASP Net Core
author:
  name: "Andrea Chiarelli"
  url: "https://twitter.com/andychiare"
  mail: "andrea.chiarelli.ac@gmail.com"
  avatar: "https://pbs.twimg.com/profile_images/827888770510880769/nnvUxzSd_400x400.jpg"
design:
  bg_color: "#3A1C5D"
  image: https://cdn.auth0.com/blog/asp-net-core-tutorial/logo.png
tags:
- .net-core
- asp.net-core
- asp.net
- c#
- oauth
- openid-connect
related:
- jp-reactjs-authentication
- jp-vuejs2-authentication
lang: jp
alternate_locale_en: securing-asp-dot-net-core-2-applications-with-jwts
---

注意！本書は ASP.NET Core プラットフォームのバージョン 2.0 を参照しています。ASP.NET Core 1.0 をセキュアにする方法をお探しの方は、 [ASP.NET Core 認証チュートリアル](https://auth0.com/blog/asp-dot-net-core-authentication-tutorial/) セクションをご参照ください。お楽しみください！

---

**TL;DR:** 以前のバージョンとは異なり、ASP.NET Core 2 は JSON Web Token に対するネイティブサポートを提供します。このサポートにより、ASP.NET アプリケーションにおけるこのテクノロジをより簡単な方法で統合することができます。本書では、ASP.NET Core 2 をベースにして Web API アプリケーションを作成する際 JWT を有効にする方法を見ていきます。 [最終コードはこの GitHub レポジトリで検索できます](https://github.com/andychiare/netcore2-jwt)。

## JWT への簡単な概要

_JSON Web Token_（短縮して JWT）は Web 環境においてますます人気を集めています。 [JWT](https://auth0.com/docs/jwt) [は、コンパクトかつセキュアな方法で JSON オブジェクトとしてパーティ間でデータ送信を可能にするオープンスタンダードです](https://auth0.com/docs/jwt)。ソースおよびターゲット間で送信されるデータは簡単に検証を受け、信頼が得られるようにデジタル署名されているので、通常、認証や情報交換を行う際に使用されています。

JWT は以下の 3 つのセクションで構成されています。

- `Header`： これは JWT のタイプや、データを暗号化するために使用するハッシュ アルゴリズムについてのメタ情報を含む JSON オブジェクトです。
- `Payload`： ソースおよびターゲット間で実際に共有されるデータを含む JSON オブジェクトであっても、これらのデータは _claims_ でコード化され、エンティティについて、一般的にはユーザーについてのステートメントです。
- `Signature`： このセクションは上記の 2 つのセクションをベースにしたデジタル署名を表すので、データの整合性を確認することができます。

JWT の 3 つのセクションは、データが HTTP ベース環境に簡単に送信できるようにドット(.)で区切った [Base64 文字列](https://en.wikipedia.org/wiki/Base64) のシーケンスに統合されています。認証で使用するときは、JWT テクノロジーはクライアントにセッションデータを保存できるようにし、保護されたリソースにアクセスしようとする際にはトークンをサーバーに提供します。通常、トークンは [Bearer スキーマ](https://swagger.io/docs/specification/authentication/bearer-authentication/) を使って`Authorization` HTTP ヘッダーでにあるサーバーに送信され、それにはそのリソースへのアクセス許可または拒否を可能にするすべての情報が含まれています。

もちろん、本書は一般用語やテクノロジーの基本的なアイディアを含む JWTについての簡単な概要です。詳細については、 [JSON Web Token の概要](https://jwt.io/introduction/)をご覧ください。

{% include tweet_quote.html quote_text="JSON Web Token は JSON オブジェクトとしてパーティ間で安全に情報を送信するためのコンパクトで自己完結型のTokenです。" %}

## ASP.NET Core 2.0 アプリケーションを JWT でセキュアする

Web API アプリケーションを作成しながら、JWT をサポートした [ASP.NET Core 2 アプリケーション](https://www.microsoft.com/net/) をセットアップする方法を見てみましょう。Visual Studio を使って、またはコマンドラインを通してこのアプリケーションを作ることができます。前者の場合では、次の画像で示すように_ASP.NET Core Web アプリケーション_ プロジェクトテンプレートを選択します。

![Creating ASP.NET Core 2 project on Visual Studio](https://cdn.auth0.com/blog/net-core-2/creating-project.png)

次に、ASP.NET アプリケーションのタイプを選択しますが、この場合では、次の画像で示すように_Web API_を選択します。

![Creating ASP.NET Core 2 Web API](https://cdn.auth0.com/blog/net-core-2/creating-project-web-api.png)

簡便性のため、JWTの管理にフォーカスしたいので、ここでは認証のどのタイプの認証にも可能にしていません。

コマンドラインからアプリケーションを作りたい場合は、以下のコマンドを通して作成することができます。

```shell
dotnet new webapi -n JWT
```

これで、現在のフォルダに JWT という名前の ASP.NET Web API プロジェクトを作られます。

![Creating ASP.NET Core 2 project with dotnet cli](https://cdn.auth0.com/blog/net-core-2/creating-app-through0-cli.png)

プロジェクトの作成方法にかかわらず、基本的な ASP.NET Core 2 Web API アプリケーションを設定するクラスを定義するファイルがフォルダに作成されます。

まず最初に、JWT ベース認証のサポートを構成するために、`Startup.cs` の `ConfigureServices` メソッドの本文を変更します。以下は、`ConfigureServices` の実装によるものです。

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace JWT
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // このメソッドはランタイムで呼び出されます。このメソッドを使って HTTP リクエストパイプラインを構成します。
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
          };
        });

      services.AddMvc();
    }
  }
}
```

ここで、`AddAuthentication` メソッドを使って `JwtBearerDefaults.AuthenticationScheme` を指定して JWT 認証スキーマを登録します。次に JWT Bearerオプションで認証を構成します。特に、 JSON Web Token の有効性を検討するために、どのパラメーターを考慮しなければならないかを指定します。このコードでは、トークンの有効性を検討するには以下をしなければならないとしています。

1. トークンを作成したサーバーを検証する(`ValidateIssuer = true`)
2. トークンの受信人が受信を許可されているかを確認する (`ValidateAudience = true`)
3. トークンの期限が切れておらず、Issuerの署名鍵が有効であることをチェックする (`ValidateLifetime = true`)
4. 受信したトークンを署名するために使用された鍵が信頼された鍵のリストに入っていることを検証する (`ValidateIssuerSigningKey = true`)。

また、Issuer、audience、および署名鍵の値も指定します。これらの値は `appsettings.json` ファイルに保存し、以下の`Configuration` オブジェクトを通してアクセスできるようにします。

```js
//appsettings.json
{
// ...
  "Jwt": {
    "Key": "veryVerySecretKey",
    "Issuer": "http://localhost:63939/"
  }
}
```

このステップでは JWT ベースの認証サービスを構成します。この認証サービスがアプリケーションで使用できるようにするため、`app.UseAuthentication()` を呼び出す `Configure` メソッドを `Startup` クラスに作成します。

// その他のメソッド

```csharp
// その他のメソッド
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
  if (env.IsDevelopment())
  {
    app.UseDeveloperExceptionPage();
  }

  app.UseAuthentication();

  app.UseMvc();
}
```

この変更で、JWT ベースの認証をサポートするアプリケーションの構成が完了します。

## ASP.NET Core 1.0 と ASP.NET Core 2.0 の比較

[どのように ASP.NET Core 1.x が JWT をサポートするか](https://auth0.com/blog/asp-dot-net-core-authentication-tutorial/)についてご存知であれば、その有効性をすでに経験されていることでしょう。

まずはじめに、ASP.NET Core の以前のバージョンでは、外部パッケージをいくつかインストールする必要がありました。2.0ではJSON Web Token はネイティブでサポートされているので、これらをインストールする必要がなくなりました。

また、総合的な認証システムの結果として、構成手順が簡潔化されました。実際、ASP.NET Core 1.0 ではサポートする各認証スキーマごとにそれぞれ1 つのミドルウェアがありましたが、ASP.NET Core 2.0 では 1 つのミドルウェアが全ての認証を処理し、各認証スキーマはサービスとして登録されます。

このことにより、よりコンパクトでより整理されたコードを作ることができます。

## ASP.NET Core 2.0 エンドポイントを JWT でセキュアする

JWT ベースの認証を有効にしたら、HTTP `GET` リクエストで呼び出されたときに書籍のリストを返すシンプルな Web API を作りましょう。この API は以下の `Controllers` 名前空間の `BooksController` と呼ばれる新しいクラスで保持されます。

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespaceJWT.Controllers
{
  [Route(&quot;api/[controller]&quot;)]
  publicclassBooksController : Controller
  {
    [HttpGet, Authorize]
    public IEnumerable&lt;Book&gt; Get()
    {
    var currentUser = HttpContext.User;
    var resultBookList = new Book[] {
      new Book { Author = &quot;Ray Bradbury&quot;,Title = &quot;Fahrenheit 451&quot; },
      new Book { Author = &quot;Gabriel García Márquez&quot;, Title = &quot;One Hundred years of Solitude&quot; },
      new Book { Author = &quot;George Orwell&quot;, Title = &quot;1984&quot; },
      new Book { Author = &quot;Anais Nin&quot;, Title = &quot;Delta of Venus&quot; }
   };

     return resultBookList;
  }

    publicclassBook
  {
    publicstring Author { get; set; }
    publicstring Title { get; set; }
    publicbool AgeRestriction { get; set; }
  }
  }
}
```

ご覧の通り、API は単に書籍の配列を返します。ただし、`Authorize` 属性で API をマークすると、このエンドポイントに対するリクエストが HTTP リクエストで渡されたトークンの認証チェックをトリガーします。

アプリケーション （IDE または `dotnet run` コマンドを通して）を実行し、 GET リクエストを `/api/books` エンドポイントにするならば、応答として`401` HTTP ステータスコードを取得します。 [プロジェクトのソースコード](https://github.com/andychiare/netcore2-jwt) に添付されている `Test` プロジェクトの `UnAuthorizedAccess` テストを実行するか、あるいは [curl](https://curl.haxx.se/) または [Postman](https://www.getpostman.com/) のような汎用 HTTP クライアントを使ってお試しください。

![Using Postman to issue requests to ASP.NET Core 2 web API](https://cdn.auth0.com/blog/net-core-2/interacting-with-postman.png)

もちろん、この結果はトークンが不足しているためですから API へのアクセスは拒否されます。

## 認証用の JWT を作成する

ユーザーが新しい JWT を得るために認証できるように、このアプリケーションに認証 API を追加しましょう。それをするに、以下のコードで `TokenController` と呼ばれるコントローラを `Controllers` namespaceに作りましょう。

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JWT.Controllers
{
  [Route("api/[controller]")]
  public class TokenController : Controller
  {
    private IConfiguration _config;

    public TokenController(IConfiguration config)
    {
      _config = config;
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult CreateToken([FromBody]LoginModel login)
    {
      IActionResult response = Unauthorized();
      var user = Authenticate(login);

      if (user != null)
      {
        var tokenString = BuildToken(user);
        response = Ok(new { token = tokenString });
      }

      return response;
    }

    private string BuildToken(UserModel user)
    {
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(_config["Jwt:Issuer"],
        _config["Jwt:Issuer"],
        expires: DateTime.Now.AddMinutes(30),
        signingCredentials: creds);

      return new JwtSecurityTokenHandler().WriteToken(token);
     }

     private UserModel Authenticate(LoginModel login)
     {
      UserModel user = null;

      if (login.Username == "mario" && login.Password == "secret")
      {
        user = new UserModel { Name = "Mario Rossi", Email = "mario.rossi@domain.com"};
      }
      return user;
     }

    public class LoginModel
    {
      public string Username { get; set; }
      public string Password { get; set; }
    }

    private class UserModel
    {
      public string Name { get; set; }
      public string Email { get; set; }
      public DateTime Birthdate { get; set; }
    }
  }
}
```

最初に気づくことは `AllowAnonymous` 属性の存在です。これは、ユーザーが資格情報を提供した後に、新しいトークンを得るために誰もがアクセスできる API、つまりパブリック API でなければならないので非常に重要です。

API は HTTP `POST` リクエストに応答し、ユーザー名とパスワード（`LoginModel` オブジェクト）を含むオブジェクトを予測します。

`Authenticate` メソッドは提供されたユーザー名とパスワードが予期されたものであることを確認し、ユーザーを表す `UserModel` オブジェクトを返します。もちろん、これは認証プロセスの簡易実装です。本番環境用の実装では言うまでもなく、より正確であるべきです。

`Authentication` メソッドがユーザーを返せば、提供された資格情報が有効であり、AuthenticationAPI は `BuildToken` メソッドを通して新しいトークンを生成します。これは最も興味深い部分ですが、ここで `JwtSecurityToken` クラスを使って JSON Web Token を作ります。Issuer、audience（この場合は、両方とも同じです）、有効期限および時間、および署名など、Class コンストラクタにいくつかのパラメーターを渡します。最後に、`JwtSecurityTokenHandler` クラスの `WriteToken` メソッドを通してそれらを変換し、`BuildToken` メソッドは文字列としてトークンを返します。

## API へのアクセスを認証する

ここで、作成した 2 つの API をテストします。

まず、HTTP POST リクエストを `/api/token` エンドポイントに作り、以下の JSON をリクエスト本文に渡して、JWT を取得しましょう。

{&quot;username&quot;: &quot;mario&quot;, &quot;password&quot;: &quot;secret&quot;}

これは、Postman またはどの HTTP クライアントでも簡単にできます。例えば、curl では以下がコマンドになります。

```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"username": "mario", "password": "secret"}' \
  0:5000/api/token
```

レスポンスとして、次のような JSON を取得します。


```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXJpbyBSb3NzaSIsImVtYWlsIjoibWFyaW8ucm9zc2lAZG9tYWluLmNvbSIsImJpcnRoZGF0ZSI6IjE5ODMtMDktMjMiLCJqdGkiOiJmZjQ0YmVjOC03ZDBkLTQ3ZTEtOWJjZC03MTY4NmQ5Nzk3NzkiLCJleHAiOjE1MTIzMjIxNjgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjM5MzkvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo2MzkzOS8ifQ.9qyvnhDna3gEiGcd_ngsXZisciNOy55RjBP4ENSGfYI"
}
```

トークンの値を見ると、本書の始めで話し合ったように、3 つの部分はドット（.）で区切られています。

ここで、前のセクションで実行したように、書籍のリストをリクエストします。ただし、今回は認証 HTTP ヘッダーとしてトークンを提供します。

```Authorization: Bearer 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXJpbyBSb3NzaSIsImVtYWlsIjoibWFyaW8ucm9zc2lAZG9tYWluLmNvbSIsImJpcnRoZGF0ZSI6IjE5ODMtMDktMjMiLCJqdGkiOiJmZjQ0YmVjOC03ZDBkLTQ3ZTEtOWJjZC03MTY4NmQ5Nzk3NzkiLCJleHAiOjE1MTIzMjIxNjgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NjM5MzkvIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo2MzkzOS8ifQ.9qyvnhDna3gEiGcd_ngsXZisciNOy55RjBP4ENSGfYI
```

前回と同様に、これは Postman またはどの HTTP クライアントでも簡単にできます。Curl では、以下がコマンドになります。

```bash
curl -H 'Authorization: Bearer '$JWT 0:5000/api/books
```

もちろん、`JWT` env 変数は`JWT="eyJhbG..."` をサインインしている間に受け取ったトークンでセットしなければなりません。

今回は書籍のリストを取得します。

## JWT claimsを ASP.NET Core 2.0 で処理する

JWT について説明しているときに、トークンには _claims_ と呼ばれるデータが含まれているかもしれないと言及しました。これらは通常、リソースへのアクセスを認可するときに有益になり得るユーザーについての情報です。claimsは例えば、ユーザーの電子メール、性別、役割、市町村、あるいはリソースにアクセスしているときにユーザーを識別する有益なその他の情報が考えられます。リソースにアクセスする認可をチェックしているときにclaimsが利用できるように JWT にそれらを追加できます。ASP.NET Core 2 アプリケーションでどのようにclaimsを管理するか、練習してみましょう。

このリストには、全員に適切でない書籍が含まれているとします。例えば、年齢制限のある書籍が含まれています。認証後に返される JWT にはユーザーの年齢についての情報を含むべきです。それをするには、`TokenController` の `BuildToken` メソッドを以下のように更新しましょう。


```csharp
private string BuildToken(UserModel user)
{

  var claims = new[] {
    new Claim(JwtRegisteredClaimNames.Sub, user.Name),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(JwtRegisteredClaimNames.Birthdate, user.Birthdate.ToString("yyyy-MM-dd")),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
  };

  var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
  var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

  var token = new JwtSecurityToken(_config["Jwt:Issuer"],
    _config["Jwt:Issuer"],
    claims,
    expires: DateTime.Now.AddMinutes(30),
    signingCredentials: creds);

  return new JwtSecurityTokenHandler().WriteToken(token);
}
```

前バージョンとの主な違いは `claims` 変数の定義に関するものです。それは`claims` の配列インスタンスで、それぞれが鍵と値から作成されています。その鍵は [標準化されたclaims](https://tools.ietf.org/html/rfc7519#section-4)用の名前を提供するある構造の値 (`JwtRegisteredClaimNames`) です。ユーザーの名前、電子メール、生年月日、および JWT に関係するユニークな識別子のclaimsを作成しました。

この `claims` 配列はクライアントに送信される JWT に含まれるように `JwtSecurityToken` コンストラクターに渡されます。

では、以下のように書籍のリストを返すときにユーザーの年齢を考慮するために、API コードを変更する方法を見てみましょう。

```csharp
[Route("api/[controller]")]
public class BooksController : Controller
{
  [HttpGet, Authorize]
  public IEnumerable<Book> Get()
  {
    var currentUser = HttpContext.User;
    int userAge = 0;
    var resultBookList = new Book[] {
      new Book { Author = "Ray Bradbury", Title = "Fahrenheit 451", AgeRestriction = false },
      new Book { Author = "Gabriel García Márquez", Title = "One Hundred years of Solitude", AgeRestriction = false },
      new Book { Author = "George Orwell", Title = "1984", AgeRestriction = false },
      new Book { Author = "Anais Nin", Title = "Delta of Venus", AgeRestriction = true }
    };

    if (currentUser.HasClaim(c => c.Type == ClaimTypes.DateOfBirth))
    {
      DateTime birthDate = DateTime.Parse(currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.DateOfBirth).Value);
      userAge = DateTime.Today.Year - birthDate.Year;
    }

    if (userAge < 18)
    {
      resultBookList = resultBookList.Where(b => !b.AgeRestriction).ToArray();
    }

    return resultBookList;
  }

  public class Book
  {
    public string Author { get; set; }
    public string Title { get; set; }
    public bool AgeRestriction { get; set; }
  }
}
```


`AgeRestriction` プロパティを書籍クラスに追加しました。書籍に年齢が制限されているか否かを表す値はboolean値です。

リクエストを受け取ると、`DateOfBirth`  Claimが現在のユーザーに関係するものかをチェックします。肯定の場合は、そのユーザーの年齢を計算します。もし、そのユーザーが 18 歳未満であれば、そのリストには年齢制限なしの書籍のみがが含まれ、そうでない場合はリスト全体が返されます。

この新しいシナリオは、 [プロジェクトのソースコード](https://github.com/andychiare/netcore2-jwt) に含まれているテストの `GetBooksWithoutAgeRestrictions` および `GetBooksWithAgeRestrictions` を実行するか、あるいは以下の`curl` コマンドを発行してテストします。

```bash
# サインイン
curl -X POST -H 'Content-Type: application/json' -d '{username: "mary", password: "barbie"}' 0:5000/api/token

# JWT 変数を設定する（AAA.BBB.CCC と受け取ったトークンと置換する）
JWT="AAA.BBB.CCC"

# 書籍を入手する
curl -H 'Authorization: Bearer '$JWT 0:5000/api/books
```

最後のコマンドは、以下で制限されている以外の全ての書籍を含むリストを送信します。_Delta of Venus_。

{% include tweet_quote.html quote_text="ASP.NET Core 2.0 API をセキュアにする方法を学んだばかりです。" %}

## クロス オリジンなリクエスト(CORS)を ASP.NET Core 2.0 で有効にする

多くの場合、API がその他のオリジン（その他のドメイン）から来るリクエストを受け入れるように指定します。AJAX リクエストを発行するとき、ブラウザーはプレフライトを作成し、サーバーが Web アプリをホストするドメインからのリクエストを受け入れているかをチェックします。これらプレライトの応答に、少なくともオリジナルドメインからのリクエストを受け入れることを指定する `Access-Control-Allow-Origin` ヘッダーが含まれないのであれば、ブラウザーは（セキュリティ対策のため）実際のリクエストを開始しません。

CORS のサポートを含む （および、このヘッダーと一緒にいくつか追加する）には、`Startup` クラスにあと 2 つの変更を加える必要があります。最初に、以下を追加する必要があります

```csharp
services.AddCors(options =>
{
  options.AddPolicy("CorsPolicy",
      builder => builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
  .Build());
});
```

`ConfigureServices` メソッドの最後の呼び出しとして追加します。次に、以下を加えます。

```bash
app.UseCors("CorsPolicy");
```

これで、この API は基本的にどんなオリジンからのリクエストでもリクエストを受け入れます。さらにセキュリティを高めるには、`AllowAnyOrigin` を `WithOrigins` に変更し、特定オリジン（例：`https://mydomain.com`） を定義します。

## 備考：ASP.NET Core 2.0 を Auth0 でセキュアにする

ASP.NET Core 2.0 アプリケーションを Auth0 でセキュアにすることは簡単で、たくさんの素晴らしい機能を提供します。 [Auth0](https://auth0.com/) を使うと数行のコード行を書くだけで、強固な [ID 管理ソリューション](https://auth0.com/user-management)、 [シングル サインオン](https://auth0.com/docs/sso/single-sign-on)、 [ソーシャル ID プロバイダー（Facebook、GitHub、Twitter など）](https://auth0.com/docs/identityproviders)のサポート、および [エンタープライズ ID プロバイダー（Active Directory、LDAP、SAML、カスタムなど）](https://auth0.com/enterprise)のサポートすることができます。

ASP.NET Core 2.0 では、 [Auth0 管理ダッシュボードに API を作成](https://auth0.com/docs/apis)し、コードに 2 つの変更をする必要があります。API を作成するには、 [無料 Auth0 アカウントにサインアップ](https://auth0.com/signup)する必要があります。その後、 [ダッシュボードの APIs セクション](https://manage.auth0.com/#/apis)に移動し、「CREATE API」をクリックします。表示のダイアログでは、API の_名前_ を「Books」に、_識別子_を 「http://books.mycompany.com」 に設定し、_署名アルゴリズム_ を「RS256」 のままにします。

![Creating API on Auth0](https://cdn.auth0.com/blog/net-core-2/creating-api-on-auth0.png)

その後、`Startup` の呼び出しを `services.AddAuthentication` から以下に置換します。


```csharp
string domain = $"https://{Configuration["Auth0:Domain"]}/";
services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
  options.Authority = domain;
  options.Audience = Configuration["Auth0:Audience"];
});
```

それから、以下の要素を appsettings.json に加えます。

```json
{
  "Logging": {
    // ...
  },
  "Auth0": {
    "Domain": "bk-samples.auth0.com",
    "Audience": "http://books.mycompany.com"
  }
}
```

**注** この場合のドメインは、Auth0 アカウントを作成したときに指定したドメインに **変更されなければならないことにご注意ください** 。

### 統合性をテストする

それだけです。ASP.NET Core 2.0 API を Auth0 でセキュアにするには、統合性をテストするだけです。ただし、この統合性をテストするには、 [このアプリケーションと通信するクライアントが必要です](https://auth0.com/docs/clients)。本書の中心は ASP.NET Core 2.0 ですから、 [構成可能な Auth0 クライアントでセキュアにする汎用 Web アプリケーション](http://auth0.digituz.com.br/)を使用します。このアプリケーションで構成する必要があるのは、`clientID`、`domain`、および `audience` プロパティのみです。

`clientID` および `domain` プロパティを得るには、管理ダッシュボードに新しいクライアントを作る必要があります。 [Clientsセクション](https://manage.auth0.com/#/clients)で「CREATE CLIENT」をクリックし、表示のダウアログで「Book Client」と名付け、クライアントタイプとして「Single Page Web Applications」を選択します。クライアントを作成した後、その「Settings」タブに移動し、`http://auth0.digituz.com.br` を「Allowed Callback URLs」 フィールドに追加し、「SAVE」(ctrl/command + s) を押します。この同じタブで、興味がある両方のプロパティ（`Client ID` および `Domain`） をフェッチし、汎用アプリケーションに追加します。同様にaudienceに API の識別子（例：`http://books.mycompany.com`） を設定できます。ここで、「SIGN IN WITH AUTH0」 を押し、ユーザーを認証します。

![Testing integration with Auth0](https://cdn.auth0.com/blog/net-core-2/testing-auth0-integration.png)

認証した後に、Web アプリを使ってリクエストを API （例：`http://localhost:5000/api/books`） に発行します。この Web アプリが認証プロセスで生成された `access_token` を自動的に `Authorization` ヘッダーに追加するときに、この API はその有効性をチェックし、書籍のリストをユーザーに送信します。

![Issuing request to the API](https://cdn.auth0.com/blog/net-core-2/issuing-requests-api-auth0.png)

## まとめ

本書では JSON Web Token テクノロジーの概要について説明し、ASP.NET Core 2 での使い方を紹介しました。シンプルな Web API アプリケーションを展開しながら、JWT 認証のサポートを構成する方法や認証トークンを作成する方法を見てきました。また、claimsを JWT に挿入する方法や、リソースへのアクセスを認可しながらそれらを使用する方法についても学びました。

最後に、JSON Web Tokens を ASP.NET Core 2 アプリケーションで管理することがどんなに簡単かも経験しました。