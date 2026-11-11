<?php
/*
 * Login: verifica username/password e restituisce un JWT firmato (HS256).
 *
 * Richiesta:  POST /auth/index.php   body JSON {"username": "...", "password": "..."}
 *             (accetta anche i parametri form username/password)
 * Risposta:   200 {"token": "<jwt>", "scadenza": <secondi>}
 *             401 {"msg": "Credenziali errate", "error": 1}
 *
 * Regole di sicurezza mostrate in questo esempio:
 * - le password sono salvate solo come hash (password_hash) e verificate con password_verify;
 * - il payload del JWT contiene solo dati non sensibili (sub, iat, exp): il payload è
 *   leggibile da chiunque con una decodifica base64, quindi MAI inserirvi la password;
 * - il segreto di firma (JWT_SECRET) è letto dal file .env, non è scritto nel codice;
 * - tutte le query usano prepared statement.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Expose-Headers: Content-Length, X-JSON");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit();
}

function rispondi(int $status, array $body): void {
	http_response_code($status);
	echo json_encode($body);
	exit();
}

function base64UrlEncode(string $data): string {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header('Allow: POST, OPTIONS');
	rispondi(405, ['msg' => 'Usare il metodo POST', 'error' => 1]);
}

/* CONFIGURAZIONE (stesso file .env di api.php e create.php) */
require_once dirname(__DIR__) . '/env.php';
loadEnv(dirname(__DIR__) . '/.env');

$jwtSecret = $_ENV['JWT_SECRET'] ?? '';
if (strlen($jwtSecret) < 32) {
	// Meglio fallire che firmare token con un segreto debole o vuoto.
	rispondi(500, ['msg' => 'JWT_SECRET mancante o troppo corto (minimo 32 caratteri) nel file .env', 'error' => 1]);
}

/* CONN DB */
$host = $_ENV['DB_HOST'] ?? 'localhost';
$dbname = $_ENV['DB_NAME'] ?? '';
$user = $_ENV['DB_USER'] ?? '';
$pass = $_ENV['DB_PASS'] ?? '';
$port = $_ENV['DB_PORT'] ?? 3306;

try {
	$dbh = new PDO("mysql:host=$host;dbname=$dbname;port=$port", $user, $pass, [
		PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
	]);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	error_log('Connessione DB fallita: ' . $e->getMessage());
	rispondi(500, ['msg' => 'Errore connessione al database', 'error' => 1]);
}
/* END CONN DB */

/* INPUT: JSON oppure parametri form */
$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
	$input = $_POST;
}
$username = isset($input['username']) ? trim((string) $input['username']) : '';
$password = isset($input['password']) ? (string) $input['password'] : '';

if ($username === '' || $password === '') {
	rispondi(400, ['msg' => 'username e password sono obbligatori', 'error' => 1]);
}

/* VERIFICA CREDENZIALI */
try {
	$stmt = $dbh->prepare('SELECT username, password, scadenza FROM user WHERE username = :username');
	$stmt->execute(['username' => $username]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
	error_log('Lettura utente fallita: ' . $e->getMessage());
	rispondi(500, ['msg' => 'Errore lettura utente', 'error' => 1]);
}

// Stesso messaggio per utente inesistente e password errata: non si rivela quali username esistono.
if (!$row || !password_verify($password, $row['password'])) {
	rispondi(401, ['msg' => 'Credenziali errate', 'error' => 1]);
}

// Se l'algoritmo di default di PHP cambia, l'hash viene aggiornato al primo login riuscito.
if (password_needs_rehash($row['password'], PASSWORD_DEFAULT)) {
	$upd = $dbh->prepare('UPDATE user SET password = :hash WHERE username = :username');
	$upd->execute(['hash' => password_hash($password, PASSWORD_DEFAULT), 'username' => $username]);
}

/* CREAZIONE JWT */
$durata = max(60, (int) $row['scadenza']); // secondi
$adesso = time();
$header = base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
$payload = base64UrlEncode(json_encode([
	'sub' => $row['username'],
	'iat' => $adesso,
	'exp' => $adesso + $durata,
]));
$signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", $jwtSecret, true));
$jwt = "$header.$payload.$signature";

// Il token non viene salvato nel database: un JWT si verifica con la firma e il campo exp.
rispondi(200, ['token' => $jwt, 'scadenza' => $durata]);
