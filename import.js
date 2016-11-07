'use strict'

let Importer = require('wxr')
let fs = require('fs')
let shelljs = require('shelljs')
let _ = require('underscore')
let parameterize = require('parameterize')

var importer = new Importer

// Load all the exported files
shelljs.find('./export').filter(function(filename) {
  if (filename.match(/\.json$/)) {
    var contents = fs.readFileSync('./' + filename)
    var post = JSON.parse(contents)
    post.categories = _.map(post.categories, function(item) {
      return {
        slug: parameterize(item.replace('&amp;', ' ')),
        title: item
      }
    })
    post.tags = _.map(post.tags, function(item) {
      return {
        slug: parameterize(item.replace('&amp;', ' ')),
        title: item
      }
    })
    importer.addPost(post)
  }
});

console.log(importer.stringify())
