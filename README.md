# jQuery Search Hint
A jQuery plugin for search inputs to get results and suggest keywords to the user.

Built by  [Westley Mon](http://westleymon.com) at [Mindgruve](http://mindgruve.com).

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/mindgruve/searchHint/master/dist/jquery.searchHint.min.js
[max]: https://raw.githubusercontent.com/mindgruve/searchHint/master/dist/jquery.searchHint.js

```html
<script src="jquery.js"></script>
<script src="dist/jquery.searchHint.min.js"></script>

    $('.search-hint-input').searchHint({
        suggestionBox: $('.search-hint-span'),
        termDictionaryUrl: '/search-hint/index.php'
    });
```

## Documentation

Some CSS styling is to reach various desired effects.  Reference the demo, or style it as desired.

```css
.search-hint {
    border: 1px solid #ccc;
    font-size: 16px;
    height: 30px;
    position: relative;
    margin: auto;
    max-width: 300px;
    text-align: left;               
}

.search-hint span,
.search-hint input {
    background-color: transparent;
    border: 0;
    bottom: 0;
    color: #000;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 2;

}

.search-hint span {
    color: #ccc;
    left: 1px;
    top: 1px;
    z-index: 1;
}

/* adjust for webkit rending the input a bit different */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    .search-hint span {
        left: 1px;
        top: 5px;
    }
}

```

### Options

| Property  | Default | Required | Description |
|---|---|---|---|
| `suggestionBox`  | `null` | Yes | An element to display the suggestion |
| `termDictionaryUrl`  | `null` | Yes | Url to provide the results |
| `dataType`  | `json` | No | Type of data the Ajax call can expect |

### Fetching Results

The script expects to hit an endpoint that returns JSON encoded results.  It looks for a key called `terms` which contains an Array of all terms associated with the first letter of the search query.

```javascript
{"id":"a","terms":["ant","apple","art"]}
```

The `termDictionaryUrl` takes the given URL and appends a query string to it, i.e.: `?letter=a`.  The endpoint can be setup with a simple switch based on the query string.  See `demos/results.php` for reference.

**Suggestions are shown to the user in the order of which the terms are in the array. Add weight to which terms show up first by ordering the array accordingly.**

### Examples
See `demos/index.html`

To see it in action, download this package, run PHP's  built-in web server in the root of this package, and access `<localhost or ip>/demos`.  More info on [PHP's Built-in Web Server](http://php.net/manual/en/features.commandline.webserver.php).

*For the sake of this example and saving time... Only search for words starting with A, B, or C.*

### Roadmap
- Add support for overriding the manipulation of endpoint results
- Add ability to use a different URL structure for endpoint