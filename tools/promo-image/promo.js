/*jslint vars: true, indent: 2, plusplus: true */
/*global document */


(function () {

  'use strict';

  function star(ctx, x, y, r_in, r_out, ang, c1, c2) {
    var n, r, a, gr;

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(Math.PI + ang * Math.PI / 180);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;

    ctx.beginPath();
    for (n = 0; n < 10; n++) {
      r = n % 2 ? r_in : r_out;
      a = Math.PI * n / 5;
      ctx.lineTo(r * Math.sin(a), r * Math.cos(a));
    }
    ctx.closePath();
    ctx.stroke();
    gr = ctx.createLinearGradient(0, -50, 0, 50);
    gr.addColorStop(0, c1);
    gr.addColorStop(1, c2);
    ctx.fillStyle = gr;
    ctx.fill();

    ctx.restore();
  }

  var c = document.getElementById('main');
  var ctx = c.getContext('2d');
  var gr, x;

  // bg
  gr = ctx.createLinearGradient(0, 6, 0, 60 - 6);
  gr.addColorStop(1, '#6699ff');
  gr.addColorStop(0, '#3366cc');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 440, 280);

  // box
  gr = ctx.createLinearGradient(0, 6, 0, 280 - 6);
  gr.addColorStop(0, '#cccccc');
  gr.addColorStop(1, '#999999');
  ctx.fillStyle = gr;
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(6, 60);
  ctx.lineTo(6, 280 - 6);
  ctx.lineTo(440 - 6, 280 - 6);
  ctx.lineTo(440 - 6, 60);
  ctx.lineTo(440 - 90, 60);
  ctx.quadraticCurveTo(440 - 90, 6, 440 - 90 - 60 + 6, 6);
  ctx.lineTo(60 - 6, 6);
  ctx.quadraticCurveTo(6, 6, 6, 60);
  ctx.fill();
  ctx.stroke();
  // box tabs
  ctx.beginPath();
  for (x = 40; x <= 180; x += 40) {
    ctx.moveTo(0, 60);
    ctx.lineTo(x, 60);
    ctx.quadraticCurveTo(x, 6, x + 60 - 6, 6);
    ctx.stroke();
  }

  // stars
  star(ctx, 104, 180, 45, 100, -14, '#ffaa00', '#ffff00');
  star(ctx, 440 - 104, 186, 45, 100, 9, '#ffaa00', '#ffff00');
  star(ctx, 440 / 2, 155, 45 + 5, 100 + 5, -4, '#ffaa00', '#ffff00'); // middle

  // *** icon
  c = document.getElementById('icon');
  ctx = c.getContext('2d');
  //star(ctx, 200, 200, 45 + 5, 100 + 5, 0, '#ffaa00', '#ffff00');
  //star(ctx, 200, 200, 45 + 5, 100 + 5, 0, '#aaaaaa', '#ffffff');

  ctx.strokeStyle = '#444';
  ctx.fillStyle = '#444';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 40;
  ctx.beginPath();
  ctx.translate(20, 20);
  ctx.moveTo(0, 50);
  ctx.lineTo(50, 0);
  ctx.lineTo(150, 0);
  ctx.lineTo(200, 50);
  ctx.lineTo(300, 50);
  ctx.lineTo(300, 300);
  ctx.lineTo(0, 300);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = 30;
  ctx.translate(150, 180);
  ctx.rotate(Math.PI);
  ctx.beginPath();
  var r_in = 50;
  var r_out = 110;
  var n, r, a;
  for (n = 0; n < 10; n++) {
    r = n % 2 ? r_in : r_out;
    a = Math.PI * n / 5;
    ctx.lineTo(r * Math.sin(a), r * Math.cos(a));
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

}());
