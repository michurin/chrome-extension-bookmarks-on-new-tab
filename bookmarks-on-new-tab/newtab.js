/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */

(function () {

  'use strict';

  var storage = chrome.storage.local;
  var document = window.document;
  var permissions = {permissions: ['bookmarks']};
  var bookmarks_root_element = document.getElementById('bookmarks');

  function div(c) {
    var e = document.createElement('div');
    e.className = c;
    return e;
  }

  function build_tree(root_element, childrens, stoplist) {
    childrens.forEach(function (v) {
      var text;
      if (v.id === '0') { // left root node
        build_tree(root_element, v.children, stoplist);
        return;
      }
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
      } else {
        var folder = div(stoplist[v.id] ? 'closed-folder' : 'folder');
        var body = div('body');
        var title = div('title');
        text = div('jail');
        text.innerText = v.title;
        title.appendChild(text);
        title.title = v.title;
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
        build_tree(body, v.children, stoplist);
      }
    });
  }

  function init_bookmarks() {
    bookmarks_root_element.innerText = '';
    bookmarks_root_element.onclick = undefined;
    bookmarks_root_element.style.cursor = 'default';
    storage.get({stoplist: null}, function(sl) {
      sl = sl.stoplist;
      if (sl === null) {
        sl = {};
      }
      chrome.bookmarks.getTree(function (childrens) {
        build_tree(bookmarks_root_element, childrens, sl);
      });
    });
    var e = document.getElementById('edit-bookmarks');
    e.style.display = 'block';
    e.onclick = function () {
      chrome.tabs.create({
        active: true,
        url: 'chrome://bookmarks/'
      });
    };
    chrome.bookmarks.onChanged.addListener(init_bookmarks);
    chrome.bookmarks.onMoved.addListener(init_bookmarks);
    chrome.bookmarks.onChildrenReordered.addListener(init_bookmarks);
    chrome.bookmarks.onImportEnded.addListener(init_bookmarks);
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
