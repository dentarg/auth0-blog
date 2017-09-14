var link='';
self.addEventListener('push', function (event) {
    event.waitUntil(
        fetch('last.json').then(function (response) {
            return response.json();
        }).then(function(data){
            data = data || {};
            link = data.link;
            return self.registration.showNotification('New article in Auth0 blog!', {
                body: data.title || '',
                icon: data.thumbnail || 'https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png',
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
                return clients.openWindow(link + '?utm_source=notifications-chrome&utm_medium=sc&utm_campaign=notifications');
            }
        })
    );
});

self.addEventListener('install', function(event) {
    self.skipWaiting();
});