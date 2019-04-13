/*
 * Ultra light new tab Google chrome extension
 * Copyright (c) 2014-2019 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global permissions_request, bind_bookmarks_listeners, bind_storage_listeners */

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

  var valid_font_sizes = [8, 10, 12, 14, 16, 18, 20];
  var default_font_size = 14;

  function cpan_with_text(text) {
    var e = document.createElement('span');
    e.innerText = text;
    return e;
  }

  function redraw_font_size_selector() {
    chrome.storage.local.get({font_size: default_font_size}, function (value) {
      var font_size = parseInt(value.font_size, 10);
      if (valid_font_sizes.indexOf(font_size) < 0) {
        font_size = default_font_size;
      }
      var element = document.getElementById('font_size');
      var nodes = element.querySelectorAll('div');
      for (var i = 0; i < nodes.length; i++) {
        element.removeChild(nodes[i]);
      }
      valid_font_sizes.forEach(function(v) {
        var e = document.createElement('div');
        e.appendChild(cpan_with_text(v === font_size ? '☑' : '☐'));
        e.appendChild(cpan_with_text(' ' + v + 'px'));
        e.onclick = function () {
          chrome.storage.local.set({font_size: v});
        };
        element.appendChild(e);
      });
    });
  }

  function init_bookmarks() {
    redraw_tree();
    bind_bookmarks_listeners(redraw_tree);
    bind_storage_listeners(redraw_tree);
  }

  redraw_font_size_selector();
  bind_storage_listeners(redraw_font_size_selector);

  permissions_request(bookmarks_root_element, init_bookmarks);

}());
