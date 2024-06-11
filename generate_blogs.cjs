const toTitleCase = require("titlecase");
const showdown = require("showdown");
const converter = new showdown.Converter();
const fs = require("node:fs");
const path = require('path');

// Bad JavaScript Practices: The File
// you can take this if you want but idk how useful it's gonna be lol

(function() {
    const htmlTemplate = `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <meta name="description" content="Website for sayofthelor">
        <meta name="author" content="sayofthelor">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="../wobble.js"></script>
    </head>
    <body>
        {{SLOT}}
    </body>
</html>`;
    const htmlTemplate2 =  `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <meta name="description" content="Website for sayofthelor">
        <meta name="author" content="sayofthelor">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <h1>blogs!!!</h1>
        <hr />
        <ul>{{SLOT}}
        </ul>
    </body>
</html>`;
    let add = "";
    const files = fs.readdirSync("blogs");
    for (const file of files) {
        if (file.endsWith("md")) {
            console.log("parsing " + file + "...");
            const pth = path.parse(file).name;
            add += `\n\t\t\t<li><a href="${pth+".html"}">${toTitleCase(pth.replace("-", " "))}</a></li>`;
            const md = fs.readFileSync("blogs/"+file, 'utf-8');
            const html = converter.makeHtml(md);
            fs.writeFileSync("blogs/"+pth+".html", htmlTemplate.replace("{{SLOT}}", html
            .replace("<wobble>", "<div id=\"wobble\">")
            .replace("</wobble>", "</div>")
            .replace("<center>", "<div align=\"center\">")
            .replace("</center>", "</div>")
            .split("\n")
            .join("\n\t\t")
            ));
        }
    }
    console.log("writing index.html...");
    fs.writeFileSync("blogs/index.html", htmlTemplate2.replace("{{SLOT}}", add));
    console.log("done :3")
})();