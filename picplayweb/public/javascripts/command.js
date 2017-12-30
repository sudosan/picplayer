/**
 * https://qiita.com/amamamaou/items/b663e3fae23031431535
 */
 (function () {
  'use strict';

  var
    // コマンドのキーコード
    command = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],

    length = command.length,
    index = 0;

  document.addEventListener('keydown', function (ev) {
    if (ev.keyCode === command[index]) {
      index++;

      if (index >= length) {
        index = 0;

        // 全てのコマンドを入力したら何かする
        download();
      }
    } else {
      // コマンド入力を間違えたらリセット
      index = 0;
    }
  });
})();
