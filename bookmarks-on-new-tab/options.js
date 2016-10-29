/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome, permissions_request, bind_listeners */

(function () {

  'use strict';

  var document = window.document;
  var bookmarks_root_element = document.getElementById('bookmarks');

  function empty_div(class_name) {
    var e = document.createElement('div');
    if (class_name) {
      e.className = class_name;
    }
    return e;
  }

  function title_div(title, id) {
    var r = empty_div();
    var e = empty_div('title');
    e.innerText = title;
    e.onclick = function () {
      chrome.storage.local.set({root_id: id});
    };
    r.appendChild(e);
    return r;
  }

  function item_elemets(title, id) {
    var body = empty_div('body');
    var container = empty_div();
    container.appendChild(title_div(title, id));
    body.appendChild(container);
    body.appendChild(empty_div('decor_long'));
    body.appendChild(empty_div('decor_angle'));
    return {
      body: body,
      container: container
    };
  }

  function activate(cond, element) {
    if (cond) {
      element.className = 'actives';
    }
  }

  function bld_subtree(outer_element, childrens, level, root_id) {
    if (level === 0) {
      var v = childrens[0];
      var holder = empty_div(); // holder is item.container but without any uplinks
      outer_element.appendChild(holder);
      holder.appendChild(title_div('All', v.id));
      activate(v.id === root_id, holder);
      bld_subtree(holder, v.children, 1, root_id);
      return;
    }
    childrens.forEach(function (v) {
      if (v.url) {
        return;
      }
      var item = item_elemets(v.title, v.id);
      outer_element.appendChild(item.body);
      activate(v.id === root_id, item.container);
      bld_subtree(item.container, v.children, 1, root_id);
    });
  }

  function redraw_tree() {
    chrome.storage.local.get({root_id: null}, function(value) {
      var root_id = value.root_id;
      var in_root = false;
      if (root_id === null) {
        in_root = true;
        root_id = '0';
      } else {
        root_id = String(root_id); // ids are strings
      }
      chrome.bookmarks.getTree(function (childrens) {
        bookmarks_root_element.innerText = '';
        bld_subtree(bookmarks_root_element, childrens, 0, root_id);
      });
    });
  }

  function init_bookmarks() {
    bind_listeners(redraw_tree);
    redraw_tree();
  }

  permissions_request(bookmarks_root_element, init_bookmarks);

}());
