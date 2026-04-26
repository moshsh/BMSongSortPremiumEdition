// 2008/7/3 Scripted by K-Factory@migiwa
// 2008/7/19 Modified by  K-Factory@migiwa
// ・イラストのランダム化
// ・BugFix
// 2008/7/25 Modified by  K-Factory@migiwa
// ・ランキングにイラスト表示
// ・メンテナンス用PG追加
// ・BugFix
// 2009/1/27 Modified by  K-Factory@migiwa
// ・絵の表示ON/OFF追加
// ・高速化処理追加
// 2009/9/8 Modified by  K-Factory@migiwa
// ・タイトル分類の変更
// 2013/1/22 Modified by Anonymous
// added undo function (requires minor changes in index.html and fnc_data.js)

// 実行コードです。
// 修正する場合は気をつけてください。
var ary_TempData = new Array();
var ary_SortData = new Array();
var ary_ParentData = new Array();
var ary_EqualData = new Array();
var int_LeftList, int_LeftID;
var int_RightList, int_RightID;
var ary_RecordData = new Array();
var int_RecordID = 0;

var csort = new Array();
var csort2 = new Array();
var csort3 = new Array();
var csort4 = new Array();
var csort5 = new Array();
var csort6 = new Array();

var int_Count = 0;
var int_Total = 0;
var int_Completed = 0;
var int_Status = 0;
var progressGaugeId = 'progressGauge';
var iGM = 100;

var back_ary_SortData = new Array();
var back_ary_EqualData = new Array();
var back_ary_RecordData = new Array();
var back_int_RecordID = 0;
//var back_ary_TempData = new Array();
var back_ary_ParentData = new Array();

var back_int_Completed = 0;
var back_int_Total = 0;
var back_int_RightList = int_RightList;
var back_int_RightID = int_RightID;
var back_int_LeftList = int_LeftList;
var back_int_LeftID = int_LeftID;
var maxRows = 25;
var bmScore = 0;
var mrScore = 0;
var mgScore = 0;
var tooScore = 0;
var mfScore = 0;
const maxValue = 4;
var onlyMainAlbums = true;

// *****************************************************************************
// * StartUp
// * <BODY>タグの読み込み終了時に実行。
// * Execute when the <BODY> tag has finished loading
function startup() {
    var albumSelectTable = document.getElementById('albumSelectTable');
    createAlbumCheckboxes(albumSelectTable);
    document.getElementById('displayImagesWhileSorting').disabled = false;

    createSelectAllAndDisplayImagesWhileSortingButtons()

    if (!bln_ProgessBar) createProgressGauge(progressGaugeId, iGM, iGM);
}

function createAlbumCheckboxes(albumSelectTable) {
    var tbl_body_Select = document.createElement('tbody');
    albumSelectTable.appendChild(tbl_body_Select);

    // タイトルから選択用チェックボックスに変換
    // Convert from title to selection checkbox
    for (i = 0; i < albumTitleArray.length; i++) {
        // Row[i]
        if ((i % albumSelectTableColumnCount) == 0) {
            var new_row = tbl_body_Select.insertRow(tbl_body_Select.rows.length);
            new_row.id = 'optSelRow' + i;
        }
        // Col[0]
        var new_cell = new_row.insertCell(new_row.childNodes.length);
        var new_CheckBox = document.createElement('input');
        new_CheckBox.setAttribute('type', 'checkbox', 0);
        new_CheckBox.value = albumTitleArray[i];
        new_CheckBox.title = albumTitleArray[i];
        if (new_CheckBox.value == 'BABYMETAL (2014)' || new_CheckBox.value == 'METAL RESISTANCE (2016)'
            || new_CheckBox.value == 'METAL GALAXY (2019)' || new_CheckBox.value == 'THE OTHER ONE (2023)'
            || new_CheckBox.value == 'METAL FORTH (2025)') {
            new_CheckBox.setAttribute('checked', 'true', 0);
        }
        new_CheckBox.id = 'optSelect' + i;
        new_cell.appendChild(new_CheckBox);
        new_cell.style = "width: 10vw;";

        var new_span = document.createElement('span');
        const fullText = albumTitleArray[i];

        // Find the last " (" which separates title and year
        const splitIndex = fullText.lastIndexOf(" (");

        const title = fullText.substring(0, splitIndex);
        const year = fullText.substring(splitIndex); // keeps parentheses

        // Append TITLE
        new_span.appendChild(document.createTextNode(title));

        // Append <br>
        if (splitIndex > 0) {
            new_span.appendChild(document.createElement("br"));
        }

        // Append (YEAR)
        new_span.appendChild(document.createTextNode("    " + year));
        new_span.title = albumTitleArray[i];
        new_span.id = i;
        new_span.setAttribute('class', 'cbox', 0);
        new_span.className = 'cbox';
        new_span.onclick = function () { chgFlag(this.id); }
        new_cell.appendChild(new_span);
    }
}

