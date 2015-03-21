<?php

$path = "c:/wamp/www/sage";
$live_url = "/sage/";

class Sage {

	public $start_date =	null;
	public $weeks =			0;
	public $def_windows =	8;
	
	const COL_DATE = 0;
	
	const ACC_TAKINGS = 1205;
	const ACC_CURRENT = 1200;
	
	const NC_SALES_TAXABLE	= 4000;
	const NC_SALES_NO_VAT	= 4001;
	
	const NC_SALES			= 5000;
	const NC_WINDOWS		= 7801;
	const NC_WAGES			= 2220;
	
	public function calcVat($x) {
		//return ($x / 47) * 7; // 17.5%
		return ($x / 6); // 20%
	}
	
	public function num_format($val) {
		return number_format($val, 2, '.', '');
	}
	
	public function askForDates() {
		global $live_url;
		?>
		
		<p>Please enter the start date &amp; number of weeks</p>
		
		<form action="<?php echo $live_url; ?>" method="post">
			<input type="hidden" name="step" value="gen_form" />
			<p>
				<label>Start Date (YYYY-MM-DD):</label>
				<input type="text" name="start_date" />
			</p>
			
			<p>
				<label># of weeks:</label>
				<input type="text" name="weeks" />
			</p>
			
			<p>
				<input type="submit" value="begin" />
			</p>
			
		</form>
		
		<?php
	
	}
	
	public function start() {
	
	
	}
	
	public function saveSession() {
		$_SESSION["sage"] = serialize($this);	
	}
	
	public function renderTransForm() {
		global $live_url;

		$start = strtotime($this->start_date);
		
		?>
		<style>
			.clear {
				clear: both;
			}
			.weekly {
				margin: 0 20px 0 0;
			}
			
			.weekly input {
				text-align: right;
			}
			
			.weekly .week {
				text-align: left;
			}
			</style>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
			
			<script>
			
				$(document).ready(function() {
					$("input[type='text']").change(function() {
						
						table = $(this).parents("table");
						wk_num = table.attr("id").replace("w_", "");
						 
						sum = 0;
						
						//sum += table.find("input[name='purchases[" + wk_num + "]']").val();
						
						sum += parseFloat($("input[name='purchases[" + wk_num + "]']").val());
						sum += parseFloat($("input[name='win[" + wk_num + "]']").val());
						sum += parseFloat($("input[name='wages[" + wk_num + "]']").val());
						sum += parseFloat($("input[name='vat_bank[" + wk_num + "]']").val());
						
						$("input[name='tot_vat[" + wk_num + "]']").val(sum);
						
					});
				});
			</script>
			<form action="<?php echo $live_url; ?>" method="post">
				<input type="hidden" name="step" value="generateCSV" />
		<?php
		$prev_month = 0;
		
		for ($i = 0; $i < $this->weeks; $i++) {
			$date = strtotime("+$i weeks", $start);
			
			$month = date("n", $date);
			
			if ($prev_month != 0 && $prev_month != $month) {
				echo "
				<div style=\"clear: both;\"></div>
				<hr />";
			}
			$prev_month = $month;
			?>
				<table class="weekly" style=" float: left;" id="w_<?php echo $i; ?>">
					<tr>
						<th colspan="3">
							Week <input class="week" type="text" name="week[<?php echo $i; ?>]" value="<?php echo date("d/m/Y", $date); ?>" />
						</th>
					</tr>
					<tr>
						<td>Purchases (5000)</td>
						<td></td>
						<td><input type="text" name="purchases[<?php echo $i; ?>]" /></td>
					</tr>
					<tr>
						<td>Windows (7801)</td>
						<td></td>
						<td><input type="text" name="win[<?php echo $i; ?>]" value="<?php echo $this->def_windows; ?>" /></td>
					</tr>
					<tr>
						<td>Wages (2220)</td>
						<td></td>
						<td><input type="text" name="wages[<?php echo $i; ?>]" /></td>
					</tr>
					<tr>
						<td>Vat B</td>
						<td></td>
						<td><input type="text" name="vat_bank[<?php echo $i; ?>]" /></td>
					</tr>
					<tr>
						<td>No Vat (4001)</td>
						<td></td>
						<td><input type="text" name="no_vat[<?php echo $i; ?>]" /></td>
					</tr>
					<tr>
						<td>Tot Vat (4000)</td>
						<td></td>
						<td><input type="text" name="tot_vat[<?php echo $i; ?>]" /></td>
					</tr>
						
				</table>
			<?php
		}
		?>
			
			<div class="clear"></div>
			<hr />
			<p>
				<input type="submit" value="Post" />
			</p>
			</form>
		<?php
	}
	
