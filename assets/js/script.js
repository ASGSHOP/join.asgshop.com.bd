function switchTab(tabName, evt) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    (evt?.target || event.target).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzBxh6Hbo-OXiNymFUZXBrEIcHCikDGXq26Zo57QMyDCosK-C1I4Pb6AQTmFCNTlWKFGw/exec';

async function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cvInput = document.getElementById('cvFile');

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'wait';
    submitBtn.textContent = 'Submitting...';

    const file = cvInput.files[0];
    if (!file) {
        alert('Please upload your CV.');
        resetButton();
        return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    const position = document.getElementById('positionType').value;
    const district = document.getElementById('district').value.trim();

    if (!name || !email || !phone || !position || !district) {
        alert('Please fill in all required fields.');
        resetButton();
        return;
    }

    if (!phone.startsWith('+880')) {
        phone = '+880' + phone.replace(/^0+/, '');
    }

    const reader = new FileReader();

    reader.onload = async () => {
        try {
            const base64 = reader.result.split(',')[1];

            const body = new URLSearchParams();
            body.append('name', name);
            body.append('email', email);
            body.append('phone', phone);
            body.append('position', position);
            body.append('district', district);
            body.append('cv_filename', file.name);
            body.append('cv_mimeType', file.type || 'application/pdf');
            body.append('cv_file', base64);
            const res = await fetch(WEB_APP_URL, {
                method: 'POST',
                body
            });

            if (!res.ok) {
                throw new Error('Network error: ' + res.status);
            }

            const data = await res.json();
            if (data.status !== 'ok') throw new Error(data.message || 'Submission failed');

            form.reset();
            submitBtn.textContent = 'Submit Application';
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 8000);

        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            resetButton();
        }
    };

    reader.readAsDataURL(file);

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        item.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            if (this.parentElement) {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            }
        });
        input.addEventListener('blur', function () {
            if (this.parentElement) {
                this.parentElement.style.transform = 'scale(1)';
            }
        });
    });

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            if (this.validity.valid) {
                this.style.borderColor = '#10b981';
            } else if (this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            if (this.validity.valid) {
                this.style.borderColor = '#10b981';
            } else if (this.value) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
});