function createSelectAllAndDisplayImagesWhileSortingButtons() {

    var displayImagesWhileSortingFooter = document.createElement('tfoot');
    albumSelectTable.appendChild(displayImagesWhileSortingFooter);

    // Row[0]
    var new_row = displayImagesWhileSortingFooter.insertRow(displayImagesWhileSortingFooter.rows.length);
    new_row.setAttribute('class', "opt_foot", 0);
    new_row.className = "opt_foot";

    var new_cell = new_row.insertCell(new_row.childNodes.length);
    new_cell.setAttribute('colspan', albumSelectTableColumnCount);
    new_cell.style = 'text-align: center; vertical-align: middle;padding-top: 10px;'
    var new_CheckBox = document.createElement('input');
    new_CheckBox.setAttribute('type', 'checkbox', 0);
    new_CheckBox.setAttribute('checked', 'true', 0);
    new_CheckBox.value = "All";
    new_CheckBox.title = "Check/uncheck all boxes";
    new_CheckBox.id = 'optSelect_all';
    new_CheckBox.onclick = function () { chgAll(); }
    new_cell.appendChild(new_CheckBox);

    var new_span = document.createElement('span');
    new_span.appendChild(document.createTextNode("Select All"));
    new_cell.appendChild(new_span);
}

function chgAll() {
    for (i = 0; i < albumTitleArray.length; i++) {
        document.getElementById('optSelect' + i).checked = document.getElementById('optSelect_all').checked;
    }
}

// *****************************************************************************
// * chgFlag
// * タイトル名がクリックされてもチェックボックスを変更する。
// * Changing the checkbox when the title is clicked.
function chgFlag(int_id) {
    var obj_Check = document.getElementById('optSelect' + int_id);
    if (!obj_Check.disabled) {
        obj_Check.checked = (obj_Check.checked) ? false : true;
    }
}

