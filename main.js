const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'ImageShrink',
		width: 500,
		height: 600,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: isDev,
		backgroundColor: 'red',
	});

	// mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	// OR shorter without defining the protocol
	mainWindow.loadFile('./app/index.html');
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: 'About ImageShrtink',
		width: 300,
		height: 300,
		icon: `${__dirname}/assets/icons/Icon_256x256.png`,
		resizable: false,
		backgroundColor: 'white',
	});

	// mainWindow.loadURL(`file://${__dirname}/app/index.html`);
	// OR shorter without defining the protocol
	aboutWindow.loadFile('./app/about.html');
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	// No need for this because of the built in roles
	// globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
	// globalShortcut.register(isMac ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', () =>
	// 	mainWindow.toggleDevTools()
	// );

	mainWindow.on('closed', () => (mainWindow = null));
});

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: 'fileMenu',
	},
	...(!isMac
		? [
				{
					label: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	...(isDev
		? [
				{
					label: 'Developer',
					submenu: [
						{ role: 'reload' },
						{ role: 'forcereload' },
						{ role: 'separator' },
						{ role: 'toggledevtools' },
					],
				},
		  ]
		: []),
];

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});
