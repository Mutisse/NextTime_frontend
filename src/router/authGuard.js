import { LocalStorage } from "quasar";
import { decodeToken } from "../util/jwt";

const authGuard = (to, from, next) => {
  const token = LocalStorage.getItem("token");
  const isAuthenticated = !!token;
  const decodedToken = token ? decodeToken(token) : null;
  const requiredScopes = to.meta.requiredScopes;
  console.log( to.path)


  if (isAuthenticated && (to.path === "/login" || to.path === "/register")) {
    // Redireciona para a página inicial se o usuário estiver autenticado e tentar acessar login ou registro
    next('/');
    return;
  }

  if (isAuthenticated && to.path === "/") {
    // Verifica se o usuário já está na página inicial
    if (decodedToken) {
      // Verifica se o usuário é um entregador e redireciona para a rota correta
      if (decodedToken.scopes.includes("entregador")) {
        next("/show-packs");
        return;
      }

      if (decodedToken.scopes.includes("admin")) {
        next("/admin/dashboard");
        return;
      }

      if (decodedToken.scopes.includes("empresa")) {
        next("/s");
        return;
      }


    }
    // Se não for um entregador ou não houver token decodificado, permite o acesso à página inicial
    next();
    return;
  }

  if (isAuthenticated && decodedToken) {
    if (requiredScopes) {
      const userScopes = decodedToken.scopes;
      const hasAccess = requiredScopes.every((scope) =>
        userScopes.includes(scope)
      );

      if (!hasAccess) {
        next("/unauthorized");
        return;
      }
    }

    next(); // Permite o acesso à rota se autenticado e tiver os escopos necessários
  } else if (to.path === "/login" || to.path === "/register") {
    next(); // Permite o acesso às páginas de login e registro se não autenticado
  } else {
    next("/login"); // Redireciona para a página de login se não autenticado
  }
};

export default authGuard;