// *****************************************************************************
// * Initialize
// * 使用する配列や、カウンターを初期化する
// * 初回のみ動作。
// * Initialise the arrays and counters to be used
// * Runs only on the first execution.
function init() {
    int_Total = 0;
    int_RecordID = 0;

    // ソート対象のみを抽出
    // Extract only the items to be sorted
    for (i = 0; i < ary_CharacterData.length; i++) {
        for (j = 0; j < albumTitleArray.length; j++) {
            if (document.getElementById('optSelect' + j).checked && (ary_CharacterData[i][2][j] == 1)) {
                ary_TempData[int_Total] = ary_CharacterData[i];
                int_Total++;
                break;
            }
        }
    }

    if (int_Total == 0) {
        alert("Please make a selection.");
        return;
    } else {
        for (i = 0; i < albumTitleArray.length; i++) {
            document.getElementById('optSelect' + i).disabled = true;
            document.getElementById('optSelect' + i).style.dsiplay = 'none';
        }
        document.getElementById('displayImagesWhileSorting').disabled = true;
    }

    int_Total = 0;

    // ソート配列にIDを格納する
    // Store IDs in the sorted array
    ary_SortData[0] = new Array();
    for (i = 0; i < ary_TempData.length; i++) {
        ary_SortData[0][i] = i;

        // 保存用配列
        // Array for storage
        ary_RecordData[i] = 0;
    }

    var int_Pointer = 1;
    for (i = 0; i < ary_SortData.length; i++) {
        // #ソートは基本ロジックを流用
        // 要素数が２以上なら２分割し、
        // 分割された配列をary_SortDataの最後に加える
        // Sorting reuses the core logic
        // If the number of elements is two or more, divide into two parts
        // and append the split arrays to the end of ary_SortData
        if (ary_SortData[i].length >= 2) {
            var int_Marker = Math.ceil(ary_SortData[i].length / 2);
            ary_SortData[int_Pointer] = ary_SortData[i].slice(0, int_Marker);
            int_Total += ary_SortData[int_Pointer].length;
            ary_ParentData[int_Pointer] = i;
            int_Pointer++;

            ary_SortData[int_Pointer] = ary_SortData[i].slice(int_Marker, ary_SortData[i].length);
            int_Total += ary_SortData[int_Pointer].length;
            ary_ParentData[int_Pointer] = i;
            int_Pointer++;
        }
    }

    // 引き分けの結果を保存するリスト
    // キー：リンク始点の値
    // 値 ：リンク終点の値
    // List storing draw results
    // Key: Value at link start point
    // Value: Value at link end point
    for (i = 0; i <= ary_TempData.length; i++) {
        ary_EqualData[i] = -1;
    }

    int_LeftList = ary_SortData.length - 2;
    int_RightList = ary_SortData.length - 1;
    int_LeftID = 0;
    int_RightID = 0;
    int_Count = 1;
    int_Completed = 0;

    // イニシャライズが終了したのでステータスを1に変更
    // Initialisation has completed, so change the status to 1
    int_Status = 1;

    document.getElementById('fldMiddleT').innerHTML = str_CenterT;
    document.getElementById('fldMiddleB').innerHTML = str_CenterB;

    fnc_ShowData();
}

// *****************************************************************************
// * Image Initialize
// * メンテナンス用リスト
// * Maintenance list
function imginit() {
    var int_ImgCount = 0;
    var int_ImgValue = 0;
    var int_ImgMax = 0;

    var tbl_Image_body = document.getElementById('imgTable');

    for (i = 0; i < ary_CharacterData.length; i++) {
        new_row = tbl_Image_body.insertRow(tbl_Image_body.rows.length);

        // Col[0]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        new_cell.appendChild(document.createTextNode(i));
        new_cell.setAttribute('class', 'resTableL', 0);
        new_cell.className = 'resTableL';
        // Col[1]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        new_cell.appendChild(document.createTextNode(ary_CharacterData[i][1]));
        new_cell.setAttribute('class', 'resTableR', 0);
        new_cell.className = 'resTableR';

        // Col[2]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        for (j = 0; j < albumTitleArray.length; j++) {
            if (ary_CharacterData[i][2][j] == 1) {
                new_cell.appendChild(document.createTextNode(albumTitleArray[j]));
                new_cell.appendChild(document.createElement('br'));
            }
        }
        new_cell.setAttribute('class', 'resTableR', 0);
        new_cell.className = 'resTableR';

        // Col[3]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        new_cell.setAttribute('class', 'resTableR', 0);
        new_cell.className = 'resTableR';

        if (ary_CharacterData[i][3].length > 0) {
            for (j = 3; j < ary_CharacterData[i].length; j++) {
                var new_img = document.createElement('img');
                new_img.src = str_ImgPath + ary_CharacterData[i][j];
                new_cell.appendChild(new_img);
                int_ImgCount++;
            }
            int_ImgValue++;
        }
        int_ImgMax++;
    }

    document.getElementById("lbl_imgCount").innerHTML = int_ImgCount;
    document.getElementById("lbl_imgParcent").innerHTML = Math.floor((int_ImgValue / int_ImgMax) * 100);
    document.getElementById("lbl_imgValue").innerHTML = int_ImgValue;
    document.getElementById("lbl_imgMax").innerHTML = int_ImgMax;
}

// Undo previous choice (

