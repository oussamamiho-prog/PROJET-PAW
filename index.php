<?php
session_start();

$host = "localhost";
$dbname = "attendance_db";
$user = "root";   
$pass = "";       

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("DB connection error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection error"]);
    exit;
}