import "https://cdn.jsdelivr.net/gh/sayofthelor/test/hscript.min.js";

const interp = new hscript.Interp();
const parser = new hscript.Parser();
parser.allowTypes = true;
parser.allowMetadata = true;
interp.variables.set("console", console);
interp.variables.set("window", window);
interp.variables.set("document", document);
interp.variables.set("location", location);
interp.variables.set("navigator", navigator);
interp.variables.set("screen", screen);
interp.variables.set("history", history);
interp.variables.set("performance", performance);
interp.variables.set("alert", alert);
interp.variables.set("confirm", confirm);
interp.variables.set("prompt", prompt);
interp.variables.set("XMLHttpRequest", XMLHttpRequest);
interp.variables.set("trace", (v) => {
    if (document.getElementById("haxe-output").innerHTML.split("<br>").length > 30) {
        document.getElementById("haxe-output").innerHTML = "";
    }
    const thing = `hscript: ${v}`;
    console.log(thing);
    const node = document.getElementById("haxe-output");
    node.innerHTML += thing + "<br>";
});
interp.variables.set("script", interp);
interp.variables.set("setInContext", (k, v) => interp.setVar(k, v));
interp.variables.set("Browser", {
    console: console,
    document: document,
    location: location,
    navigator: navigator,
    self: self,
    supported: true,
    window: window,
    alert: alert,
    createXMLHttpRequest: () => new XMLHttpRequest(),
    getLocalStorage: () => localStorage,
    getSessionStorage: () => sessionStorage,
});

const runHaxeCode = (code) => {
    try {
        const ast = parser.parseString(code);
        interp.execute(ast);
    } catch (e) {
        console.log(e);
        document.getElementById("haxe-output").innerHTML += e + "<br>";
    }
}

export {runHaxeCode}      