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
    // Используем <img> внутри слайда, адаптацию делаем через CSS object-fit

    // Создаем слайды для каждого элемента данных
    dataForCourses.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = '0';
        slide.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        slide.style.transform = 'translateX(100%)'; // Начальная позиция справа
        slide.style.borderRadius = '16px';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.location || 'Изображение слайда';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '16px';
        img.style.display = 'block';
        slide.appendChild(img);
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
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = '0';
        slide.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        slide.style.transform = 'translateX(100%)'; // Начальная позиция справа
        slide.style.borderRadius = '16px';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.alt || 'Фото из галереи';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.borderRadius = 'inherit';
        img.style.display = 'block';
        slide.appendChild(img);
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