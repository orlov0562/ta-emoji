 <?php

	$json = json_decode(file_get_contents('out/emoji.json'));

	file_put_contents('out/ta-emoji-ico-table.class.php', '');

	ob_start();

        echo '<?php'.PHP_EOL;
?>

class TaEmoji {
    public static function getEmojiIcoTable(){
        return [
            'code'=>[<?php foreach($json as $item) echo "':".$item[0].":',";?>],
            'alt'=>[<?php foreach($json as $item) echo "'".$item[1]."',";?>],
            'emojiClass'=>[<?php foreach($json as $item) echo "'ta-emoji-ico-".$item[0]."',";?>]
        ];
    }
}<?php

file_put_contents('out/ta-emoji-ico-table.class.php', ob_get_clean());
