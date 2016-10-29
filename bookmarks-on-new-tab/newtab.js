/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome, permissions_request, bind_listeners, url_openner */

'use strict';

(function () {
  window.document.getElementById('options').onclick = url_openner('options.html');
}());

(function () {

  var storage = chrome.storage.local;
  var document = window.document;
  var bookmarks_root_element = document.getElementById('bookmarks');

  function div(c) {
    var e = document.createElement('div');
    e.className = c;
    return e;
  }

  function build_subtree(root_element, childrens, stoplist, is_root) {
    childrens.forEach(function (v) {
      if (is_root) { // left root node
        build_subtree(root_element, v.children, stoplist, false);
        return;
      }
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
        build_subtree(body, v.children, stoplist, false);
      }
    });
  }


  function redraw_tree() {
    storage.get({stoplist: null, root_id: null}, function(value) {
      var stoplist = value.stoplist;
      var root_id = value.root_id;
      if (stoplist === null) {
        stoplist = {};
      }
      var reinit_tree = function (childrens) {
        bookmarks_root_element.innerText = '';
        bookmarks_root_element.onclick = undefined;
        bookmarks_root_element.style.cursor = 'default';
        build_subtree(bookmarks_root_element, childrens, stoplist, true);
      };
      if (root_id === null) {
        chrome.bookmarks.getTree(reinit_tree);
      } else {
        chrome.bookmarks.getSubTree(String(root_id), reinit_tree);
      }
    });
  }

  function show_edit_link() {
    var e = document.getElementById('edit-bookmarks');
    e.style.display = 'inline-block';
    e.onclick = url_openner('chrome://bookmarks/');
  }

  function init_bookmarks() {
    bind_listeners(redraw_tree);
    redraw_tree();
    show_edit_link();
  }

  permissions_request(bookmarks_root_element, init_bookmarks);

}());
