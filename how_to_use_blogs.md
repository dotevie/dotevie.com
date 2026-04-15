# how to use the blogs system

### 1. write a blog post using markdown syntax into an md file in the `blogs/source` folder
- special HTML tags \<wobble> and \<center> are allowed to be used here
### 2. make a meta file
- in the same directory, make a file called `(name).meta` that contains, on three lines:
- - the article title
- - the publish time in RFC3359 format (e.g. `2026-04-15T00:13:00-04:00` for apr 15 2026 13:00 EDT) (DO NOT CHANGE THIS AFTER PUBLISHING)
- - the update time in RFC3359 format (this can be changed after publishing)
- this title will be made into a header on the final article
- if no title file exists, a title case version of the filename will be used instead and no date will be shown
### 3. run the blog generator
- refer to `README.md` if you forgot how to do this
- generates `index.html`, html files for all blogs, and an Atom feed `feed.atom` in `docs/blogs/`

### by the end your file structure should look something like this

```
.
├── blogs/
|   ├── source/
|   |   ├── order.meta
|   │   ├── name.md
|   │   └── name.meta
└── docs/
    ├── blogs/
    |   ├── index.html
    │   ├── name.html
    │   └── feed.atom
```