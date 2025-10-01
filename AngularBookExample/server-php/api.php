<?php
/*METHOD GET AND GET WITH GET ID*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: PUT,PATCH, POST, GET, OPTIONS, DELETE");

/*CONN DB*/
	require_once __DIR__ . '/env.php';
	loadEnv(__DIR__ . '/.env');

	$host = $_ENV['DB_HOST'];
	$dbname = $_ENV['DB_NAME'];
	$user = $_ENV['DB_USER'];
	$pass = $_ENV['DB_PASS'];
    $port = isset($_ENV['DB_PORT']) ? $_ENV['DB_PORT'] : 3306;

try {
    $dbh = new PDO ("mysql:host=$host;dbname=$dbname;port=$port", $user, $pass, [
		PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
	]);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Errore connessione al database !' . $e->getMessage();
    die();
}
/*END CONN DB*/

$json = trim(file_get_contents('php://input'));
$input = json_decode($json, true);
$method = $_SERVER['REQUEST_METHOD'];


if (isset ($_GET['id'])) {
    $id = $_GET['id'];

    try {
        $sql = 'SELECT *FROM book WHERE id = :id';
        $stmt = $dbh->prepare($sql);
        $id = $id;
        $stmt->execute(['id' => $id]);
        $rows = $stmt->fetch();
        echo json_encode($rows);
    } catch (PDOException $e) {
        echo 'Errore select tabella !' . $e->getMessage();
        die();
    }
} else {
    try {
        $sql = 'SELECT *FROM book';
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    } catch (PDOException $e) {
        echo 'Errore select tabella !' . $e->getMessage();
        die();
    }

}

switch ($method) {
    case 'PATCH':
        $id = $_GET['id'];
        $title = $input["title"];
        $author = $input["author"];
        $price = $input["price"];
        $isbn = $input["isbn"];
        $description = $input["description"];
        $img = $input["img"];
        try {
            $sql = "UPDATE book SET title=?, author=?, price=?,isbn=?,description=? ,img=? WHERE id=?";
            $stmt = $dbh->prepare($sql);
            $stmt->execute([$title, $author, $price, $isbn, $description, $img, $id]);
        } catch (PDOException $e) {
            echo $sql . "<br/>" . $e->getMessage();
        }
        break;

    case 'POST':
        $title = $input["title"];
        $author = $input["author"];
        $price = $input["price"];
        $isbn = $input["isbn"];
        $description = $input["description"];
        $img = $input["img"];
        try {
            $sql = "INSERT INTO book (title,author,price,isbn,description,img)
		VALUES('$title','$author','$price' ,'$isbn','$description','$img')";
            $dbh->exec($sql);
        } catch (PDOException $e) {
            echo $sql . "<br/>" . $e->getMessage();
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        try {
            $sql = "Delete From book WHERE id= :id";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
        } catch (PDOException $e) {
            echo $sql . "<br/>" . $e->getMessage();
        }
        break;
}


