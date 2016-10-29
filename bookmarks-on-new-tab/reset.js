/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome, window */

(function () {

  'use strict';

  window.document.getElementById('reset').onclick = function () {
    if (window.confirm('Do you realy want to reset extension?')) {
      chrome.storage.local.clear();
    }
  };

}());