function fnc_Undo() {
    if (int_Status == 0) {
        fnc_Sort(0);
        return;
    }

    if (int_Count > 2 && int_Completed != back_int_Completed) {

        //ary_TempData = back_ary_TempData.slice(0);
        ary_SortData = back_ary_SortData.slice(0);
        ary_RecordData = back_ary_RecordData.slice(0);
        int_RecordID = back_int_RecordID;
        ary_EqualData = back_ary_EqualData.slice(0);
        ary_ParentData = back_ary_ParentData.slice(0);

        int_Completed = back_int_Completed;
        int_Count = int_Count - 2;
        int_Total = back_int_Total;
        int_RightList = back_int_RightList;
        int_RightID = back_int_RightID;
        int_LeftList = back_int_LeftList;
        int_LeftID = back_int_LeftID;
        int_Status = (int_LeftList < 0) ? 2 : 1;

        fnc_ShowData();
    }
}

/* Debugging purposes (simulates choosing Tie until completion)

function fnc_TieRest(){
    while(int_Status < 2){
        fnc_Sort(0);
    }
}
*/

// *****************************************************************************
// * Sort (-1:左側, 0:引き分け, 1:右側)
// * Sort (-1: left side, 0: draw, 1: right side)

function fnc_Sort(int_SelectID) {

    //back_ary_TempData = ary_TempData.slice(0);	
    back_ary_SortData = ary_SortData.slice(0);
    back_ary_RecordData = ary_RecordData.slice(0);
    back_int_RecordID = int_RecordID;
    back_ary_EqualData = ary_EqualData.slice(0);
    back_ary_ParentData = ary_ParentData.slice(0);

    back_int_Completed = int_Completed;
    back_int_Total = int_Total;
    back_int_RightList = int_RightList;
    back_int_RightID = int_RightID;
    back_int_LeftList = int_LeftList;
    back_int_LeftID = int_LeftID;

    // ステータスにより処理を分岐
    // Process based on status
    switch (int_Status) {
        case 0:
            // 初回クリック時、ソート情報を初期化する。
            // Initialise sort information on the first click.
            init();
        case 2:
            // ソートが終了していた場合、ソート処理は行わない。
            // If sorting has already been completed, no sorting processing is performed.
            return;
        default:
    }

    // ary_RecordDataに保存
    // 左側Count
    // Save to ary_RecordData
    // Left Count
    if (int_SelectID != 1) {
        fnc_CountUp(0);
        while (ary_EqualData[ary_RecordData[int_RecordID - 1]] != -1) {
            fnc_CountUp(0);
        }
    }

    // 引き分けの場合のみ
    // In the event of a draw only
    if (int_SelectID == 0) {
        ary_EqualData[ary_RecordData[int_RecordID - 1]] = ary_SortData[int_RightList][int_RightID];
    }

    // 右側Count
    // Right Count
    if (int_SelectID != -1) {
        fnc_CountUp(1);
        while (ary_EqualData[ary_RecordData[int_RecordID - 1]] != -1) {
            fnc_CountUp(1);
        }
    }

    // 片方のリストを走査し終えた後の処理
    // Processing after traversing one of the lists
    if (int_LeftID < ary_SortData[int_LeftList].length && int_RightID == ary_SortData[int_RightList].length) {
        // リストint_RightListが走査済 - リストint_LeftListの残りをコピー
        // List int_RightList has been traversed - Copy the remainder of list int_LeftList
        while (int_LeftID < ary_SortData[int_LeftList].length) {
            fnc_CountUp(0);
        }
    } else if (int_LeftID == ary_SortData[int_LeftList].length && int_RightID < ary_SortData[int_RightList].length) {
        // リストint_LeftListが走査済 - リストint_RightListの残りをコピー
        // List int_LeftList has been traversed - Copy the remainder of list int_RightList
        while (int_RightID < ary_SortData[int_RightList].length) {
            fnc_CountUp(1);
        }
    }

    //両方のリストの最後に到達した場合は
    //親リストを更新する
    // When reaching the end of both lists
    // Update the parent list
    if (int_LeftID == ary_SortData[int_LeftList].length && int_RightID == ary_SortData[int_RightList].length) {
        for (i = 0; i < ary_SortData[int_LeftList].length + ary_SortData[int_RightList].length; i++) {
            ary_SortData[ary_ParentData[int_LeftList]][i] = ary_RecordData[i];
        }

        ary_SortData.pop();
        ary_SortData.pop();
        int_LeftList = int_LeftList - 2;
        int_RightList = int_RightList - 2;
        int_LeftID = 0;
        int_RightID = 0;
        //新しい比較を行う前にary_RecordDataを初期化
        // Initialise ary_RecordData before performing a new comparison
        if (int_LeftID == 0 && int_RightID == 0) {
            for (i = 0; i < ary_TempData.length; i++) {
                ary_RecordData[i] = 0;
            }
            int_RecordID = 0;
        }
    }

    // 終了チェック
    // Termination check
    int_Status = (int_LeftList < 0) ? 2 : 1;

    fnc_ShowData();
}

