# extractivate
This library provides a function that helps extract data from DOM elements. This allows HTML to be rendered server side and activated client side without having to pass the original data to the client. It can be used alongside React or any other library that requires the original data to be present when hydrating HTML.

### Component Code

```js
import React, { Component } from 'react';
import e from 'extractivate';

export default class Link extends Component {
    // component code
}

Link.activate = e('.link', { // find elements
    url: e('href'), // use 'href' attribute as 'url' property
    text: e() // use inner text as 'text' property
});
```

You can choose your own way to relate the result of e() to the component. This example sets it onto the component under the arbitrarily chosen name 'activate'.

### Client Side Code

```js
import React from 'react';
import { hydrate } from 'react-dom';
import Link from './Link';

Link.activate(document, (props, element) => {
    hydrate(<Link {...props} />, element.parentNode);
});
```

## Extract
The value extracted depends on which of three optional parameters are defined. None or all of the parameters can be defined, but they must exist in the following order.

### Selector
Any string that contains a dot or square bracket will be treated as a selector. A trailing dot can be used if you only wish to select on the tag name. The selector will be used to find a new element within the current element.

### Name/Structure
Any value that is not a selector or a function will be treated as a name or structure. If it is a string, it will read an attribute from the current element. If it is an object, each property of that object should have its own extract call. If it is an array of objects, it will merge all of the objects into one. If this parameter doesn't exist, it will read the inner text from the current element.

### Transform
A function can be provided to transform the extracted value and return a new one. The first parameter will be the extracted value and the second is the element.

## Modifiers
Modifiers can be placed after the extract call to modify its behavior.

### Array
Place '.asArray' after the extract call to have it extract from all elements that match the selector and return the resulting array.

```js
e('.link', {
    url: e('href'),
    text: e()
}).asArray;
```

### Booleans
Place '.asBoolean' after the extract call to have it return true if the attribute exists and false if it doesn't.

```js
e('input[type=checkbox]', 'checked').asBoolean
```

## Activate
Pass the document or an element to the function returned by the extract function to have it locate elements and extract their properties. If you pass a function as the second parameter it will be called for each element found. The first parameter of the input function will be the properties, the second will be the element. Any additonal parameters passed will be also be passed along to the input function.

```js
import React from 'react';
import { hydrate } from 'react-dom';
import SomeComponent from './SomeComponent';
import OtherComponent from './OtherComponent';

const resolver = (props, element, Component) => {
	hydrate(<Component {...props} />, element.parentNode);
};


SomeComponent.activate(document, resolver, SomeComponent);
OtherComponent.activate(document, resolver, OtherComponent);
```
