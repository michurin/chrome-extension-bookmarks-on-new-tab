/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported permissions_request */

'use strict';

function permissions_request (root_element, init_func) {

  var permissions = {permissions: ['bookmarks']};

  chrome.permissions.contains(permissions, function (x) {
    if (x) {
      init_func();
    } else {
      root_element.innerText = 'bookmarks';
      root_element.style.cursor = 'pointer';
      root_element.onclick = function () {
        chrome.permissions.request(permissions, function (x) {
          if (x) {
            init_func();
          }
        });
      };
    }
  });
}