// *****************************************************************************
// * CountUp(0:左側 1:右側)
// * 選択された方をカウントアップする。
// * CountUp(0:Left 1:Right)
// * Increments the selected side.
function fnc_CountUp(int_Select) {
    ary_RecordData[int_RecordID] = ary_SortData[((int_Select == 0) ? int_LeftList : int_RightList)][((int_Select == 0) ? int_LeftID : int_RightID)];

    if (int_Select == 0) {
        int_LeftID++;
    } else {
        int_RightID++;
    }

    int_RecordID++;
    int_Completed++;
}

// *****************************************************************************
// * ShowData
// * 進捗率と名前を表示する。
// * ShowData
// * Display the progress rate and name.
function fnc_ShowData() {



    document.getElementById("lblCount").innerHTML = int_Count;
    document.getElementById("lblProgress").innerHTML = Math.floor(int_Completed * 100 / int_Total);
    if (!bln_ProgessBar) eGR(progressGaugeId, Math.floor(int_Completed * 100 / int_Total));

    if (int_Status == 2) {
        // 判定が終了していた場合、結果表示。
        // If the determination has concluded, display the result.
        var int_Result = 1;

        var tbl_Result = document.createElement('table');
        tbl_Result.classList.add('resTable');

        var tbl_head_Result = document.createElement('thead');
        tbl_Result.appendChild(tbl_head_Result);

        new_row = tbl_head_Result.insertRow(tbl_head_Result.rows.length);

        // Col[0]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        new_cell.setAttribute('class', 'resTableH', 0);
        new_cell.className = 'resTableH';
        new_cell.appendChild(document.createTextNode('Order'));
        // Col[1]
        new_cell = new_row.insertCell(new_row.childNodes.length);
        new_cell.setAttribute('class', 'resTableH', 0);
        new_cell.className = 'resTableH';
        new_cell.appendChild(document.createTextNode('Name'));

        var tbl_body_Result = document.createElement('tbody');
        tbl_Result.appendChild(tbl_body_Result);

        var int_Same = 1;

        var obj_SelectItem = document.getElementById("resultField");
        obj_SelectItem.innerHTML = "";
        obj_SelectItem.appendChild(tbl_Result);

        for (i = 0; i < ary_TempData.length; i++) {
            var rowId = i;
            new_row = tbl_body_Result.insertRow(tbl_body_Result.rows.length);

            // Col[0]
            new_cell = new_row.insertCell(new_row.childNodes.length);
            new_cell.setAttribute('class', 'resTableL', 0);
            new_cell.className = 'resTableL';
            new_cell.appendChild(document.createTextNode(int_Result));

            csort2[i] = int_Result; // v2a

            // Col[1]
            new_cell = new_row.insertCell(new_row.childNodes.length);
            new_cell.setAttribute('class', 'resTableR', 0);
            new_cell.className = 'resTableR';

            var bln_imgFlag = false;
            if ((int_ResultImg != 0) && (i < int_ResultRank)) {
                var new_img = document.createElement('img');
                var obj_TempData = ary_TempData[ary_SortData[0][i]];

                if (obj_TempData[3].length > 0) {
                    new_img.src = str_ImgPath + obj_TempData[Math.floor(Math.random() * (obj_TempData.length - 3)) + 3];
                    new_cell.appendChild(new_img);
                    new_cell.appendChild(document.createElement('br'));
                    bln_imgFlag = true;
                }
            }

            if ((int_ResultImg == 2) || (!bln_imgFlag)) {
                new_cell.appendChild(document.createTextNode(ary_TempData[ary_SortData[0][i]][1]));
                csort4[i] = ary_TempData[ary_SortData[0][i]][1]; // v2a
                csort6[i] = ary_TempData[ary_SortData[0][i]][1]; // v2a
            }

            if (i < ary_TempData.length - 1) {
                if (bln_ResultMode == 0) {
                    if (ary_EqualData[ary_SortData[0][i]] == ary_SortData[0][i + 1]) {
                        int_Result++;
                    }
                } else {
                    if (ary_EqualData[ary_SortData[0][i]] == ary_SortData[0][i + 1]) {
                        int_Same++;
                    } else {
                        int_Result += int_Same;
                        int_Same = 1;
                    }
                }
            }

            // Break up results into a new table after every [maxRows] results,
            // or at the transition point between image and imageless results.
            // Do not break in the middle of image results.
            var cutoff = int_ResultRank - 1
            if (rowId >= cutoff &&
                rowId == cutoff ||
                (rowId - cutoff) % maxRows == 0) {

                tbl_Result = document.createElement('table');
                tbl_Result.classList.add('resTable');
                tbl_body_Result = document.createElement('tbody');
                tbl_Result.appendChild(tbl_body_Result);
                obj_SelectItem.appendChild(tbl_Result);
            }
        }

        if (bln_ResultStyle == 1) {
            document.getElementById("mainTable").style.display = 'none';
        }
        if (bln_ResultStyle == 0) {
            document.getElementById("ranTable").style.display = 'inline';
        } // v2a

        // v2a start

        for (i = 0; i < 10; i++) {
            if (csort4[i] == undefined) {
                break;
            }
            else {
                csort += csort2[i];
                csort += '位： ';
                csort4[i] = csort4[i].replace(/・(.*)/g, "");
                csort += csort4[i];
                csort += '　';
            }
        }

        for (i = 0; i < 130; i++) {
            if (csort4[i] == undefined) {
                break;
            }
            else {
                csort5 += csort2[i];
                csort5 += '. ';
                csort5 += csort6[i];
                csort5 += '<br>';
            }
        }

        //csort6 = ["Babymetal Death", "Megitsune", "Gimme Chocolate!!", "line!", "Akatsuki", "Doki Doki☆Morning", "Onedari Daisakusen", "4 no Uta", "Uki Uki★Midnight",
        //    "Catch Me If You Can", "Rondo of Nightmare", "Headbangeeeeerrrrr!!!!!", "Ijime, Dame, Zettai", "Road of Resistance", "Karate", "Awadama Fever", "Yava!", "Amore",
        //    "Meta Taro", "Syncopation", "From Dusk Till Dawn", "GJ!", "Sis. Anger", "No Rain, No Rainbow", "Tales of the Destinies", "The One", "The One (English ver.)", "In The Name Of",
        //    "Distortion", "Kagerou / Tattoo", "Elevator Girl", "Elevator Girl (English ver.)", "Starlight", "PA-PA-YA", "Shanti Shanti Shanti", "Arkadia", "Shine", "Future Metal",
        //    "DA DA DANCE (feat. Tak Matsumoto)", "Oh! MAJINAI (feat. Joakim Brodén)", "Brand New Day (feat. Tim Henson & Scott LePage)", "Night Night Burn!", "↑↓←→BBAB", "BxMxC",
        //    "Metal Kingdom", "Divine Attack -Shingeki-", "Mirror Mirror", "Maya", "Time Wave", "Believing", "Metalizm", "Monochrome", "Light and Darkness", "The Legend",
        //    "from me to u (feat. Poppy)", "RATATATA (x Electric Callboy)", "3 no Uta (x Slaughter to Prevail)", "Kon! Kon! (feat. Bloodywood)", "KxAxWxAxIxI", "Sunset Kiss (feat. Polyphia)",
        //    "My Queen (feat. Spiritbox)", "Algorism", "METALI!! (feat. Tom Morello)", "White Flame ー白炎ー"];

        calculateAveragePosition();

        if (onlyMainAlbums) {
            drawRadarChart(
                "radarChart",
                [(bmScore / 64) * maxValue, (mrScore / 64) * maxValue, (mgScore / 64) * maxValue, (tooScore / 64) * maxValue, (mfScore / 64) * maxValue],
                ["BM", "MR", "MG", "TOO", "MF"]
            );
            displayPersonalityType();
        }


        // v2a end	

    } else {
        // 判定が終了していない場合、選択肢を更新。
        // If the determination has not yet concluded, update the options
        for (i = 0; i < 2; i++) {
            var obj_SelectItem = document.getElementById((i == 0) ? "fldLeft" : "fldRight");
            console.log("LeftList:", int_LeftList, "RightList:", int_RightList);
            console.log("LeftID:", int_LeftID, "RightID:", int_RightID);
            console.log("ary_SortData:", ary_SortData);
            var obj_TempData = ary_TempData[ary_SortData[(i == 0) ? int_LeftList : int_RightList][(i == 0) ? int_LeftID : int_RightID]];
            if ((obj_TempData[3].length > 0) && document.getElementById('displayImagesWhileSorting').checked) {
                var obj_Item = document.createElement("img");
                obj_Item.src = str_ImgPath + obj_TempData[Math.floor(Math.random() * (obj_TempData.length - 3)) + 3];
                obj_Item.title = obj_TempData[1];
            } else {
                var obj_Item = document.createElement("span");
                obj_Item.appendChild(document.createTextNode(obj_TempData[1]));
            }
            obj_Item.title = obj_TempData[1];
            obj_SelectItem.innerHTML = obj_TempData[1];
            var name_Item = document.createTextNode(obj_TempData[1]);
            obj_SelectItem.replaceChild(obj_Item, obj_SelectItem.firstChild);
            obj_SelectItem.appendChild(document.createElement('br'));
            obj_SelectItem.appendChild(name_Item);
        }

        int_Count++;
    }
}

