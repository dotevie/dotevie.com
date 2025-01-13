# how to use the blogs system

### 1. write a blog post using markdown syntax into an md file in the `blogs/source` folder
- special HTML tags \<wobble> and \<center> are allowed to be used here
### 2. make a meta file
- in the same directory, make a file called `(name).meta` that contains the title of the article on one line, and the publish date (yyyy-mm-dd) on another
- this title will be made into a header on the final article
- if no title file exists, a title case version of the filename will be used instead and no date will be shown
### 44 run the blog generator
- refer to `README.md` if you forgot how to do this

### by the end your file structure should look something like this

```
.
└── blogs/
    ├── source/
    |   ├── order.meta
    │   ├── name.md
    │   └── name.meta
    ├── name.html
    └── index.html
```