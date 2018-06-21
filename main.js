const electron = require('electron')
const { app, BrowserWindow } = electron

let win
function createWindow() {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    // 创建浏览器窗口
    win = new BrowserWindow({width, height})
    // win.maximize();
    // 然后加载应用的 index.html。
    win.loadFile('index.html')

    // win.webContents.openDevTools()

    win.on("close", () => {
        win = null
    })
}

app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
})