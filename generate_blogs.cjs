const toTitleCase = require("titlecase");
const converter = new (require("showdown")).Converter();
const fs = require("node:fs");
const path = require('path');

// Bad JavaScript Practices: The File
// you can take this if you want but idk how useful it's gonna be lol

function manualDateParse(dateRaw) {
    // i know this is stupid
    // but Date.toLocaleDateString wouldn't spit out the format i wanted
    const date = dateRaw.split("T")[0];
    const list = date.split("-");
    const year = parseInt(list[0]);
    const month = parseInt(list[1]);
    const day = parseInt(list[2]);
    const realMonth = ['', 
        'january', 'february', 'march',
        'april', 'may', 'june',
        'july', 'august', 'september',
        'october', 'november', 'december'
    ][month];
    const dayEnd =
        day % 10 == 1 && day != 11 ? "st" :
        day % 10 == 2 && day != 12 ? "nd" :
        day % 10 == 3 && day != 13 ? "rd" :
        "th";
    return realMonth + " " + day + dayEnd + ", " + year;
}

(function() {
    const htmlTemplate = `<!DOCTYPE html>
<html>
    <head>
        <title>{{TITLE}} - dotevie.com</title>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <link rel="alternate" title="blog RSS feed" type="application/atom+xml" href="https://dotevie.com/blogs/feed.atom" />
        <meta name="description" content="Website for dotevie">
        <meta name="author" content="dotevie">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="../wobble.js"></script>
    </head>
    <body>
        <ul id="navbar">
            <li><a href="/index.html">home</a></li>
            <li><a href="/blogs/index.html">blog</a></li>
        </ul>
        {{HEADER}}
        <article>
        {{SLOT}}
        </article>
    </body>
</html>`;
    const htmlTemplate2 =  `<!DOCTYPE html>
<html>
    <head>
        <title>blog posts - dotevie.com</title>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <link rel="alternate" title="blog RSS feed" type="application/atom+xml" href="https://dotevie.com/blogs/feed.atom" />
        <meta name="description" content="Website for dotevie.com">
        <meta name="author" content="dotevie">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <ul id="navbar">
            <li><a href="/index.html">home</a></li>
            <li><a href="/blogs/index.html">blog</a></li>
        </ul>
        <div style="display: flex; justify-content: space-between; padding:0;"><h1>blog posts</h1> <p class="date"><a href="https://dotevie.com/blogs/feed.atom"><img src="../rss.svg" height="24px" alt="RSS logo"/></a></p></div>
        <hr />
        <ul>{{SLOT}}
        </ul>
    </body>
</html>`;
    const atomTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>dotevie.com</title>
    <id>https://dotevie.com/</id>
	<link rel="alternate" href="https://dotevie.com/"/>
	<link rel="self" type="application/atom+xml" href="https://dotevie.com/blogs/feed.atom"/>
	<updated>{{UPDATED_TIME}}</updated>
	<author>
		<name>dotevie</name>
	</author>{{ENTRIES_GO_HERE}}
</feed>`;
    const atomEntryTemplate = `
    <entry>
		<title>{{TITLE}}</title>
		<link rel="alternate" type="text/html" href="{{URL}}"/>
		<id>{{URL}}</id>
		<published>{{PUBLISH_TIME}}</published>
		<updated>{{UPDATE_TIME}}</updated>
        <content type="html">
{{SLOT}}
        </content>
    </entry>`
    let finalAtomFile = "";
    let atomEntries =  "";
    let add = "";
    const files = fs.readdirSync("blogs/source/");
    for (let i = files.length - 1; i >= 0; i--) {
        if (files[i].endsWith("meta")) continue;
        else files.splice(i, 1);
    }
    files.sort((a,b) => {
        const reala = fs.readFileSync("blogs/source/"+a, 'utf-8');
        const realb = fs.readFileSync("blogs/source/"+b, 'utf-8');
        const contents = [reala.split("\n"), realb.split("\n")];
        return new Date(contents[1][1].split("\r")[0]) - new Date(contents[0][1].split("\r")[0]);
    });
    for (let i = 0; i < files.length; i++) {
        let fname = files[i].split(".");
        fname[fname.length - 1] = "md";
        files[i] = fname.join(".");
    }
    console.log(files);
    for (const file of files) {
        console.log(`parsing ${file}...`);
        const pth = path.parse(file).name;
        let name = "";
        let date = null;
        let rawDate = null;
        let updateDate = null;
        if (fs.existsSync(`blogs/source/${pth}.meta`)) {
            const meta = fs.readFileSync(`blogs/source/${pth}.meta`, 'utf-8').split("\n");
            name = meta[0].split("\r")[0]; // fix for windows
            date = manualDateParse(meta[1]);
            rawDate = meta[1];
            updateDate = meta[2];
            console.log(`meta file found for ${file}, usng name "${name}" and date "${date}"`);
        } else {
            throw new Error(`no meta file found for ${file}, stopping`);
        }
        if (date == null) {
            throw new Error(`date for ${file} not found, stopping`);
        }
        if (updateDate == null) {
            throw new Error(`update date for ${file} not found, stopping`)
        }
        const formattedUrl = `https://dotevie.com/blogs/${pth}.html`
        add += `\n\t\t\t<li><div style="display: flex; justify-content: space-between; padding:0;"><a href="./${pth}.html">${name}</a>${date ?`<p style="padding-right: 40px; font-weight: normal; align-self: right; margin: 0; font-size: medium; text-align: right;">${date}</p>` : ""}</div></li>`;
        const md = fs.readFileSync(`blogs/source/${file}`, 'utf-8');
        const html = converter.makeHtml(md);
        const formattedHtml = html.replace("<wobble>", "<div id=\"wobble\">")
            .replace("</wobble>", "</div>")
            .replace("<center>", "<div align=\"center\">") // idk if this is the best way to center a div but it's ok for what i'm doing
            .replace("</center>", "</div>")
            .split("\n")
            .join("\n\t\t"); // we need this for the atom feed also
        const formattedTitle = name.replace(/<\/?[^>]+(>|$)/g, "");
        atomEntries += atomEntryTemplate.replace("{{TITLE}}", formattedTitle)
            .replace("{{PUBLISH_TIME}}", rawDate)
            .replace("{{UPDATE_TIME}}", updateDate)
            .replaceAll("{{URL}}", formattedUrl)
            .replace("{{SLOT}}", `\t\t\t<div xmlns="http://www.w3.org/1999/xhtml">
                ${formattedHtml.replaceAll("\t\t", "\t\t\t\t").replaceAll("{{BLOG_URL}}", "https://dotevie.com/blogs")}
            </div>`); 
        fs.writeFileSync(`docs/blogs/${pth}.html`, htmlTemplate.replace("{{TITLE}}", formattedTitle) // strip tags
            .replace("{{HEADER}}",`<div style="display: flex; justify-content: space-between; padding:0;">
            <h1>${name}</h1>`
            + (date ? `    <p class="date">${date} | <a href="https://dotevie.com/blogs/feed.atom"><img src="../rss.svg" height="24px" alt="RSS logo"/></a></p>` : "")
            + "\t\t</div><hr />")
            .replace("{{SLOT}}", formattedHtml.replaceAll("{{BLOG_URL}}", "."))
        );
    }
    finalAtomFile = atomTemplate.replace("{{UPDATED_TIME}}", new Date().toISOString())
        .replace("{{ENTRIES_GO_HERE}}", atomEntries);
    console.log("writing index.html...");
    fs.writeFileSync("docs/blogs/index.html", htmlTemplate2.replace("{{SLOT}}", add));
    console.log("writing feed.atom...");
    fs.writeFileSync("docs/blogs/feed.atom", finalAtomFile);
    console.log("copying images...");
    fs.cpSync("blogs/images", "docs/blogs/images", {recursive: true});
    console.log("done :3");
})();