 var link;
self.addEventListener('push', function(event) {
    console.log('Received a push message', event);
    event.waitUntil(
        fetch('last.json').then(function(response){
            console.log(response);
            return response.json();
        }).then(function(data){
            console.log('data', data);
            link = data.link;
            return self.registration.showNotification('New article in Auth0 blog!', {
                body: data.title,
                icon: data.thumbnail,
                tag: 'Auth0-blog-post-notification'
            })
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.dir(event);
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow(link);
            }
        })
    );
});
