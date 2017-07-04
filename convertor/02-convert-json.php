<?php
	mb_internal_encoding("UTF-8");

    $data = file_get_contents('out/source.html');

	$emoji = [];
	$nextOccur = mb_strpos($data,'<tr>');
	while ($nextOccur!==FALSE) {
		echo 'Data left to process: '.strlen($data).' bytes'.PHP_EOL;

		$data = mb_substr($data, $nextOccur+4);

		$nextOccur = mb_strpos($data,'<tr>');

		$block = mb_substr($data, 0, mb_strpos($data,'</tr>'));

		if (!preg_match_all('~<td[^>]*>(.+)</td>~Uu', $block, $regs)) continue;
		if (count($regs[0])<15) continue;

		$codeBlock =  $regs[1][1];
		$fbBlock =  $regs[1][8];

		if (!preg_match('~name=[\'"]([^\'"]+)[\'"]~Uu', $codeBlock, $regs)) continue;

		$name = trim($regs[1]);

		if (!preg_match('~alt=[\'"]([^\'"]+)[\'"]~Uu', $fbBlock, $regs)) continue;

		$alt = trim($regs[1]);

		if (!preg_match('~src=[\'"]([^\'"]+)[\'"]~Uu', $fbBlock, $regs)) continue;

		$src = trim($regs[1]);

		$emoji[] = [$name, $alt, $src];

		echo 'Found '.count($emoji).' emoji'.PHP_EOL;
		$nextOccur = mb_strpos($data,'<tr>');

	}

	file_put_contents('out/emoji.json', json_encode($emoji));

	echo 'Saved '.count($emoji).' emoji'.PHP_EOL;

