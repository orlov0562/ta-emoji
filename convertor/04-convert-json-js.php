 <?php

	$json = json_decode(file_get_contents('out/emoji.json'));

	file_put_contents('out/ta-emoji-ico-table.js', '');

	ob_start();

?>taEmoji.options.emojiIcoTable = {<?php
foreach($json as $k=>$item) {
    if ($k) echo ',';
    echo "'".$item[0]."':{alt:'".$item[1]."'}";
}
?>};<?php

file_put_contents('out/ta-emoji-ico-table.js', ob_get_clean());
