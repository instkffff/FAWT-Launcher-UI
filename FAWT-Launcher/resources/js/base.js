function switchMode(mode) {
    const leftBtn = document.querySelector('.toggle-left');
    const rightBtn = document.querySelector('.toggle-right');
    const menusim = document.querySelector('#menu-sim');
    const menureal = document.querySelector('#menu-real');

    // 判断是否已经处于目标模式，如果是则直接返回
    if ((mode === 1 && leftBtn.classList.contains('active')) ||
        (mode === 2 && rightBtn.classList.contains('active'))) {
        return;
    }

    // 移除所有按钮的 active 类
    leftBtn.classList.remove('active');
    rightBtn.classList.remove('active');

    // 添加 shadow 类
    leftBtn.classList.add('shadow');
    rightBtn.classList.add('shadow');

    let activeBtn;

    if (mode === 1) {
        activeBtn = leftBtn;
        menusim.classList.remove('display-none');
        menusim.classList.add('display-show');
        menureal.classList.remove('display-show');
        menureal.classList.add('display-none');
    } else if (mode === 2) {
        activeBtn = rightBtn;
        menusim.classList.remove('display-show');
        menusim.classList.add('display-none');
        menureal.classList.remove('display-none');
        menureal.classList.add('display-show');
    }

    // 使用 setTimeout 来在切换后移除 shadow 类
    setTimeout(() => {
        leftBtn.classList.remove('shadow');
        rightBtn.classList.remove('shadow');
    }, 100); // 可根据需要调整时间

    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.add('shadow');
    }
}