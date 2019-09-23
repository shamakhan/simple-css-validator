# Simple CSS validator

## Getting Started

### Install as dependency
```sh
npm install simple-css-validator
```

or if you use yarn then
```sh
$ yarn add simple-css-validator
```

### Usage
```js
import cssValidator from 'simple-css-validator';

...
cssRules = {
  width: '100px';
  'background-color': 'cyan',
};

validity = cssValidator(cssRules);
/* Response is of the form
  {
    valid: true,
    error: []
  }

  OR

  {
    valid: false,
    error: [
      'error-1',
      'error-2'
    ]
  }

*/
```