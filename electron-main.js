const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let productsWindow;
let currentApp = "orders"; // Can be "orders" or "products"
let productsAdminSecret = null;

function createLoginWindow() {
  const preloadPath = path.join(__dirname, "electron-preload.js");
  const loginPath = path.join(__dirname, "login.html");
  
  console.log("Creating login window...");
  console.log("Preload path:", preloadPath);
  console.log("Preload exists:", fs.existsSync(preloadPath));
  console.log("Login HTML path:", loginPath);
  console.log("Login HTML exists:", fs.existsSync(loginPath));
  
  const win = new BrowserWindow({
    width: 420,
    height: 360,
    resizable: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  // Log any preload errors
  win.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Preload error:', preloadPath, error);
  });
  
  win.loadFile(loginPath);
  return win;
}

function createProductsLoginWindow() {
  const preloadPath = path.join(__dirname, "electron-preload.js");
  const productsLoginPath = path.join(__dirname, "products-login.html");
  
  console.log("Creating products login window...");
  console.log("Products login HTML path:", productsLoginPath);
  console.log("Products login HTML exists:", fs.existsSync(productsLoginPath));
  
  const win = new BrowserWindow({
    width: 420,
    height: 360,
    resizable: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  win.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Products login preload error:', preloadPath, error);
  });
  
  win.loadFile(productsLoginPath);
  return win;
}

function createMainWindow() {
  const mainPath = path.join(__dirname, "index.html");
  const preloadPath = path.join(__dirname, "electron-preload.js");
  
  console.log("Creating main orders window...");
  console.log("Main HTML path:", mainPath);
  console.log("Main HTML exists:", fs.existsSync(mainPath));
  console.log("Preload path:", preloadPath);
  console.log("Preload exists:", fs.existsSync(preloadPath));
  
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    frame: true,
    titleBarStyle: 'default',
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  // Log any errors
  mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Main window preload error:', preloadPath, error);
  });
  
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Console] ${message}`);
  });
  
  mainWindow.loadFile(mainPath);
  console.log("Main window file loaded");
  
  mainWindow.once('ready-to-show', () => {
    console.log("Main window ready to show, displaying...");
    mainWindow.show();
    console.log("Main window shown. Resizable:", mainWindow.isResizable());
    console.log("Main window maximizable:", mainWindow.isMaximizable());
    console.log("Main window frame:", mainWindow.frame);
  });
}

function createProductsWindow() {
  const productsPath = path.join(__dirname, "products-list.html");
  const preloadPath = path.join(__dirname, "electron-preload.js");
  
  console.log("Creating products management window...");
  console.log("Products list HTML path:", productsPath);
  console.log("Products list HTML exists:", fs.existsSync(productsPath));
  
  productsWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    frame: true,
    titleBarStyle: 'default',
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  productsWindow.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Products window preload error:', preloadPath, error);
  });
  
  productsWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Products Console] ${message}`);
  });
  
  productsWindow.loadFile(productsPath);
  console.log("Products window file loaded");
  
  productsWindow.once('ready-to-show', () => {
    console.log("Products window ready to show, displaying...");
    productsWindow.show();
    console.log("Products window shown. Resizable:", productsWindow.isResizable());
    console.log("Products window maximizable:", productsWindow.isMaximizable());
    console.log("Products window frame:", productsWindow.frame);
  });
}

function createProductsAddWindow() {
  const productsAddPath = path.join(__dirname, "products-add.html");
  const preloadPath = path.join(__dirname, "electron-preload.js");
  
  console.log("Creating products add window...");
  console.log("Products add HTML path:", productsAddPath);
  console.log("Products add HTML exists:", fs.existsSync(productsAddPath));
  
  const win = new BrowserWindow({
    width: 700,
    height: 900,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    frame: true,
    titleBarStyle: 'default',
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  win.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Products add window preload error:', preloadPath, error);
  });
  
  win.loadFile(productsAddPath);
  
  win.once('ready-to-show', () => {
    win.show();
  });
  
  return win;
}

