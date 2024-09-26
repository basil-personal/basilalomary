document.addEventListener('DOMContentLoaded', () => {
    const desktop = document.getElementById('desktop');
    const startButton = document.getElementById('start-button');
    const timeDisplay = document.getElementById('time');

    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateTime, 1000);
    updateTime();

    function createWindow(id, title, content) {
        const window = document.createElement('div');
        window.className = 'window';
        window.style.left = `${50 + Math.random() * 100}px`;
        window.style.top = `${50 + Math.random() * 100}px`;
        window.innerHTML = `
            <div class="window-header">
                <span>${title}</span>
                <span class="close-button">×</span>
            </div>
            <div class="window-content">${content}</div>
        `;
        document.getElementById('windows').appendChild(window);

        const closeButton = window.querySelector('.close-button');
        closeButton.addEventListener('click', () => window.remove());

        makeDraggable(window);
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
            }

            createWindow(windowId, title, content);
        });
    });
});
