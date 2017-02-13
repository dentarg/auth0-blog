 var link;
self.addEventListener('push', function (event) {
    event.waitUntil(
        fetch('last.json').then(function (response) {
            return response.json();
        }).then(function(data){
            link = data.link + '?utm_source=notifications-chrome&utm_medium=sc&utm_campaign=notifications';
            return self.registration.showNotification('New article in Auth0 blog!', {
                body: data.title,
                icon: data.thumbnail,
                tag: 'Auth0-blog-post-notification'
            })
        })
    );
});

self.addEventListener('notificationclick', function(event) {
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
