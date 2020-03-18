<?php
//実行するコマンド
$cmd = "python3 /mnt/smb/make-base/omron/2jciebu.py";

//コマンドを実行
exec($cmd, $opt, $return);

//実行結果を出力
if ($return == 0) {
	foreach ($opt as $opt_val) {
		echo $opt_val;
	}
} else {
	echo "error";
}
?>