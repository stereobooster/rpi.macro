# rpi.macro

[![Build Status](https://travis-ci.org/stereobooster/rpi.macro.svg?branch=master)](https://travis-ci.org/stereobooster/rpi.macro) [![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

> Helper macro for [react-precious-image](https://github.com/stereobooster/react-precious-image)

## Usage

Similar to nodejs `require` call:

```js
import rpi from "rpi.macro";

const meta = rpi("./image.jpg");
```

### Example of usage in create-react-app

```js
import React from "react";
import rpi from "rpi.macro";
import { AdaptiveLoad } from "react-precious-image";

import image from "./images/doggo.jpg";
const meta = rpi("./doggo.jpg");

const App = () => <AdaptiveLoad src={image} alt="doggo" {...meta} />;
```

## Credits

Based on [pveyes/raw.macro](https://github.com/pveyes/raw.macro).

## License

MIT
