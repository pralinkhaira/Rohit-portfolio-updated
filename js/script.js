/* Smooth scrolling for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* Modal functions */
function openModal() {
    document.getElementById("connectModal").classList.add("active");
}

function closeModal() {
    document.getElementById("connectModal").classList.remove("active");
}

/* Ventures infinite loop animation (no hover, original colors) */
const track = document.querySelector('.ventures-track');

if (track) {
    // clone logos dynamically (no duplicate HTML)
    track.innerHTML += track.innerHTML;

    let position = 0;
    const speed = 2; // adjust speed if needed

    function animateVentures() {
        position -= speed;

        if (Math.abs(position) >= track.scrollWidth / 2) {
            position = 0;
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animateVentures);
    }

    animateVentures();
}

/* Console log */
console.log("Portfolio loaded – January 2026");

/* PITCH FORM FUNCTIONALITY*/

document.addEventListener('DOMContentLoaded', function () {
    const pitchForm = document.querySelector('.pitch-form');

    if (pitchForm) {
        initPitchForm(pitchForm);
    }
});

function initPitchForm(form) {
    // Form elements
    const nameInput = document.getElementById('name');
    const companyInput = document.getElementById('company');
    const sectorInput = document.getElementById('sector');
    const investmentInput = document.getElementById('investment');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const pitchSummary = document.getElementById('pitch-summary');
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-upload');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // Auto-resize textarea
    if (pitchSummary) {
        pitchSummary.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // File upload handling
    if (uploadBox && fileInput) {
        // Click to upload
        uploadBox.addEventListener('click', function () {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                handleFileUpload(this.files[0]);
            }
        });

        // Drag and drop
        uploadBox.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        uploadBox.addEventListener('dragleave', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        uploadBox.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files && files[0]) {
                fileInput.files = files;
                handleFileUpload(files[0]);
            }
        });

        // Remove file
        const removeBtn = uploadBox.querySelector('.remove-file');
        if (removeBtn) {
            removeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                clearFileUpload();
            });
        }
    }

    function handleFileUpload(file) {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            showUploadError('Invalid file type. Please upload PDF, PPT, or DOCX.');
            return;
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            showUploadError('File size exceeds 10MB limit.');
            return;
        }

        // Clear errors and show file
        uploadBox.classList.remove('error');
        uploadBox.querySelector('.upload-size-error')?.remove();
        uploadBox.classList.add('has-file');

        const uploadContent = uploadBox.querySelector('.upload-content');
        const fileInfo = uploadBox.querySelector('.file-info');
        const fileName = uploadBox.querySelector('.file-name');

        if (uploadContent) uploadContent.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'block';
        if (fileName) fileName.textContent = file.name;
    }

    function showUploadError(message) {
        uploadBox.classList.add('error');

        // Remove existing error
        const existingError = uploadBox.querySelector('.upload-size-error');
        if (existingError) existingError.remove();

        // Add new error
        const errorEl = document.createElement('small');
        errorEl.className = 'upload-size-error';
        errorEl.textContent = message;
        uploadBox.appendChild(errorEl);

        clearFileUpload();
    }

    function clearFileUpload() {
        fileInput.value = '';
        uploadBox.classList.remove('has-file', 'error');
        uploadBox.querySelector('.upload-size-error')?.remove();

        const uploadContent = uploadBox.querySelector('.upload-content');
        const fileInfo = uploadBox.querySelector('.file-info');

        if (uploadContent) uploadContent.style.display = 'block';
        if (fileInfo) fileInfo.style.display = 'none';
    }

    // Real-time validation
    const inputs = [nameInput, companyInput, sectorInput, investmentInput, emailInput, phoneInput];

    inputs.forEach(input => {
        if (input) {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        }
    });

    if (pitchSummary) {
        pitchSummary.addEventListener('blur', function () {
            validateField(this);
        });
    }

    // Form validation functions
    function validateField(field) {
        const fieldParent = field.parentElement;
        const errorMessage = fieldParent.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove existing classes
        fieldParent.classList.remove('valid', 'error');

        // Required validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required.';
        }
        // Email validation
        else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address.';
            }
        }
        // Phone validation
        else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number (10-15 digits).';
            }
        }

        // Apply classes
        if (field.value.trim() || field.type === 'tel' || field.type === 'email') {
            if (isValid) {
                fieldParent.classList.add('valid');
            } else {
                fieldParent.classList.add('error');
            }
        }

        // Show error message
        if (errorMessage) {
            errorMessage.textContent = message;
        }

        return isValid;
    }

    function validateForm() {
        let isFormValid = true;

        inputs.forEach(input => {
            if (input && !validateField(input)) {
                isFormValid = false;
            }
        });

        if (pitchSummary && !validateField(pitchSummary)) {
            isFormValid = false;
        }

        return isFormValid;
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                showFormMessage('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            if (btnText) btnText.textContent = 'Submitting...';
            if (btnLoader) btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            try {
                await simulateSubmission();

                showFormMessage('Thank you for your pitch! We will review it and get back to you at connect@rohitjangir.in', 'success');
                form.reset();
                clearFileUpload();

                // Remove validation classes
                document.querySelectorAll('.form-field').forEach(el => {
                    el.classList.remove('valid', 'error');
                });

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                showFormMessage('An error occurred. Please try again or email us directly at connect@rohitjangir.in', 'error');
            } finally {
                // Reset button state
                if (btnText) btnText.textContent = 'Submit Pitch';
                if (btnLoader) btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    function simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;

            // Auto-hide after 8 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 8000);
            }
        }
    }
}
