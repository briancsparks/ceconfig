
# Comprehensive Easy Configuration management

`ceconfig` makes it easy to get config values for your program -- both Node.js projects and Bash scripts.
Just use it as shown below and get those values now.  Worry about where they come from only if that
complexity shows up on your project.

Usage in Node.js projects:

```sh
npm i -S ceconfig
```

Then, in your JavaScript:

```javascript
const CONFIG  = require('ceconfig').mkCONFIG();

// ...

const editor = CONFIG('editor');
```

Usage in Bash scripts:

```sh
# Install ceconfig
npm i -g ceconfig
```

Then in your scripts:

```sh
EDITOR="$(ceconfig editor)"

# -or -

curl -sSL "http://$(ceconfig devserver):$(ceconfig devport)/my/favorite/route"
```

## How

* Looks everywhere for configuration data, in this order:
  * Commnad-line arguments.
  * Environment variables
  * All the expected spellings and types of .ceconfig.xyz files
  * All the expected locations for those .ceconfig files
  * Call your function to retrieve it


