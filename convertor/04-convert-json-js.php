 <?php

	$json = json_decode(file_get_contents('out/emoji.json'));

	file_put_contents('out/ta-emoji-ico-table.js', '');

	ob_start();

?>taEmoji.options.emojiIcoTable = {
        code: [<?php foreach($json as $item) echo "':".$item[0].":',"; ?>],
        alt: [<?phpforeach($json as $item) echo "'".$item[1]."',";}?>],
        emojiClass: [<?php foreach($json as $item) echo "'ta-emoji-ico-".$item[0]."',";?>]
};<?php

file_put_contents('out/ta-emoji-ico-table.js', ob_get_clean());
