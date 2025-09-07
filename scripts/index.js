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
    
    let currentIndex = 0;
    
    // Создаем индикаторы
    dataForCourses.forEach((_, index) => {
        const item = document.createElement('div');
        item.className = 'slider-item';
        if (index === 0) item.classList.add('slider-item-active');
        item.addEventListener('click', () => {
            setActiveCourse(index);
        });
        itemsContainer.appendChild(item);
    });
    
    // Обработчики для кнопок
    buttons[0].addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + dataForCourses.length) % dataForCourses.length;
        setActiveCourse(currentIndex);
    });
    
    buttons[1].addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % dataForCourses.length;
        setActiveCourse(currentIndex);
    });
    
    // Функция установки активного курса
    function setActiveCourse(index) {
        currentIndex = index;
        
        // Обновляем контент
        locationElement.textContent = dataForCourses[index].location;
        priceElement.textContent = dataForCourses[index].price;
        previewWrapper.style.backgroundImage = `url('${dataForCourses[index].image}')`;
        
        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('slider-item-active');
            } else {
                item.classList.remove('slider-item-active');
            }
        });
    }
    
    // Инициализация первого элемента
    setActiveCourse(0);
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
    
    let currentIndex = 0;
    
    // Создаем индикаторы
    dataForGallery.forEach((_, index) => {
        const item = document.createElement('div');
        item.className = 'slider-item';
        if (index === 0) item.classList.add('slider-item-active');
        item.addEventListener('click', () => {
            setActiveGalleryItem(index);
        });
        itemsContainer.appendChild(item);
    });
    
    // Обработчики для кнопок
    leftButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + dataForGallery.length) % dataForGallery.length;
        setActiveGalleryItem(currentIndex);
    });
    
    rightButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % dataForGallery.length;
        setActiveGalleryItem(currentIndex);
    });
    
    // Функция установки активного элемента галереи
    function setActiveGalleryItem(index) {
        currentIndex = index;
        
        // Обновляем фон
        galleryImage.style.backgroundImage = `url('${dataForGallery[index].image}')`;
        
        // Обновляем индикаторы
        const items = itemsContainer.querySelectorAll('.slider-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('slider-item-active');
            } else {
                item.classList.remove('slider-item-active');
            }
        });
    }
    
    // Инициализация первого элемента
    setActiveGalleryItem(0);
}