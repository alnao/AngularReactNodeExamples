<?php
	$host = 'localhost';
	$dbname='newdb';
	$user='root';
	$pass='A.1234qaz';
	$dbname='newdb';
	$pdo = new PDO("mysql:host=localhost", $user, $pass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$dbname = "`".str_replace("`","``",$dbname)."`";
	$pdo->query("CREATE DATABASE IF NOT EXISTS $dbname");
	$pdo->query("use $dbname");
	
	$dbname='newdb';
	$table = "book";
	$table2 ="user";

			try {
		 $db = new PDO ("mysql:host = $host;dbname=$dbname", $user,$pass);
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
		 $db = new PDO ("mysql:host = $host;dbname=$dbname", $user,$pass);
		 $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );//Error Handling
		 $query = $db->prepare("CREATE TABLE IF NOT EXISTS $table2(
					   `id` int(11) AUTO_INCREMENT,
					   `username` varchar(100) NOT NULL,
					   `password` varchar(100) NOT NULL,
					   `scadenza` varchar(100) NOT NULL,
					   `token` varchar(100) NOT NULL,
					   PRIMARY KEY(`id`))");
	$query->execute();
	}
	catch (PDOException $e) {
	  echo $e->getMessage();
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