function createProductsDetailWindow(productId) {
  const productsDetailPath = path.join(__dirname, "products-detail.html");
  const preloadPath = path.join(__dirname, "electron-preload.js");
  
  console.log("Creating products detail window for product:", productId);
  console.log("Products detail HTML path:", productsDetailPath);
  console.log("Products detail HTML exists:", fs.existsSync(productsDetailPath));
  
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    frame: true,
    titleBarStyle: 'default',
    minWidth: 400,
    minHeight: 300,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  
  win.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('Products detail window preload error:', preloadPath, error);
  });
  
  // Load with product ID as query parameter
  win.loadFile(productsDetailPath, { query: { id: productId } });
  
  win.once('ready-to-show', () => {
    win.show();
  });
  
  return win;
}


app.whenReady().then(() => {
  // Check for command-line argument to switch between apps
  // Usage: npm run desktop -- --orders   (for orders app)
  //        npm run desktop -- --products (for products app, default)
  currentApp = process.argv.includes("--orders") ? "orders" : "products";
  
  console.log("Starting app:", currentApp);
  console.log("Process argv:", process.argv);
  
  if (currentApp === "orders") {
    const login = createLoginWindow();
  } else {
    const productsLogin = createProductsLoginWindow();
  }

  // ========== ORDERS APP IPC HANDLERS ==========
  ipcMain.handle("desktop-read-config", async () => {
    const cfgPath = path.join(process.cwd(), "desktop-config.json");
    try {
      if (fs.existsSync(cfgPath)) return JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    } catch (err) {
      console.error("Failed to read desktop-config:", err);
    }
    return null;
  });

  ipcMain.handle("save-orders-file", async (event, orders) => {
    try {
      const filePath = path.join(process.cwd(), "data", "orders.json");
      const dir = path.dirname(filePath);
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), "utf-8");
      console.log("Orders saved successfully");
      return { success: true, message: "Orders saved" };
    } catch (err) {
      console.error("Error saving orders:", err);
      return { success: false, error: err.message };
    }
  });

  // Window control handlers
  ipcMain.handle('desktop-resize-window', async (event, opts) => {
    try {
      const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
      if (!win || win.isDestroyed()) return { success: false, error: 'no-window' };
      const width = Number(opts.width) || win.getBounds().width;
      const height = Number(opts.height) || win.getBounds().height;
      win.setSize(Math.max(200, width), Math.max(200, height));
      return { success: true };
    } catch (e) {
      console.error('desktop-resize-window error', e);
      return { success: false, error: String(e) };
    }
  });

  ipcMain.handle('desktop-open-window', async (event, args) => {
    try {
      const file = args && args.filePath ? String(args.filePath) : 'dashboard.html';
      const opts = (args && args.opts) || {};
      const preloadPath = path.join(__dirname, 'electron-preload.js');

      const win = new BrowserWindow({
        width: opts.width || 900,
        height: opts.height || 600,
        resizable: true,
        maximizable: true,
        minimizable: true,
        closable: true,
        frame: true,
        titleBarStyle: 'default',
        minWidth: 400,
        minHeight: 300,
        show: false,
        webPreferences: {
          preload: preloadPath,
          contextIsolation: true,
          enableRemoteModule: false,
          sandbox: false,
        },
      });

      // If a local file, loadFile, else loadURL
      const filePath = path.join(process.cwd(), String(file));
      if (fs.existsSync(filePath)) {
        win.loadFile(filePath);
      } else {
        try { win.loadURL(String(file)); } catch (e) { console.error('open-window loadURL failed', e); }
      }

      win.once('ready-to-show', () => {
        win.show();
      });

      return { success: true };
    } catch (e) {
      console.error('desktop-open-window error', e);
      return { success: false, error: String(e) };
    }
  });

  ipcMain.handle('desktop-set-fullscreen', async (event, flag) => {
    try {
      const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
      if (!win || win.isDestroyed()) return { success: false, error: 'no-window' };
      win.setFullScreen(Boolean(flag));
      return { success: true };
    } catch (e) {
      console.error('desktop-set-fullscreen error', e);
      return { success: false, error: String(e) };
    }
  });

  ipcMain.on("desktop-login", (evt, provided) => {
    const cfgPath = path.join(process.cwd(), "desktop-config.json");
    let cfg = { password: "changeme" };
    try {
      if (fs.existsSync(cfgPath)) cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    } catch (err) {
      console.error("Failed to read config", err);
    }
    const normalize = (s) => {
      if (!s && s !== 0) return "";
      try {
        return String(s).trim().replace(/^[\{\(\"\']+|[\}\)\"\']+$/g, "");
      } catch (e) {
        return String(s).trim();
      }
    };
    if (normalize(provided) === normalize(cfg.password)) {
      console.log("Orders login successful, opening main window");
      
      try {
        createMainWindow();
        console.log("Main window created");
        
        // Add error handler to main window
        mainWindow.webContents.on('crashed', () => {
          console.error("Main window crashed");
          evt.sender.send("desktop-login-failed");
        });
        
        // Close login window only (not all windows)
        setTimeout(() => {
          BrowserWindow.getAllWindows().forEach((w) => {
            if (w && !w.isDestroyed() && w !== mainWindow) {
              w.close();
            }
          });
        }, 500);
      } catch (err) {
        console.error("Error creating main window:", err);
        evt.sender.send("desktop-login-failed");
      }
    } else {
      console.log("Orders login failed - password mismatch");
      evt.sender.send("desktop-login-failed");
    }
  });

  // ========== PRODUCTS APP IPC HANDLERS ==========
  ipcMain.on("products-login", (evt, provided) => {
    // Password for product management: "Don't Chase me i'll kill you"
    const expectedPassword = "Don't Chase me i'll kill you";
    
    const normalize = (s) => {
      if (!s && s !== 0) return "";
      try {
        return String(s).trim().replace(/^[\{\(\"\']+|[\}\)\"\']+$/g, "");
      } catch (e) {
        return String(s).trim();
      }
    };
    
    if (normalize(provided) === normalize(expectedPassword)) {
      console.log("Products login successful");
      
      // Determine configured ADMIN_SECRET from environment or .env file
      let configuredSecret = process.env.ADMIN_SECRET || "";
      try {
        if (!configuredSecret) {
          const envPath = path.join(process.cwd(), '.env');
          if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, 'utf-8');
            const m = raw.match(/^ADMIN_SECRET=(.*)$/m);
            if (m && m[1]) {
              configuredSecret = m[1].trim().replace(/^\"|\"$/g, '');
            }
          }
        }
      } catch (e) {
        console.warn('Failed to read ADMIN_SECRET from .env', e);
      }

      // Use the configured secret so renderer can call API with correct header
      productsAdminSecret = configuredSecret || '';
      
      try {
        createProductsWindow();
        console.log("Products window created");
        
        // Close login window only
        setTimeout(() => {
          BrowserWindow.getAllWindows().forEach((w) => {
            if (w && !w.isDestroyed() && w !== productsWindow) {
              w.close();
            }
          });
        }, 500);
      } catch (err) {
        console.error("Error creating products window:", err);
        evt.sender.send("products-login-failed");
      }
    } else {
      console.log("Products login failed - password mismatch");
      evt.sender.send("products-login-failed");
    }
  });

  ipcMain.on("go-to-add-product", (evt) => {
    console.log("Opening add product window");
    createProductsAddWindow();
  });

  ipcMain.on("go-to-product-detail", (evt, productId) => {
    console.log("Opening product detail window for product:", productId);
    createProductsDetailWindow(productId);
    // Close products list window - detail will open
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w && !w.isDestroyed() && w.webContents.getURL().includes("products-list")) {
        w.close();
      }
    });
  });

  ipcMain.on("go-to-products-list", (evt) => {
    console.log("Going back to products list");
    if (productsWindow && !productsWindow.isDestroyed()) {
      productsWindow.focus();
    } else {
      createProductsWindow();
    }
    // Close add product and detail windows
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w && !w.isDestroyed() && (w.webContents.getURL().includes("products-add") || w.webContents.getURL().includes("products-detail"))) {
        w.close();
      }
    });
  });

  ipcMain.handle("get-products-admin-secret", async () => {
    return productsAdminSecret || "";
  });

  // Switch to orders app
  ipcMain.on("switch-to-orders", (evt) => {
    console.log("Switching to orders app");
    // Close all current windows
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w && !w.isDestroyed()) {
        w.close();
      }
    });
    // Start orders app
    currentApp = "orders";
    const login = createLoginWindow();
  });

  // Switch to products app
  ipcMain.on("switch-to-products", (evt) => {
    console.log("Switching to products app");
    // Close all current windows
    BrowserWindow.getAllWindows().forEach((w) => {
      if (w && !w.isDestroyed()) {
        w.close();
      }
    });
    // Start products app
    currentApp = "products";
    const login = createProductsLoginWindow();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (currentApp === "orders") {
        createLoginWindow();
      } else {
        createProductsLoginWindow();
      }
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
