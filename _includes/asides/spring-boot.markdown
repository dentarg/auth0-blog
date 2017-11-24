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
