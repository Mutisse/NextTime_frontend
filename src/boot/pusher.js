import Pusher from 'pusher-js';

export default ({ app }) => {
  const pusher = new Pusher('ad8e57aafc015265f061', {
    cluster: 'ap2',
  });

  // Torne o Pusher disponível globalmente (opcional)
  app.config.globalProperties.$pusher = pusher;
};
