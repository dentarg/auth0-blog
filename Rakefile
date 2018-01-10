require "stringex"
require 'highline/import'
new_post_ext = "markdown"
posts_dir    = "_posts"

#usage rake
desc 'push to github, deploy to heroku and finally notify search engines about the sitemap.xml'
task :default do
  puts '* Pushing to github'
  `git push origin`

  puts '* Deploying to heroku'
  `git push heroku`

  #notify search engines
  Rake::Task["sitemap"].invoke
end

#usage rake sitemap, but this task will be executed automatically after deploying
desc 'notify search engines'
task :sitemap do
  begin
    require 'net/http'
    require 'uri'
    puts '* Pinging Google about our sitemap'
    Net::HTTP.get('www.google.com', '/webmasters/tools/ping?sitemap=' + URI.escape('http://blog.auth0.com/sitemap.xml'))
  rescue LoadError
    puts '! Could not ping Google about our sitemap, because Net::HTTP or URI could not be found.'
  end
end

# borrowed this from octopress
# usage rake new_post[my-new-post] or rake new_post['my new post'] or rake new_post (defaults to "new-post")
desc "Begin a new post in _posts"
task :new_post, :title do |t, args|
  mkdir_p "#{posts_dir}"
  args.with_defaults(:title => 'new-post')
  title = args.title
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("Rake aborted!") if ask("#{filename} already exists. \nDo you want to overwrite? Y/n", ['y', 'n', 'Y', 'N']).downcase == 'n'
  end
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts <<-POST
---
layout: post
title: #{title.gsub(/&/,'&amp;')}
description: <A SHORT DESCRIPTION OF THE POST <= 200 CHARACTERS >
longdescription: <A LONG DESCRIPTION OF THE POST BETWEEN 230 AND 320 CHARACTERS>
date: #{Time.now.strftime('%Y-%m-%d %H:%M')}
category: <FROM HERE: https://docs.google.com/spreadsheets/d/1e_RKzi8kVwzqPG8si8kyDOWPiBk9tI-XNGh0KgRIF7Q>
press_release: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
is_non-tech: <true|false (FOR FALSE YOU COULD ALSO REMOVE THIS LINE)>
banner:
  text: <TEXT TO BE USED AS A BANNER>
author:
  name: <YOUR NAME>
  url: <YOUR URL>
  mail: <YOUR MAIL>
  avatar: <LINK TO PROFILE PIC>
design:
  bg_color: <A HEX BACKGROUND COLOR>
  image: <A PATH TO A 200x200 IMAGE>
tags:
- foo
related:
- <ADD SOME RELATED POSTS FROM AUTH0'S BLOG>
---

**TL;DR:** A brief synopsis that includes link to a [github repo](http://www.github.com/).

---
POST
  end
end


