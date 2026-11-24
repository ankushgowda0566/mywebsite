/**
 * ==============================================================================
 * STUDENT PORTFOLIO SCRIPT
 * Author: Alex Chen
 * Description: Vanilla JavaScript handling theme switching, mobile navigation,
 *              scrollspy, project filtering, modal dialogs, and form validation.
 * ==============================================================================
 */

// Wait for DOM to be fully parsed before executing
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. THEME SWITCHER (Dark & Light Mode with LocalStorage)
       ========================================================================== */
    const themeToggleBtn = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;
    const STORAGE_KEY = "portfolio-theme";

    /**
     * Initializes theme from localStorage or system preference.
     */
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            // Check OS color preference
            const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
            applyTheme(prefersLight ? "light" : "dark");
        }
    }

    /**
     * Applies the chosen theme to the DOM and updates accessibility attributes.
     * @param {string} theme - 'dark' or 'light'
     */
    function applyTheme(theme) {
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_KEY, theme);

        if (themeToggleBtn) {
            const isDark = theme === "dark";
            themeToggleBtn.setAttribute(
                "aria-label",
                isDark ? "Switch to light theme" : "Switch to dark theme"
            );
            themeToggleBtn.setAttribute(
                "title",
                isDark ? "Switch to light theme" : "Switch to dark theme"
            );
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
        });
    }

    // Listen for OS theme changes if user has not set a manual preference
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? "light" : "dark");
        }
    });

    initTheme();

    /* ==========================================================================
       2. RESPONSIVE NAVIGATION & MOBILE HAMBURGER MENU
       ========================================================================== */
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    /**
     * Toggles the mobile navigation drawer.
     */
    function toggleMenu() {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    }

    /**
     * Closes the mobile navigation drawer.
     */
    function closeMenu() {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside of navbar
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on pressing the Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("open")) {
                closeMenu();
                navToggle.focus();
            }
        });
    }

    // Smooth navigation click with header offset
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    /* ==========================================================================
       3. ACTIVE NAVIGATION SCROLLSPY
       ========================================================================== */
    const sections = document.querySelectorAll("section[id]");

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavLink, { passive: true });

    /* ==========================================================================
       4. SCROLL-REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach((el) => el.classList.add("revealed"));
    }

    /* ==========================================================================
       5. PROJECTS FILTERING (Vanilla JS Filter System)
       ========================================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const noProjectsMessage = document.getElementById("noProjectsMessage");
    const resetFilterBtn = document.getElementById("resetFilterBtn");

    /**
     * Filters projects matching the selected category.
     * @param {string} filterValue - The category to display ('all', 'web', 'js', etc.)
     */
    function filterProjects(filterValue) {
        let visibleCount = 0;

        projectCards.forEach((card) => {
            const categories = (card.getAttribute("data-category") || "").split(" ");
            const matches = filterValue === "all" || categories.includes(filterValue);

            if (matches) {
                card.classList.remove("filtered-out");
                visibleCount++;
            } else {
                card.classList.add("filtered-out");
            }
        });

        // Toggle empty state message
        if (noProjectsMessage) {
            noProjectsMessage.style.display = visibleCount === 0 ? "block" : "none";
        }
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });

            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            const filter = btn.getAttribute("data-filter") || "all";
            filterProjects(filter);
        });
    });

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener("click", () => {
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) {
                allBtn.click();
            }
        });
    }

    /* ==========================================================================
       6. INTERACTIVE PROJECT DETAILS MODAL
       ========================================================================== */
    const projectModal = document.getElementById("projectModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalDismissBtn = document.getElementById("modalDismissBtn");
    const modalCategory = document.getElementById("modalCategory");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalFeatures = document.getElementById("modalFeatures");
    const modalTags = document.getElementById("modalTags");
    const modalGithubLink = document.getElementById("modalGithubLink");
    const viewProjectButtons = document.querySelectorAll(".btn-view-project");

    let lastFocusedElement = null;

    // Detailed project data store
    const projectsData = {
        planner: {
            title: "Interactive Study & Task Planner",
            category: "Web Application / Vanilla JavaScript",
            description: "A productivity platform designed specifically for students to manage coursework deadlines, study blocks, and project milestones with zero external dependencies.",
            features: [
                "Local storage persistence ensuring task data remains across browser sessions",
                "Color-coded priority flags (High, Medium, Low) and category filtering",
                "Progress tracking bar calculating completion percentage dynamically",
                "Due date validation and countdown warnings for upcoming assignments"
            ],
            tags: ["HTML5", "CSS Grid", "Vanilla JavaScript (ES6+)", "LocalStorage API", "Responsive UI"],
            github: "https://github.com"
        },
        weather: {
            title: "Responsive Weather & Forecast Hub",
            category: "Web Application / API Integration",
            description: "An interactive meteorological dashboard providing real-time forecasts, atmospheric metrics, and dynamic background aesthetics tuned to local sky conditions.",
            features: [
                "Search autocompletion and location matching",
                "Dynamic UI themes adapting to day, dusk, and night atmosphere",
                "5-day forecast breakdown with high/low temperature curves",
                "Unit toggle between Celsius and Fahrenheit with instantaneous re-rendering"
            ],
            tags: ["HTML5", "CSS Flexbox", "Asynchronous JavaScript", "Fetch API", "DOM Manipulation"],
            github: "https://github.com"
        },
        algorithm: {
            title: "Sorting Algorithm Visualizer",
            category: "Vanilla JavaScript / Educational Tool",
            description: "An interactive computer science educational visualizer showing how sorting algorithms partition and order elements in memory step by step.",
            features: [
                "Real-time visual comparison of Bubble Sort, Selection Sort, and Insertion Sort",
                "Customizable array generator with speed control sliders (10ms - 500ms)",
                "Comparison count and array access counters updated per step",
                "Interactive step-pause-resume playback state controls"
            ],
            tags: ["JavaScript ES6", "CSS Keyframes", "Data Structures", "Algorithms", "Clean Architecture"],
            github: "https://github.com"
        },
        expense: {
            title: "Student Budget & Expense Engine",
            category: "Python & Web / Data Ledger",
            description: "A financial tracking utility helping students budget monthly allowances, categorize educational expenses, and generate clean CSV ledger statements.",
            features: [
                "Categorized budget allocations (Housing, Books, Groceries, Transit)",
                "Automated CSV transaction parsing and report generation",
                "Spending alert notifications when approaching category budget caps",
                "Clean summary dashboard displaying month-over-month savings"
            ],
            tags: ["Python 3", "Data Parsing", "CSV Engine", "Semantic HTML5", "Financial Logic"],
            github: "https://github.com"
        }
    };

    /**
     * Opens the modal dialog and populates data for the requested project.
     * @param {string} projectId - Key corresponding to projectsData
     */
    function openModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        lastFocusedElement = document.activeElement;

        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDescription.textContent = data.description;
        modalGithubLink.setAttribute("href", data.github);

        // Populate feature list
        modalFeatures.innerHTML = "";
        data.features.forEach((feat) => {
            const li = document.createElement("li");
            li.textContent = feat;
            modalFeatures.appendChild(li);
        });

        // Populate tags
        modalTags.innerHTML = "";
        data.tags.forEach((tag) => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag;
            modalTags.appendChild(span);
        });

        projectModal.classList.add("open");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent body scroll behind modal

        // Focus close button for keyboard accessibility
        if (modalCloseBtn) {
            modalCloseBtn.focus();
        }
    }

    /**
     * Closes the project modal dialog.
     */
    function closeModal() {
        projectModal.classList.remove("open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    viewProjectButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const projectId = btn.getAttribute("data-project");
            if (projectId) {
                openModal(projectId);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeModal);

    // Close modal on clicking outside card
    if (projectModal) {
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && projectModal.classList.contains("open")) {
                closeModal();
            }
        });
    }

    /* ==========================================================================
       7. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
       ========================================================================= */
    const contactForm = document.getElementById("contactForm");
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const userSubjectInput = document.getElementById("userSubject");
    const userMessageInput = document.getElementById("userMessage");
    const charCounter = document.getElementById("charCounter");
    const formAlert = document.getElementById("formAlert");
    const submitBtn = document.getElementById("submitBtn");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    // Live character counter for the message textarea
    if (userMessageInput && charCounter) {
        userMessageInput.addEventListener("input", () => {
            const count = userMessageInput.value.length;
            charCounter.textContent = `${count} / 500`;
            if (count >= 480) {
                charCounter.style.color = "var(--error-text)";
            } else {
                charCounter.style.color = "var(--text-muted)";
            }
        });
    }

    /**
     * Clears error highlight and error text for a field.
     */
    function clearError(input, errorElement) {
        input.classList.remove("is-invalid");
        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    /**
     * Sets error highlight and error message for a field.
     */
    function setError(input, errorElement, message) {
        input.classList.add("is-invalid");
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear individual errors on input
    if (userNameInput) {
        userNameInput.addEventListener("input", () => clearError(userNameInput, nameError));
    }
    if (userEmailInput) {
        userEmailInput.addEventListener("input", () => clearError(userEmailInput, emailError));
    }
    if (userMessageInput) {
        userMessageInput.addEventListener("input", () => clearError(userMessageInput, messageError));
    }

    /**
     * Validates email address with standard regex.
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let isValid = true;
            let firstInvalidField = null;

            // Validate Name
            const nameVal = userNameInput.value.trim();
            if (nameVal.length < 2) {
                setError(userNameInput, nameError, "Please enter your name (minimum 2 characters).");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = userNameInput;
            } else {
                clearError(userNameInput, nameError);
            }

            // Validate Email
            const emailVal = userEmailInput.value.trim();
            if (!emailVal) {
                setError(userEmailInput, emailError, "Email address is required.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = userEmailInput;
            } else if (!isValidEmail(emailVal)) {
                setError(userEmailInput, emailError, "Please enter a valid email address (e.g. name@domain.com).");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = userEmailInput;
            } else {
                clearError(userEmailInput, emailError);
            }

            // Validate Message
            const msgVal = userMessageInput.value.trim();
            if (msgVal.length < 10) {
                setError(userMessageInput, messageError, "Please enter a message of at least 10 characters.");
                isValid = false;
                if (!firstInvalidField) firstInvalidField = userMessageInput;
            } else {
                clearError(userMessageInput, messageError);
            }

            if (!isValid) {
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                return;
            }

            // Simulate form submission
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Sending Message...</span>
                <span class="status-indicator"></span>
            `;

            setTimeout(() => {
                // Show success alert
                formAlert.className = "form-alert success";
                formAlert.innerHTML = `
                    <strong>Thank you, ${escapeHTML(nameVal)}!</strong> Your message has been sent successfully. I will get back to you shortly.
                `;
                formAlert.style.display = "block";

                // Reset form fields
                contactForm.reset();
                if (charCounter) {
                    charCounter.textContent = "0 / 500";
                    charCounter.style.color = "var(--text-muted)";
                }

                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;

                // Auto-hide alert after 8 seconds
                setTimeout(() => {
                    formAlert.style.display = "none";
                }, 8000);
            }, 600);
        });
    }

    /**
     * Sanitizes strings to safely inject in innerHTML.
     */
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, (tag) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[tag] || tag));
    }

    /* ==========================================================================
       8. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.style.opacity = "1";
                backToTopBtn.style.pointerEvents = "auto";
            } else {
                backToTopBtn.style.opacity = "0.7";
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
