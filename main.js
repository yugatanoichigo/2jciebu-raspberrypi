var get_data_frame;		//データ取得インターバル
var get_delay = 3000;	//データ取得頻度(ms)
var get_flg = 0;		//データ取得の開始フラグ
var count = 1;			//データの更新回数
var count_hum = 1;			//データの更新回数（湿度）
var count_pre = 1;			//データの更新回数（気圧）
var count_co2 = 1;			//データの更新回数（CO2）

var temp = hum = bri = pre = noi = co2 = 0;
var max_temp = min_temp = ave_temp = sum_temp = 0;	//温度
var max_hum = min_hum = ave_hum = sum_hum = 0;		//湿度
var max_bri = min_bri = ave_bri = sum_bri = 0;		//照度
var max_pre = min_pre = ave_pre = sum_pre = 0;		//気圧
var max_noi = min_noi = ave_noi = sum_noi = 0;		//騒音
var max_co2 = min_co2 = ave_co2 = sum_co2 = 0;		//CO2

var date = [];
var datalist_temp = datalist_hum = datalist_bri = datalist_pre = datalist_noi = datalist_co2 = [];

var myChart;

$(function() {
	var ctx = document.getElementById("myChart").getContext('2d');

	myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: '温度',
					data: [],
					borderColor: '#C7ADDC',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				},{
					label: '湿度',
					data: [],
					borderColor: '#C7ADDC',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				},{
					label: '照度',
					data: [],
					borderColor: '#9195C6',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				},{
					label: '気圧',
					data: [],
					borderColor: '#A0C0CC',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				},{
					label: '騒音',
					data: [],
					borderColor: '#91C6B5',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				},{
					label: 'CO2',
					data: [],
					borderColor: '#91CC93',
					backgroundColor: 'rgba(0, 0, 0, 0)'
				}
			],
		},
		options: {
			title: {
				display: true,
				text: '環境データ'
			}
		}
	});

	/* データ取得頻度の設定値が変更された場合 */
	$('#set_delay_val').on('change', function() {
		clearInterval(get_data_frame);

		get_delay = $(this).val();
		get_delay = Number(get_delay) * 1000;

		console.log("delay:"+get_delay);

		if (get_delay >= 3000) {
			console.log("delay changed.");

			get_data_frame = setInterval("get_data()", get_delay);
		} else {
			$(this).val(3);
			get_delay = 3000;

			clearInterval(get_data_frame);

			get_data_frame = setInterval("get_data()", get_delay);
		}
	});

	/* 開始する */
	$('#start').on('click', function() {
		if (get_flg == 0) {	//開始
			get_flg = 1;

			/* データの取得・更新 */
			get_data_frame = setInterval("get_data()", get_delay);
			get_data();

			$('#start').text('計測停止');
		} else {	//停止
			get_flg = 0;

			clearInterval(get_data_frame);

			$('#start').text('計測開始');
		}

		$('#mes').html("");
	});
});

/* グラフの更新 */
function chart_output() {
	const time = new Date();	//現在の時間を取得

	const h = ('0' + time.getHours()).slice(-2);	//時
	const m = ('0' + time.getMinutes()).slice(-2);	//分
	const s = ('0' + time.getSeconds()).slice(-2);	//秒

	now = h + ':' + m + ':' + s;	//現在時刻

	myChart.data.labels.push(now);	//現在時刻をグラフに追加

	//各項目の最新データをグラフに追加
	//（全てのデータが１つのグラフに収まるように数値を調節しています）
	var max_val = Number($('#set_chart_max_val').val());	//湿度の最低値


	if (temp > max_val) myChart.data.datasets[0].data.push(max_val + 1);		//温度
	else myChart.data.datasets[0].data.push(temp);		//温度

	if ((hum / 2) > max_val) myChart.data.datasets[1].data.push(max_val + 1);	//湿度
	else myChart.data.datasets[1].data.push(hum / 2);	//湿度

	if ((bri / 3) > max_val) myChart.data.datasets[2].data.push(max_val + 1);	//照度
	else myChart.data.datasets[2].data.push(bri / 3);	//照度

	if ((pre / 33) > max_val) myChart.data.datasets[3].data.push(max_val + 1);	//気圧
	else myChart.data.datasets[3].data.push(pre / 33);	//気圧

	if ((noi / 2) > max_val) myChart.data.datasets[4].data.push(max_val + 1);	//騒音
	else myChart.data.datasets[4].data.push(noi / 2);	//騒音

	if ((co2 / 14) > max_val) myChart.data.datasets[5].data.push(max_val + 1);	//CO2
	else myChart.data.datasets[5].data.push(co2 / 14);	//CO2

	//グラフの更新
	myChart.update();
}

