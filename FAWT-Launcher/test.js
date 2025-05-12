const commandsList = {
    main: `npm -C "${path}" run main`,
    middleware: `npm -C "${path}" run middleware --test = false`,
    middlewaretest: `npm -C "${path}" run middleware --test = true`,
    testclient: `node "${path}\\FAWT-COMM\\socketClient\\startClient.js"`,
    camera: `npm -C "${path}" run camera`,
    simcamera: `node "${path}\\FAWT-COMM\\camera\\simulated\\wsServer.js"`,
};

console.log(commandsList["main"]);