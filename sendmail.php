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
    $message = "Новый запрос с сайта:\n\n"
               . "Телефон: " . htmlspecialchars($phone_clean) . "\n"
               . "Время отправки: " . date('Y-m-d H:i:s');
    
    // Заголовки
    $headers = "Content-type: text/html; charset=utf-8\r\n"
           . "From: postmaster@regata.team\r\n"
           . "Reply-To: " . $phone_clean . "\r\n"
           . "X-Mailer: PHP/" . phpversion()
           . "MIME-Version: 1.0\r\n";
    
    // Отправка письма
if (mail($to, $subject, $message, $headers)) {
    header('Location: thank-you.html'); // Перенаправление на страницу благодарности
    exit;
} else {
    die(json_encode(['success' => false, 'error' => 'Ошибка при отправке формы']));
}
?>