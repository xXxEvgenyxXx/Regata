// index.js
import { dataForCourses, dataForGallery } from './data.js';

// Инициализация слайдеров после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем слайдеры');
    initCoursesSlider();
    initGallerySlider();
    initPhoneInputMask();
});

// Маска ввода телефона + клиентская валидация
function initPhoneInputMask() {
    const phoneInput = document.getElementById('phoneInput');
    const form = document.querySelector('form.contact-form');
    if (!phoneInput || !form) return;

    // Установим плейсхолдер по формату
    phoneInput.setAttribute('placeholder', '+7 (___) ___-__-__');

    function formatPhone(value) {
        const digits = value.replace(/\D/g, '');
        let result = '+7 ';
        // Если пользователь начал не с 7 или 8 — насильно приводим к 7
        let numbers = digits;
        if (numbers.startsWith('7')) {
            numbers = numbers.slice(1);
        } else if (numbers.startsWith('8')) {
            numbers = numbers.slice(1);
        }
        // Собираем по маске (XXX) XXX-XX-XX
        if (numbers.length > 0) result += '(' + numbers.substring(0, Math.min(3, numbers.length));
        if (numbers.length >= 3) result += ') ' + numbers.substring(3, Math.min(6, numbers.length));
        if (numbers.length >= 6) result += '-' + numbers.substring(6, Math.min(8, numbers.length));
        if (numbers.length >= 8) result += '-' + numbers.substring(8, Math.min(10, numbers.length));
        return result.trim();
    }

    function handleInput(e) {
        const raw = e.target.value;
        // Разрешим вводить только цифры, пробелы и знаки форматирования, затем переформатируем
        const cleaned = raw.replace(/[^\d+]/g, '');
        let withCountry = cleaned;
        if (!withCountry.startsWith('+7')) {
            withCountry = '+7' + withCountry.replace(/^\+?7?/, '');
        }
        e.target.value = formatPhone(withCountry);
    }

    function isValidPhone(inputValue) {
        const onlyDigits = inputValue.replace(/\D/g, '');
        // Ожидаем 11 цифр с начальной 7
        return /^7\d{10}$/.test(onlyDigits);
    }

    phoneInput.addEventListener('input', handleInput);
    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value) phoneInput.value = '+7 ';
    });
    phoneInput.addEventListener('blur', () => {
        if (!isValidPhone(phoneInput.value)) {
            // Если номер неполный — очищаем поле
            phoneInput.value = '';
        }
    });

    // Контейнер для статуса
    let statusEl = document.querySelector('.form-status');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status';
        statusEl.style.marginTop = '12px';
        statusEl.style.fontSize = '14px';
        statusEl.style.lineHeight = '1.4';
        statusEl.style.minHeight = '20px';
        form.appendChild(statusEl);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!isValidPhone(phoneInput.value)) {
            statusEl.style.color = '#ff6b6b';
            statusEl.textContent = 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправляем...';
            }
            statusEl.style.color = '#888';
            statusEl.textContent = 'Отправка...';

            const digits = phoneInput.value.replace(/\D/g, '');
            const normalized = '+' + digits; // +7XXXXXXXXXX

            const formData = new URLSearchParams();
            formData.set('phone', normalized);

            const response = await fetch(form.getAttribute('action') || 'sendmail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formData.toString()
            });

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const payload = isJson ? await response.json() : null;

            if (response.ok && payload && payload.success) {
                statusEl.style.color = '#2e7d32';
                statusEl.textContent = payload.message || 'Заявка успешно отправлена';
                form.reset();
            } else {
                const errorText = payload?.error || 'Не удалось отправить заявку. Попробуйте позже.';
                statusEl.style.color = '#ff6b6b';
                statusEl.textContent = errorText;
            }
        } catch (err) {
            statusEl.style.color = '#ff6b6b';
            statusEl.textContent = 'Ошибка сети. Проверьте соединение и попробуйте снова.';
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}