/* データの取得・出力 */
function get_data() {
	//データの取得
	$.ajax({
		url: './get_data.php',
	}).done(function(data) {
		data = data.split("##");	//返ってきたデータを"##"で分割

		var val = 0;		//データ値の仮格納
		var stop_flg = 0;	//データが取得できなかった場合の停止フラグ

		//各データが取得できたかの判定
		for (i = 0; i < data.length; i++) {
			val = Number(data[i].replace(/.*:/, ""));
			val = val.toFixed(1);

			//データが取得できていない場合
			if (isNaN(val)) stop_flg = 1;
		}

		//データが取得できていない場合、計測を停止
		if (stop_flg) {
			console.log("## NaN ##");

			$('#mes').html("データの計測に失敗しました。計測を停止します。");
			$('#start').text('計測開始');
			$('body').css('background-color', '#FFDDDD');

			get_flg = 0;

			clearInterval(get_data_frame);	//計測インターバルを停止

			return false;	//現在の関数を終了
		} else {
			$('#mes').html("");
			$('body').css('background-color', '#FFFFFF');
		}

		//各データの更新
		for (i = 0; i < data.length; i++) {
			val = Number(data[i].replace(/.*:/, ""));	//データの文字列部分を削除
			val = val.toFixed(1);	//小数点を1桁までにする

			if (data[i].match(/Temperature/)) {	//温度
				$('#temp_val').text(val);	//最新データ表示の更新

				data_update("temp", val);	//最高・最低・平均データの算出、更新

				temp = val;	//最新データを格納
			} else if (data[i].match(/humidity/)) {	//湿度
				$('#hum_val').text(val);	//最新データ表示の更新

				data_update("hum", val);	//最高・最低・平均データの算出、更新

				hum = val;	//最新データを格納
			} else if (data[i].match(/light/)) {	//照度
				$('#bri_val').text(val);	//最新データ表示の更新

				data_update("bri", val);	//最高・最低・平均データの算出、更新

				bri = val;	//最新データを格納
			} else if (data[i].match(/pressure/)) {	//気圧
				$('#pre_val').text(val);	//最新データ表示の更新

				data_update("pre", val);	//最高・最低・平均データの算出、更新

				pre = val;	//最新データを格納
			} else if (data[i].match(/noise/)) {	//騒音
				$('#noi_val').text(val);	//最新データ表示の更新

				data_update("noi", val);	//最高・最低・平均データの算出、更新

				noi = val;	//最新データを格納
			} else if (data[i].match(/eCO2/)) {	//CO2
				$('#co2_val').text(val);	//最新データ表示の更新

				data_update("co2", val);	//最高・最低・平均データの算出、更新

				co2 = val;	//最新データを格納
			}
		}

		count++;	//データの更新回数の加算

		console.log("GET DATA.");

		chart_output();	//チャートの出力

	}).fail(function(data) {
		alert("データの取得に失敗しました");
	});
}

