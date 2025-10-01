<?php 
	require_once __DIR__ . '/env.php';
	loadEnv(__DIR__ . '/.env');

	$host = $_ENV['DB_HOST'];
	$dbname = $_ENV['DB_NAME'];
	$user = $_ENV['DB_USER'];
	$pass = $_ENV['DB_PASS'];
   
   echo "<h1>funziona</h1>"; 
?>