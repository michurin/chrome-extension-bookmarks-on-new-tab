/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported url_openner */

'use strict';

function url_openner(url) {
  var tabParams = {url: url};
  return function (e) {
    if (e.shiftKey) {
      chrome.tabs.create(tabParams);
      return;
    }
    chrome.tabs.update(null, tabParams);
  };
}
