<?php
    mb_internal_encoding("UTF-8");

    require 'ta-emoji/ta-emoji-ico-table.class.php';

    function convertPlainTextToEmojiText($text) {

        if (!preg_match('~:\S+:~u', $text)) return $text;

        $emojiIcoTable = TaEmoji::getEmojiIcoTable();
        $emojis = [];
        foreach($emojiIcoTable as $emojiName=>$ext) {

            $emojis[] = '<img
                src="ta-emoji/blank.gif"
                alt="'.$ext['alt'].'"
                class="ta-emoji-ico ta-emoji-ico-'.$emojiName.'"
                data-ta-emoji="'.$emojiName.'"
            >';
        }

        $codes = [];

        foreach ($emojiIcoTable as $name=>$ext) {
            $codes[] = ':'.$name.':';
        }

        $text = str_replace($codes, $emojis, $text);

        return $text;
    }

    function convertInputTextToPlainText($text) {

        $emojiIcoTable = TaEmoji::getEmojiIcoTable();

        $codes = [];
        $alts = [];

        foreach ($emojiIcoTable as $name=>$ext) {
            $codes[] = ':'.$name.':';
            $alts[] = $ext['alt'];
        }

        $text = str_replace($alts, $codes, $text);
        return $text;
    }

?>
<!doctype html>
<html lang="ru-RU">
<head>
    <meta charset="UTF-8">
    <title>TA-Emoji by orlov0562</title>
    <style>
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
        .row {display:flex;}
        .col {margin: 0 5px;}

    </style>
    <link href="ta-emoji/ta-emoji.css" rel="stylesheet">
    <link href="ta-emoji/ta-emoji-ico-table.css" rel="stylesheet">
</head>
<body>
    <h3>Frontend side</h3>
    <form method="post">
        <div class="row">
            <div class="col">
                First emoji block, with predefined textarea size<br>
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
                <br><a href="#" id="emoji-btn" class="btn">Emoji..</a>
            </div>
            <div class="col">
                Second emoji block, without predefined textarea size<br>
                <textarea class="emoji-textarea-second" name="text"><?php
                    if (!empty($_POST['text'])){
                        echo htmlspecialchars($_POST['text']);
                    } else {
                        echo "Text :1f600::1f601::1f63c::1f63d::1f47e:text text:1f462::1f462::1f462::1f460::1f460::1f460::1f460:  text\n";
                        echo "Text :1f600::1f601::1f63c::1f63d: text :1f47e:text text:1f462::1f462::1f462::1f460: text text\n";
                        echo "👩‍👧‍👦\n";
                        echo "😀😁😼😽👾\n";
                    }
                ?></textarea>
                <br><a href="#" id="emoji-btn-second" class="btn">Emoji..</a>
            </div>
        </div>
        </div>
            <hr>
            <input type="text" value="👩‍👧‍👦😀😁😼😽👾"> - input for test purposes
            <hr>
        </div>

        <div>
            <input type="submit" value="Send">
            <a href="?" class="btn">Reset</a>
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

        // -----------------------------

        var emoji = taEmojiClass.getInstance();
        emoji.attach('.emoji-textarea');

	setTimeout(function(){
		emoji.loadEmojiPanel();
	}, 500);

        $('#emoji-btn').click(function(e){
		var position = $(this).offset();
		position.left += 20;
		position.top += $(this).height() - 10;
		emoji.showEmojiPanel(position);
		e.stopPropagation();
		return false;
	});

        // -----------------------------

        var emojiSecond = taEmojiClass.getInstance();

	var options = emojiSecond.options;
	options.emojiTextarea.attr.id = 'ta-emoji-textarea-chat';
	options.emojiPanel.attr.id = 'ta-emoji-panel-chat';

        emojiSecond.attach('.emoji-textarea-second', options);

	setTimeout(function(){
		emojiSecond.loadEmojiPanel();
	}, 500);

        $('#emoji-btn-second').click(function(e){
		var position = $(this).offset();
		position.left += 20;
		position.top += $(this).height() - 10;
		emojiSecond.showEmojiPanel(position);
		e.stopPropagation();
		return false;
	});

        // -----------------------------

        $('body').click(function(){
            $('.ta-emoji-panel').hide();
	});


    </script>
</body>
</html>
