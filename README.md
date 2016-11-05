## Nashvillest Content from Wayback Machine

So, funny story. A bunch of data may have been lost in a server crash.

This is an attempt to piece the content back together. It uses a [Ruby gem](https://github.com/hartator/wayback-machine-downloader) to extract the site content from the [Internet Wayback Machine](https://archive.org).

## Scraping the Content

**Requirements:**
- bundler

```
bundle install
bundle exec wayback_machine_downloader http://nashvillest.com --exclude "/^http:\/\/nashvillest.com(:80)?\/(tag|page|category|\?)\/.*/"
```

This takes a few hours to complete. The RegEx above is to exclude some pages that would end up being duplicates (and likely not useful for data extraction).

## Parsing Out the Articles

**Requirements:**
- node (4.4+)

**Parse everything:**

```
npm install
find . -type f -name 'index.html' -exec node parse.js {} \;
```

**Parse a single path:**

```
npm install
node parse.js <path to article>
```
