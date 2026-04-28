// src/boot/version-check.js

export default ({ app }) => {
  const currentVersion = '1.0.0'; // Defina a versão atual do app aqui
  const storedVersion = localStorage.getItem('app_version');

  if (storedVersion !== currentVersion) {
    // Versão antiga detectada, remover o conteúdo do localStorage
    localStorage.clear();
    // Atualizar a versão armazenada
    localStorage.setItem('app_version', currentVersion);
  }
}
