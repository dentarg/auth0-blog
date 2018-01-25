This is a clone of the qraftlabs blog at [http://blog.qraftlabs.com](http://blog.qraftlabs.com).

This blog uses [Jekyll](https://github.com/mojombo/jekyll).

## Create a new blog post

```bash
rake new_post["title of the new blog post"]
```

### Manage posts in the "Top Reads" section

To add a post to the "Top Reads" section you must add the tag `featured` to it. Use the `pr:` yaml front matter to sort its position. (e.g. `pr: 1` is the top post in the section).

### Markdown Cheat Sheet

A blog post markdown cheat sheet is available at [post-cheat-sheet.markdown](post-cheat-sheet.markdown).

### Customize your post's design

![Post design](https://cldup.com/IPu5HDCNf3.png)

Use the yaml front matter in your post to customize its design. The `design` variable supports the following parameters. All of these parameters are optional.

```
---
design:
  bg_color: Set the background color for your post's header. (You can use rgb or hex colors inside double quotes)
  bg_merge: Set to true to merge your image with your header's background color (default is false)
  image: A url path to your posts image, it will be downsized if too big to fit inside a circle.
  image_tw: Overrides image to set a specific image for twitter card
  image_fb:  Overrides image to set a specific image for facebook open graph
  image_bg_color: Set a color for the circle in wich the image is placed. Use `none` for a transparent circle. (Default is `#eaeef3`).
  image_size: Set the maximum size your image will have relative to the circle. (Default is "120%")
  image_top: Set the the top offset relative to the center of the image. (Default is "50%")
  image_left: Set the the left offset relative to the center of the image. (Default is "50%")
---
```

### Blog post Multi Language

These parameters are required for each version of Blog post

```
---
lang: Set the language code of the post ( en | ja | es | de )
alternate_locale_en:  Set the name of the post url  in English (filename without the date).  example: name-blog-post-url
alternate_locale_es:  Set the name of the post url in Spanish (filename without the date).   example: es-name-blog-post-url
alternate_locale_de:  Set the name of the post url in German (filename without the date).    example: de-name-blog-post-url
alternate_locale_ja:  Set the name of the post url in Japanese (filename without the date).  example: ja-name-blog-post-url
---
```
It is suggested to put the language code after the date and before the name of the blog post for each version. For example:

```
	-  2017-10-05-name-blog-post-url.markdown
	-  2017-10-05-es-name-blog-post-url.markdown
	-  2017-10-06-ja-name-blog-post-url.markdown
```

### Grammarly

All blog posts should be checked with the Grammarly app before publication. Please read the [Grammarly instructions here](https://github.com/auth0/blog/blob/master/grammarly.markdown).

## Prerequisites

1.  Install Ruby (2.1.0 or later)
2.  Make sure you have [`rbenv`](https://github.com/rbenv/rbenv)
3.  Install Bundler `gem install bundler`

## Run

1.  Enter the blog directory and make sure (with `ruby -v`) that you are running the right ruby version (`.ruby-version` file).
2.  Install dependencies with `bundle install`
3.  `bundle exec jekyll serve --watch --limit_posts 10` (removing `--limit_posts` will make thing really slow)
4.  Open [http://localhost:4000/blog/](http://localhost:4000/blog/). Make sure you **don't leave out the trailing slash (/)**, otherwise you will get a 404.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

All the infrastructure to run this blog is open sourced under the MIT license. See the [LICENSE](LICENSE) file for more info.

The exact content of the articles (the `_posts` folder) is Qraftlabs Copyright.
