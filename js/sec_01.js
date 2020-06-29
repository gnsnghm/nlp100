/** 
* 言語処理100本ノック
* 第01章
*/

/**
 * 入力した文字列を反対から出力
 * @param {string} x_str 反対向きにする文字列
 */
function q001(x_str) {
    let p_cb = document.getElementById("q001");
    p_cb.innerHTML = x_str.split("").reverse().join("");
}

let q002 = (x_str) => {
    let p_cb = document.getElementById("q002");

    let p_length = Math.floor(x_str.length / 2);
    let p_initial = 1;
    let p_diff = 2;
    let p_arr = Array.apply(null, new Array(p_length)).map(function(v, i){ return p_initial + (i * p_diff)});

    let p_ans = "";
    for(let i in p_arr) {
        p_ans += x_str.charAt(p_arr[i]);
    }

    p_cb.innerHTML = p_ans;
}

let q003 = (x_str) => {
    let p_cb = document.getElementById("q003");

    let p_strs = x_str.replace(/[.,]/g, "").split(" ");
    let p_arr = Array.apply(null, new Array(p_strs.length)).map(function(v, i){ return 1 + i});

    let p_ans = "";
    for(let i in p_arr) {
        p_ans += p_strs[i].split("").length;
    }

    p_cb.innerHTML = p_ans;
}

let q004 = (x_str) => {
    let p_cb = document.getElementById("q004");

    let p_strs = x_str.replace(/[.,]/g, "").split(" ");
    let p_one = [1, 5, 6, 7, 8, 9, 15, 16, 19];

    let p_ans = {};
    for(let i = 0; i < p_strs.length; i++) {
        p_num = i + 1;
        if(p_one.indexOf(p_num) != -1) {
            p_ans[p_strs[i].slice(0, 1)] = String(i + 1);
        } else {
            p_ans[p_strs[i].slice(0, 2)] = String(i + 1);
        }
    }

    p_html = "{";
    for(let [p_key, p_val] of Object.entries(p_ans)){
        p_html +=  "'" + p_key + "': " + p_val + ", ";
    }
    p_html += "}";
    p_html = p_html.replace(/, }/g, "}")

    p_cb.innerHTML = p_html;
}

let q005 = (x_str) => {
    let p_cb = document.getElementById("q005");

    // 文字 bi-gram
    let p_ans = n_gram(x_str, 2, "char");
    let p_html = "文字 bi-gram：" + dispAry(p_ans) + "<br>";

    // 単語 bi-gram
    p_ans = n_gram(x_str.split(" "), 2, "unit");
    p_html += "単語 bi-gram：" + dispAry(p_ans) + "<br>";

    p_cb.innerHTML = p_html;
}

let dispAry = (x_ans) => {
    let p_html = "{";

    for(let [p_key, p_val] of Object.entries(x_ans)){
        // p_html +=  "'" + p_key + "': " + p_val + ", ";
        p_html +=  "'" + p_val + "', ";
    }
    p_html += "}";
    p_html = p_html.replace(/, }/g, "}")

    return p_html;
}

let n_gram = (x_target, x_n, x_type) => {
    let p_target = x_target;

    let p_ans = [];
    for(let i = 0; i < p_target.length - x_n + 1; i++) {
        p_ans.push(p_target.slice(i, i + x_n));
    }

    let p_ans_dup = p_ans.filter((x, i, self) => self.indexOf(x) === i);

    return p_ans_dup;
}

let ArrayHelper = {
    union:(x_a, x_b) => {
        let p_concat = x_a.concat(x_b);
        p_concat = p_concat.filter((x, i, self) => self.indexOf(x) === i);
        return p_concat;
    },

    intersection:(x_a, x_b) => {
        let p_concat = x_a.concat(x_b);
        p_concat = p_concat.filter((x, i, self) =>
            self.indexOf(x) === i && i !== self.lastIndexOf(x));
        return p_concat;
    },

    difference:(x_a, x_b) => {
        let p_temp = ArrayHelper.intersection(x_a, x_b);
        // let p_concat = x_a.concat(x_b);
        let p_concat = x_a;
        p_concat = p_concat.filter((x, i, self) => p_temp.indexOf(x) == -1);
        return p_concat;
    },

    shuffle:(x_ary) => {
        let p_ary = x_ary;
        for(let i = p_ary.length;  i >= 0; i--) {
            let p_rand = Math.floor(Math.random() * ( (i + 1)));

            // 配列の数値を入れ替える
            [p_ary[i], p_ary[p_rand]] = [p_ary[p_rand], p_ary[i]];
        }
        return p_ary;
    }
}

let q006 = () => {
    let p_cb = document.getElementById("q006");

    let p_x = "paraparaparadise";
    let p_y = "paragraph";

    // 文字 bi-gram
    let p_ans_x = n_gram(p_x, 2, "char");
    let p_html = p_x + " の bi-gram：" + dispAry(p_ans_x) + "<br>";

    // 文字 bi-gram
    p_ans_y = n_gram(p_y, 2, "char");
    p_html += p_y + " の bi-gram：" + dispAry(p_ans_y) + "<br>";

    // 和集合
    let p_ans_union = ArrayHelper.union(p_ans_x, p_ans_y);
    p_html += "和集合：" + dispAry(p_ans_union) + "<br>";

    // 積集合
    let p_ans_intersection = ArrayHelper.intersection(p_ans_x, p_ans_y);
    p_html += "積集合：" + dispAry(p_ans_intersection) + "<br>";

    // 差集合
    let p_ans_difference = ArrayHelper.difference(p_ans_x, p_ans_y);
    p_html += "差集合：" + dispAry(p_ans_difference) + "<br>";

    p_cb.innerHTML = p_html;
}

let q007_disp = (x, y, z) => {
    return x + "時の" + y + "は" + z;
}

let q007 = () => {
    let p_cb = document.getElementById("q007");

    let x = document.getElementById("q007_x").value
    let y = document.getElementById("q007_y").value
    let z = document.getElementById("q007_z").value

    p_cb.innerHTML = q007_disp(x, y, z);
}

let cipher = (x_str) =>{
    let p_ary_decode = [];
    for(i = 0; i < x_str.length; i++) {
        let p_charAt = x_str.charAt(i);
        if(p_charAt.match(/[a-z]/)) {
            let p_code_num = 219 - p_charAt.charCodeAt(0);
            p_ary_decode[i] = String.fromCharCode(p_code_num);
        } else {
            p_ary_decode[i] = p_charAt;
        }
    }
    return p_ary_decode.join("");
}

let q008 = () => {
    let p_cb = document.getElementById("q008");
    let p_str = document.getElementById("q008_str").value;

    p_ans = cipher(p_str);

    p_cb.innerHTML = "暗号化：" + p_ans + "<br>";
    p_cb.innerHTML += "複合化：" + p_str;
}

let q009 = () => {
    let p_cb = document.getElementById("q009");
    let p_str = document.getElementById("q009_str").value;

    let p_slice = p_str.replace(/(.)\s+([.,])/g, "$1$2").slice(" ").split(" ");

    let p_ans = [];
    if(p_slice.slice(" ").length >= 4) {
        p_ans.push(p_slice.slice(0, 1));
        p_ans.push(ArrayHelper.shuffle(p_slice.slice(1, p_slice.length - 1)).join(" "));
        p_ans.push(p_slice.slice(-1));
    } else {
        p_ans = p_slice;
    }

    p_cb.innerHTML = p_ans.join(" ");
}