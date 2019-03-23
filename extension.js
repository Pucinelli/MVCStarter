const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const window = vscode.window;

const appJs = 
`const app = require('./config/server');\n
app.listen(3000, () => console.log('Connected on port 3000.'));`;

const serverJs = 
`const express = require('express');
const consign = require('consign');\n
const app = express();\n
consign()
    .include('./app/routes')
    .then('./app/controllers')
    .into(app);\n
module.exports = app;`;

const routesJs = 
`module.exports = application => {\n
    application.get('/', (req, res) => 
        application.app.controllers.index.index(req, res, application));\n
};`;

const controllersJs = 
`module.exports = {\n
    index: (req, res, app) => {
        res.send('Hello, World!');
    }\n
}`;

const packageJson =
`{
    "name": "${vscode.workspace.rootPath.split(path.sep).filter(s=>s.trim()).pop().replace(/ /g, '-')}",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "start": "node app"
    },
    "author": "",
    "license": "ISC"
  }  
`;

const spawnProcess = (process, commandList) => {
    const child = vscode.window.createTerminal(process);
    child.show();

    commandList.forEach(command => child.sendText(`${process} ${command}`));

    // child.dispose();
}

const activate = (context) => {

    let disposable = vscode.commands.registerCommand('extension.startMvcProject', () => {
        if(vscode.workspace.workspaceFolders.length == 0)
            return;
        
        const actualDir = vscode.workspace.rootPath;

        fs.mkdirSync(path.join(actualDir, 'app'))
        fs.mkdirSync(path.join(actualDir, 'config'))
        
        fs.mkdirSync(path.join(actualDir, 'app', 'controllers'));
        fs.mkdirSync(path.join(actualDir, 'app', 'models'));
        fs.mkdirSync(path.join(actualDir, 'app', 'public'));
        fs.mkdirSync(path.join(actualDir, 'app', 'routes'));
        fs.mkdirSync(path.join(actualDir, 'app', 'views'));
        
        fs.mkdirSync(path.join(actualDir, 'app', 'public', 'css'));
        fs.mkdirSync(path.join(actualDir, 'app', 'public', 'img'));
        fs.mkdirSync(path.join(actualDir, 'app', 'public', 'js'));
        
        fs.appendFileSync(path.join(actualDir, 'app.js'), appJs);
        fs.appendFileSync(path.join(actualDir, 'config', 'server.js'), serverJs);
        fs.appendFileSync(path.join(actualDir, 'app', 'routes', 'index.js'), routesJs);
        fs.appendFileSync(path.join(actualDir, 'app', 'controllers', 'index.js'), controllersJs);
        fs.appendFileSync(path.join(actualDir, 'package.json'), packageJson);
        
        spawnProcess('npm', ['install express consign', 'start']);

        window.showInformationMessage("MVC Pattern Ready!");
        vscode.commands.executeCommand("Reload Window");
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

const deactivate = () => {};

exports.deactivate = deactivate;