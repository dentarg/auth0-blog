## Aside: Securing Spring APIs with Auth0

Securing applications with Auth0 is very easy and brings a lot of great features to the table. With Auth0, we only have to write a few lines of code to get a solid [identity management solution](https://auth0.com/user-management),
[single sign-on](https://auth0.com/docs/sso/single-sign-on) feature, support for [social identity providers (like Facebook, GitHub, Twitter, etc.)](https://auth0.com/docs/identityproviders) and support for [enterprise identity providers (Active Directory, LDAP, SAML, etc.)](https://auth0.com/enterprise).

In this section, we are going to learn how to use Auth0 to secure Spring APIs. As we will see, the process is simple and fast. First, we need to create an API on our [free Auth0 account](https://auth0.com/signup). To do that, we have to go to [the APIs section of the management dashboard](https://manage.auth0.com/#/apis) and click on "Create API". On the dialog that appears, we can give our API a friendly name (like "Contacts API") and an identifier (e.g. "https://contacts.mycompany.com").


The second step is to import a dependency called `auth0-spring-security-api`:

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

On the third step, we need to create a class to extend the [WebSecurityConfigurerAdapter](https://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/config/annotation/web/configuration/WebSecurityConfigurerAdapter.html) class. In this extension, we will use `JwtWebSecurityConfigurer` to integrate Auth0 and Spring Security:

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

After integrating them, we can easily secure our endpoints (methods on controllers) with Spring Security annotations:

```
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



```bash
curl http://localhost:8080/contacts/

curl -H "Authorization: Bearer "$TOKEN http://localhost:8080/contacts/

curl -X POST -H "Authorization: Bearer "$TOKEN -H 'content-type: application/json' -d '{
  "name": "Elon Musk",
  "phone": "42"
}' http://localhost:8080/contacts/

curl -X POST -H 'content-type: application/json' -d '{
  "grant_type":"password",
  "username":"brunokrebs",
  "password":"123456",
  "audience":"https://bkrebs.auth0.com/api/v2/",
  "scope":"read:contacts",
  "client_id": "3qu4Cxt4h2x9Em7Cj0s7Zg5FxhQLjiiK",
  "client_secret": "sUOIf4Psed68nU4hZvHlkRE2vCgUJF4UHlymKOJrgpn6oL8NJ3bOvdA1Y4ajo3IW"
}' https://bkrebs.auth0.com/oauth/token
```

```
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik4wTTROVVJETXpZMVFUbENRalpCTlRFd05VRkRRa1pFT1VWR1FUZEdRVUkwT1RFMVJEUXdRZyJ9.eyJpc3MiOiJodHRwczovL2JrLXNhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwMTEyNjYzOTA4ODgwMjU1MDU4IiwiYXVkIjoiaHR0cDovL3NwcmluZy1ib290LWFzaWRlLmF1dGgwc2FtcGxlcy5jb20vIiwiaWF0IjoxNTExNDU2MDgwLCJleHAiOjE1MTE0NjMyODAsImF6cCI6ImxPV1owZ1U0OThtVlNzbjQwaEtMZXNFSkRRYmNmUThBIiwic2NvcGUiOiJyZWFkOmNvbnRhY3RzIn0.jXt_fdt_QkEAP1bWMvYMIUs7-ZDblwKagKLW90nntYmgz-EZqsRKJwVXABdWlWqAAcpzs4Su6cOJQuXuhywmoClW0ODfxgSRJg5161UaCgCo3EsAjVWsil9-QFLTqufWYrp5ERTOLYuWmDq-B3hTxrULLU2j9IEsTXoav9JysHnwM90_VCEJ2rjho5l99_Sdr1Jwfe_ZfM2qu_PCA9OFGVQxF_OjHDcV-vvMdeY_qbGZsOPGaIpGr2RjveSdeMR0jQYE1WXdeuV6hhJOARLsB0peppoX93HbF-e3m5rv8kY-1jcdn87YhcK_gQ3Ff5aVxU72GjSoRu_VwQzW_nvajw"
```
