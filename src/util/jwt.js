
// Exemplo de função para decodificar e acessar o token JWT
export function decodeToken(token) {
  try {
    const parts = token.split('.');
    const decodedPayload = JSON.parse(atob(parts[1]));

    // console.log(decodedPayload); // Exemplo de saída dos dados decodificados

    // Acesso aos scopes (exemplo)
    const scopes = decodedPayload.scopes;
    // console.log(scopes);

    return decodedPayload;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}