	public function generateCSV() {
		//var_dump($_REQUEST);
		//exit;
		
		$row = 0;
		
		$output = "";
		if (!is_array($_REQUEST['week'])) {
			echo "Missing week array. Nothing was done :(";
			return;
		}
		
		foreach ($_REQUEST['week'] as $week=>$date ) {
			
			/*
			 4000 - Tot Vat
			*/
			
			//calc net
			$vat = round(Sage::calcVat($_REQUEST['tot_vat'][$week]), 2);
			
			$output .= "\"CR\"," .
			Sage::ACC_TAKINGS . "," .
			Sage::NC_SALES_TAXABLE . "," .
			0 . "," .
			"\"$date\"," .
			"," .
			"," .
			$this->num_format($_REQUEST['tot_vat'][$week] - $vat) . "," .
			"\"T1\"," .
			$vat .
			"\r\n";				
			
			
			/*
			 4001 - No Vat
			*/
			
			
			$output .= "\"CR\"," .
			Sage::ACC_TAKINGS . "," .
			Sage::NC_SALES_NO_VAT . "," .
			0 . "," .
			"\"$date\"," .
			"," .
			"," .
			$this->num_format($_REQUEST['no_vat'][$week]) . "," .
			"\"T0\"," .
			0 .
			"\r\n";				
			
			
			/*
			 5000 - Purchases
			*/
			
			$output .= "\"CP\"," .
			Sage::ACC_TAKINGS . "," .
			Sage::NC_SALES . "," .
			0 . "," .
			"\"$date\"," .
			"," .
			"," .
			$this->num_format($_REQUEST['purchases'][$week]) . "," .
			"\"T0\"," .
			0 .
			"\r\n";				
			
			
			
			$output .= "\"CP\"," .
			Sage::ACC_TAKINGS . "," .
			Sage::NC_WINDOWS . "," .
			0 . "," .
			"\"$date\"," .
			"," .
			"," .
			$this->num_format($_REQUEST['win'][$week]) . "," .
			"\"T0\"," .
			0 .
			"\r\n";				
			
			
			
			$output .= "\"CP\"," .
			Sage::ACC_TAKINGS . "," .
			Sage::NC_WAGES . "," .
			0 . "," .
			"\"$date\"," .
			"," .
			"," .
			$this->num_format($_REQUEST['wages'][$week]) . "," .
			"\"T9\"," .
			0 .
			"\r\n";				
			
			
			$output .= "\"JC\"," .
			"," .
			Sage::ACC_TAKINGS . "," .
			0 . "," .
			"\"$date\"," .
			"\"TRANS\"," .
			"\"Bank Transfer\"," .
			$this->num_format($_REQUEST['vat_bank'][$week]) . "," .
			"\"T9\"," .
			0 .
			"\r\n";
			
			
			$output .= "\"JD\"," .
			"," .
			Sage::ACC_CURRENT . "," .
			0 . "," .
			"\"$date\"," .
			"\"TRANS\"," .
			"\"Bank Transfer\"," .
			$this->num_format($_REQUEST['vat_bank'][$week]) . "," .
			"\"T9\"," .
			0 .
			"\r\n";
			
			$output .= "\"JC\"," .
			"," .
			Sage::ACC_TAKINGS . "," .
			0 . "," .
			"\"$date\"," .
			"\"TRANS\"," .
			"\"Bank Transfer\"," .
			$this->num_format($_REQUEST['no_vat'][$week]) . "," .
			"\"T9\"," .
			0 .
			"\r\n";
			
			$output .= "\"JD\"," .
			"," .
			Sage::ACC_CURRENT . "," .
			0 . "," .
			"\"$date\"," .
			"\"TRANS\"," .
			"\"Bank Transfer\"," .
			$this->num_format($_REQUEST['no_vat'][$week]) . "," .
			"\"T9\"," .
			0 .
			"\r\n";
			
		}
		
		header("Content-type: text/csv");
		header('Content-Disposition: attachment; filename="sage_import.csv"');
		echo $output;
	}
	
}

/*
session_start();

if (isset($_SESSION["sage"])) {
	$sage = unserialize($_SESSION["sage"]);
}
else {
	$sage = new Sage();
}
*/
	
?>
