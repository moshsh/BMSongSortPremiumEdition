// 2008/7/3 Scripted by K-Factory@migiwa
// 2009/1/27 Modified by K-Factory@migiwa

// *****************************************************************************
str_CenterT = 'lols';
str_CenterB = 'Undo last choice';

str_ImgPath = 'img/';
// 0:順番に　1:昔の
// 0: In order 1: Old
var bln_ResultMode = 1;
// 0:テキスト　1:イラスト　2:テキスト＋イラスト
// 0: Text  1: Illustration  2: Text + Illustration
var int_ResultImg = 2;
// イラスト表示時、何位までをイラスト表示にするか。
// When displaying illustrations, up to which position should illustrations be shown?
var int_ResultRank = 3;

// ソート用のテーブルを
// 0:残す　1:消す
// Sorting table
// 0: Keep  1: Delete
var bln_ResultStyle = 0;

// ソート進捗バーの表示
// 0:表示　1:消す
// Sort progress bar display
// 0: Show  1: Hide
var bln_ProgessBar = 1;

// Maximum number of result rows before being broken off into another table.
var maxRows = 20;

// * タイトル情報（編集可能。最後の行に”,”を付けないようにしてください）
// * Title information (editable. Please do not add a comma at the end of the last line)
var albumSelectTableColumnCount = 5;
var albumTitleArray = [
 "BABYMETAL (2014)",
 "METAL RESISTANCE (2016)",
 "METAL GALAXY (2019)",
 "THE OTHER ONE (2023)",
 "METAL FORTH (2025)",
 "KAMI BAND",
 "Covers",
 "Collaborations",
 "Alternative Studio Song Versions",
 "Alternative Live Performance Versions"
];

