/*
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */

(function () {

  'use strict';

  var storage = chrome.storage.local;
  var document = window.document;
  var bookmarks; // = chrome.bookmarks // but not now
  var stoplist;
  var permissions = {permissions: ['bookmarks']};
  var bookmarks_root_element = document.getElementById('bookmarks');

  function div(c) {
    var e = document.createElement('div');
    e.className = c;
    return e;
  }

  function build_tree(root_id, root_element) {
    bookmarks.getChildren(root_id, function (nn) {
      if (nn.length === 0) {
        return;
      }
      nn.forEach(function (v) {
        var text;
        if (v.url) {
          var img = document.createElement('img');
          img.src = 'chrome://favicon/size/16@1x/' + v.url;
          var item = div('item');
          text = div('jail');
          var label = div('jail-text');
          label.innerText = v.title;
          text.appendChild(img);
          text.appendChild(label);
          item.title = v.title;
          item.appendChild(text);
          item.onclick = function () {
            window.location.href = v.url;
          };
          root_element.appendChild(item);
        } else { // If v.url is missing, it will be a folder.
          var folder = div(stoplist[v.id] ? 'closed-folder' : 'folder');
          var body = div('body');
          var title = div('title');
          text = div('jail');
          text.innerText = v.title;
          title.appendChild(text);
          title.onclick = function () {
            var x = folder.className;
            var tgt;
            if (x === 'folder') {
              tgt = 'closed-folder';
              stoplist[v.id] = true;
            } else {
              tgt = 'folder';
              delete stoplist[v.id];
            }
            storage.set({stoplist: stoplist});
            folder.className = tgt;
          };
          folder.appendChild(title);
          folder.appendChild(body);
          root_element.appendChild(folder);
          build_tree(v.id, body);
        }
      });
    });
  }

  function init_bookmarks() {
    bookmarks_root_element.innerText = '';
    bookmarks_root_element.onclick = undefined;
    bookmarks_root_element.style.cursor = 'default';
    bookmarks = chrome.bookmarks;
    storage.get({stoplist: null}, function(sl) {
      sl = sl.stoplist;
      if (sl === null) {
        sl = {};
      }
      stoplist = sl; // set global
      build_tree('0', bookmarks_root_element);
    });
  }

  chrome.permissions.contains(permissions, function (x) {
    if (x) {
      init_bookmarks();
    } else {
      bookmarks_root_element.innerText = 'bookmarks';
      bookmarks_root_element.onclick = function () {
        chrome.permissions.request(permissions, function (x) {
          if (x) {
            init_bookmarks();
          }
        });
      };
      bookmarks_root_element.style.cursor = 'pointer';
    }
  });

}());
