// validation.js
// External JavaScript for patient form validations and review

function updateSalaryValue() {
    const slider = document.getElementById('salary');
    const value = document.getElementById('salaryValue');
    value.textContent = slider.value;
}

function setDobRange() {
    const dob = document.getElementById('dob');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const max = `${yyyy}-${mm}-${dd}`;
    const minDate = new Date(yyyy - 120, today.getMonth(), today.getDate());
    const minY = minDate.getFullYear();
    const minM = String(minDate.getMonth() + 1).padStart(2, '0');
    const minD = String(minDate.getDate()).padStart(2, '0');
    const min = `${minY}-${minM}-${minD}`;
    dob.min = min;
    dob.max = max;
}

function validateForm() {
    const form = document.getElementById('patientForm');
    const errors = [];

    // Date of birth range checks
    const dob = form.dob.value;
    if (dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        if (dobDate > today) {
            errors.push('Date of Birth: Cannot be in the future.');
        }
        if (dobDate < minDate) {
            errors.push('Date of Birth: Cannot be more than 120 years ago.');
        }
    }

    const username = form.userid.value.toLowerCase();
    const pass = form.password.value;
    const repass = form.repassword.value;

    if (pass !== repass) {
        errors.push('Passwords do not match.');
    }

    if (pass === username || pass.includes(username) || username.includes(pass.slice(0, 3))) {
        errors.push('Password cannot equal or contain part of User ID.');
    }

    const pwdRequirements = /^(?=.{8,30}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()_\-+=\\\/><.,`~])[A-Za-z\d!@#%^&*()_\-+=\\\/><.,`~]+$/;
    if (!pwdRequirements.test(pass)) {
        errors.push('Password must be 8-30 chars, include upper, lower, digit, and special (no quotes).');
    }

    if (errors.length > 0) {
        alert('Please fix these issues before submitting:\n\n' + errors.join('\n'));
        return false;
    }
    return true;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateSalaryValue();
    setDobRange();

    // Password match validation
    document.getElementById('repassword').addEventListener('input', function() {
        const pass = document.getElementById('password').value;
        const repass = this.value;
        if (pass !== repass) {
            this.setCustomValidity('Passwords do not match');
        } else {
            this.setCustomValidity('');
        }
    });

    // User ID to lowercase on input
    document.getElementById('userid').addEventListener('input', function() {
        this.value = this.value.toLowerCase();
    });

    // Zip truncate on input
    document.getElementById('zip').addEventListener('input', function() {
        const val = this.value;
        if (val.length > 5 && val.includes('-')) {
            this.value = val.split('-')[0];
        }
    });
});

function reviewForm() {
    const form = document.getElementById('patientForm');
    const reviewContent = document.getElementById('reviewContent');
    const reviewSection = document.getElementById('reviewSection');
    
    let content = '';
    let errors = [];

    // Name
    const first = form.firstname.value.trim();
    const middle = form.middleinit.value.trim();
    const last = form.lastname.value.trim();
    content += `First, MI, Last Name           ${first} ${middle} ${last}\n`;

    // DOB
    const dob = form.dob.value;
    const dobDate = new Date(dob);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    if (dobDate > today) {
        errors.push('Date of Birth: Cannot be in the future');
    } else if (dobDate < minDate) {
        errors.push('Date of Birth: Cannot be more than 120 years ago');
    }
    content += `Date of Birth                       ${dob}\n`;

    // Social
    const social = form.social.value;
    content += `Social Security                     ${social.replace(/./g, '*')}\n`; // obscured

    // Address
    const addr1 = form.addr1.value.trim();
    const addr2 = form.addr2.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value;
    const zip = form.zip.value;
    const truncatedZip = zip.split('-')[0];
    content += `Address                               ${addr1}\n`;
    if (addr2) content += `                                      ${addr2}\n`;
    content += `                                      ${city}, ${state} ${truncatedZip}\n`;

    // Phone
    const phone = form.phone.value;
    content += `Phone number                   ${phone}\n`;

    // Email
    const email = form.email.value;
    content += `Email address                    ${email}\n`;

    // User ID
    const userid = form.userid.value.toLowerCase();
    form.userid.value = userid; // convert to lowercase
    content += `User ID                                 ${userid}\n`;

    // Passwords
    const pass = form.password.value;
    const repass = form.repassword.value;
    if (pass !== repass) {
        errors.push('Passwords do not match');
    }
    if (pass === userid || pass.includes(userid) || userid.includes(pass.slice(0,3))) {
        errors.push('Password cannot equal or contain part of User ID');
    }
    content += `Password                            ${pass.replace(/./g, '*')}\n`;

    // Symptoms
    const symptoms = [];
    const checkboxes = form.querySelectorAll('input[name="symptoms"]:checked');
    checkboxes.forEach(cb => symptoms.push(cb.value));
    content += `\nSymptoms:\n`;
    ['chickenpox', 'measles', 'mumps', 'covid', 'flu'].forEach(sym => {
        content += `${sym.charAt(0).toUpperCase() + sym.slice(1)}             ${symptoms.includes(sym) ? 'Y' : 'N'}\n`;
    });

    // Vaccinated
    const vacc = form.querySelector('input[name="vaccinated"]:checked');
    content += `\nVaccinated?                         ${vacc ? vacc.value : 'Not selected'}\n`;

    // Illness severity
    const salary = form.salary.value;
    content += `\nIllness Severity                   ${salary}\n`;

    // Comments
    const comments = form.comments.value;
    content += `\nDescribed Symptoms                     ${comments}\n`;

    // Display errors
    if (errors.length > 0) {
        content += '\nERRORS:\n' + errors.join('\n') + '\n';
    }

    reviewContent.textContent = content;
    reviewSection.style.display = 'block';
}

function startOver() {
    document.getElementById('reviewSection').style.display = 'none';
    document.getElementById('patientForm').reset();
    updateSalaryValue();
}

