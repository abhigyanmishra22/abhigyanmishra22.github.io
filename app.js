// Portfolio Website JavaScript

// Variables for state management
let isMenuOpen = false;
let animatedElements = new Set();
let currentSection = 'home';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    setupNavigation();
    setupScrollAnimations();
    setupSkillBars();
    setupContactForm();
    setupBackToTop();
    setupSmoothScrolling();
    updateActiveNavigation();
}

// Navigation Setup
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            toggleMobileMenu();
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Navbar background on scroll
    window.addEventListener('scroll', handleNavbarScroll);
}

function toggleMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    isMenuOpen = !isMenuOpen;
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        navbar.style.background = 'rgba(19, 52, 59, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(19, 52, 59, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active Navigation Update
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = entry.target.id;
                
                // Update navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-70px 0px -70px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .about-bio, .about-stats, .skills-category, .timeline-item, .project-card, .education-item, .testimonial-card, .contact-item, .contact-form');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function animateElement(element) {
    if (animatedElements.has(element)) return;
    
    animatedElements.add(element);
    
    // Add animation class based on element type
    if (element.classList.contains('section-header')) {
        element.classList.add('animate', 'fadeInUp');
    } else if (element.classList.contains('timeline-item')) {
        element.classList.add('animate', 'fadeInLeft');
    } else if (element.classList.contains('project-card')) {
        element.classList.add('animate', 'fadeInUp');
        // Stagger animation for project cards
        const delay = Array.from(element.parentNode.children).indexOf(element) * 0.1;
        element.style.animationDelay = `${delay}s`;
    } else {
        element.classList.add('animate', 'fadeInUp');
    }
}

// Skill Bars Animation
function setupSkillBars() {
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkillBars();
                skillsAnimated = true;
            }
        });
    }, {
        threshold: 0.3
    });
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.setProperty('--skill-width', `${width}%`);
            bar.classList.add('animate');
        }, index * 100);
    });
}

// Contact Form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearErrors);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
    };
    
    // Validate form
    if (validateForm(formData)) {
        // Simulate form submission
        showFormSuccess();
        form.reset();
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError('name', 'Please enter a valid name (at least 2 characters)');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.length < 3) {
        showFieldError('subject', 'Please enter a subject (at least 3 characters)');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
        showFieldError('message', 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearFieldError(input.name);
    
    switch (input.name) {
        case 'name':
            if (value && value.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters');
            }
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError('email', 'Please enter a valid email address');
            }
            break;
        case 'subject':
            if (value && value.length < 3) {
                showFieldError('subject', 'Subject must be at least 3 characters');
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    clearFieldError(fieldName);
    
    field.style.borderColor = '#ff5459';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff5459';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearErrors(e) {
    const input = e.target;
    clearFieldError(input.name);
}

function showFormSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div style="
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #1890ff;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
        ">
            <i class="fas fa-check-circle"></i>
            Thank you for your message! I'll get back to you soon.
        </div>
    `;
    
    const contactForm = document.getElementById('contact-form');
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Back to Top Button
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle responsive changes
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMobileMenu();
    }
    
    // Spacebar for smooth scrolling
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
    }
});

// Loading animation (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate', 'fadeInUp');
        }, index * 200);
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Intersection Observer polyfill fallback
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported, falling back to scroll events');
    
    // Fallback for older browsers
    window.addEventListener('scroll', throttle(() => {
        // Simplified scroll handling for older browsers
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                currentSection = section.id;
                
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}