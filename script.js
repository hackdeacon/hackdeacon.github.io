document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.cursor');
  const hoverElements = document.querySelectorAll('a, .link-card, button');
  const linkCards = document.querySelectorAll('.link-card');

  const initCursor = () => {
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      const speed = 0.15;
      const diffX = mouseX - cursorX;
      const diffY = mouseY - cursorY;

      cursorX += diffX * speed;
      cursorY += diffY * speed;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animate);
    };

    animate();

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  };

  const initScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    linkCards.forEach(card => {
      observer.observe(card);
    });
  };

  const initCardHoverEffects = () => {
    linkCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');

        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: radial-gradient(circle, rgba(97, 218, 251, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
          z-index: 0;
        `;

        card.appendChild(ripple);

        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const initTypewriterEffect = () => {
    const texts = [
      '技术探索者',
      '代码创作者',
      '持续学习者'
    ];
    const lines = document.querySelectorAll('.subtitle-line');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentText = texts[textIndex];
      const currentLine = lines[textIndex];

      if (currentLine) {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            currentLine.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, 80);
          } else {
            setTimeout(() => {
              isDeleting = true;
              typeWriter();
            }, 2000);
          }
        } else {
          if (charIndex > 0) {
            currentLine.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWriter, 50);
          } else {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(typeWriter, 500);
          }
        }
      }
    };

    setTimeout(typeWriter, 2000);
  };

  const initParallaxEffect = () => {
    const heroSection = document.querySelector('.hero-section');

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.gradient-bg, .noise-bg');

      parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    let ticking = false;
    const requestScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16);
      }
    };

    window.addEventListener('scroll', requestScroll);
  };

  const initFooterAnimation = () => {
    const footer = document.querySelector('.footer');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    if (footer) {
      observer.observe(footer);
    }
  };

  initCursor();
  initScrollAnimations();
  initCardHoverEffects();
  initParallaxEffect();
  initFooterAnimation();

  if (window.innerWidth > 768) {
    initTypewriterEffect();
  }

  const handleResize = () => {
    if (window.innerWidth > 768) {
      cursor.style.display = 'block';
    } else {
      cursor.style.display = 'none';
    }
  };

  window.addEventListener('resize', handleResize);
  handleResize();
});
