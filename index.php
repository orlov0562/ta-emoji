<?php
    mb_internal_encoding("UTF-8");

    require 'ta-emoji/ta-emoji-ico-table.class.php';

    function convertPlainTextToEmojiText($text) {

        if (!preg_match('~:\S+:~u', $text)) return $text;

        $emojiIcoTable = TaEmoji::getEmojiIcoTable();
        $emojis = [];
        foreach($emojiIcoTable['emojiClass'] as $i=>$class) {
            $emojis[] = '<img src="ta-emoji/blank.gif"
                              alt="'.$emojiIcoTable['alt'][$i].'"
                              class="ta-emoji-ico '.$class.'"
                              data-ta-emoji="'.$i.'"
                        >';
        }

        $text = str_replace($emojiIcoTable['code'], $emojis, $text);

        return $text;
    }

    function convertInputTextToPlainText($text) {

        $emojiIcoTable = TaEmoji::getEmojiIcoTable();
        $text = str_replace($emojiIcoTable['alt'], $emojiIcoTable['code'], $text);
        return $text;
    }

?>
<!doctype html>
<html lang="ru-RU">
<head>
    <meta charset="UTF-8">
    <title>TA-Emoji by orlov0562</title>
    <style>
        .emoji-textarea {
            width:400px;
            height:400px;
        }

        .btn,
        input[type=submit]{
            font-family:Arial;
            font-size:1em;
            display:inline-block;
            padding: 5px 10px;
            border:1px solid silver;
            background-color: #FAFAFA;
            color:black;
            text-decoration:none;
        }
    </style>
    <link href="ta-emoji/ta-emoji.css" rel="stylesheet">
    <link href="ta-emoji/ta-emoji-ico-table.css" rel="stylesheet">
</head>
<body>
    <h3>Frontend side</h3>
    <form method="post">
        <div>
            <textarea class="emoji-textarea" name="text"><?php
                if (!empty($_POST['text'])){
                    echo htmlspecialchars($_POST['text']);
                } else {
                    echo "Text :1f600::1f601::1f63c::1f63d::1f47e:text text:1f462::1f462::1f462::1f460::1f460::1f460::1f460:  text\n";
                    echo "Text :1f600::1f601::1f63c::1f63d: text :1f47e:text text:1f462::1f462::1f462::1f460: text text\n";
                    echo "👩‍👧‍👦\n";
                    echo "😀😁😼😽👾\n";
                }
            ?></textarea>
        </div>

        <br>
        <div>
            <input type="submit" value="Send">
            <a href="?" class="btn">Reset</a>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <a href="#" id="emoji-btn" class="btn">Emoji</a>
        </div>
    </form>

	<hr>
	<h3>Backend side</h3>

    <?php if (!empty($_POST['text'])):?>

        <?php
            $text = $_POST['text'];
            $text = htmlspecialchars($text);
            $text = str_replace("\n",'<br>', $text);
        ?>

        <h4>Raw (come from form)</h4>
        <?php
            echo $text;
        ?>

        <h4>Converted (prepared for save to db)</h4>
        <?php
            $text = convertInputTextToPlainText($text);
            echo $text;
        ?>

        <h4>Formatted (prepared for output to page)</h4>
        <?php
            $text = convertPlainTextToEmojiText($text);
            echo $text;
        ?>
	<?php else:?>
		<p>Press [Send] button</p>
    <?php endif;?>


    <script
        src="https://code.jquery.com/jquery-2.2.4.min.js"
        integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
        crossorigin="anonymous"></script>

    <script src="ta-emoji/ta-emoji.js"></script>
    <script src="ta-emoji/ta-emoji-ico-table.js"></script>

    <script>
        var emoji = taEmoji.getInstance();

        emoji.attach('.emoji-textarea');

        $(function(){
			setTimeout(emoji.loadEmojiPanel, 500);
		});

        $('#emoji-btn').click(function(e){
			var position = $(this).offset();
			position.left -= 1;
			position.top += $(this).height() - 1;
			emoji.showEmojiPanel(position);
			e.stopPropagation();
		});

        $('body').click(function(){
			emoji.hideEmojiPanel();
		});

    </script>
</body>
</html>
