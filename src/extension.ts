// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { open } from 'fs';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quick-search" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let search = vscode.commands.registerCommand('quick-search.search', async () => {
		let text = await getQueryText();
		if(text === undefined) {
			return;
		}
		console.log(text);
		switch(vscode.workspace.getConfiguration('quick-search').get("default")) {
			case "google":
				searchByGoogle(text);
				break;
			case "stackoverflow":
				searchByStackOverflow(text);
				break;
		}
		
	});

	let searchbyg = vscode.commands.registerCommand('quick-search.searchByGoogle', async () => {
		let text = await getQueryText();
		if(text === undefined) {
			return;
		}
		searchByGoogle(text);
	});

	let searchbyso = vscode.commands.registerCommand('quick-search.searchByStackOverflow', async () => {
		let text = await getQueryText();
		if(text === undefined) {
			return;
		}
		searchByStackOverflow(text);
	});

	context.subscriptions.push(search);
	context.subscriptions.push(searchbyg);
	context.subscriptions.push(searchbyso);
}

async function getQueryText() : Promise<string | undefined> {
	const editor = vscode.window.activeTextEditor;
	let text = "";
	if(editor !== undefined) {
		text = editor.document.getText(editor.selection);
	}
	if(text === "") {
		let result = await vscode.window.showInputBox({
			placeHolder: "Keyword to search..."
		});
		if(result === undefined) {
			return;
		}
		else {
			return result;
		}
		
	}
	else {
		return text;
	}
}

function searchByGoogle(query: string) {
	openSearchWindow("https://google.com/search?q=" + query);
	vscode.window.showInformationMessage('Searching by Google.');
}

function searchByStackOverflow(query: string) {
	openSearchWindow("https://stackoverflow.com/search?q=" + query);
	vscode.window.showInformationMessage('Searching by Stack Overflow.');
}

function openSearchWindow(url: string) {
	vscode.env.openExternal(vscode.Uri.parse(url));
}

// this method is called when your extension is deactivated
export function deactivate() { }
