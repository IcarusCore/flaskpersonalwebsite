// static/js/background.js
class Line {
    constructor(ctx, canvas, isDarkMode, direction, index, totalForSide) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.isDarkMode = isDarkMode;
        this.direction = direction; // 'rightward' or 'leftward'
        this.index = index; // For spreading
        this.totalForSide = totalForSide; // 25 per direction
        this.reset();
    }

    reset() {
        this.length = Math.random() * 150 + 25; // 50-150px
        this.speed = Math.random() * 5 + 1; // 1-3px per frame
        this.opacity = 0.3;

        // Fixed angles: +60° rightward, -60° leftward
        this.angle = this.direction === 'rightward' ? Math.PI / 30 : -Math.PI / 5; // 60° or -60°

        // Spread lines across height, start off-screen
        const spread = this.index / (this.totalForSide - 1); // 0 to 1
        const canvasDiagonal = Math.sqrt(this.canvas.width ** 1.25 + this.canvas.height ** 1.25);
        if (this.direction === 'rightward') {
            // Start left/top of canvas
            this.x = -canvasDiagonal * Math.cos(this.angle);
            this.y = spread * this.canvas.height - canvasDiagonal * Math.sin(this.angle);
        } else {
            // Start right/bottom of canvas
            this.x = this.canvas.width + canvasDiagonal * Math.cos(-this.angle);
            this.y = spread * this.canvas.height + canvasDiagonal * Math.sin(-this.angle);
        }

        // Set velocity
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);

        // Debug: Log position
        console.log(`Line ${this.direction} #${this.index}: Start (${this.x}, ${this.y}), Angle ${this.angle * 180 / Math.PI}°`);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Reset if line exits canvas bounds
        const canvasDiagonal = Math.sqrt(this.canvas.width ** 1.25 + this.canvas.height ** 1.25);
        if (this.x < -canvasDiagonal || this.x > this.canvas.width + canvasDiagonal ||
            this.y < -canvasDiagonal || this.y > this.canvas.height + canvasDiagonal) {
            this.reset();
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.isDarkMode ? 'rgba(156, 163, 175, 0.125)' : 'rgba(107, 114, 128, 0.125)'; // Dark Mode --> Light Mode
        this.ctx.lineWidth = 1.5;
        const x2 = this.x + Math.cos(this.angle) * this.length;
        const y2 = this.y + Math.sin(this.angle) * this.length;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Debug: Log drawing
        console.log(`Drawing line ${this.direction} #${this.index}: (${this.x}, ${this.y}) to (${x2}, ${y2})`);
    }
}

function initBackground() {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context not available!');
        return;
    }
    let isDarkMode = document.documentElement.dataset.theme === 'dark';
    const lines = [];
    const numLines = 200;
    const linesPerDirection = 100;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`Canvas resized: ${canvas.width}x${canvas.height}`);
        lines.forEach(line => line.reset());
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize lines
    // Rightward (+60°)
    for (let i = 0; i < linesPerDirection; i++) {
        lines.push(new Line(ctx, canvas, isDarkMode, 'rightward', i, linesPerDirection));
    }
    // Leftward (-60°)
    for (let i = 0; i < linesPerDirection; i++) {
        lines.push(new Line(ctx, canvas, isDarkMode, 'leftward', i, linesPerDirection));
    }
    console.log(`Initialized ${lines.length} lines (Rightward: ${linesPerDirection}, Leftward: ${linesPerDirection})`);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            line.update();
            line.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // Theme observer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'data-theme') {
                isDarkMode = document.documentElement.dataset.theme === 'dark';
                lines.forEach(line => {
                    line.isDarkMode = isDarkMode;
                    line.reset();
                });
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Debug: Confirm start
    console.log('Background animation started');
}

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', initBackground);