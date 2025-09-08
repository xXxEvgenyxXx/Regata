<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    
    // Валидация номера телефона
    if (empty($phone)) {
        echo json_encode(['success' => false, 'error' => 'Пожалуйста, введите номер телефона']);
        exit;
    }
    
    // Очистка номера от лишних символов
    $phone_clean = preg_replace('/[^+\d]/', '', $phone); // Оставляем только цифры и знак плюс
    $phone_pattern = '/^\+7\d{10}$/';
    
    if (!preg_match($phone_pattern, $phone_clean)) {
        echo json_encode(['success' => false, 'error' => 'Введите корректный номер телефона']);
        exit;
    }
    
    // Настройки письма
    $to = 'fox.celesta@yandex.ru'; // Замените на свой email
    $subject = 'Заявка на корпоративную регату';
    $message = '<html><body>'
        . '<h2>Новая заявка с сайта</h2>'
        . '<p><strong>Телефон:</strong> ' . htmlspecialchars($phone_clean) . '</p>'
        . '<p><strong>Время отправки:</strong> ' . date('Y-m-d H:i:s') . '</p>'
        . '</body></html>';
    
    // Заголовки
    $headers = '';
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: REGATA <postmaster@regata.team>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Параметры отправки (Envelope From) для лучшей доставляемости
    $params = '-f postmaster@regata.team';
    
    // Отправка письма
    header('Content-Type: application/json; charset=UTF-8');
    if (mail($to, $subject, $message, $headers, $params)) {
        echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
        exit;
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Ошибка при отправке формы']);
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не поддерживается']);
}
?>