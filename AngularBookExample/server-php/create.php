<?php
// Create database and table
// Run this file once to create the database and table
// Adjust the configuration in the .env file
// Then run this file from the command line: php create.php	

echo __DIR__;
require_once __DIR__ . '/env.php';
loadEnv(__DIR__ . '/.env');

$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$port = isset($_ENV['DB_PORT']) ? $_ENV['DB_PORT'] : 3306;

$pdo = new PDO("mysql:host=$host;port=$port", $user, $pass, [
	PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
]);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//$dbname = "`".str_replace("`","``",$dbname)."`";
$pdo->query("CREATE DATABASE IF NOT EXISTS $dbname");
$pdo->query("use $dbname");

$table = "book";
$table2 ="user";

try {
	$db = new PDO ("mysql:host=$host;port=$port;dbname=$dbname", $user,$pass, [
		PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
	]);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
	$query = $db->prepare("CREATE TABLE IF NOT EXISTS $table(
				`id` int(11) AUTO_INCREMENT,
				`title` varchar(100) NOT NULL,
				`author` varchar(100) NOT NULL,
				`price` float NOT NULL,
				`isbn` varchar(100) NOT NULL,
				`description` text NOT NULL,
				`img` mediumtext NOT NULL,
				PRIMARY KEY(`id`))");
	$query->execute();
}
	catch (PDOException $e) {
	echo $e->getMessage();
	die();
}
$title = 'Il nome della Rosa';
$author = 'Umberto Eco';
$price = 30;
$isbn = '875-254-214-14';
$description = 'Demo Il nome della rosa';
$img='';
try {
	$sql = "INSERT INTO book (title,author,price,isbn,description,img)
VALUES('$title','$author','$price','$isbn','$description','$img')";
	$db->exec($sql);
}catch(PDOException $e) {
	echo $sql ."<br/>" . $e->getMessage();
} 

try {
	$db = new PDO ("mysql:host=$host;port=$port;dbname=$dbname", $user,$pass, [
	PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
]);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
	$query = $db->prepare("CREATE TABLE IF NOT EXISTS $table2(
				`id` int(11) AUTO_INCREMENT,
				`username` varchar(100) NOT NULL,
				`password` varchar(100) NOT NULL,
				`scadenza` varchar(100) NOT NULL,
				`token` varchar(100) NOT NULL,
				PRIMARY KEY(`id`))");
	$query->execute();
}catch (PDOException $e) {
	echo $e->getMessage();
	die();
}
$username = 'demo';
$password = 'demo';
$scadenza = '30000';
$token = '';
try {
	$sql = "INSERT INTO user (username,password,scadenza,token)
VALUES('$username','$password','$scadenza' ,'$token')";
	$db->exec($sql);
}catch(PDOException $e) {
	echo $sql ."<br/>" . $e->getMessage();
}
//	$pdo = null;
echo "Database and table $table created successfully";