/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2019 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported permissions_request */

'use strict';

function permissions_request (root_element, init_func) { // TODO this function have to be removed; permissions are mandatory

  var permissions = {
    permissions: ['bookmarks'],
    origins: ['chrome://favicon/']
  };

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
