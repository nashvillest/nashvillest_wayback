'use strict'

// Usage:
//   node parse.js /path/to/page.html

let cheerio = require('cheerio')
let _ = require('underscore')
let fs = require('fs')
let moment = require('moment')

var filename = process.argv[2]

// Must provide something to parse
if (!filename) {
  console.log('Missing argument for file to parse.')
  process.exit(1)
}

// Create the export directory if it doesn't exist
if (!fs.existsSync('./export')){
    fs.mkdirSync('./export');
}

if (!filename.match(/\d+\/\d+\/\d+\//) || filename.match(/\d+\/\d+\/\d+\/index.html/) || filename.match(/feed\/index.html$/)) {
  // console.log('Skipping non-post: ' + filename)
  return
}

fs.readFile(filename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err)
  }
  let $ = cheerio.load(data)

  // Container for all post data
  var post = {}

  // Get the post ID
  var post_id = $('link[rel="shortlink"]').attr('href')
  if (!post_id) {
    post_id = $('div[id^=post-]').attr('id')
  }
  if (!post_id) {
    post_id = $('input[name="comment_post_ID"]').val()
  }
  if (!post_id) {
    console.log('[ERROR] Empty post ID in ' + filename)
    return
  }
  post_id = post_id.replace(/(.*)\D+/, '')
  if (!parseInt(post_id, 10)) {
    console.log('[ERROR] Unable to correctly parse post ID in ' + filename)
    return
  }
  post.id = post_id

  // Get the permalink
  var permalink = $('.post > h1 a').attr('href')
  if (!permalink) {
    permalink = $('.entry-title > a:nth-child(1)').attr('href')
  }
  if (!permalink) {
    permalink = $('a[href*="nashvillest.disqus.com"]').attr('href')
  }
  if (!permalink) {
    permalink = filename.replace('/index.html', '')
  }
  if (!permalink) {
    console.log('[ERROR] Empty permalink in ' + filename)
    return
  }
  permalink = permalink.match(/[^/]*(?=(\/)?$)/)[0]
  post.name = permalink

  // Get the post title
  var title = $('.post > h1 a').html()
  if (!title) {
    title = $('.entry-title > a:nth-child(1)').html()
  }
  if (!title) {
    title = $('#content > h2:nth-child(3)').html()
  }
  if (!title) {
    console.log('[ERROR] Missing a title in ' + filename)
    return
  }
  post.title = title

  // Get the author information
  var author = $('a[rel="author"]').html()
  if (!author) {
    author = $('span.author .fn').html()
  }
  if (!author) {
    author = $('#content > h4:nth-child(4)').html()
    if (author) {
      author = author.match(/\<\!\-\- by (.*) \-\-\>/)[1]
    }
  }
  if (!author) {
    console.log('[ERROR] Missing a author in ' + filename)
    return
  }
  post.author = author

  // Get the publish date
  var publish_date = $('.meta .date').html()
  if (!publish_date) {
    publish_date = $('.published-date').html()
  }
  if (!publish_date) {
    publish_date = filename.match(/\d+\/\d+\/\d+/)[0]
    publish_date = publish_date.replace('/', '\\')
  }
  publish_date = publish_date.replace('| ', '')
  publish_date = Date.parse(publish_date)
  publish_date = moment.unix(publish_date/1000).format()
  post.date = publish_date

  // Get the Tags
  var tags = []
  _.each($('.post').find('a[rel="tag"]'), function (element) {
    tags.push($(element).html())
  })
  post.tags = tags

  // Get the Categories
  var categories = []
  _.each($('.entry-meta').find('a[rel="category tag"]'), function (element) {
    categories.push($(element).html())
  })
  post.categories = categories

  // Delete the social buttons
  $('.entry .tw_button').remove()
  $('.entry .wp_plus_one_button').remove()
  $('.sociable').remove()

  // The entry content (changes based on template)
  var content = $('.entry').html()
  if (!content) {
    content = $('.entry-content').html()
  }
  if (!content) {
    console.log('[ERROR] Empty content in ' + filename)
    return
  }
  content = content.replace(/\r?\n|\r/g,"").trim()
  post.contentEncoded = content

  // Write out a JSON file
  var file_contents = JSON.stringify(post)
  var stream = fs.createWriteStream('./export/' + post.id + '-' + post.name + '.json');
  stream.once('open', function(fd) {
    stream.write(file_contents);
    stream.end();
  });
})
