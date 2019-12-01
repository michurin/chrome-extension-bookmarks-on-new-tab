/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2019 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported url_openner */

'use strict';

function url_openner(url) {
  return function (e) {
    if (e.shiftKey) {
      chrome.tabs.create({url: url});
      return;
    }
    if (e.ctrlKey) {
      chrome.tabs.create({url: url, active: false});
      return;
    }
    chrome.tabs.update(null, {url: url});
  };
}
