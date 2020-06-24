/** 
* 言語処理100本ノック
* 第03章
* 参考URL(ほぼコピペ)：https://qiita.com/pppp403/items/08220614f3d69882b390
*/

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

  /**
   * データの整形
   * @METHOD SHAPING
   * @PARAM {STRING} X_T T 行分割したテキスト
   */
  this.shaping = (x_t) => {
    // カテゴリを抽出(q21, q22)
    x_t.categories = x_t.text.match(/\[\[カテゴリ:[^\]]*?\]\]/g);
    if (x_t.categolies) {
      for (let j = 0; j < x_t.categories.length; j++) {
        x_t.categolies[j] = x_t.categolies[j].replace(/\[\[カテゴリ:([^\]]*?)\]\]/, "$1");
      }
    }

    // セクションを抽出(q23)
    let p_match_section = /={2,} [^=]*? ={2,}/g;
    x_t.sections = x_t.text.match(/={2,} [^=]*? ={2,}/g);
    if (x_t.sections) {
      for (let j = 0; j < x_t.sections.length; j++) {
        _level = x_t.sections[j].replace(/(={2,}).+/, "$1").length - 1
        x_t.sections[j] = {
          level: _level,
          name: x_t.sections[j].replace(/^={2,} (.*?) ={2,}/, "$1")
        }
      }
    }

    // ファイルの抽出(q24)
    x_t.files = x_t.text.match(/\[\[ファイル:[^\]]*?\]\]/g);
    if (x_t.files) {
      for (var j = 0; j < x_t.files.length; j++) {
        _datas = x_t.files[j].replace(/\[\[ファイル:([^\]]*?)\]\]/, '$1').split("|");
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
      let _lines = x_t.text.replace(/[\s\S]*{{基礎情報 国([\s\S]*)/g, "$1").replace(/\|\n/g, "\n|").split("\n|");
      let _setLines = [];

      for (let j = 0; j < _lines.length; j++) {
        let p_targetLine = _lines[j];

        // q25
        p_targetLine = p_targetLine.trim().replace("|", "");

        // 基礎状況のエンド位置
        if (p_targetLine.indexOf("}}\n") == 0) {
          j = _lines.length + 1;
        }
        if (j < _lines.length && p_targetLine != "") {
          // q26
          p_targetLine = p_targetLine.replace(/'{2,}/g, '');
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

          // キー配列に変換
          let _name = p_targetLine.replace(/([^=]*?)=[\s\S]*/, "$1").trim();
          let _val = p_targetLine.replace(/.*?=([\s\S]*)/, "$1").trim().replace(/\n/, "");
          _setLines[_name] = _val;
        }
      }
      x_t.baseData = _setLines;
    }
    this.datas[x_t.title] = x_t;
    /**
    * 国旗画像のデータを取得
    * @method getFlagImg
    * @param {string} name 国名
    * @return jsonデータ
    */
    this.getFlagImg = function (name) {
      if (this.datas[name].baseData["国旗画像"]) {
        return $.ajax({
          url: "https://en.wikipedia.org/w/api.php?action=query&titles=File:" + encodeURIComponent(this.datas[name].baseData["国旗画像"]) + '&prop=imageinfo&iiprop=url&format=json',
          type: 'get',
          context: this,
          dataType: 'jsonp'
        });
      }
    }
  }
}

$(function () {
  let p_wiki = new wikiAPI('jawiki-country.json');
  p_wiki.getData.done(function (_data) {
    let p_list = _data.split("\n");
    for (let i = 0; i < p_list.length; i++) {
      if (p_list[i] != "") {
        var p_parse = JSON.parse(p_list[i]);
        this.shaping(p_parse);
      }
    }
    // console.log(this.datas["イギリス"]);
    p_info = this.datas["イギリス"];
  })
})

$(function () {
  $("#q020_area").hide();
  // 指定ボタンを押下すると処理を開始する
  $("#q020").on("click", function () {
    let p_wiki = new wikiAPI('jawiki-country.json');
    p_wiki.getData.done(function (_data) {
      let p_list = _data.split("\n");
      for (let i = 0; i < p_list.length; i++) {
        if (p_list[i] != "") {
          var p_parse = JSON.parse(p_list[i]);
          this.shaping(p_parse);
        }
      }
      $("#q020_area").text(this.datas["イギリス"].text); // div領域を表示
      // $("#q020_area").html("ゆかりさんは天才ですから"); // div領域を表示
      $("#q020_area").show(); // div領域を表示
    });
  });
  $("#q020_hide").on("click", function () {
      $("#q020_area").hide();
  });
});