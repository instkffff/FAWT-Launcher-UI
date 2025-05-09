function switchMode(mode) {
    const leftBtn = document.querySelector('.toggle-left');
    const rightBtn = document.querySelector('.toggle-right');

    leftBtn.classList.remove('active');
    rightBtn.classList.remove('active');

    if (mode === 1) {
        leftBtn.classList.add('active');
    } else if (mode === 2) {
        rightBtn.classList.add('active');
    }
}