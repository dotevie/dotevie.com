const toTitleCase = require("titlecase");
const converter = new (require("showdown")).Converter();
const fs = require("node:fs");
const path = require('path');

// Bad JavaScript Practices: The File
// you can take this if you want but idk how useful it's gonna be lol

(function() {
    const htmlTemplate = `<!DOCTYPE html>
<html>
    <head>
        <title>{{TITLE}} - sayofthelor.us</title>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <meta name="description" content="Website for sayofthelor">
        <meta name="author" content="sayofthelor">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="../wobble.js"></script>
    </head>
    <body>
        <ul id="navbar">
            <li><a href="/index.html">home</a></li>
            <li><a href="/blogs/index.html">(new) blog</a></li>
        </ul>
        {{SLOT}}
    </body>
</html>`;
    const htmlTemplate2 =  `<!DOCTYPE html>
<html>
    <head>
        <title>blog posts - sayofthelor.us</title>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <meta name="description" content="Website for sayofthelor">
        <meta name="author" content="sayofthelor">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <ul id="navbar">
            <li><a href="/index.html">home</a></li>
            <li><a href="/blogs/index.html">(new) blog</a></li>
        </ul>
        <h1>blog posts</h1>
        <hr />
        <ul>{{SLOT}}
        </ul>
    </body>
</html>`;
    let add = "";
    const files = fs.readFileSync("blogs/source/_order.meta", 'utf-8').split("\n");
    for (let i = 0; i < files.length; i++) {
        files[i] = files[i].split("\r")[0]; // fix for windows
    }
    for (const file of files) {
        if (file.endsWith("md")) {
            console.log(`parsing ${file}...`);
            const pth = path.parse(file).name;
            let name = "";
            let date = null;
            if (fs.existsSync(`blogs/source/${pth}.meta`)) {
                const meta = fs.readFileSync(`blogs/source/${pth}.meta`, 'utf-8').split("\n");
                name = meta[0].split("\r")[0]; // fix for windows
                date = meta[1];
                console.log(`meta file found for ${file}, usng name "${name}" and date "${date}"`);
            } else {
                name = toTitleCase(pth.replace("-", " "));
                console.log(`no title file found for ${file}, using auto name "${name}"`);
            }
            add += `\n\t\t\t<li><div style="display: flex; justify-content: space-between; padding:0;"><a href="${pth+".html"}">${name}</a>${date ?`<p style="padding-right: 40px; font-weight: normal; align-self: center; margin: 0; font-size: medium;">${date}</p>` : ""}</div></li>`;
            const md = fs.readFileSync(`blogs/source/${file}`, 'utf-8');
            const html = converter.makeHtml(md);
            fs.writeFileSync(`blogs/${pth}.html`, htmlTemplate.replace("{{TITLE}}", name).replace("{{SLOT}}", 
            `<div style="display: flex; justify-content: space-between; padding:0;">
            <h1>${name}</h1>`
            + (date ? `    <p class="date">${date}</p>` : "")
            + "\t\t</div><hr />"
            + html
            .replace("<wobble>", "<div id=\"wobble\">")
            .replace("</wobble>", "</div>")
            .replace("<center>", "<div align=\"center\">") // idk if this is the best way to center a div but it's ok for what i'm doing
            .replace("</center>", "</div>")
            .split("\n")
            .join("\n\t\t")
            ));
        }
    }
    console.log("writing index.html...");
    fs.writeFileSync("blogs/index.html", htmlTemplate2.replace("{{SLOT}}", add));
    console.log("done :3");
})();