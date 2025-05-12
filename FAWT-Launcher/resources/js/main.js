document.body.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        event.target.classList.add('shadow');

        setTimeout(() => {
            event.target.classList.remove('shadow');
        }, 100);
    }
});

async function switchMode(mode) {
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
        await stopCommand('camera')
        await stopCommand('middleware')
        await stopCommand('main')
        activeBtn = leftBtn;
        menusim.classList.remove('display-none');
        menusim.classList.add('display-show');
        menureal.classList.remove('display-show');
        menureal.classList.add('display-none');
    } else if (mode === 2) {
        await stopCommand('simcamera')
        await stopCommand('middlewaretest')
        await stopCommand('testclient')
        await stopCommand('main')
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



const mainStatus = document.querySelector('#main');
const mainStatus1 = document.querySelector('#main1');
const middlewareStatus = document.querySelector('#middleware');
const cameraStatus = document.querySelector('#camera');
const simcameraStatus = document.querySelector('#simcamera');
const testclientStatus = document.querySelector('#testclient');
const middlewaretestStatus = document.querySelector('#middlewaretest');

// define commands

// 提取公共路径
// const path = "C:\\Users\\NightCandle\\Desktop\\drone-system";

const path = '.'

// 定义命令列表
const commandsList = {
    serve: `npm -C "${path}" run serve`,
    main: `node "${path}\\server\\index.js"`,
    middleware: `node "${path}\\FAWT-COMM\\socketServer\\serverFinal.js" --test = false`,
    middlewaretest: `node "${path}\\FAWT-COMM\\socketServer\\serverFinal.js" --test = true`,
    testclient: `node "${path}\\FAWT-COMM\\socketClient\\startClient.js"`,
    camera: `python "${path}\\FAWT-COMM\\camera\\cameraWs.py"`,
    simcamera: `node "${path}\\FAWT-COMM\\camera\\simulated\\wsServer.js"`,
};

let pidList = {
    main: null,
    middleware: null,
    middlewaretest: null,
    testclient: null,
    camera: null,
    simcamera: null,
};

let idList = {
    main: null,
    middleware: null,
    middlewaretest: null,
    testclient: null,
    camera: null,
    simcamera: null,
}

let statusList = {
    main: [mainStatus, mainStatus1],
    middleware: middlewareStatus,
    camera: cameraStatus,
    simcamera: simcameraStatus,
    testclient: testclientStatus,
    middlewaretest: middlewaretestStatus,
}

async function executeCommand(commandName) {
    let command = commandsList[commandName];
    console.log(`Executing command: ${command}`);
    try {
        let result = await Neutralino.os.spawnProcess(command);
        console.log(`Process ID: ${result.id}`);
        console.log(`Process ID: ${result.pid}`);
        // 将 pid 和 id 存入对应的对象中
        pidList[commandName] = result.pid;
        idList[commandName] = result.id;
        statusStart(commandName);

        console.log(`Command "${commandName}" executed successfully.`);
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error);
    }
}

async function stopCommand(commandName) {
    const id = idList[commandName];
    const pid = pidList[commandName];
    console.log(id + ':' + pid);
    if (id === null) {
        console.error(`No PID found for command: ${commandName}`);
        return;
    }
    try {
        await Neutralino.os.updateSpawnedProcess(id, 'exit');
        idList[commandName] = null
        pidList[commandName] = null
        statusHalt(commandName);

        console.log(`Command "${commandName}" stopped successfully.`);
    } catch (error) {
        console.error(`Error stopping command: ${commandName}`);
        console.error(error);
    }
}

async function restartCommand(commandName) {
    try {
        await stopCommand(commandName);
        await executeCommand(commandName);
    } catch (error) {
        console.error(`Error restarting command: ${commandName}`);
        console.error(error);
    }
}

async function start(commandName) {
    const id = idList[commandName];
    if (id) {
        alert('请勿重复启动');
        console.warn(`Command "${commandName}" is already running.`);
        return;
    }

    try {
        await executeCommand(commandName);
    } catch (error) {
        console.error(`Failed to start command: ${commandName}`);
        console.error(error);
    }
}

async function halt(commandName) {
    const id = idList[commandName];
    if (id === null) {
        alert('软件未开启');
        console.warn(`Command "${commandName}" is not running.`);
        return;
    }

    try {
        await stopCommand(commandName);
    } catch (error) {
        console.error(`Failed to halt command: ${commandName}`);
        console.error(error);
    }
}

async function restart(commandName) {
    const id = idList[commandName];
    if (id === null) {
        alert('软件未开启');
        console.warn(`Command "${commandName}" is not running.`);
        return;
    }
    try {
        await restartCommand(commandName);
    } catch (error) {
        console.error(`Failed to restart command: ${commandName}`);
        console.error(error);
    }
}

function statusStart(commandName) {
    const elements = Array.isArray(statusList[commandName])
        ? statusList[commandName]
        : [statusList[commandName]];

    elements.forEach(element => {
        element.classList.remove('stop');
        element.classList.add('run');
    });
}

function statusHalt(commandName) {
    const elements = Array.isArray(statusList[commandName])
        ? statusList[commandName]
        : [statusList[commandName]];

    elements.forEach(element => {
        element.classList.remove('run');
        element.classList.add('stop');
    });
}

async function setWindowSize() {
    await Neutralino.window.setSize(
        {
            width: 618,
            height: 840,
            resizable: false
        }
    )
}

// Initialize Neutralino
Neutralino.init();

Neutralino.events.on("ready", () => {
    Neutralino.os.spawnProcess(`npm -C "${path}" run serve`).then(() => {
        console.log("Process started successfully!");
    });
});

Neutralino.events.on("windowClose", async () => {
    // 获取所有正在运行的命令名
    const runningCommands = Object.keys(pidList).filter(cmd => pidList[cmd] !== null);

    // 依次停止所有正在运行的命令
    for (const cmd of runningCommands) {
        await stopCommand(cmd);
    }

    // 确保主进程退出
    Neutralino.app.exit();
});

setWindowSize()
