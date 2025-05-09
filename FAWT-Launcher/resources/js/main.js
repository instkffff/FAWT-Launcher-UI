async function setWindowSize() {
    await Neutralino.window.setSize(
        {
            width: 618,
            height: 840,
            resizable: false
        }
    )
}

setWindowSize()

Neutralino.events.on("windowClose", () => {
  Neutralino.app.exit();
});

// Initialize Neutralino
Neutralino.init();