import sys.io.File;
import haxe.io.Path;
import sys.FileSystem;
using StringTools;

// run this to generate corresponding html files to load and render each markdown file
// command: haxe --run Generate.hx
final htmlTemplate = '<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../global.css" type="text/css" />
        <script src="https://unpkg.com/showdown/dist/showdown.min.js"></script>
        <script src="../wobble.js"></script>
        <script>
            async function loadFile(path) {
                const converter = new showdown.Converter();
                let response = await fetch(path);
                let text = await response.text();
                text = text.replace("<wobble>", "<div id=\\\"wobble\\\">").replace("</wobble>", "</div>");
                let html = converter.makeHtml(text);
                console.log(html);
                let div = document.getElementById("content");
                console.log(div);
                div.insertAdjacentHTML("beforeend", html);
            }
            loadFile("./{{NAME}}.md");
        </script>
    </head>
    <body>
        <div id="content"></div>
    </body>
</html>';
function main() {
    for (file in FileSystem.readDirectory(FileSystem.absolutePath("./"))) {
        if (Path.extension(file) != "md") continue;
        var html = htmlTemplate.replace("{{NAME}}", Path.withoutExtension(file));
        File.saveContent(FileSystem.absolutePath("./" + Path.withoutExtension(file) + ".html"), html);
        trace("Generated " + Path.withoutExtension(file) + ".html");
    }
}