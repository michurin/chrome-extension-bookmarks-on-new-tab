/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */

(function () {

  'use strict';

  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.update(null, {url: 'chrome://newtab/'});
  });

}());
