let scrolled = false;

window.addEventListener('scroll', function (event) {
	if (!scrolled) {
		scrolled = true;
		window.scrollTo({
			top: 1300,
			behavior: 'smooth'
		});
		event.preventDefault();
	}
});

gsap
	.timeline({
		scrollTrigger: {
			trigger: '.inband',
			start: 'top center',
			end: 'center bottom',
			markers: false,
			scrun: true,
			pin: true
		}
	})
	.from('.cont', {
		x: innerWidth * 1,
		duration: 1,
		stagger: 0.2
	});