function fnc_CC(progressGaugeId, sClass) {
    document.getElementById(progressGaugeId).setAttribute('class', sClass, 0);
    document.getElementById(progressGaugeId).className = sClass;
}
function drawRadarChart(canvasId, values, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    const styles = getComputedStyle(document.documentElement);

    const axisColor = styles.getPropertyValue("--axis-color").trim();
    const dataFill = styles.getPropertyValue("--data-fill").trim();
    const dataStroke = styles.getPropertyValue("--data-stroke").trim();
    const labelColor = styles.getPropertyValue("--label-color").trim();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    const angleStep = (Math.PI * 2) / values.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawValueBands(ctx, centerX, centerY, radius, maxValue);

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    values.forEach((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
    });
    ctx.stroke();

    // Data shape
    ctx.fillStyle = dataFill;
    ctx.strokeStyle = dataStroke;
    ctx.beginPath();

    values.forEach((value, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (value / maxValue) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Labels
    ctx.fillStyle = labelColor;
    ctx.font = "14px sans-serif";
    labels.forEach((label, i) => {
        const angle = i * angleStep - Math.PI / 2;
        ctx.fillText(
            label,
            centerX + (radius + 20) * Math.cos(angle) - 5,
            centerY + (radius + 20) * Math.sin(angle) + 5
        );
    });
}

function drawValueBands(ctx, centerX, centerY, radius, maxValue) {
    const styles = getComputedStyle(document.documentElement);

    const bands = [
        { max: 1, color: styles.getPropertyValue("--band-low").trim() },
        { max: 2.5, color: styles.getPropertyValue("--band-mid").trim() },
        { max: 4, color: styles.getPropertyValue("--band-high").trim() }
    ];

    let prevRadius = 0;

    bands.forEach(band => {
        const r = (band.max / maxValue) * radius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = band.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        prevRadius = r;
    });

    ctx.lineWidth = 1; // reset
}

function calculateAveragePosition() {
    if (onlyMainAlbums) {
        csort6.forEach((song) => {
            var currentRanking = 63 - csort6.indexOf(song);

            const containsCurrentSong = (element) => element.includes(song);
            var currentSongIndex = ary_CharacterData.findIndex(containsCurrentSong);
            var acdItemContainingCurrentSong = ary_CharacterData[currentSongIndex];
            var albumIdentityArray = acdItemContainingCurrentSong[2];
            var albumId = albumIdentityArray.indexOf(1);

            switch (albumId) {
                case 0:
                    bmScore += currentRanking / 13
                    break;
                case 1:
                    mrScore += currentRanking / 14
                    break;
                case 2:
                    mgScore += currentRanking / 17
                    break;
                case 3:
                    tooScore += currentRanking / 10
                    break;
                case 4:
                    mfScore += currentRanking / 10
                    break;
                default:
                    onlyMainAlbums = false;
            }
        }
        )
    }
}

function displayPersonalityType() {
    const personalityTypeHtmlObject = document.getElementById("personalityType");
    var personalitytext = "";
    var scoreNormalised = [normaliseScore(bmScore), normaliseScore(mrScore), normaliseScore(mgScore), normaliseScore(tooScore), normaliseScore(mfScore)]
    var maxScoreNormalised = Math.max.apply(Math, scoreNormalised);
    var countMaxScoreNormalised = scoreNormalised.filter(score => score == maxScoreNormalised).length;
    switch (countMaxScoreNormalised) {
        case 1:
            switch (maxScoreNormalised) {
                case scoreNormalised[0]:
                    personalitytext = "Traditionalist";
                    break;
                case scoreNormalised[1]:
                    personalitytext = "Classical";
                    break;
                case scoreNormalised[2]:
                    personalitytext = "Modernist";
                    break;
                case scoreNormalised[3]:
                    personalitytext = "Post-Modernist";
                    break;
                case scoreNormalised[4]:
                    personalitytext = "New Age";
                    break;
            }
            break;
        case 2:
            switch (maxScoreNormalised) {
                case scoreNormalised[0]:
                    switch (maxScoreNormalised) {
                        case scoreNormalised[1]:
                            personalitytext = "Classical Traditionalist";
                            break;
                        case scoreNormalised[2]:
                            personalitytext = "Traditional Modernist";
                            break;
                        case scoreNormalised[3]:
                            personalitytext = "Post-Modern Traditionalist";
                            break;
                        case scoreNormalised[4]:
                            personalitytext = "New Age Traditionalist";
                            break;
                    }
                case scoreNormalised[1]:
                    switch (maxScoreNormalised) {
                        case scoreNormalised[2]:
                            personalitytext = "Classical Modernist";
                            break;
                        case scoreNormalised[3]:
                            personalitytext = "Classical Post-Modernist";
                            break;
                        case scoreNormalised[4]:
                            personalitytext = "Classy New Age";
                            break;
                    }
                case scoreNormalised[2]:
                    switch (maxScoreNormalised) {
                        case scoreNormalised[3]:
                            personalitytext = "Modern Post-Modernist";
                            break;
                        case scoreNormalised[4]:
                            personalitytext = "Post-Modern New Age";
                            break;
                    }
                case scoreNormalised[3]:
                    personalitytext = "New Age Post-Modernist";
                    break;
            }
            break;
        default:
            personalitytext = "BABYMETAL Enjoyer";
    }
    /*    personalityText = personalityText.italics();*/
    personalityTypeHtmlObject.textContent = "Personality Type: " + personalitytext;
}

function normaliseScore(score) {
    if (normaliseScore == 0) {
        return 0;
    } else {
        return Math.floor((score - 4.5) * (5 / 58));
    }
}
