/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported url_openner */

'use strict';

function url_openner(url) {
  return function () {
    chrome.tabs.update(
      null,
      {
        active: true,
        url: url
      }
    );
  };
}
