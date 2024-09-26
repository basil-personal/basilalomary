document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const openWindows = document.getElementById('open-windows');
    const clock = document.getElementById('clock');

    // Boot sequence
    setTimeout(() => {
        document.querySelector('.progress').style.width = '100%';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            desktop.style.display = 'block';
        }, 3000);
    }, 100);

    // Clock
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Start menu
    startButton.addEventListener('click', () => {
        startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Window management
    const windows = document.querySelectorAll('.window');
    let activeWindow = null;

    function openWindow(windowId) {
        const win = document.getElementById(windowId);
        win.style.display = 'block';
        win.style.zIndex = getMaxZIndex() + 1;
        activeWindow = win;
        updateTaskbar();
    }

    function closeWindow(windowId) {
        const win = document.getElementById(windowId);
        win.style.display = 'none';
        updateTaskbar();
    }

    function minimizeWindow(windowId) {
        const win = document.getElementById(windowId);
        win.style.display = 'none';
        updateTaskbar();
    }

    function maximizeWindow(windowId) {
        const win = document.getElementById(windowId);
        if (win.style.width === '100%') {
            win.style.width = '400px';
            win.style.height = '300px';
            win.style.top = '50px';
            win.style.left = '50px';
        } else {
            win.style.width = '100%';
            win.style.height = 'calc(100% - 40px)';
            win.style.top = '0';
            win.style.left = '0';
        }
    }

    function updateTaskbar() {
        openWindows.innerHTML = '';
        windows.forEach(win => {
            if (win.style.display !== 'none') {
                const button = document.createElement('div');
                button.className = 'taskbar-item';
                button.textContent = win.querySelector('.title').textContent;
                button.addEventListener('click', () => {
                    if (win === activeWindow) {
                        minimizeWindow(win.id);
                    } else {
                        openWindow(win.id);
                    }
                });
                openWindows.appendChild(button);
            }
        });
    }

    function getMaxZIndex() {
        return Math.max(
            ...Array.from(windows, win => parseInt(win.style.zIndex) || 0)
        );
    }

    // Window controls
    windows.forEach(win => {
        const close = win.querySelector('.close');
        const minimize = win.querySelector('.minimize');
        const maximize = win.querySelector('.maximize');

        close.addEventListener('click', () => closeWindow(win.id));
        minimize.addEventListener('click', () => minimizeWindow(win.id));
        maximize.addEventListener('click', () => maximizeWindow(win.id));

        // Make windows draggable
        const titleBar = win.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', (e) => {
            const startX = e.clientX - win.offsetLeft;
            const startY = e.clientY - win.offsetTop;

            function onMouseMove(e) {
                win.style.left = `${e.clientX - startX}px`;
                win.style.top = `${e.clientY - startY}px`;
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        win.addEventListener('mousedown', () => {
            activeWindow = win;
            win.style.zIndex = getMaxZIndex() + 1;
        });
    });

    // Open windows from desktop icons and start menu
    document.querySelectorAll('.icon, .start-item').forEach(item => {
        item.addEventListener('click', () => {
            const windowId = `${item.dataset.window}-window`;
            openWindow(windowId);
            startMenu.style.display = 'none';
        });
    });
});
