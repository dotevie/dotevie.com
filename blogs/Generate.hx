import sys.io.File;
import haxe.io.Path;
import sys.FileSystem;
using StringTools;

// run this to generate corresponding html files to load and render each markdown file
// command: haxe --run Generate.hx
inline final htmlTemplate = '<!DOCTYPE html>
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
</html>';
inline final htmlTemplate2 = '<!DOCTYPE html>
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
</html>';
function main() {
    var add = '';
    for (file in FileSystem.readDirectory(FileSystem.absolutePath("./"))) {
        if (Path.extension(file).toLowerCase() != "md") continue;
        var html = htmlTemplate.replace("{{SLOT}}", 
        Markdown.markdownToHtml(File.getContent(file))
            .replace("<wobble>", "<div id=\"wobble\">")
            .replace("</wobble>", "</div>")
            .replace("<center>", "<div align=\"center\">")
            .replace("</center>", "</div>")
        );
        File.saveContent(FileSystem.absolutePath("./" + Path.withoutExtension(file) + ".html"), html);
        add += '\n            <li><a href="${Path.withoutExtension(Path.withoutDirectory(file))}.html">${Path.withoutExtension(Path.withoutDirectory(file))}</li>';
        trace("Generated " + Path.withoutExtension(file) + ".html");
    }
    File.saveContent(FileSystem.absolutePath("./index.html"), htmlTemplate2.replace("{{SLOT}}", add));
    trace("Generated base index file");
}