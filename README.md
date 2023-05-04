# mjdjourney-connect
Sample code for showing how to connect with mjdjourney

## How it works
its wrapping discord API that provided by mjdjourney.
the workflow is first generate 4 low resolution images (which is the default behavor of mjdjourney)
and choose one image to upscale and then return the imageURL

## API
```js
//prompt string
//aspect , e.g: 2:3 for portiat  or 3:2 for widescreen
//aspect default value is 3:2
const imageUrl = await generate(prompt, aspect);

//example:
const imageUrl = await generate('a pretty boy with short hair', '2:3');
```

## Installation
```sh
npm install
```

## Usage
```sh
# syntax
./mjdjourney [prompt]

# example:
./mjdjourney a blone girl looking at the window by disney style
```