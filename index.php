<?php


include ("config.php");

$step = (isset($_REQUEST["step"])) ? $_REQUEST["step"] : "get_dates";

$sage = new Sage();

switch ($step) {
	
	case "generateCSV":
		$sage->generateCSV();
		break;
	
	case "gen_form":
		$sage->start_date = $_REQUEST["start_date"];
		$sage->weeks = $_REQUEST["weeks"];
		$sage->renderTransForm();
		break;
	

	case "get_dates":
	default:
		$sage->askForDates();
		break;
    
}
?>