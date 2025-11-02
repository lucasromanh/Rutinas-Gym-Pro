<?php
header('Content-Type: application/json');

echo json_encode([
    'status' => 'ok',
    'message' => 'Mock endpoint listo para Hostinger/MySQL',
    'timestamp' => gmdate('c'),
]);
