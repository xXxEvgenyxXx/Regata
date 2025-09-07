// index.js
import { dataForCourses, dataForGallery } from './data.js';

// Инициализация слайдеров после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем слайдеры');
    initCoursesSlider();
    initGallerySlider();
});

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
        slide.style.transition = 'all 0.5s ease-out';
        slidesContainer.appendChild(slide);

        // Создаем индикаторы
        const indicator = document.createElement('div');
        indicator.className = 'slider-item';
        if (index === 0) {
            indicator.classList.add('slider-item-active');
            slide.style.opacity = '1'; // Показываем первый слайд
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
        setActiveCourse(newIndex, true); // true для анимации "назад"
    });
    buttons[1].addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % dataForCourses.length;
        setActiveCourse(newIndex, false); // false для анимации "вперед"
    });

    // Функция установки активного курса
    function setActiveCourse(index, isReverse = false) {
        if (currentIndex === index) return; // Если слайд тот же, ничего не делаем

        const slides = slidesContainer.querySelectorAll('.slide');
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        // Добавляем классы для анимации
        if (isReverse) {
            // Анимация для кнопки "назад"
            currentSlide.classList.add('slide-exit-reverse');
            nextSlide.classList.add('slide-enter-reverse');
            setTimeout(() => {
                currentSlide.classList.add('slide-exit-reverse-active');
                nextSlide.classList.add('slide-enter-reverse-active');
            }, 10);
        } else {
            // Анимация для кнопки "вперед"
            currentSlide.classList.add('slide-exit');
            nextSlide.classList.add('slide-enter');
            setTimeout(() => {
                currentSlide.classList.add('slide-exit-active');
                nextSlide.classList.add('slide-enter-active');
            }, 10);
        }

        // Обновляем контент после начала анимации
        locationElement.textContent = dataForCourses[index].location;
        priceElement.textContent = dataForCourses[index].price;

        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('slider-item-active');
            } else {
                item.classList.remove('slider-item-active');
            }
        });

        // Очищаем классы анимации после ее завершения
        setTimeout(() => {
            currentSlide.classList.remove('slide-exit', 'slide-exit-active', 'slide-exit-reverse', 'slide-exit-reverse-active');
            nextSlide.classList.remove('slide-enter', 'slide-enter-active', 'slide-enter-reverse', 'slide-enter-reverse-active');
            currentSlide.style.opacity = '0';
            nextSlide.style.opacity = '1';
            currentIndex = index;
        }, 500); // Должно совпадать с длительностью transition в CSS
    }

    // Инициализация первого элемента уже выполнена при создании слайдов
}

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

    // Создаем контейнер для слайдов внутри .gallery-image
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'gallery-slides-container';
    slidesContainer.style.position = 'relative';
    slidesContainer.style.width = '100%';
    slidesContainer.style.height = '100%';
    slidesContainer.style.borderRadius = 'inherit'; // Наследуем border-radius
    galleryImage.innerHTML = ''; // Очищаем содержимое
    galleryImage.appendChild(slidesContainer);

    // Восстанавливаем исходные классы и стили
    galleryImage.className = originalClasses;
    galleryImage.setAttribute('style', originalStyle);

    // Создаем слайды для каждого элемента данных
    dataForGallery.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.style.backgroundImage = `url('${item.image}')`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.borderRadius = 'inherit'; // Наследуем border-radius
        slide.style.opacity = '0';
        slide.style.transition = 'all 0.5s ease-out';
        slidesContainer.appendChild(slide);

        // Создаем индикаторы
        const indicator = document.createElement('div');
        indicator.className = 'slider-item';
        if (index === 0) {
            indicator.classList.add('slider-item-active');
            slide.style.opacity = '1'; // Показываем первый слайд
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
        setActiveGalleryItem(newIndex, true); // true для анимации "назад"
    });
    
    rightButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % dataForGallery.length;
        setActiveGalleryItem(newIndex, false); // false для анимации "вперед"
    });

    // Функция установки активного элемента галереи
    function setActiveGalleryItem(index, isReverse = false) {
        if (currentIndex === index) return; // Если слайд тот же, ничего не делаем

        const slides = slidesContainer.querySelectorAll('.gallery-slide');
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        // Добавляем классы для анимации
        if (isReverse) {
            // Анимация для кнопки "назад" - сдвиг вправо
            currentSlide.classList.add('gallery-slide-exit-reverse');
            nextSlide.classList.add('gallery-slide-enter-reverse');
            setTimeout(() => {
                currentSlide.classList.add('gallery-slide-exit-reverse-active');
                nextSlide.classList.add('gallery-slide-enter-reverse-active');
            }, 10);
        } else {
            // Анимация для кнопки "вперед" - сдвиг влево
            currentSlide.classList.add('gallery-slide-exit');
            nextSlide.classList.add('gallery-slide-enter');
            setTimeout(() => {
                currentSlide.classList.add('gallery-slide-exit-active');
                nextSlide.classList.add('gallery-slide-enter-active');
            }, 10);
        }

        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('slider-item-active');
            } else {
                item.classList.remove('slider-item-active');
            }
        });

        // Очищаем классы анимации после ее завершения
        setTimeout(() => {
            currentSlide.classList.remove('gallery-slide-exit', 'gallery-slide-exit-active', 'gallery-slide-exit-reverse', 'gallery-slide-exit-reverse-active');
            nextSlide.classList.remove('gallery-slide-enter', 'gallery-slide-enter-active', 'gallery-slide-enter-reverse', 'gallery-slide-enter-reverse-active');
            currentSlide.style.opacity = '0';
            nextSlide.style.opacity = '1';
            currentIndex = index;
        }, 500); // Добавляем задержку 500ms
    }

    // Инициализация первого элемента уже выполнена при создании слайдов
}