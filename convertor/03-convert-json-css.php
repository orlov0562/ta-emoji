 <?php

	$json = json_decode(file_get_contents('out/emoji.json'));

	file_put_contents('out/ta-emoji-ico-table.css', '');

	foreach($json as $item) {
		$itemData = '.ta-emoji-ico.ta-emoji-ico-'.$item[0].'{background-image: url('.$item[2].');}'.PHP_EOL;
		file_put_contents('out/ta-emoji-ico-table.css', $itemData, FILE_APPEND);
	}
