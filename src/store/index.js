import { createStore } from "vuex";
import CryptoJS from "crypto-js";
import { decodeToken } from "../util/jwt";
import { LocalStorage } from "quasar";

const SECRET_KEY = "your-secret-key"; // Substitua por uma chave secreta segura

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const store = createStore({
  state: {
    cart: [],
    user: null,
    showMap: false,
    ShowPackageModal: false,
    leftDrawerOpen: false,
  },
  getters: {
    user: (state) => state.user,
    cart(state) {
      state.cart = JSON.parse(localStorage.getItem("cart"));
      return state.cart;
    },
    showMap: (state) => state.showMap,
    leftDrawerOpen: (state) => state.leftDrawerOpen,
    cartTotal(state) {
      return state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    totalItemsInCart(state) {
      if (state.cart.length == 0) {
        const auxCart = localStorage.getItem("cart");
        if (auxCart && auxCart.length > 0) {
          state.cart = JSON.parse(auxCart);
        } else {
          localStorage.setItem("cart", JSON.stringify([]));
        }
      }
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    getProductCartById: (state) => (id) => {
      const existingItem = state.cart.find((item) => item.id === parseInt(id));
      return existingItem || null;
    },
    incrementProductQuantity: (state) => (id) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === parseInt(id)
      );
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cart];

        updatedCartItems[existingItemIndex].quantity += 1;
        state.cart = updatedCartItems;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    decrementProductQuantity: (state) => (id, toZero) => {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === parseInt(id)
      );
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cart];
        if (updatedCartItems[existingItemIndex].quantity === 1 && !toZero) {
          return;
        }

        if (updatedCartItems[existingItemIndex].quantity < 1) {
          return;
        }
        updatedCartItems[existingItemIndex].quantity -= 1;
        state.cart = updatedCartItems;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    removeProductInCart: (state) => (id) => {
      const existingItemIndex = state.cart.filter((item) => item.id !== id);
      state.cart = existingItemIndex;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
  mutations: {
    togglePackageModal(state) {
      state.ShowPackageModal = !state.ShowPackageModal;
    },
    addToCart(state, product) {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === product.id
      );
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...state.cart];

        updatedCartItems[existingItemIndex].quantity += 1;
        state.cart = updatedCartItems;
      } else {
        product.quantity = 1;
        state.cart.push(product);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart(state, index) {
      state.cart.splice(index, 1);
    },
    toggleMap(state) {
      state.showMap = !state.showMap;
    },

    toggleLeftDrawer(state) {
      // console.log(state.leftDrawerOpen);
      state.leftDrawerOpen = !state.leftDrawerOpen;
    },
    setUser(state, user) {
      const token = LocalStorage.getItem("token");
      const isAuthenticated = !!token;
      const decodedToken = token ? decodeToken(token) : null;

      if (isAuthenticated && decodedToken) {
        console.log(decodedToken.scopes);
        if (decodedToken.scopes.includes("entregador")) {
          user.scope = "entregador";
        } else if (decodedToken.scopes.includes("admin")) {
          user.scope = "admin";
        } else if (decodedToken.scopes.includes("cliente")) {
          user.scope = "cliente";
        } else if (decodedToken.scopes.includes("empresa")) {
          user.scope = "empresa";
        }
      }

      state.user = user;
      const encryptedUser = encrypt(user);
      LocalStorage.set("user", encryptedUser);
    },
    clearUser(state) {
      state.user = null;
      LocalStorage.remove("user"); state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    loadUser(state) {
      const encryptedUser = LocalStorage.getItem("user");
      if (encryptedUser) {
        try {
          state.user = decrypt(encryptedUser);
        } catch (error) {
          console.error("Failed to decrypt user data:", error);
          state.user = null;
        }
      }
    },
  },
  actions: {
    login({ commit }, user) {
      // Simule uma requisição de login
      setTimeout(() => {
        commit("setUser", user);
      }, 1000);
    },
    logout({ commit }) {
      commit("clearUser");
    },
    toggleMap({ commit }) {
      commit("toggleMap");
    },
    togglePackageModal({ commit }) {
      commit("togglePackageModal");
    },
    toggleLeftDrawer({ commit }) {
      commit("toggleLeftDrawer");
    },
    addToCart({ commit }, product) {
      commit("addToCart", product);
    },
    removeFromCart({ commit }, index) {
      commit("removeFromCart", index);
    },
    clearCart({ commit }) {
      commit("clearCart");
    },
  },
});

// Carregar o usuário do localStorage ao iniciar a aplicação
store.commit("loadUser");

export default store;
