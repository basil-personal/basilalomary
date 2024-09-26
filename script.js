document.addEventListener('DOMContentLoaded', () => {
    const bootSequence = document.getElementById('boot-sequence');
    const bootText = document.getElementById('boot-text');
    const desktop = document.getElementById('desktop');
    const startButton = document.getElementById('start-button');
    const openWindows = document.getElementById('open-windows');
    const clock = document.getElementById('clock');
    const startupSound = document.getElementById('startup-sound');

    let zIndex = 1000;

    function typeWriter(text, element, speed = 50, callback) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.innerHTML += '<span class="cursor">_</span>';
                if (callback) callback();
            }
        }
        type();
    }

    function bootUp() {
        const bootMessages = [
            "Initializing Basil OS v1.0...",
            "Loading system components...",
            "Checking hardware compatibility...",
            "Mounting file systems...",
            "Starting user interface...",
            "Welcome to Basil OS!"
        ];

        let delay = 0;
        bootMessages.forEach((message, index) => {
            setTimeout(() => {
                typeWriter(message + '\n', bootText, 50, () => {
                    if (index === bootMessages.length - 1) {
                        setTimeout(() => {
                            bootSequence.style.display = 'none';
                            desktop.style.display = 'block';
                            startupSound.play();
                        }, 1000);
                    }
                });
            }, delay);
            delay += 1500;
        });
    }

    bootUp();

    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    function createWindow(id, title, content) {
        const window = document.createElement('div');
        window.className = 'window';
        window.id = id;
        window.style.zIndex = zIndex++;
        window.style.left = `${50 + Math.random() * 100}px`;
        window.style.top = `${50 + Math.random() * 100}px`;
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <span class="minimize">_</span>
                    <span class="maximize">□</span>
                    <span class="close">×</span>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;
        document.getElementById('windows').appendChild(window);
        
        makeDraggable(window);
        makeResizable(window);
        
        const closeBtn = window.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            window.remove();
            updateTaskbar();
        });

        updateTaskbar();
        return window;
    }

    function makeDraggable(element) {
        const header = element.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;
            element.style.zIndex = zIndex++;
        }

        function drag(e) {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                element.style.left = `${startLeft + deltaX}px`;
                element.style.top = `${startTop + deltaY}px`;
            }
        }

        function stopDragging() {
            isDragging = false;
        }
    }

    function makeResizable(element) {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        resizer.style.cssText = 'width:10px;height:10px;background:transparent;position:absolute;right:0;bottom:0;cursor:se-resize;';
        element.appendChild(resizer);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizer.addEventListener('mousedown', startResizing);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);

        function startResizing(e) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(element.style.width) || element.offsetWidth;
            startHeight = parseInt(element.style.height) || element.offsetHeight;
            e.stopPropagation();
        }

        function resize(e) {
            if (isResizing) {
                const width = startWidth + (e.clientX - startX);
                const height = startHeight + (e.clientY - startY);
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
            }
        }

        function stopResizing() {
            isResizing = false;
        }
    }

    function updateTaskbar() {
        openWindows.innerHTML = '';
        document.querySelectorAll('.window').forEach(window => {
            const button = document.createElement('div');
            button.className = 'window-button';
            button.textContent = window.querySelector('.window-title').textContent;
            button.addEventListener('click', () => {
                window.style.display = window.style.display === 'none' ? 'block' : 'none';
                window.style.zIndex = zIndex++;
            });
            openWindows.appendChild(button);
        });
    }

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.dataset.window;
            let content = '';
            let title = '';

            switch (windowId) {
                case 'about':
                    title = 'About Basil';
                    content = '<h2>About Basil Alomary</h2><p>Your about content here...</p>';
                    break;
                case 'projects':
                    title = 'Projects';
                    content = '<h2>My Projects</h2><ul><li>Project 1</li><li>Project 2</li></ul>';
                    break;
                case 'contact':
                    title = 'Contact';
                    content = '<h2>Contact Basil</h2><p>Email: basil@example.com</p>';
                    break;
                case 'terminal':
                    title = 'Terminal';
                    content = '<div id="terminal-content"><div id="output"></div><input type="text" id="input" autofocus></div>';
                    break;
            }

            createWindow(windowId, title, content);

            if (windowId === 'terminal') {
                initializeTerminal();
            }
        });
    });

    function initializeTerminal() {
        const terminalContent = document.getElementById('terminal-content');
        const output = document.getElementById('output');
        const input = document.getElementById('input');

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value;
                output.innerHTML += `<div>> ${command}</div>`;
                processCommand(command);
                input.value = '';
            }
        });

        function processCommand(command) {
            let response = '';
            switch (command.toLowerCase()) {
                case 'help':
                    response = 'Available commands: help, about, clear';
                    break;
                case 'about':
                    response = 'Basil OS Terminal v1.0';
                    break;
                case 'clear':
                    output.innerHTML = '';
                    return;
                default:
                    response = `Command not recognized: ${command}`;
            }
            output.innerHTML += `<div>${response}</div>`;
        }
    }
});
