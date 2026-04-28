import axios from "axios";
// const baseURL = "http://127.0.0.1:8000"
// const frontURL = "http://localhost:9000/#";;
const frontURL = "https://klcmarket.shop/#";
const baseURL = "https://klcmarket.shop/api";
// Configuração do Axios
const api = axios.create({
  baseURL: baseURL + "/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Função para verificar se o usuário está logado
const isLoggedIn = () => {
  // Implemente sua lógica para verificar se o usuário está autenticado
  // Exemplo simples: verificar se há um token JWT armazenado
  const token = localStorage.getItem("token");
  return token ? true : false;
};

// Interceptores do Axios para adicionar o token JWT nas requisições autenticadas
api.interceptors.request.use(
  (config) => {
    if (isLoggedIn()) {
      const token = localStorage.getItem("token");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exemplo de métodos da API
const apiMethods = {
  baseURL: () => {
    return baseURL;
  },
  frontURL: () => {
    return frontURL;
  },


  // Autenticação
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getUser: () => api.get("/auth/user"),
  logout: () => api.post("/auth/logout"),
  forgotPasswordOtp: (userData) => api.post("/auth/password/otp", userData),
  forgotPasswordVerify: (userData) => api.post("/auth/password/verify", userData),
  forgotPasswordReset: (userData) => api.post("/auth/password/reset", userData),

  // Usuários
  getUsers: () => api.get("/auth/users"),
  updateCliente: (id, userData) => api.put(`/auth/user/${id}`, userData),
  updateUser: (userData) => api.put(`/auth/user`, userData),
  deleteUser: (id) => api.delete(`/auth/user/${id}`),
  resetPassword: (id, userData) =>
    api.put(`/auth/user/update-password/${id}`, userData),
  resetUserName: (id, userData) =>
    api.put(`/auth/user/update-username/${id}`, userData),
  getUserByEmail: (email) => api.get(`/auth/users/${email}`),
  getUserById: (id) => api.get(`/auth/users/byId/${id}`),
  registerUser: (userData) => api.post("/auth/users/register", userData),

  // Entregadores
  createEntregador: (entregadorData) =>
    api.post("/auth/entregadores", entregadorData),
  getEntregadores: () => api.get("/auth/entregadores"),
  getEntregadorById: (id) => api.get(`/auth/entregador/${id}`),

  // Empresas
  createEmpresa: (empresaData) => api.post("/auth/empresas", empresaData),
  updateEmpresa: (empresaData) => api.post("/auth/empresas/update", empresaData),
  getEmpresaDoUsuarioLogado: (id) => api.get(`/auth/obter-empresa-usuario/${id}`),
  getStoreById: (id) => api.get(`/auth/empresas/${id}`),


  // Produtos
  createProduct: (productData) => api.post("/auth/products", productData),
  getProducts: () => api.get("/auth/products"),
  getProductById: (id) => api.get(`/auth/products/${id}`),
  updateProduct: (id, productData) =>
    api.post(`/auth/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/auth/products/${id}`),
  setProductDraft: (id) => api.patch(`/auth/products/${id}/draft`),

  // Comentariios
  createComment: (id,productData) => api.post(`/auth/products/${id}/comments`, productData),
  getComments: (id) => api.get(`/products/${id}/comments`),
  updateComment: (id, data) => api.put(`/auth/comments/${id}`,data),
  deleteComment: (id) => api.delete(`/auth/comments/${id}`),
  replyComment: (productData) => api.post(`/auth/products/${id}/comments/reply`, productData),

  // Pedidos
  processarPedidos: (pedidoData) => api.post("/auth/pedidos", pedidoData),
  pedidoToPacote: (id) => api.post(`/auth/pedidos/pedidoToPacote/${id}`),
  atualizarStatusPedido: (id, statusData) =>
    api.post(`/auth/pedidos/status/${id}`, statusData),
  getPedidosPorEmpresa: () => api.get("/auth/pedidos"),
  getPedidosPublicos: () => api.get("/auth/pedidos/public"),
  getHistoricoPedidos: () => api.get("/auth/pedidos/historico"),
  getPedidosAEntregar: () => api.get("/auth/pedidos/a-entregar"),
  getEstatisticasEntregador: () => api.get("/auth/pedidos/statistic"),
  getPedidoById: (id) => api.get(`/auth/pedidos/${id}`),
  pegarPedido: (id) => api.put(`/auth/pedidos/pegar-pedido/${id}`),
  cancelarPedido: (id) => api.put(`/auth/pedidos/cancelar/${id}`),
  fetchPendentOrders: () => api.get("/auth/pedidos/pendentes-contador1"),//tras o nr de pedidos novos/pendentes

  // empresa loja pedidos
  getPedidoByIdByStore: (id) => api.get(`/auth/empresa/pedidos/${id}`),
  empresaAtualizarStatusPedido: (id, statusData) =>
    api.put(`/auth/empresa/pedidos/status/${id}`, statusData),
  empresaVendas: () => api.get(`/auth/empresa/relatorio`),
  invoice: () => api.get(`/auth/empresa/invoice`),

  // Personalização de Pedidos
  personalizePedido: (pedidoData) =>
    api.post("/auth/pedidos/personalize", pedidoData),
  obterPacotesPersonalizados: (pedidoData) =>
    api.post("/auth/pedidos/personalize1", pedidoData),
  getPedidosPersonalizadosPublicos: () =>
    api.get("/auth/pedidos/personalize/public"),
  getHistoricoPedidosPersonalizados: () =>
    api.get("/auth/pedidos/personalize/historico"),
  getPedidosPersonalizadosAEntregar: () =>
    api.get("/auth/pedidos/personalize/a-entregar"),
  getPedidoPersonalizadoById: (id) =>
    api.get(`/auth/pedidos/personalize/${id}`),
  pegarPedidoPersonalizado: (id) =>
    api.put(`/auth/pedidos/personalize/pegar-pedido/${id}`),
  cancelarPedidoPersonalizado: (id) =>
    api.put(`/auth/pedidos/personalize/cancelar/${id}`),
  atualizarStatusPedidoPersonalizado: (id, statusData) =>
    api.post(`/auth/pedidos/personalize/status/${id}`, statusData),

  // admin
  getDeliveryStatistic: () => api.get("/auth/admin/delivery/statistic"),
  fetchCustomers: () => api.get("/auth/admin/custumers"),
  pesquisaCustomers: (name) => api.get(`/auth/admin/custumers/p/${name}`),
  updateCustomers: (id,data) => api.put(`/auth/admin/customers/${id}`, data),
  resetPassword: (id) => api.put(`/auth/admin/user/${id}`),
  addCustomers: (data) => api.post(`/auth/admin/customers`, data),
  deleteCustomers: (id) => api.delete(`/auth/admin/customers/${id}`),
  // admin Orders
  getDashboardMetrics: () => api.get("/auth/admin/dashboardMetrics"),
  getAtiveOrdersByCustumer: () => api.get("/auth/admin/order/ative"),
  getHistoryOrdersByCustumer: (id) =>
    api.get(`/auth/admin/order/history/${id}`),
  getAdminOrderById: (id) => api.get(`/auth/admin/order/byId/${id}`),

  // admin deliver (AD)
  // tudo sobre entregadores por id
  getEstatisticasEntregadorAD: (id) => api.get(`/auth/a/d/statistic/${id}`),
  getHistoricoAD: (id) => api.get(`/auth/a/d/history/${id}`),
  verPedido: (id) => api.get(`/auth/a/d/pedido/${id}`),

  // admin stores
  fetchStores: () => api.get("/auth/admin/stores"),
  fetchPesquisaStores: (name) => api.get(`/auth/admin/stores/${name}`),
  fetchStoreById: (id) => api.get(`/auth/admin/stores/${id}`), //perfil de loja
  fetchProductStoreById: (id) => api.get(`/auth/admin/stores/products/${id}`), //lista de produtos de loja
  fetchOrdersStoreById: (id) => api.get(`/auth/admin/stores/orders/${id}`), //lista de pedidos da loja
  fetchOneOrderStoreById: (empresa_id,pedido_id) => api.get(`/auth/admin/stores/orders/${empresa_id}/${pedido_id}`), //lista de pedidos da loja



  // Séries
  createSerie: (serieData) => api.post("/auth/series", serieData),
  getSeries: () => api.get("/auth/series"),

  // Produtos Públicos
  getPublicProducts: (params) => api.get("/products2", { params }),

  getPublicProductById: (id) => api.get(`/products2/${id}`),
  getPublicProductsByCategory: (category) =>
    api.get(`/products/categories/${category}`),
  // Produtos por vendedor
  getPublicProductsBySeller: (sellerId) => api.get(`/products23/seller/${sellerId}`),


  // Messagens
  sendMessage: (data) => api.post("/auth/messages/send", data),
  getMessages: (receiver_id) => api.get(`/auth/messages/${receiver_id}`),
  fetchConversations: () => api.get("/auth/conversations"),
  fetchCountUnread: () => api.get("/auth/messages/unread-count"),

  sendCustomNotification: (data) => api.post("/send-notification", data),

// Whatsapp
  sendWhatsappMessage: (data) => api.post("/send-whatsapp-message", data),
  sendOtp: (data) => api.post("/send-otp", data),
  verifyOtp: (data) => api.post("/verify-otp", data),
  sendGroupMessage: (data) => api.post("/send-group-message", data),
  listGroups: () => api.get("/list-groups"),

  // Outros
  getCategories: () => api.get("/categories"),
  getTags: () => api.get("/tags"),
  searchProducts: (searchTerm) => api.get(`/products/pesquisa/${searchTerm}`),
  verifyEmail: (id, hash) => api.get(`/email/verify/${id}/${hash}`),
  resendVerificationEmail: () => api.post("/email/resend"),
};

export default apiMethods;
