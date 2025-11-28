<?php
header('Content-Type: application/json');

require_once DIR . '/config.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if ($username === '' || $password === '') {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = :u LIMIT 1");
    $stmt->execute(["u" => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $hash = hash('sha256', $password);

    if (!$user || $user['password_hash'] !== $hash) {
        echo json_encode(["success" => false, "message" => "Invalid username or password"]);
        exit;
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        "success" => true,
        "role" => $user['role'],
        "full_name" => $user['username']
    ]);
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error"]);
}