# how to use the blogs system

### 1. write a blog post using markdown syntax into an md file in the `blogs/source` folder
- special HTML tags \<wobble> and \<center> are allowed to be used here
### 2. make a title file
- in the same directory, make a file called `(name).title` that contains the title of the article
- this title will be made into a header on the final article
- if no title file exists, a title case version of the filename will be used instead
### 3. make a date file
- in the same directory, make a file called `(name).date` containing the publish date you want to show
- there's no spec you have to follow here but i recommend sticking to something (e.g. `january 1st 1970`)
### 4. put your md file into `blogs/source/order.meta`
- this is to determine the order of the blogs, i would recommend just putting it at the beginning to keep it chromological
### 5. run the blog generator
- refer to `README.md` if you forgot how to do this

### by the end your file structure should look something like this

```
.
└── blogs/
    ├── source/
    |   ├── order.meta
    |   ├── name.date
    │   ├── name.md
    │   └── name.title
    ├── name.html
    └── index.html
```