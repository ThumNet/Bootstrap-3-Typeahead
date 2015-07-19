Bootstrap 3 Typeahead
=====================

For simple autocomplete use cases there seems to be nothing wrong with the dropped typeahead plugin. Here you will find the typeahead autocomplete plugin for Twitter's Bootstrap 2 ready to use with Twitter's Bootstrap 3. The original code is written by [@mdo](http://twitter.com/mdo) and [@fat](http://twitter.com/fat).

With Twitter Bootstrap 3 the typeahead plugin had been dropped. [@mdo](http://twitter.com/mdo) says: "in favor of folks using [Twitter's typeahead](https://github.com/twitter/typeahead.js). Twitter's typeahead has more features than the old bootstrap-typeahead.js and less bugs." 
Twitter's typeahead don't work direct with Bootstrap 3. The DOM structure of the dropdown menu used by `typeahead.js` differs from the DOM structure of the Bootstrap dropdown menu. 

Download
========

 - Download the latest [bootstrap3-typeahead.js](https://github.com/thumnet/Bootstrap-3-Typeahead/blob/master/src/bootstrap3-typeahead.js) or [bootstrap3-typeahead.min.js](https://github.com/thumnet/Bootstrap-3-Typeahead/dist/blob/master/bootstrap3-typeahead.min.js).

 - Include it in your source after jQuery and Bootstrap Javascript.

CSS
===
There is no additional css required to use the plugin. Bootstrap's css contains all required styles in the `.dropdown-menu` class. The original CSS add a `z-index` of 1051 to the dropdownmenu via the typeahead class. You could add this if you need it.
`.typeahead { z-index: 1051;}` (less or css).

Usage
=====

	<input type="text" data-provide="typeahead">

You'll want to set `autocomplete="off"` to prevent default browser menus from appearing over the Bootstrap typeahead dropdown.

Via data attributes
-------------------
Add data attributes to register an element with typeahead functionality as shown in the example above.

Via JavaScript
--------------

Call the typeahead manually with:

	$('.typeahead').typeahead()

Destroys previously initialized typeaheads. This entails reverting DOM modifications and removing event handlers:	
	
	$('.typeahead').typeahead('destroy')

Working example
===============
See [sample](https://github.com/ThumNet/Bootstrap-3-Typeahead/blob/master/sample.html).
	
	
Options
=======

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-source=""`.

<table class="table table-bordered table-striped">
  <thead>
   <tr>
     <th style="width: 100px;">Name</th>
     <th style="width: 50px;">type</th>
     <th style="width: 100px;">default</th>
     <th>description</th>
   </tr>
  </thead>
  <tbody>
    <tr>
     <td>source</td>
     <td>array, function</td>
     <td>[ ]</td>
     <td>The data source to query against. May be an array of strings, an array of JSON object with a name property or a function. The function accepts two arguments, the <code>query</code> value in the input field and the <code>process</code> callback. The function may be used synchronously by returning the data source directly or asynchronously via the <code>process</code> callback's single argument.</td>
   </tr>
   <tr>
     <td>items</td>
     <td>number</td>
     <td>8</td>
     <td>The max number of items to display in the dropdown. Can also be set to 'all'</td>
   </tr>
   <tr>
     <td>minLength</td>
     <td>number</td>
     <td>1</td>
     <td>The minimum character length needed before triggering autocomplete suggestions. You can set it to 0 so suggestion are shown even when there is no text when lookup function is called.</td>
   </tr>
   <tr>
     <td>showHintOnFocus</td>
     <td>boolean</td>
     <td>false</td>
     <td>If hints should be shown when applicable as soon as the input gets focus.</td>
   </tr>
  <tr>
     <td>scrollHeight</td>
     <td>number, function</td>
     <td>0</td>
     <td>Number of pixels the scrollable parent container scrolled down (scrolled out the viewport).</td>
   </tr>         
   <tr>
     <td>autoSelect</td>
     <td>boolean</td>
     <td>true</td>
     <td>Allows you to dictate whether or not the first suggestion is selected automatically. Turning autoselect off also means that the input won't clear if nothing is selected and <kbd>enter</kbd> or <kbd>tab</kbd> is hit.</td>
   </tr>
   <tr>
     <td>onSelect</td>
     <td>function</td>
     <td>$.noop()</td>
     <td>Call back function to execute after selected an item. It gets the current active item in parameter if any.</td>
   </tr>
   <tr>
     <td>onSearch</td>
     <td>function</td>
     <td>$.noop()</td>
     <td>Call back function to execute after pressing [enter] or selecting search item. It gets the current query in parameter.</td>
   </tr>
   <tr>
     <td>onNew</td>
     <td>function</td>
     <td>$.noop()</td>
     <td>Call back function to execute after selecting new item. It gets the current query in parameter.</td>
   </tr>
   <tr>
     <td>delay</td>
     <td>integer</td>
     <td>0</td>
     <td>Adds a delay between lookups.</td>
   </tr>
  <tr>
  <tr>
    <td>searchItem</td>
    <td>string</td>
    <td>false</td>
    <td>Adds an extra option to the end of the list, for example "Search". This could be used, for example, to pop a dialog when an item is not found in the list of data. Example: <a href="http://cl.ly/image/2u170I1q1G3A/addItem.png">http://cl.ly/image/2u170I1q1G3A/addItem.png</a></td>
   </tr>
  <tr>
    <td>newItem</td>
    <td>string</td>
    <td>false</td>
    <td>Adds an extra option to the end of the list, for example "New Entry". This could be used, for example, to pop a dialog when an item is not found in the list of data. Example: <a href="http://cl.ly/image/2u170I1q1G3A/addItem.png">http://cl.ly/image/2u170I1q1G3A/addItem.png</a></td>
   </tr>
   <tr>
    <td>displayTemplate</td>
    <td>string</td>
    <td>{{value}}</td>
    <td>Used to render a dropdown item. Build using <a href="https://github.com/piacentini/minitemplate">minitemplate</a>. See <a href="https://github.com/ThumNet/Bootstrap-3-Typeahead/blob/master/sample.html">sample.html</a> for possible usecase.</td>
   </tr>
  </tbody>
</table>

Methods
=======

	.typeahead(options): Initializes an input with a typeahead.
	.lookup: To trigger the lookup function externally
	.getActive: To get the currently active item, you will get a String or a JSOn object depending on how you initialized typeahead. Works only for the first match.