// * キャラクター情報（編集可能。最後の行に”,”を付けないようにしてください）
// * 使用フラグ（0にするとソートに入りません）,
//   "タイトルID"（先頭から0, 1, 2...）,
//   {タイトル別参加フラグ}（1を入れると対象タイトルに入ります）,
//   "キャラクター名", "画像（空白の場合、キャラクター名が使用されます）"
//                                      [1,2,3,4,5,6,7,8,9,
// * Character information (editable. Do not add a comma at the end of the last line)
// * Usage flag (set to 0 to exclude from sorting),
//   "Title ID" (0, 1, 2... from the beginning),
//   {Title Participation Flag} (set to 1 to include in target title),
//   "Character Name", "Image (if blank, character name will be used)"
//                                      [1,2,3,4,5,6,7,8,9,
var ary_CharacterData = [
  [1, "Babymetal Death",            [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Megitsune",                  [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Gimme Chocolate!!",          [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "line!",                      [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Akatsuki",                   [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Doki Doki☆Morning",          [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Onedari Daisakusen",         [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "4 no Uta",                   [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Uki Uki★Midnight",           [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Catch Me If You Can",        [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Rondo of Nightmare",         [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Headbangeeeeerrrrr!!!!!",    [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],
  [1, "Ijime, Dame, Zettai",        [1,0,0,0,0,0,0,0,0,0], "bmsong/bm01.jpg"],

  [1, "Road of Resistance",         [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Karate",                     [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Awadama Fever",              [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Yava!",                      [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Amore",                      [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Meta Taro",                  [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Syncopation",                [0,1,0,0,0,0,0,0,0,0], "bmsong/mr02.jpg"],
  [1, "From Dusk Till Dawn",        [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "GJ!",                        [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Sis. Anger",                 [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "No Rain, No Rainbow",        [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "Tales of the Destinies",     [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],
  [1, "The One",                    [0,1,0,0,0,0,0,0,0,0], "bmsong/mr02.jpg"],
  [1, "The One (English ver.)",     [0,1,0,0,0,0,0,0,0,0], "bmsong/mr01.jpg"],

  [1, "In The Name Of",                                       [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_LS.jpg"],
  [1, "Distortion",                                           [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_s_d.jpg"],
  [1, "Kagerou / Tattoo",                                     [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Elevator Girl",                                        [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_eg.jpg"],
  [1, "Elevator Girl (English ver.)",                         [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Starlight",                                            [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_s_s.jpg"],
  [1, "PA-PA-YA",                                             [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_ppy.jpg"],
  [1, "Shanti Shanti Shanti",                                 [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Arkadia",                                              [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Shine",                                                [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Future Metal",                                         [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "DA DA DANCE (feat. Tak Matsumoto)",                    [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Oh! MAJINAI (feat. Joakim Brodén)",                    [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Brand New Day (feat. Tim Henson & Scott LePage)",      [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "Night Night Burn!",                                    [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "↑↓←→BBAB",                                             [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  [1, "BxMxC",                                                [0,0,1,0,0,0,0,0,0,0], "bmsong/bm_mg.jpg"],
  
  [1, "Metal Kingdom",                                        [0,0,0,1,0,0,0,0,0,0], "bmsong/Metal_Kingdom.jpg"],
  [1, "Divine Attack -Shingeki-",                             [0,0,0,1,0,0,0,0,0,0], "bmsong/bm_da.jpg"],
  [1, "Mirror Mirror",                                        [0,0,0,1,0,0,0,0,0,0], "bmsong/Mirror_Mirror.jpg"],
  [1, "Maya",                                                 [0,0,0,1,0,0,0,0,0,0], "bmsong/Maya.jpg"],
  [1, "Time Wave",                                            [0,0,0,1,0,0,0,0,0,0], "bmsong/Time_Wave.jpg"],
  [1, "Believing",                                            [0,0,0,1,0,0,0,0,0,0], "bmsong/Believing.jpg"],
  [1, "Metalizm",                                             [0,0,0,1,0,0,0,0,0,0], "bmsong/Metalizm.jpg"],
  [1, "Monochrome",                                           [0,0,0,1,0,0,0,0,0,0], "bmsong/bm_mc.jpg"],
  [1, "Light and Darkness",                                   [0,0,0,1,0,0,0,0,0,0], "bmsong/Light_and_Darkness.jpg"],
  [1, "The Legend",                                           [0,0,0,1,0,0,0,0,0,0], "bmsong/The_Legend.jpg"],
 
  [1, "from me to u (feat. Poppy)",                           [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "RATATATA (x Electric Callboy)",                        [0,0,0,0,1,0,0,0,0,0], "bmsong/RATATATA.jpg"],
  [1, "3 no Uta (x Slaughter to Prevail)",                    [0,0,0,0,1,0,0,0,0,0], "bmsong/S3.jpg"],
  [1, "Kon! Kon! (feat. Bloodywood)",                         [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "KxAxWxAxIxI",                                          [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "Sunset Kiss (feat. Polyphia)",                         [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "My Queen (feat. Spiritbox)",                           [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "Algorism",                                             [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
  [1, "METALI!! (feat. Tom Morello)",                         [0,0,0,0,1,0,0,0,0,0], "bmsong/METALI.jpg"],
  [1, "White Flame ー白炎ー",                                  [0,0,0,0,1,0,0,0,0,0], "bmsong/MetalForth.jpg"],
     
  [1, "Mischiefs of Metal Gods",                              [0,0,0,0,0,1,0,0,0,0], "bm.png"],
  [1, "Gathering of the Metal Warriors",                      [0,0,0,0,0,1,0,0,0,0], "bm.png"],
  
  [1, "Kimi to Anime ga Mitai",                               [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Love machine",                                         [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Chokotto Love",                                        [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "White Love",                                           [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Over The Future",                                      [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Tsubasa wo Kudasai",                                   [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Soul's Refrain",                                       [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "PainKiller (w/ Chad Smith)",                           [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  [1, "Breaking the Law (w/ Chad Smith)",                     [0,0,0,0,0,0,1,0,0,0], "bm.png"],
  
  [1, "PainKiller (w/ Rob Halford)",                          [0,0,0,0,0,0,0,1,0,0], "bm.png"],
  [1, "Breaking the Law (w/ Rob Halford)",                    [0,0,0,0,0,0,0,1,0,0], "bm.png"],
  [1, "Itch For the Cure (w/ BMTH)",                          [0,0,0,0,0,0,0,1,0,0], "bmsong/BMTHcover.jpg"],
  [1, "Kingslayer (w/ BMTH)",                                 [0,0,0,0,0,0,0,1,0,0], "bmsong/BMTHcover.jpg"],
  [1, "The End (w/ Lil Uzi Vert)",                            [0,0,0,0,0,0,0,1,0,0], "bmsong/PinkTape.jpg"],
  [1, "Leave It All Behind (w/ F. Hero & Bodyslam)",          [0,0,0,0,0,0,0,1,0,0], "bmsong/LIAB.jpg"],
  [1, "Eternal Flames (w/ TMG)",                              [0,0,0,0,0,0,0,1,0,0], "bmsong/TMGII.jpg"],
  [1, "Bekhauf (w/ Bloodywood)",                              [0,0,0,0,0,0,0,1,0,0], "bmsong/Bekhauf.jpg"],
  
  [1, "line! (Vega mix ver.)",                                [0,0,0,0,0,0,0,0,1,0], "bm.png"],
  [1, "Megitsune (Tekina remix)",                             [0,0,0,0,0,0,0,0,1,0], "bm.png"],
  [1, "4 no Uta (444 ver.)",                                  [0,0,0,0,0,0,0,0,1,0], "bmsong/bm02.jpg"],
  [1, "Ijime, Dame, Zettai (Nemesis ver.)",                   [0,0,0,0,0,0,0,0,1,0], "bmsong/IDZltd.jpg"],
  [1, "GJ! (Reward edit)",                                    [0,0,0,0,0,0,0,0,1,0], "bmsong/mr03.jpg"],
  [1, "Starlight (single)",                                   [0,0,0,0,0,0,0,0,1,0], "bmsong/Starlight.jpg"],
  [1, "Distortion (single)",                                  [0,0,0,0,0,0,0,0,1,0], "bmsong/Distortion.jpg"],
  [1, "Monochrome (The First Take)",                          [0,0,0,0,0,0,0,0,1,0], "bmsong/MonoTFT.jpg"],
  [1, "The One (The First Take)",                             [0,0,0,0,0,0,0,0,1,0], "bmsong/TOTFT.jpg"],
 
  [1, "Akatsuki (Unfinished ver.)",                           [0,0,0,0,0,0,0,0,0,1], "bm.png"],
  [1, "Gimme Chocolate!! (Skrillex ver.)",                    [0,0,0,0,0,0,0,0,0,1], "bmsong/bm.jpg"],
  [1, "The One (Unfinished ver.)",                            [0,0,0,0,0,0,0,0,0,1], "bmsong/mr03.jpg"],
  [1, "The One (Legend S ver.)",                              [0,0,0,0,0,0,0,0,0,1], "bmsong/bm_LS.jpg"],
  [1, "Headbangeeeeerrrrr!!!!! (Yui ver.)",                   [0,0,0,0,0,0,0,0,0,1], "bmsong/bm.jpg"],
  [1, "Headbangeeeeerrrrr!!!!! (Moa ver.)",                   [0,0,0,0,0,0,0,0,0,1], "bmsong/bm_mg.jpg"],
  [1, "Headbangeeeeerrrrr!!!!! (Momo ver.)",                  [0,0,0,0,0,0,0,0,0,1], "bmsong/LegendMM.jpg"],
  [1, "GJ! (Moa Solo ver.)",                                  [0,0,0,0,0,0,0,0,0,1], "bmsong/bm_LS.jpg"],
  [1, "4 no Uta (Moa Solo ver.)",                             [0,0,0,0,0,0,0,0,0,1], "bmsong/bm_LS.jpg"],
  [1, "Headbanger (☆Night Of 15 Mix★)",                      [0,0,0,0,0,0,0,0,0,1], "bmsong/bm02.jpg"],
  [1, "Babymetal Death (Shin ver.)",                          [0,0,0,0,0,0,0,0,0,1], "bm.png"],
  [1, "Onedari Daisakusen (Budokan 2021)",                    [0,0,0,0,0,0,0,0,0,1], "bmsong/10BMY.jpg"],
  [1, "Onedari Daisakusen (Su-metal Anger ver.)",             [0,0,0,0,0,0,0,0,0,1], "bm.png"],
  [1, "GJ! (Budokan 2021)",                                   [0,0,0,0,0,0,0,0,0,1], "bmsong/10BMY.jpg"],
  [1, "Akatsuki (Budokan 2021)",                              [0,0,0,0,0,0,0,0,0,1], "bmsong/10BMY.jpg"],
  [1, "The One (Living Legend ver.)",                         [0,0,0,0,0,0,0,0,0,1], "bmsong/10BMY.jpg"],
  [1, "Megitsune (赤子金属 ver.)",                             [0,0,0,0,0,0,0,0,0,1], "bmsong/FoxFest.jpg"]
  
];
