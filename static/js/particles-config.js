        particlesJS('particles-js', {
            particles: {
                number: { value: 125, density: { enable: true, value_area: 800 } }, 
                color: { value: '#ffffff' },
                shape: {
                    type: 'circle',
                    stroke: { width: 0, color: '#000000' },
                    polygon: { nb_sides: 5 },
                },
                opacity: { value: 0.5, random: false, anim: { enable: false } },
                size: { value: 3, random: true, anim: { enable: false } },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 2,
                },
                move: {
                    enable: true,
                    speed: 2, // Reduced from 6 for performance
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                },
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true,
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 },
                },
            },
            retina_detect: true,
        });