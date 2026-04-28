// service-worker.js

self.addEventListener('push', function(event) {
  // Extrai os dados da notificação enviada pelo servidor
  let data = {};
  if (event.data) {
      data = event.data.json(); // Converte os dados da notificação em JSON
  }

  const title = data.title || 'Notificação'; // Define um título padrão
  const options = {
      body: data.body || 'Você tem uma nova notificação!', // Mensagem padrão
      icon: data.icon || 'icon.png', // Ícone da notificação
      badge: data.badge || 'badge.png', // Ícone da badge
      vibrate: [100, 50, 100], // Padrão de vibração
      actions: [
          {
              action: 'explore', // Ação da notificação
              title: 'Ver' // Texto da ação
          },
          {
              action: 'close', // Ação para fechar a notificação
              title: 'Fechar' // Texto da ação
          }
      ]
  };

  event.waitUntil(
      self.registration.showNotification(title, options) // Exibe a notificação
  );
});

// Lidar com cliques na notificação
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Fecha a notificação

  // Ação a ser realizada ao clicar na notificação
  event.waitUntil(
      clients.openWindow('http://seu-site.com') // Abra a URL desejada
  );
});
