! var fs = require('fs')
!
! var automatic_variables = {
!   '$@': 'name of target',
!   '$%': 'name of target (an archive member)',
!   '$<': 'name of first prerequisite',
!   '$?': 'names of prerequisites newer than target',
!   '$^': 'names of prerequisites, without duplicates',
!   '$+': 'names of prerequisites',
!   '$|': 'names of order-only prerequisites',
!   '$*': 'part of name corresponding to ‘%’ in target pattern',
!   '$(@D)': 'directory name of target',
!   '$(%D)': 'directory name of target (an archive member)',
!   '$(<D)': 'directory name of first prerequisite',
!   '$(?D)': 'directory names of prerequisites newer than target',
!   '$(^D)': 'directory names of prerequisites, without duplicates',
!   '$(+D)': 'directory names of prerequisites',
!   '$(*D)': 'directory part of stem',
!   '$(@F)': 'name of target, without directory name',
!   '$(%F)': 'name of target (an archive member), without directory name',
!   '$(<F)': 'name of first prerequisite, without directory name',
!   '$(?F)': 'names of prerequisites newer than target, without directory names',
!   '$(^F)': 'names of prerequisites, without directory names, with duplicates removed',
!   '$(+F)': 'names of prerequisites, without directory names',
!   '$(*F)': 'stem, without directory name',
! }
!
! function _(text) {
!   console.log(text);
! }
!
! function join(sep) {
!   return function(list) {
!     return list.join(sep)
!   }
! }
!
! function read(filename) {
!   return fs.readFileSync(filename, {encoding: 'utf8'})
! }
!
! function decorate(language, text) {
!   return '  <pre><code class="language-' + language + '">' +
!          require('./lib/decorate/' + language)(text, '', []) +
!          '</code></pre>'
! }
!
<html>
<head>
  <meta charset="utf-8">
  <title>Just Use Make</title>
  <style>
! _(read('style.css').replace(/^(?!$)/gm, '    '))
!
! Object.keys(automatic_variables)
! .map(function(key) {
!   return [
!     '    span[data-content="' + key + '"]:hover:after {',
!     '      content: " -- ' + automatic_variables[key] + '";',
!     '    }',
!   ]
! })
! .map(join('\n'))
! .map(_)
  </style>
</head>
<body>
  <a id="github-banner" href="https://github.com/davidchambers/justusemake.org">
    <img src="http://aral.github.io/fork-me-on-github-retina-ribbons/right-orange@2x.png" alt="Fork me on GitHub">
  </a>
  <div class="prose">
    <h1>Just Use Make</h1>
    <p>
      <a href="http://en.wikipedia.org/wiki/Make_(software)">Make</a> isn’t
      just for neckbeards who’ve been programming C since the seventies.
      Make is a popular, conceptually simple build tool for men and women
      of all ages.
    </p>
    <p>
      Make is finicky. Make is unapproachable. Make doesn’t run on Windows
      (without assistance).
    </p>
    <p>
      Make isn’t perfect. Many years of development effort have been spent
      creating Make-like tools which aim to be better than Make in general,
      or better than Make for a particular purpose.
    </p>
    <p>
      Often, though, one should <strong>just use Make</strong>.
    </p>
    <p>
      Let’s automate the build workflow for a hypothetical web application
      which uses CoffeeScript and Stylus. We’ll do this with both Make and
      <a href="http://gruntjs.com/">Grunt</a>, a popular JavaScript task
      runner.
    </p>
    <p>
      Let’s start with the simplest task a build tool must support: copying
      files. We wish to copy everything in the <b>src/assets</b> directory
      into <b>dist/assets</b>.
    </p>
  </div>
! _(decorate('make', read('src/makefiles/COPY')))
  <div class="prose">
    <p>
      In Make, the first step is to generate a list of files to build.
      In this case, we use the <code>find</code> command to make a list of
      <em>input</em> files by finding all the files in <b>src/assets</b>.
      We then use Make’s
      <a href="https://www.gnu.org/software/make/manual/html_node/Text-Functions.html"><code>patsubstr</code></a>
      to create a list of <em>output</em> files, which we name
      <code>ASSETS</code>. We then create a “target” named <code>build</code>
      and list all the assets as dependencies. This means running
      <code>make build</code> will build all the files in <code>ASSETS</code>.
      Let’s assume that <code>ASSETS</code> is <b>dist/assets/bar.png
      dist/assets/foo.png</b>. In order to build <b>dist/assets/bar.png</b>,
      Make looks for the first rule with a matching pattern. In this case,
      the <code>dist/assets/%</code> target describes how to build
      <b>dist/assets/bar.png</b> from <b>src/assets/bar.png</b>.
    </p>
    <p>
      Grunt requires a bit of set-up. First, install Grunt itself:
    </p>
  </div>
! _(decorate('console', '$ npm install -g grunt-cli'))
  <div class="prose">
    <p>
      To copy files, we’ll need the
      <a href="https://github.com/gruntjs/grunt-contrib-copy">grunt-contrib-copy</a>
      plugin:
    </p>
  </div>
! _(decorate('console', '$ npm install grunt-contrib-copy'))
  <div class="prose">
    <p>
      Next, we create a file named <b>Gruntfile.js</b> with some configuration
      to tell Grunt which files we want to copy and to where:
    </p>
  </div>
! _(decorate('javascript', read('src/javascript/grunt-init-config.js')))
  <div class="prose">
    <p>
      This is a <em>lot</em> of configuration for a straightforward task.
      What’s more, Grunt is about as smart as its name suggests:
    </p>
  </div>
! _(decorate('console', read('src/console/grunt-copy')))
  <div class="prose">
    <p>
      Grunt goes ahead and copies the files each time. Make, thanks to the
      dependency graph we specified in the makefile, only rebuilds a file
      if one or more of its dependencies has changed:
    </p>
  </div>
! _(decorate('console', read('src/console/make-copy')))
  <div class="prose">
    <p>
      Right now our build step involves copying three images, but as our
      projects grows, rebuilding everything from scratch every time could
      disrupt our feedback loop. We don’t want to wait ten seconds to test
      every tweak we make to our app!
    </p>
    <p>
      The next thing we’d like to do is create JavaScript files from our
      CoffeeScript source files. First, with Make:
    </p>
  </div>
  <pre>...</pre>
! _(decorate('make', read('src/makefiles/COFFEE')))
  <div class="prose">
    <p>Grunt example goes here.</p>
  </div>
! _(decorate('make', read('src/makefiles/EXAMPLE_1')))
</body>
</html>
