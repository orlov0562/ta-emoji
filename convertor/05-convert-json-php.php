 <?php

	$json = json_decode(file_get_contents('out/emoji.json'));

	file_put_contents('out/ta-emoji-ico-table.class.php', '');

	ob_start();

        echo '<?php'.PHP_EOL;
?>

class TaEmoji {
    public static function getEmojiIcoTable(){
        return [<?php foreach($json as $k=>$item) echo "'".$item[0]."'=>['alt'=>'".$item[1]."', 'sort'=>".$k."],";?>];
    }
}<?php

file_put_contents('out/ta-emoji-ico-table.class.php', ob_get_clean());
