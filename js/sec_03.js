/** 
* 言語処理100本ノック
* 第03章
* 参考URL(正規表現など変更)：https://qiita.com/pppp403/items/08220614f3d69882b390
*/

var g_england;

/**
記事データを取得し整形
* @class wikiAPI
* @property {has} datas 記事タイトルをキーに持つ整形済みデータ
* @property {string} url 記事データのURL
* @param {strings} x_url 記事データのURL
*/
var wikiAPI = function (x_url) {
  this.datas = [];
  this.url = x_url;

  this.getData = $.ajax({
    url: this.url,
    type: 'GET',
    cache: true,
    context: this,
    dataType: 'text'
  });

  // データクレンジング(q25-29)
  this.setBaseData = (x_targetLine) => {
    // キー配列に変換
    let _name = x_targetLine.replace(/([^=]*?)=[\s\S]*/, "$1").trim();
    let _val = x_targetLine.replace(/.*?=([\s\S]*)/, "$1").trim().replace(/\n/, "");
    // return { _name, _val };
    return { "name": _name, "val": _val };
  }

  /**
   * データの整形
   * @method SHAPING
   * @param {STRING} X_T T 行分割したテキスト
   */
  this.shaping = (x_t) => {
    // カテゴリを抽出(q21, q22)
    x_t.categories = x_t.text.match(/\[\[(カテゴリ|Category):[^\]]*?\]\]/g);
    x_t.cleansingCategories = x_t.text.match(/\[\[(カテゴリ|Category):[^\]]*?\]\]/g);
    if (x_t.categories) {
      for (let j = 0; j < x_t.categories.length; j++) {
        x_t.cleansingCategories[j] = x_t.categories[j].replace(/\[\[(カテゴリ|Category):([^\]]*?)(\|.*)?\]\]/, "$2");
      }
    }

    // セクションを抽出(q23)
    x_t.sections = x_t.text.match(/={2,}( )?[^=]*?( )?={2,}/g);
    if (x_t.sections) {
      for (let j = 0; j < x_t.sections.length; j++) {
        _level = x_t.sections[j].replace(/(={2,}).+/, "$1").length - 1
        x_t.sections[j] = x_t.sections[j].replace(/^={2,}(.*?)={2,}$/, "$1") + "(" + _level + ")";
      }
    }

    // ファイルの抽出(q24)
    x_t.files = x_t.text.match(/\[\[ファイル:[^\]]*?\]\]/g);
    x_t.file = x_t.text.match(/\[\[ファイル:[^\]]*?\]\]/g);
    if (x_t.files) {
      for (var j = 0; j < x_t.files.length; j++) {
        _datas = x_t.files[j].replace(/\[\[ファイル:([^\]]*?)\]\]/, '$1').split("|");
        x_t.file[j] = _datas[0];
        x_t.files[j] = {
          name: _datas[0],
          size: _datas[1],
          alt: _datas[2]
        }
      }
    }

    // 基礎情報(q25-q29)
    if (x_t.text.match(/{{基礎情報[\s\S]*?}}\n/g)) {
      // 基礎情報のスタート位置
      let _lines = x_t.text.match(/\{\{基礎情報[\s\S]*?\}\}\n\n/)[0].replace(/\}\}\n\n/, "").split("\n|");

      // 初期設定
      let _setLines = [];
      let p_vals;
      let _setLinesQ25 = [];
      let _setLinesQ26 = [];
      let _setLinesQ27 = [];

      for (let j = 1; j < _lines.length; j++) {
        let p_targetLine = _lines[j];

        if (j < _lines.length && p_targetLine != "") {
          p_targetLine = p_targetLine.replace(/</g, "&lt;").replace(/>/g, "&gt;");


          // q25
          p_vals = this.setBaseData(p_targetLine);
          _setLinesQ25[p_vals.name] = p_vals.val;

          // q26
          _setLinesQ26[p_vals.name] = p_vals.val.replace(/'{2,5}/g, "");

          // q27
          let _reg = /\[\[(.*?)\]\]/g;
          let _rep = "__reg__link__ptn__";
          let _links = p_targetLine.match(_reg);

          if (_links) {
            p_targetLine = p_targetLine.replace(_reg, _rep);
            for (let k = 0; k < _links.length; k++) {
              let _cnp = _links[k].replace(_reg, "$1").split("|");
            }
          }

          // q28
          p_targetLine = p_targetLine
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
            .replace(/{{[^\|]*?\|/g, "")
            .replace(/}}/g, "")
            .replace(/\[[^\[]*?]/g, "");

          // q28
          p_vals = this.setBaseData(p_targetLine);
          _setLines[p_vals.name] = p_vals.val;
        }
      }
      x_t.baseData = _setLines;
      x_t.baseDataQ25 = _setLinesQ25;
      x_t.baseDataQ26 = _setLinesQ26;
    }
    this.datas[x_t.title] = x_t;
    /**
    * 国旗画像のデータを取得
    * @method getFlagImg
    * @param {string} name 国名
    * @return jsonデータ
    */
    this.getFlagImg = function (x_name) {
      if (this.datas[x_name].baseData["国旗画像"]) {
        return $.ajax({
          url: "https://en.wikipedia.org/w/api.php?action=query&titles=File:" + encodeURIComponent(this.datas[x_name].baseData["国旗画像"]) + '&prop=imageinfo&iiprop=url&format=json',
          type: 'get',
          context: this,
          dataType: 'jsonp'
        });
      }
    }
  }
}

