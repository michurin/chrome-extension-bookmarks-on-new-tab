/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported bind_listeners */

'use strict';

function bind_listeners(redraw_func) {
  ['Created', 'Removed', 'Changed', 'Moved', 'ChildrenReordered', 'ImportEnded'].forEach(function (ev) {
    chrome.bookmarks['on' + ev].addListener(redraw_func);
  });
  chrome.storage.onChanged.addListener(redraw_func);
}