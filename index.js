const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const server = require("./src/server");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    transparent: true,
    frame: false
  });

  const ret = globalShortcut.register('Esc', function(){
    app.quit();
  });

  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
});