// Функция для инициализации слайдера курсов
function initCoursesSlider() {
    console.log('Инициализация слайдера курсов');
    const slider = document.getElementById('slider-for-courses');
    if (!slider) {
        console.error('Слайдер курсов не найден!');
        return;
    }
    const itemsContainer = slider.querySelector('.slider-items');
    const buttons = slider.querySelectorAll('.slider-button');
    const locationElement = document.querySelector('.courses-preview-location');
    const priceElement = document.querySelector('.courses-preview-price');
    const previewWrapper = document.querySelector('.courses-preview-wrapper');

    // Создаем контейнер для слайдов внутри .courses-preview-wrapper
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'slides-container';
    previewWrapper.appendChild(slidesContainer);
    const images = [];
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = url;
        });
    }
    Promise.all(dataForCourses.map(item => loadImage(item.image)))
        .then(dimensions => {
            dimensions.forEach((dim, index) => {
                images[index] = dim;
            });
            // Установка размеров для первого изображения
            setBackgroundSize(previewWrapper, images[0]);
        })
        .catch(error => {
            console.error('Ошибка загрузки изображений:', error);
        });

    // Создаем слайды для каждого элемента данных
    dataForCourses.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.backgroundImage = `url('${item.image}')`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = '0';
        slide.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        slide.style.transform = 'translateX(100%)'; // Начальная позиция справа
        slidesContainer.appendChild(slide);

        // Создаем индикаторы
        const indicator = document.createElement('div');
        indicator.className = 'slider-item';
        if (index === 0) {
            indicator.classList.add('slider-item-active');
            slide.style.opacity = '1';
            slide.style.transform = 'translateX(0)'; // Первый слайд по центру
        }
        indicator.addEventListener('click', () => {
            setActiveCourse(index);
        });
        itemsContainer.appendChild(indicator);
    });

    let currentIndex = 0;

    // Обработчики для кнопок
    buttons[0].addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + dataForCourses.length) % dataForCourses.length;
        setActiveCourse(newIndex, 'left');
    });
    buttons[1].addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % dataForCourses.length;
        setActiveCourse(newIndex, 'right');
    });

    // Функция установки активного курса
    function setActiveCourse(index, direction) {
        if (currentIndex === index) return;

        const slides = slidesContainer.querySelectorAll('.slide');
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        // Устанавливаем начальные позиции для анимации
        if (direction === 'right') {
            // Для движения вправо: текущий уезжает влево, новый заезжает справа
            nextSlide.style.transform = 'translateX(100%)';
            nextSlide.style.opacity = '1';
            
            setTimeout(() => {
                currentSlide.style.transform = 'translateX(-100%)';
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        } else {
            // Для движения влево: текущий уезжает вправо, новый заезжает слева
            nextSlide.style.transform = 'translateX(-100%)';
            nextSlide.style.opacity = '1';
            
            setTimeout(() => {
                currentSlide.style.transform = 'translateX(100%)';
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        }

        // Обновляем контент
        locationElement.textContent = dataForCourses[index].location;
        priceElement.textContent = dataForCourses[index].price;

        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            item.classList.toggle('slider-item-active', i === index);
        });

        // Сбрасываем состояние после анимации
        setTimeout(() => {
            currentSlide.style.opacity = '0';
            currentIndex = index;
        }, 500);
        setBackgroundSize(previewWrapper, images[index]);
    }
    function setBackgroundSize(element, dimensions) {
        element.style.width = `${dimensions.width}px`;
        element.style.height = `${dimensions.height}px`;
    }
}

// Функция для инициализации слайдера галереи
// Функция для инициализации слайдера галереи
function initGallerySlider() {
    console.log('Инициализация слайдера галереи');
    const slider = document.getElementById('slider-for-gallery');
    if (!slider) {
        console.error('Слайдер галереи не найден!');
        return;
    }
    const itemsContainer = slider.querySelector('.slider-items');
    const leftButton = slider.querySelector('.slider-button-left');
    const rightButton = slider.querySelector('.slider-button-right');
    const galleryImage = document.querySelector('.gallery-image');

    // Сохраняем исходные классы и стили galleryImage
    const originalClasses = galleryImage.className;
    const originalStyle = galleryImage.getAttribute('style') || '';

    // Создаем контейнер для слайдов
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'gallery-slides-container';
    slidesContainer.style.position = 'relative';
    slidesContainer.style.width = '100%';
    slidesContainer.style.height = '100%';
    slidesContainer.style.borderRadius = 'inherit';
    galleryImage.innerHTML = '';
    galleryImage.appendChild(slidesContainer);
    galleryImage.className = originalClasses;
    galleryImage.setAttribute('style', originalStyle);

    // Для галереи не фиксируем размеры контейнера под реальный размер фото,
    // чтобы сохранять адаптивную вёрстку. Масштабирование делаем через background-size: contain.

    // Создаем слайды
    dataForGallery.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.style.backgroundImage = `url('${item.image}')`;
        slide.style.backgroundSize = 'contain';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.borderRadius = 'inherit';
        slide.style.opacity = '0';
        slide.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        slide.style.transform = 'translateX(100%)'; // Начальная позиция справа
        slidesContainer.appendChild(slide);

        // Создаем индикаторы
        const indicator = document.createElement('div');
        indicator.className = 'slider-item';
        if (index === 0) {
            indicator.classList.add('slider-item-active');
            slide.style.opacity = '1';
            slide.style.transform = 'translateX(0)'; // Первый слайд по центру
        }
        indicator.addEventListener('click', () => {
            setActiveGalleryItem(index);
        });
        itemsContainer.appendChild(indicator);
    });

    let currentIndex = 0;

    // Обработчики для кнопок
    leftButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + dataForGallery.length) % dataForGallery.length;
        setActiveGalleryItem(newIndex, 'left');
    });
    rightButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % dataForGallery.length;
        setActiveGalleryItem(newIndex, 'right');
    });

    // Функция установки активного элемента галереи
    function setActiveGalleryItem(index, direction) {
        if (currentIndex === index) return;

        const slides = slidesContainer.querySelectorAll('.gallery-slide');
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        // Устанавливаем начальные позиции
        if (direction === 'right') {
            // Для движения вправо: текущий уезжает влево, новый заезжает справа
            nextSlide.style.transform = 'translateX(100%)';
            nextSlide.style.opacity = '1';
            
            setTimeout(() => {
                currentSlide.style.transform = 'translateX(-100%)';
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        } else {
            // Для движения влево: текущий уезжает вправо, новый заезжает слева
            nextSlide.style.transform = 'translateX(-100%)';
            nextSlide.style.opacity = '1';
            
            setTimeout(() => {
                currentSlide.style.transform = 'translateX(100%)';
                nextSlide.style.transform = 'translateX(0)';
            }, 10);
        }

        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            item.classList.toggle('slider-item-active', i === index);
        });

        // Сбрасываем состояние после анимации
        setTimeout(() => {
            currentSlide.style.opacity = '0';
            currentIndex = index;
        }, 500);

        // Размеры контейнера не изменяем — сохраняем адаптивность блока галереи
    }

}