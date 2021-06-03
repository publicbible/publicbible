<?php
die(__FILE__."<br> LINE ".__LINE__);
ini_set('memory_limit', '512M');
ini_set('max_execution_time', '300');

function disp($x) {
  echo "<pre>";
  print_r($x);
  exit;
}

function jsonify($x) {
  header('Content-Type: application/json');
  print_r(json_encode($x));
}






// $string = file_get_contents("data/bibleBookNames.json");
// $string = json_decode($string, true);

// // echo "<pre>"; 
// $i = 1;
// foreach($string as $s) {
//   $names[$i] = $s;
//   $i++;
// }
// echo (json_encode($string));

// $show = [];
// $string1 = file_get_contents("data/temp1.json");
// $string2 = file_get_contents("data/temp2.json");
// $json1 = json_decode($string1, true);
// $json2 = json_decode($string2, true);
// $json = array_merge($json1, $json2);
// $n = 1;
// foreach ($json as $j) {
//   $show[$n]["p_id"] = $j["id"];
//   $show[$n]["p_title"] = $j["title"];
//   $show[$n]["p_tags"] = $j["tags"];
//   $n++;
// }

// jsonify($show); die();




// $servername = "localhost";
// $username = "root";
// $password = "root";
// $dbname = "membib1e";

// try {
//   $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
//   $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
//   $json = []; 
//   $verseTexts = []; 

//   $stmt0 = $conn->prepare("SELECT * FROM passages LIMIT 1500, 1500");
//   $stmt0->execute();
//   $stmt0->setFetchMode(PDO::FETCH_ASSOC);
//   $results = $stmt0->fetchAll();

//   $i = 1501;
//   foreach ($results as $r) {
//     $start = $r["p_start"];
//     $end = $r["p_end"];

//     $stmt1 = $conn->prepare("SELECT * FROM topics WHERE t_start >= $start AND t_end <= $end");
//     $stmt1->execute();
//     $stmt1->setFetchMode(PDO::FETCH_ASSOC);
//     $topics = $stmt1->fetchAll();
    
//     $w = 1;
//     $words = [];
//     foreach ($topics as $t){
//       $words[$w] = $t["t_title"];
//       $w++;
//     }

//     // $verseTexts = [];
//     // $stmt3 = $conn->prepare("SELECT id, v_textWEB FROM verses WHERE id >= $start AND id <= $end;");
//     // $stmt3->execute();
//     // $stmt3->setFetchMode(PDO::FETCH_ASSOC);
//     // $verses = $stmt3->fetchAll();
//     // foreach($verses as $v) {
//     //   $verseTexts[$v["id"]] = $v["v_textWEB"];
//     // }

//     sort($words);
//     $json[$i]["id"] = $i;
//     $json[$i]["title"] = $r["p_title"];
//     // $json[$i]["verses"] = $verseTexts;
//     $json[$i]["tags"] = array_values(array_unique($words));
//     $i++;
//     $words = $topics = null;
//   }

//   jsonify($json); die();

//   // foreach($passages as $p) {
//   //   $json[$p["p_id"]]["title"] = $p["p_title"];
//   //   $json[$p["p_id"]]["topics"] = $p["p_topics"];
//   //   $pStart = $p["p_start"];
//   //   $pEnd = $p["p_end"];
//   //   $stmt1 = $conn->prepare("SELECT DISTINCT v_bookName FROM verses WHERE id >= $pStart AND id <= $pEnd;");
//   //   $stmt1->execute();
//   //   $stmt1->setFetchMode(PDO::FETCH_ASSOC);
//   //   $books = $stmt1->fetchAll();

//   //   foreach($books as $b) {
//   //     $bName = $b["v_bookName"];
//   //     $stmt2 = $conn->prepare("SELECT DISTINCT v_chapter FROM verses WHERE v_bookName = '$bName' AND  id >= $pStart AND id <= $pEnd;");
//   //     $stmt2->execute();
//   //     $stmt2->setFetchMode(PDO::FETCH_ASSOC);
//   //     $chapters = $stmt2->fetchAll();
//   //     foreach($chapters as $c) {
//   //       $chapter = $c["v_chapter"];
//   //       $stmt3 = $conn->prepare("SELECT id, v_textWEB, v_words FROM verses WHERE v_bookName = '$bName' AND v_chapter = '$chapter' AND id >= $pStart AND id <= $pEnd;");
//   //       $stmt3->execute();
//   //       $stmt3->setFetchMode(PDO::FETCH_ASSOC);
//   //       $verses = $stmt3->fetchAll();
//   //       foreach($verses as $v) {
//   //         $json[$p["p_id"]]["verses"][$v["id"]] = $v;
//   //       }
//   //     }
//   //   }
//   // }
//   // jsonify($json);

// } catch(PDOException $e) {
//   echo "Error: " . $e->getMessage();
// }
// $conn = null;
