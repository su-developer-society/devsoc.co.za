// University cards config (add/edit items here to change boxes and links)
const universities = [
	{ name: 'Stellenbosch University', slug: 'stellenbosch', href: 'su.devsoc.co.za', location: 'Stellenbosch, Western Cape' },
	{ name: 'University of Cape Town', slug: 'uct', href: 'https://www.instagram.com/uctdevelopersoc/?hl=en', location: 'Cape Town, Western Cape' },
	{ name: 'University of KwaZulu-Natal', slug: 'ukzn', href: 'https://linktr.ee/techsocietyukzn', location: 'Durban, KwaZulu-Natal' },
	{ name: 'University of Limpopo', slug: 'ul', href: 'https://linktr.ee/uldevsociety', location: 'Polokwane, Limpopo' },
	{ name: 'Rhodes University', slug: 'rhodes', href: 'https://www.instagram.com/rhodesdevsoc/?hl=en', location: 'Makhanda, Eastern Cape' },
	{ name: 'University of the Western Cape', slug: 'uwc', href: 'https://www.instagram.com/uwc_itsociety/', location: 'Cape Town, Western Cape' },
	{ name: 'University of the Witwatersrand', slug: 'wits', href: 'https://wits-dev-soc.web.app/', location: 'Johannesburg, Gauteng' },
	{ name: 'University of Johannesburg', slug: 'uj', href: 'https://linktr.ee/ujdevsoc?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnc56EzCbUe45ziE9I5zoh7xyiIpi3miMolXBLm7pr4DFDbbF-igSOFZ6LjNI_aem_JbGvL4c79UoMfm8ulYxe9w', location: 'Johannesburg, Gauteng' },
	{ name: 'Nelson Mandela University', slug: 'nmu', href: 'https://www.facebook.com/nmucomputersociety/', location: 'Gqeberha, Eastern Cape' },
	{ name: 'University of South Africa', slug: 'unisa', href: 'https://www.instagram.com/unisadevsoc/', location: 'Pretoria, Gauteng' },
	{ name: 'University of Zululand', slug: 'unizulu', href: 'https://www.linkedin.com/company/unizulu-computer-science-society/?originalSubdomain=za', location: 'Richards Bay, KwaZulu-Natal' },
	{ name: 'Durban University of Technology', slug: 'dut', href: 'https://www.linkedin.com/company/developer-student-club-durban-university-of-technology/?originalSubdomain=za', location: 'Durban, KwaZulu-Natal' },
	{ name: 'University of Mpumalanga', slug: 'ump', href: 'https://mpumalangaictclub.blogspot.com/', location: 'Mbombela, Mpumalanga' },
	{ name: 'Sol Plaatje University', slug: 'spu', href: 'https://sonke.gklink.co/gkss-spu', location: 'Kimberley, Northern Cape' },
	{ name: 'Tshwane University of Technology', slug: 'tut', href: 'https://linktr.ee/hacker_society?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn_3DSzCJ1FTSRFPxEoEtVkn5iFjhgtA5RBvkB_fMkgkEhRxagU2Np38JXaxs_aem_qnUkrmDGXJOaBKiv7e838Q', location: 'Pretoria, Gauteng' },
	{ name: 'Vaal University of Technology', slug: 'vut', href: 'https://www.instagram.com/computer_science_club_vut/', location: 'Vanderbijlpark, Gauteng' },
];

// Normalize to external URLs (devsoc subdomain or full URL)
const toExternalUrl = (u) => {
	const href = (u.href || '').trim();
	if (href.startsWith('#')) return `https://${u.slug}.devsoc.co.za`;
	if (/^https?:\/\//i.test(href)) return href;
	return `https://${href}`;
};

function refreshUniversities(list) {
	renderUniversities(list);
	initCardTilt();
	initScrollReveal();
	initStatusChecks(list);
}

// Render cards into the grid (no emojis)
function renderUniversities(list) {
	const grid = document.getElementById('university-grid');
	if (!grid) return;

	grid.innerHTML = list.map((u, i) => {
		const url = toExternalUrl(u);
		return `
		<a href="${url}" class="uni-card" data-uni="${u.slug}" aria-label="Open ${u.name}" target="_blank" rel="noopener">
			<div class="card-inner">
				<div class="card-number">${String(i + 1).padStart(2, '0')}</div>
				<h4>${u.name}</h4>
				<div class="location-tag" aria-hidden="true">${u.location || ''}</div>
				<div class="status-dot" data-status="checking" aria-label="Checking status" title="Checking..."></div>
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

// Lightweight availability check per card
async function checkAvailability(url, timeoutMs = 4500) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		await fetch(url, {
			method: 'GET',
			mode: 'no-cors',
			cache: 'no-store',
			signal: controller.signal,
		});
		clearTimeout(timer);
		return true;
	} catch (err) {
		clearTimeout(timer);
		return false;
	}
}

function applyStatus(dot, status) {
	if (!dot) return;
	dot.dataset.status = status;
	const label = status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking';
	dot.setAttribute('aria-label', `${label} status`);
	dot.title = `${label}`;
}

function initStatusChecks(list) {
	const cards = document.querySelectorAll('.uni-card');
	cards.forEach((card, idx) => {
		const uni = list[idx];
		if (!uni) return;
		const url = toExternalUrl(uni);
		const dot = card.querySelector('.status-dot');
		applyStatus(dot, 'checking');
		checkAvailability(url).then((isUp) => {
			applyStatus(dot, isUp ? 'online' : 'offline');
		}).catch(() => applyStatus(dot, 'offline'));
	});
}

// Hook up live search / filter
function initSearch() {
	const input = document.getElementById('uni-search');
	if (!input) {
		refreshUniversities(universities);
		return;
	}

	const handleInput = () => {
		const query = input.value.trim().toLowerCase();
		const filtered = universities.filter((u) =>
			u.name.toLowerCase().includes(query) ||
			(u.slug && u.slug.toLowerCase().includes(query))
		);
		refreshUniversities(filtered);
	};

	input.addEventListener('input', handleInput);
	handleInput(); // initial render
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
		initSearch();
	});
} else {
	initSearch();
}

// Add parallax effect to orbs
window.addEventListener('mousemove', (e) => {
	const x = e.clientX / window.innerWidth;
	const y = e.clientY / window.innerHeight;
	document.querySelectorAll('.orb').forEach((orb, index) => {
		const speed = (index + 1) * 30;
		const xOffset = (x - 0.5) * speed;
		const yOffset = (y - 0.5) * speed;
		orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
	});
});