var disp = (x_ary) => {
  p_html = "";
  for (let i = 0; i < x_ary.length; i++) {
    p_html += x_ary[i] + "<br>";
  }
  return p_html;
}

var dispDist = (x_dist) => {
  let p_html = [];
  for (let p_key in x_dist) {
    p_html.push(p_key + "：" + x_dist[p_key]);
  }
  return p_html;
}

$(function () {
  // disp_area を隠す
  $("#disp_area").hide();

  $("#disp_hide").on("click", function () {
    $("#disp_area").hide();
  });

  // イギリスの情報を取得
  let p_wiki = new wikiAPI('jawiki-country.json');
  p_wiki.getData.done(function (_data) {
    let p_list = _data.split("\n");
    for (let i = 0; i < p_list.length; i++) {
      if (p_list[i] != "") {
        var p_parse = JSON.parse(p_list[i]);
        this.shaping(p_parse);
      }
    }
    g_england = this.datas["イギリス"];
  });

  //q20 
  $("#q020").on("click", function () {
    $("#disp_area").text(g_england.text);
    $("#disp_area").show();
  });

  // q21
  $("#q021").on("click", function () {
    // $("#disp_area").text(g_england.categories);
    $("#disp_area").html(disp(g_england.categories));
    $("#disp_area").show();
  });

  // q22
  $("#q022").on("click", function () {
    // $("#disp_area").text(g_england.cleansingCategories);
    $("#disp_area").html(disp(g_england.cleansingCategories));
    $("#disp_area").show();
  });

  // q23
  $("#q023").on("click", function () {
    // $("#disp_area").text(g_england.sections);
    $("#disp_area").html(disp(g_england.sections));
    $("#disp_area").show();
  });

  // q24
  $("#q024").on("click", function () {
    // $("#disp_area").text(g_england.file);
    $("#disp_area").html(disp(g_england.file));
    $("#disp_area").show();
  });

  // q25
  $("#q025").on("click", function () {
    let p_html = dispDist(g_england.baseDataQ25);

    $("#disp_area").html(disp(p_html));
    $("#disp_area").show();
  });

  // q26
  $("#q026").on("click", function () {
    let p_html = dispDist(g_england.baseDataQ26);

    $("#disp_area").html(disp(p_html));
    $("#disp_area").show();
  });
});