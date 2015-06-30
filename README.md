 js2md
his crude little module converts JavaScript files to MarkDown files.
t puts the multi-line comments as the normal text, and the code into code blocks.

his is useful when you want commented code in a MarkDown format (for a README.md for instance).

# Usage
npm i -g` 

js2md index.js > README.md`


# Example
his README.md is the effect of running js2md on [index.js](https://github.com/vigour-io/js2md/blob/master/index.js)

## Prepping variables

```javascript
ar output
ar hasbegun
ar incomments

ar title = /([^#]|^)#[^#]/
ar openingComment = /\/\*/
ar closingComment = /\*\//

ar indent
```

## Reading the file
or reading the file I used the `line-by-line` [module](https://github.com/Osterjour/line-by-line)
### Reading lines

```javascript
r.on('line', function (line) {

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
   indent = hasbegun.index + 1
   output = line.slice(indent) + '\n'
 }

 if(change) {
   incomments = !incomments
 }

)
```

### When we're done

```javascript
r.on('end', function () {
 output += '```\n\n'
 process.stdout.write(output)
)
```

### Error handling

```javascript
r.on('error', function (err) {
 throw err
)
```

