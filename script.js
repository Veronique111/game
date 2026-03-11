const square = document.getElementById("square");
const slider = document.getElementById("slider");
const wrapper = document.getElementById("imageWrapper");
const sound = document.getElementById("successSound");
const sliderContainer = document.getElementById("sliderContainer");

let successTriggered = false;
let timeoutHandle = null;

// Начальный угол рандомный от 0 до 359
const startAngle = Math.floor(Math.random() * 360);
let lastSliderValue = 0;
let currentAngle = startAngle;

// Устанавливаем начальное вращение квадрата
square.style.setProperty("--angle", `${startAngle}deg`);
slider.value = 0;

slider.addEventListener("input", () => {
    if (successTriggered) return;

    const newSliderValue = parseInt(slider.value);
    const delta = newSliderValue - lastSliderValue;
    lastSliderValue = newSliderValue;

    // Вращаем квадрат в обратную сторону (против часовой стрелки)
    currentAngle = currentAngle - delta;

    square.style.setProperty("--angle", `${currentAngle}deg`);

    // Нормализуем угол к [0, 360)
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;

    // Проверяем, близок ли угол к 0 (погрешность ±2 градуса)
    const diff = Math.min(normalizedAngle, 360 - normalizedAngle);
    const aligned = diff <= 2;

    if (aligned && !timeoutHandle) {
        timeoutHandle = setTimeout(() => {
            // Выравниваем угол ровно к 0
            currentAngle = 0;
            square.style.setProperty("--angle", `0deg`);

            // Скрываем слайдер, запускаем свечения
            sliderContainer.classList.add("hide");
            square.classList.add("glow");

            // Запускаем звук
            sound.volume = 1;
            sound.play();

            // Через 5 секунд начинаем затухание звука и растяжку квадрата
            setTimeout(() => {
                const fadeDuration = 2000; // 2 секунды затухания
                const fadeSteps = 20;
                let step = 0;

                const fadeInterval = setInterval(() => {
                    step++;
                    sound.volume = Math.max(0, 1 - step / fadeSteps);
                    if (step >= fadeSteps) {
                        clearInterval(fadeInterval);
                        sound.pause();
                        sound.currentTime = 0;

                        // Запускаем анимацию растяжки квадрата
                        square.classList.add("expand");
                        square.classList.add("clicker");
                        // ...

                        setTimeout(() => {

                            const boomSound = document.getElementById("boomSound");

                            square.addEventListener("click", () => {
                                boomSound.play();
                                document.getElementById("alertOverlay").classList.remove("hidden");
                            });


                            square.addEventListener("click", () => {
                                document.getElementById("alertOverlay").classList.remove("hidden");
                            });

                            document.getElementById("closeAlert").addEventListener("click", () => {
                                document.getElementById("alertOverlay").classList.add("hidden");
                                boomSound.pause();
                                // window.location.href = "https://b-lunch.ru";
                            });

                        }, 5000);




                    }
                }, fadeDuration / fadeSteps);
            }, 5000);

            successTriggered = true;
        }, 3000);
    } else if (!aligned) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
    }

});
