particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#667eea', '#764ba2', '#00d4ff', '#7c3aed']
        },
        shape: {
            type: ['circle', 'triangle', 'edge'],
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: {
                enable: true,
                speed: 0.8,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#667eea',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 200,
                line_linked: {
                    opacity: 1
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
});

// University cards config (add/edit items here to change boxes and links)
const universities = [
	{ name: 'Stellenbosch University', slug: 'stellenbosch', href: 'su.devsoc.co.za' },
];

// Render cards into the grid (no emojis)
function renderUniversities(list) {
	const grid = document.getElementById('university-grid');
	if (!grid) return;

	// Normalize to external URLs
	const toExternalUrl = (u) => {
		const href = (u.href || '').trim();
		if (href.startsWith('#')) return `https://${u.slug}.devsoc.co.za`;
		if (/^https?:\/\//i.test(href)) return href;
		return `https://${href}`;
	};

	grid.innerHTML = list.map((u, i) => {
		const url = toExternalUrl(u);
		return `
		<a href="${url}" class="uni-card" data-uni="${u.slug}" aria-label="Open ${u.name}" target="_blank" rel="noopener">
			<div class="card-inner">
				<div class="card-number">${String(i + 1).padStart(2, '0')}</div>
				<h4>${u.name}</h4>
				<div class="card-glow"></div>
				<div class="card-shine"></div>
			</div>
		</a>`;
	}).join('');
}

// Init 3D tilt on cards
function initCardTilt() {
	document.querySelectorAll('.uni-card').forEach(card => {
		let isHovering = false;
		card.addEventListener('mouseenter', () => { isHovering = true; });
		card.addEventListener('mouseleave', () => {
			isHovering = false;
			card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
		});
		card.addEventListener('mousemove', (e) => {
			if (!isHovering) return;
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const rotateX = (y - centerY) / 15;
			const rotateY = (centerX - x) / 15;
			requestAnimationFrame(() => {
				card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
			});
		});
	});
}

// Init scroll reveal for cards
function initScrollReveal() {
	const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);

	document.querySelectorAll('.uni-card').forEach(card => {
		card.style.opacity = '0';
		card.style.transform = 'translateY(24px)';
		card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
		observer.observe(card);
	});
}

// Render and init once DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		renderUniversities(universities);
		initCardTilt();
		initScrollReveal();
	});
} else {
	renderUniversities(universities);
	initCardTilt();
	initScrollReveal();
}

// Add parallax effect to orbs
window.addEventListener('mousemove', (e) => {
	const x = e.clientX / window.innerWidth;
	const y = e.clientY / window.innerHeight;
	document.querySelectorAll('.orb').forEach((orb, index) => {
		const speed = (index + 1) * 16;
		const xOffset = (x - 0.5) * speed;
		const yOffset = (y - 0.5) * speed;
		orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
	});
});
