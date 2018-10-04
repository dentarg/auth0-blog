## Aside: Securing Spring APIs with Auth0

Securing applications with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get solid [identity management solution](https://auth0.com/user-management),
[single sign-on](https://auth0.com/docs/sso/single-sign-on), support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders), and support for [enterprise identity providers (Active Directory, LDAP, SAML, custom, etc.)](https://auth0.com/enterprise).

In the following sections, we are going to learn how to use Auth0 to secure Spring APIs. As we will see, the process is simple and fast.

### Creating the API

First, we need to create an API on our <a href="https://auth0.com/signup" data-amp-replace="CLIENT_ID" data-amp-addparams="anonId=CLIENT_ID(cid-scope-cookie-fallback-name)">free Auth0 account</a>. To do that, we have to go to [the APIs section of the management dashboard](https://manage.auth0.com/#/apis) and click on "Create API". On the dialog that appears, we can name our API as "Contacts API" (the name isn't really important) and identify it as `https://contacts.mycompany.com` (we will use this value later).

After creating it, we have to go to the "Scopes" tab of the API and define the desired scopes. For this sample, we will define two scopes: `read:contacts` and `add:contacts`. They will represent two different operations (read and add) over the same entity (contacts).

![Defining OAuth scopes in the new Auth0 API](https://cdn.auth0.com/blog/spring-boot-aside/defining-oauth-scopes.png)

### Registering the Auth0 Dependency

The second step is to import a dependency called [`auth0-spring-security-api`](https://mvnrepository.com/artifact/com.auth0/auth0-spring-security-api). This can be done on a Maven project by including the following configuration to `pom.xml` ([it's not harder to do this on Gradle, Ivy, and so on](https://mvnrepository.com/artifact/com.auth0/auth0-spring-security-api)):

```xml
<project ...>
    <!-- everything else ... -->
    <dependencies>
        <!-- other dependencies ... -->
        <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>auth0-spring-security-api</artifactId>
            <version>1.0.0-rc.3</version>
        </dependency>
    </dependencies>
</project>
```

### Integrating Auth0 with Spring Security

The third step consists of extending the  [WebSecurityConfigurerAdapter](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html) class. In this extension, we use `JwtWebSecurityConfigurer` to integrate Auth0 and Spring Security:

```java
package com.auth0.samples.secure;

import com.auth0.spring.security.api.JwtWebSecurityConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Value(value = "${auth0.apiAudience}")
    private String apiAudience;
    @Value(value = "${auth0.issuer}")
    private String issuer;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        JwtWebSecurityConfigurer
                .forRS256(apiAudience, issuer)
                .configure(http)
                .cors().and().csrf().disable().authorizeRequests()
                .anyRequest().permitAll();
    }
}
```

As we don't want to hard code credentials in the code, we make `SecurityConfig` depend on two environment properties:

- `auth0.apiAudience`: This is the value that we set as the identifier of the API that we created at Auth0 (`https://contacts.mycompany.com`).
- `auth0.issuer`: This is our domain at Auth0, including the HTTP protocol. For example: `https://bk-samples.auth0.com/`.

Let's set them in a properties file on our Spring application (e.g. `application.properties`):

```bash
auth0.issuer:https://bk-samples.auth0.com/
auth0.apiAudience:https://contacts.mycompany.com/
```

### Securing Endpoints with Auth0

After integrating Auth0 and Spring Security, we can easily secure our endpoints with Spring Security annotations:

```java
package com.auth0.samples.secure;

import com.google.common.collect.Lists;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/contacts/")
public class ContactController {
    private static final List<Contact> contacts = Lists.newArrayList(
            Contact.builder().name("Bruno Krebs").phone("+5551987654321").build(),
            Contact.builder().name("John Doe").phone("+5551888884444").build()
    );

    @GetMapping
    @PreAuthorize("hasAuthority('read:contacts')")
    public List<Contact> getContacts() {
        return contacts;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('add:contacts')")
    public void addContact(@RequestBody Contact contact) {
        contacts.add(contact);
    }
}
```

Note that the integration allows us to use [the `hasAuthority` Spring EL Expression](https://docs.spring.io/spring-security/site/docs/current/reference/html/el-access.html) to restrict access to endpoints based on the `scope` of the `access_token`. Let's see how to get this token now.

### Creating an Auth0 Application

As the focus of this section is to secure Spring APIs with Auth0, [we are going to use a live Angular app that has a configurable Auth0 application](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&domain=bk-samples.auth0.com&audience=https:%2F%2Fcontacts.mycompany.com%2F&scope=read:contacts). To use this app we need to create an Auth0 application that represents it. Let's head to the [_Applications_ section of the management dashboard](https://manage.auth0.com/#/applications) and click on the "Create Application" button to create this application.

On the popup shown, let's set the name of this new application as "Contacts Application" and choose "Single Page Web App" as the application type. After hitting the "Create" button, we have to go to the "Settings" tab of this application and change two properties. First, we have to set `http://auth0.digituz.com.br/` in the "Allowed Web Origins" property. Second, we have to set `http://auth0.digituz.com.br/callback` in the "Allowed Callback URLs" property.

That's it, we can save the application and head to [the sample Angular app secured with Auth0](http://auth0.digituz.com.br/?clientID=ssII6Fu1qfFI4emuNeXeadMv8iTQn1hJ&domain=bk-samples.auth0.com&audience=https:%2F%2Fcontacts.mycompany.com%2F&scope=read:contacts). On it, we just need to set the correct values to the four properties:

- `clientID`: We have to copy this value from the "Client ID" field of the "Settings" tab of "Contacts Application".
- `domain`: We can also copy this value from the "Settings" tab of "Contacts Application".
- `audience`: We have to set this property to meet the identifier of the "Contacts API" that we created earlier.
- `scope`: This property will define the `authority` that the `access_token` will get access to in the backend API. For example: `read:contacts` or both `read:contacts add:contacts`.

Then we can hit the "Sign In with Auth0" button.

![Using the Angular app with the configurable Auth0 application](https://cdn.auth0.com/blog/angular-generic-client/signing-in.png)

After signing in, we can use the application to submit requests to our secured Spring API. For example, if we issue a GET request to `http://localhost:8080/contacts/`, the Angular app will include the `access_token` in the `Authorization` header and our API will respond with a list of contacts.

![Getting a response from a secure Spring API](https://cdn.auth0.com/blog/angular-generic-client/issuing-secured-requests.png)
