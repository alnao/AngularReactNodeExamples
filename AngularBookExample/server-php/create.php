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
	$stmt = $db->prepare("INSERT INTO book (title,author,price,isbn,description,img) VALUES (?,?,?,?,?,?)");
	$stmt->execute([$title, $author, $price, $isbn, $description, $img]);
}catch(PDOException $e) {
	echo $e->getMessage();
} 

try {
	$db = new PDO ("mysql:host=$host;port=$port;dbname=$dbname", $user,$pass, [
	PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
]);
	$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
	// password: contiene solo l'hash prodotto da password_hash(), mai la password in chiaro.
	// VARCHAR(255) come raccomandato dalla documentazione PHP (l'hash può crescere in futuro).
	// scadenza: durata del token JWT in secondi.
	$query = $db->prepare("CREATE TABLE IF NOT EXISTS $table2(
				`id` int(11) AUTO_INCREMENT,
				`username` varchar(100) NOT NULL UNIQUE,
				`password` varchar(255) NOT NULL,
				`scadenza` varchar(100) NOT NULL,
				PRIMARY KEY(`id`))");
	$query->execute();
	// Tabelle create con la versione precedente di questo script: colonna password troppo corta per un hash.
	$db->exec("ALTER TABLE $table2 MODIFY `password` varchar(255) NOT NULL");
}catch (PDOException $e) {
	echo $e->getMessage();
	die();
}
// Utente di prova: SOLO per sviluppo locale. Cambiare password (o rimuoverlo) prima di esporre il server.
$username = 'demo';
$password = 'demo';
$scadenza = '30000'; // secondi
$hash = password_hash($password, PASSWORD_DEFAULT);
try {
	$stmt = $db->prepare("SELECT id FROM user WHERE username = ?");
	$stmt->execute([$username]);
	if ($stmt->fetch()) {
		// Esiste già (magari con la password in chiaro della versione precedente): aggiorna l'hash.
		$stmt = $db->prepare("UPDATE user SET password = ?, scadenza = ? WHERE username = ?");
		$stmt->execute([$hash, $scadenza, $username]);
	} else {
		$stmt = $db->prepare("INSERT INTO user (username,password,scadenza) VALUES (?,?,?)");
		$stmt->execute([$username, $hash, $scadenza]);
	}
}catch(PDOException $e) {
	echo $e->getMessage();
}
//	$pdo = null;
echo "Database and table $table created successfully";