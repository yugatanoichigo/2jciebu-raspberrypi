<!DOCTYPE html>
<html lang="ja">
<html>
<head>
	<title>2JCIEBU 可視化ツール</title>
	<meta name="viewport" content="width=device-width">
	<script src="https://js.noble-gleam.com/jquery.js" type="text/javascript" charset="utf-8"></script>
	<script src="./Chart.bundle.js"></script>
	<script src="./main.js" type="text/javascript" charset="utf-8" async defer></script>
	<style type="text/css" media="screen">
		h1 {
			max-width: 800px;
			margin: 0 auto;
			margin-bottom: 20px;
			padding: 5px 10px;
			background-color: #007199;
			border-radius: 10px;
			font-size: 30px;
			text-align: center;
			color: #FFF;
		}
		hr {
			width: 85%;
			border: none;
			border-top: 2px solid #CCC;
		}
		#main {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
			grid-gap: 10px;
			max-width: 1300px;
			min-width: 1100px;
			margin: 0 auto;
			overflow-x: auto;
		}
		.center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.border { box-shadow: 0 0 0 1px #000 inset; }
		
		.conte {
			min-height: 150px;
			padding: 10px;
			border-radius: 10px;
			margin-bottom: 20px;
		}
		.conte_title {
			min-width: 150px;
			padding: 10px;
			border-radius: 10px;
			font-size: 20px;
			text-align: center;
		}

		.val {
			font-size: 25px;
		}

		.set_title {
			display: inline-block;
			position: relative;
			width: 200px;
			font-weight: 900;
		}
		input {
			width: 100px;
		}
	</style>
</head>
<body>
	<header>
		<h1>OMRON 環境センサ 取得データ</h1>
	</header>

	<div>
		&emsp;
		<a href="#" id="start">計測開始</a>
		&emsp;&emsp;
		<span id="mes"></span>
	</div>

	<br>

	<div style="width: 100%;overflow-x: auto;">
		<div id="main">
			<!-- 温度・湿度 -->
			<div id="temp" class="conte" style="background-color: #FCEFFE;border: 2px solid #E9CFFE;">
				<div class="conte_title" style="background-color: #E9CFFE;">
					温度・湿度
				</div>

				<!-- 温度値 -->
				<div style="float: left;position: relative;width: 50%;height: 90px;">
					<div class="center">
						<span id="temp_val" class="val">0</span>℃
					</div>
					&nbsp;
				</div>

				<!-- 最高温度値・最低温度値 -->
				<div style="float: left;position: relative;width: 50%;height: 90px;">
					<div class="center" style="width: 100%;">
						<small>
							平均: <span id="temp_val_ave">0</span>℃<br>
							最高: <span id="temp_val_max">0</span>℃<br>
							最低: <span id="temp_val_min">0</span>℃<br>
						</small>
					</div>
				</div>

				<hr>

				<!-- 湿度値 -->
				<div style="float: left;position: relative;width: 50%;height: 90px;">
					<div class="center">
						<span id="hum_val" class="val">0</span>%
					</div>
					&nbsp;
					<!-- エラー表示 -->
					<div class="center" style="width: 100%;top: 85%;font-size: 14px;color: red;"><b id="hum_val_ave_error"></b></div>
				</div>

				<!-- 最高湿度値・最低湿度値 -->
				<div style="float: left;position: relative;width: 50%;height: 90px;">
					<div class="center" style="width: 100%;">
						<small>
							平均: <span id="hum_val_ave">0</span>%<br>
							最高: <span id="hum_val_max">0</span>%<br>
							最低: <span id="hum_val_min">0</span>%<br>
						</small>
					</div>
				</div>
			</div>

			<!-- 照度 -->
			<div id="brightness" class="conte" style="background-color: #E6EAFB;border: 2px solid #B3B7E8;">
				<div class="conte_title" style="background-color: #B3B7E8;">
					照度
				</div>

				<!-- 照度値 -->
				<div style="position: relative;width: 100%;height: 80px;">
					<div class="center">
						<span id="bri_val" class="val">0</span> lx
					</div>
				</div>

				<!-- 平均照度値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>平均: <span id="bri_val_ave">0</span> lx</small>
				</div>

				<!-- 最高照度値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最高: <span id="bri_val_max">0</span> lx</small>
				</div>

				<!-- 最低照度値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最低: <span id="bri_val_min">0</span> lx</small>
				</div>

			</div>

			<!-- 気圧 -->
			<div id="pressure" class="conte" style="background-color: #F6F5FF;border: 2px solid #C0E0EE;">
				<div class="conte_title" style="background-color: #C0E0EE;">
					気圧
				</div>

				<!-- 気圧値 -->
				<div style="position: relative;width: 100%;height: 80px;">
					<div class="center" style="width: 100%;text-align: center;">
						<span id="pre_val" class="val">0</span> hPa
					</div>
				</div>

				<!-- エラー表示 -->
				<div style="width: 100%;top: 85%;font-size: 14px;color: red;text-align: center;"><b id="pre_val_ave_error"></b></div>

				<!-- 平均気圧値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>平均: <span id="pre_val_ave">0</span> hPa</small>
				</div>

				<!-- 最高気圧値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最高: <span id="pre_val_max">0</span> hPa</small>
				</div>

				<!-- 最低気圧値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最低: <span id="pre_val_min">0</span> hPa</small>
				</div>

			</div>

			<!-- 騒音 -->
			<div id="noise" class="conte" style="background-color: #E6FBFA;border: 2px solid #B3E8D7;">
				<div class="conte_title" style="background-color: #B3E8D7;">
					騒音
				</div>

				<!-- 騒音値 -->
				<div style="position: relative;width: 100%;height: 80px;">
					<div class="center" style="width: 100%;text-align: center;">
						<span id="noi_val" class="val">0</span> dB
					</div>
				</div>

				<!-- 平均騒音値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>平均: <span id="noi_val_ave">0</span> dB</small>
				</div>

				<!-- 最高騒音値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最高: <span id="noi_val_max">0</span> dB</small>
				</div>

				<!-- 最低騒音値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最低: <span id="noi_val_min">0</span> dB</small>
				</div>

			</div>

			<!-- CO2 -->
			<div id="co2" class="conte" style="background-color: #F7FFF9;border: 2px solid #B3EEB5;">
				<div class="conte_title" style="background-color: #B3EEB5;">
					CO2
				</div>

				<!-- CO2値 -->
				<div style="position: relative;width: 100%;height: 80px;">
					<div class="center" style="width: 100%;text-align: center;">
						<span id="co2_val" class="val">0</span> ppm
					</div>
				</div>

				<!-- エラー表示 -->
				<div style="width: 100%;top: 85%;font-size: 14px;color: red;text-align: center;"><b id="co2_val_ave_error"></b></div>

				<!-- 平均CO2値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>平均: <span id="co2_val_ave">0</span> ppm</small>
				</div>

				<!-- 最高CO2値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最高: <span id="co2_val_max">0</span> ppm</small>
				</div>

				<!-- 最低CO2値 -->
				<div style="position: relative;width: 100%;text-align: center;">
					<small>最低: <span id="co2_val_min">0</span> ppm</small>
				</div>

			</div>
		</div>
	</div>

	<div style="height: 40px;"></div>

	<canvas id="myChart"></canvas>

	<div id="setting">
		<h3>設定</h3>
		<span><small>(注)ブラウザをリロードすると値はリセットされます。</small></span>

		<br><br>

		<div class="set_list">
			<span class="set_title">データの取得頻度: </span>
			<input type="text" id="set_delay_val" value="3"> 秒
			<div style="padding-left: 30px;"><small>最小値は, 3秒です。</small></div>
		</div>

		<br>

		<div class="set_list">
			<span class="set_title">グラフの最大値: </span>
			<input type="text" id="set_chart_max_val" value="50">
			<div style="padding-left: 30px;"><small>グラフに表示できるデータ調整値の最大の値です。</small></div>
		</div>

		<br>

		<div class="set_list">
			<span class="set_title">湿度の異常表示: </span>
			<input type="text" id="set_hum_val" value="40"> %
			<div style="padding-left: 30px;"><small>湿度がこの数値以下になった場合は、「異常な数値」という表示を出し、平均値を算出しません。</small></div>
		</div>

		<br>

		<div class="set_list">
			<span class="set_title">気圧の異常表示: </span>
			<input type="text" id="set_pre_val" value="500"> hPa
			<div style="padding-left: 30px;"><small>気圧がこの数値以下になった場合は、「異常な数値」という表示を出し、平均値を算出しません。</small></div>
		</div>

		<br>

		<div class="set_list">
			<span class="set_title">CO2の異常表示: </span>
			<input type="text" id="set_co2_val" value="400"> ppm
			<div style="padding-left: 30px;"><small>CO2がこの数値以下になった場合は、「異常な数値」という表示を出し、平均値を算出しません。</small></div>
		</div>
	</div>

	<div style="height: 100px;"></div>
</body>
</html>