/* データの更新（最大・最小・平均） */
function data_update(name, val) {
	val = Number(val);	//データ値を数値の型に変換

	if (name == "temp") {	//温度
		if (count == 1) {
			max_temp = min_temp = ave_temp = val;	//初期化
			$('#temp_val_max, #temp_val_min').text(val);
		}
		if (val > max_temp) {	//最高温度の更新
			max_temp = val;
			$('#temp_val_max').text(val);
		}
		if (val < min_temp) {	//最低温度の更新
			min_temp = val;
			$('#temp_val_min').text(val);
		}
		sum_temp += val;		//温度の合計値
		ave_temp = sum_temp / count;	//温度の平均値
		ave_temp = ave_temp.toFixed(1);

		$('#temp_val_ave').text(ave_temp);

	} else if (name == "hum") {	//湿度
		if (count == 1) {
			max_hum = min_hum = ave_hum = val;	//初期化
			$('#hum_val_max, #hum_val_min').text(val);
		}
		
		min_hum = $('#set_hum_val').val();	//湿度の最低値

		if (val > min_hum) {
			if (val > max_hum) {	//最高湿度の更新
				max_hum = val;
				$('#hum_val_max').text(val);
			}
			if (val < min_hum) {	//最低湿度の更新
				min_hum = val;
				$('#hum_val_min').text(val);
			}
			sum_hum += val;			//湿度の合計値
			ave_hum = sum_hum / count_hum;	//湿度の平均値
			ave_hum = ave_hum.toFixed(1);

			$('#hum_val_ave').text(ave_hum);
			$('#hum_val_ave_error').text('');

			count_hum++;

		} else {
			$('#hum_val_ave').text('-');
			$('#hum_val_ave_error').text('！異常な数値');
		}

	} else if (name == "bri") {	//照度
		if (count == 1) {
			max_bri = min_bri = ave_bri = val;	//初期化
			$('#bri_val_max, #bri_val_min').text(val);
		}
		if (val > max_bri) {	//最高照度の更新
			max_bri = val;
			$('#bri_val_max').text(val);
		}
		if (val < min_bri) {	//最低照度の更新
			min_bri = val;
			$('#bri_val_min').text(val);
		}
		sum_bri += val;			//照度の合計値
		ave_bri = sum_bri / count;	//照度の平均値
		ave_bri = ave_bri.toFixed(1);

		$('#bri_val_ave').text(ave_bri);

	} else if (name == "pre") {	//気圧
		if (count == 1) {
			max_pre = min_pre = ave_pre = val;	//初期化
			$('#pre_val_max, #pre_val_min').text(val);
		}

		min_pre = $('#set_pre_val').val();	//気圧の最低値

		if (val > min_pre) {
			if (val > max_pre) {	//最高気圧の更新
				max_pre = val;
				$('#pre_val_max').text(val);
			}
			if (val < min_pre) {	//最低気圧の更新
				min_pre = val;
				$('#pre_val_min').text(val);
			}
			sum_pre += val;			//気圧の合計値
			ave_pre = sum_pre / count_pre;	//気圧の平均値
			ave_pre = ave_pre.toFixed(1);

			$('#pre_val_ave').text(ave_pre);
			$('#pre_val_ave_error').text('');

			count_pre++;

		} else {
			$('#pre_val_ave').text('-');
			$('#pre_val_ave_error').text('！異常な数値');
		}
		

	} else if (name == "noi") {	//騒音
		if (count == 1) {
			max_noi = min_noi = ave_noi = val;	//初期化
			$('#noi_val_max, #noi_val_min').text(val);
		}
		if (val > max_noi) {	//最高騒音の更新
			max_noi = val;
			$('#noi_val_max').text(val);
		}
		if (val < min_noi) {	//最低騒音の更新
			min_noi = val;
			$('#noi_val_min').text(val);
		}
		sum_noi += val;			//騒音の合計値
		ave_noi = sum_noi / count;	//騒音の平均値
		ave_noi = ave_noi.toFixed(1);

		$('#noi_val_ave').text(ave_noi);

	} else if (name == "co2") {	//CO2
		if (count == 1) {
			max_co2 = min_co2 = ave_co2 = val;	//初期化
			$('#co2_val_max, #co2_val_min').text(val);
		}

		min_co2 = $('#set_co2_val').val();	//気圧の最低値

		if (val > min_co2) {
			if (val > max_co2) {	//最高CO2の更新
				max_co2 = val;
				$('#co2_val_max').text(val);
			}
			if (val < min_co2) {	//最低CO2の更新
				min_co2 = val;
				$('#co2_val_min').text(val);
			}
			sum_co2 += val;			//CO2の合計値
			ave_co2 = sum_co2 / count_co2;	//CO2の平均値
			ave_co2 = ave_co2.toFixed(1);

			$('#co2_val_ave').text(ave_co2);

			$('#co2_val_ave_error').text('');

			count_co2++;

		} else {
			$('#co2_val_ave').text('-');
			$('#co2_val_ave_error').text('！異常な数値');
		}
	}
}