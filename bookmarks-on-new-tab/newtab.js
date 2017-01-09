/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2017 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global permissions_request, bind_bookmarks_listeners, bind_storage_listeners, url_openner */

'use strict';

(function () {
  window.document.getElementById('options').onclick = url_openner('options.html');
}());

(function () {

  var storage = chrome.storage.local;
  var document = window.document;
  var bookmarks_root_element = document.getElementById('bookmarks');
  var body_element = document.getElementsByTagName('body')[0];

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

  function set_font_size() {
    storage.get({font_size: 16}, function(value) {
      var font_size = Math.min(20, Math.max(8, parseInt(value.font_size, 10)));
      body_element.style.fontSize = font_size + 'px';
    });
  }

  function init_bookmarks() {
    show_edit_link();
    redraw_tree();
    bind_bookmarks_listeners(redraw_tree);
    bind_storage_listeners(redraw_tree);
  }

  bind_storage_listeners(set_font_size);

  set_font_size();

  permissions_request(bookmarks_root_element, init_bookmarks);

}());
