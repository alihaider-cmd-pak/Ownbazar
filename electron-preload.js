const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("desktopApi", {
  // ========== ORDERS APP APIs ==========
  login: (password) => ipcRenderer.send("desktop-login", password),
  onLoginFailed: (cb) => ipcRenderer.on("desktop-login-failed", cb),
  readOrdersFile: () => {
    try {
      const p = path.join(process.cwd(), "data", "orders.json");
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("desktopApi.readOrdersFile error", err);
    }
    return [];
  },
  saveOrdersFile: async (orders) => {
    return await ipcRenderer.invoke("save-orders-file", orders);
  },

  // Window controls: resize/open/fullscreen (orders app uses these)
  resizeWindow: async (w, h) => {
    return await ipcRenderer.invoke('desktop-resize-window', { width: w, height: h });
  },
  setWindowSize: async (opts) => {
    return await ipcRenderer.invoke('desktop-resize-window', opts);
  },
  openWindow: async (filePath, opts) => {
    return await ipcRenderer.invoke('desktop-open-window', { filePath, opts });
  },
  setFullScreen: async (flag) => {
    return await ipcRenderer.invoke('desktop-set-fullscreen', !!flag);
  },

  // ========== PRODUCTS APP APIs ==========
  loginProducts: (password) => ipcRenderer.send("products-login", password),
  onProductsLoginFailed: (cb) => ipcRenderer.on("products-login-failed", cb),
  goToAddProduct: () => ipcRenderer.send("go-to-add-product"),
  goToProductDetail: (productId) => ipcRenderer.send("go-to-product-detail", productId),
  goToProductsList: () => ipcRenderer.send("go-to-products-list"),
  getAdminSecret: async () => {
    return await ipcRenderer.invoke("get-products-admin-secret");
  },
  switchToOrders: () => ipcRenderer.send("switch-to-orders"),
  switchToProducts: () => ipcRenderer.send("switch-to-products"),
});
