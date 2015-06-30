#!/usr/bin/env node

var LineByLineReader = require('line-by-line')
var lr = new LineByLineReader(process.argv[2])

/*
# js2md
This crude little module converts JavaScript files to MarkDown files.
It puts the multi-line comments as the normal text, and the code into code blocks.

This is useful when you want commented code in a MarkDown format (for a README.md for instance).

## Usage
`npm i -g` 

`js2md index.js > README.md`


## Example
This README.md is the effect of running js2md on [index.js](https://github.com/vigour-io/js2md/blob/master/index.js)

### Prepping variables
*/
var output
var hasbegun
var incomments

var title = /([^#]|^)#[^#]/
var openingComment = /\/\*/
var closingComment = /\*\//

var indent
/*
### Reading the file
For reading the file I used the `line-by-line` [module](https://github.com/Osterjour/line-by-line)
#### Reading lines
*/
lr.on('line', function (line) {

  var toWrite = null
  var change = false

  if(incomments) {
    if(closingComment.test(line)) {
      change = true
      toWrite = hasbegun && '\n```javascript\n'
    }
  } else {
    if(openingComment.test(line)) {
      change = true
      toWrite = hasbegun && '```\n\n'
    }
  }
  
  if(hasbegun) {
    if(toWrite) {
      output += toWrite
    } else {
      output += line.slice(indent) + '\n'
    }
  } else if(incomments && (hasbegun = line.match(title))) {
    indent = hasbegun.index + hasbegun[0].indexOf('#')
    output = line.slice(indent) + '\n'
  }

  if(change) {
    incomments = !incomments
  }

})
/*
#### When we're done
*/
lr.on('end', function () {
  output += '```\n\n'
  process.stdout.write(output)
})
/*
#### Error handling
*/
lr.on('error', function (err) {
  throw err
})
