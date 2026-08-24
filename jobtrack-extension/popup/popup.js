class JobTrackPopup {
    constructor() {
        this.authToken = null;
        this.user = null;
        this.backendUrl = 'http://localhost:8081/api';

        this.init().catch(error => {
            console.error('Initialization failed:', error);
        });
    }

    async init() {
        await this.checkAuth();
        await this.render();
    }

    async checkAuth() {
        const data = await chrome.storage.local.get(['authToken', 'user']);

        this.authToken = data.authToken || null;
        this.user = data.user || null;
    }

    async render() {
        const app = document.getElementById('app');

        if (!app) {
            console.error('Element with id="app" not found.');
            return;
        }

        if (!this.authToken) {
            app.innerHTML = this.renderAuth();
            this.setupAuthListeners();
        } else {
            app.innerHTML = this.renderJobForm();
            this.setupJobFormListeners();
        }
    }

    renderAuth() {
        return `
            <div class="container">
                <div class="logo-section">
                    <h1>JobTrack</h1>
                    <p>Track your applications automatically</p>
                </div>

                <div id="auth-container">

                    <!-- LOGIN -->
                    <div class="auth-form" id="login-form">
                        <h2 style="font-size: 18px; margin-bottom: 16px; color: #333;">
                            Sign In
                        </h2>

                        <div id="error-msg"></div>

                        <div class="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                id="login-email"
                                placeholder="your@email.com"
                            >
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                id="login-password"
                                placeholder="••••••••"
                            >
                        </div>

                        <button
                            class="button button-primary"
                            id="login-btn"
                        >
                            Sign In
                        </button>

                        <div class="toggle-link" id="show-register">
                            Don't have an account? Create one
                        </div>
                    </div>

                    <!-- REGISTER -->
                    <div
                        class="auth-form"
                        id="register-form"
                        style="display:none;"
                    >
                        <h2 style="font-size: 18px; margin-bottom: 16px; color: #333;">
                            Create Account
                        </h2>

                        <div id="error-msg-reg"></div>

                        <div class="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                id="register-name"
                                placeholder="John Doe"
                            >
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                id="register-email"
                                placeholder="your@email.com"
                            >
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                id="register-password"
                                placeholder="••••••••"
                            >
                        </div>

                        <button
                            class="button button-primary"
                            id="register-btn"
                        >
                            Create Account
                        </button>

                        <div class="toggle-link" id="show-login">
                            Already have an account? Sign in
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    renderJobForm() {
        return `
            <div class="container">

                <div class="logo-section">
                    <h1 style="color: white; font-size: 20px;">
                        JobTrack
                    </h1>
                </div>

                <div class="user-info">
                    <p>
                        <strong>${this.escapeHtml(this.user?.fullName || '')}</strong>
                    </p>

                    <p>
                        ${this.escapeHtml(this.user?.email || '')}
                    </p>

                    <button
                        class="logout-btn"
                        id="logout-btn"
                    >
                        Logout
                    </button>
                </div>

                <div class="job-form">

                    <h2>Add Job Application</h2>

                    <div id="form-error"></div>
                    <div id="form-success"></div>

                    <!-- COMPANY -->
                    <div class="form-grid full">
                        <div class="form-group">
                            <label>Company *</label>
                            <input
                                type="text"
                                id="company"
                                placeholder="Google"
                            >
                        </div>
                    </div>

                    <!-- JOB TITLE + PORTAL -->
                    <div class="form-grid">

                        <div class="form-group">
                            <label>Job Title *</label>

                            <input
                                type="text"
                                id="jobTitle"
                                placeholder="Software Engineer"
                            >
                        </div>

                        <div class="form-group">
                            <label>Portal *</label>

                            <select
                                id="portal"
                                style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;"
                            >
                                <option value="">Select Portal</option>
                                <option value="LINKEDIN">LinkedIn</option>
                                <option value="NAUKRI">Naukri</option>
                                <option value="INTERNSHALA">Internshala</option>
                                <option value="UNSTOP">Unstop</option>
                                <option value="COMPANY_WEBSITE">
                                    Company Website
                                </option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                    </div>

                    <!-- LOCATION + EMPLOYMENT TYPE -->
                    <div class="form-grid">

                        <div class="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                id="location"
                                placeholder="Bangalore"
                            >
                        </div>

                        <div class="form-group">
                            <label>Employment Type</label>

                            <select
                                id="employmentType"
                                style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;"
                            >
                                <option value="">Select Type</option>
                                <option value="FULL_TIME">Full-time</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="PART_TIME">Part-time</option>
                                <option value="CONTRACT">Contract</option>
                            </select>
                        </div>

                    </div>

                    <!-- JOB URL -->
                    <div class="form-grid full">

                        <div class="form-group">
                            <label>Job URL</label>

                            <input
                                type="url"
                                id="jobUrl"
                                placeholder="https://..."
                            >
                        </div>

                    </div>

                    <!-- SALARY + RESUME -->
                    <div class="form-grid">

                        <div class="form-group">
                            <label>Salary/Stipend</label>

                            <input
                                type="text"
                                id="salaryStipend"
                                placeholder="₹50,000/month"
                            >
                        </div>

                        <div class="form-group">
                            <label>Resume Used</label>

                            <input
                                type="text"
                                id="resumeLabel"
                                placeholder="Resume_v1"
                            >
                        </div>

                    </div>

                    <!-- JOB DESCRIPTION -->
                    <div class="form-grid full">

                        <div class="form-group">
                            <label>Job Description</label>

                            <textarea
                                id="jobDescription"
                                placeholder="Paste job description..."
                                style="padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical; height: 100px;"
                            ></textarea>
                        </div>

                    </div>

                    <!-- SUBMIT -->
                    <button
                        class="button button-primary submit-btn"
                        id="submit-job-btn"
                    >
                        Apply Now
                    </button>

                </div>
            </div>
        `;
    }

    setupAuthListeners() {

        // Show register form
        const showRegister = document.getElementById('show-register');

        if (showRegister) {
            showRegister.addEventListener('click', () => {
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('register-form').style.display = 'block';
            });
        }

        // Show login form
        const showLogin = document.getElementById('show-login');

        if (showLogin) {
            showLogin.addEventListener('click', () => {
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            });
        }

        // Login button
        const loginButton = document.getElementById('login-btn');

        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.login();
            });
        }

        // Register button
        const registerButton = document.getElementById('register-btn');

        if (registerButton) {
            registerButton.addEventListener('click', () => {
                this.register();
            });
        }

        // Login with Enter
        const loginEmail = document.getElementById('login-email');

        if (loginEmail) {
            loginEmail.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.login();
                }
            });
        }

        // Login password with Enter
        const loginPassword = document.getElementById('login-password');

        if (loginPassword) {
            loginPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.login();
                }
            });
        }

        // Register with Enter
        const registerPassword = document.getElementById('register-password');

        if (registerPassword) {
            registerPassword.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.register();
                }
            });
        }
    }

    async login() {

        const emailElement = document.getElementById('login-email');
        const passwordElement = document.getElementById('login-password');
        const errorMsg = document.getElementById('error-msg');

        const email = emailElement?.value.trim();
        const password = passwordElement?.value;

        if (!email || !password) {
            errorMsg.className = 'error';
            errorMsg.textContent = 'Please fill in all fields';
            return;
        }

        try {

            const response = await fetch(
                `${this.backendUrl}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            if (!response.ok) {

                let message = 'Invalid credentials';

                try {
                    const error = await response.json();

                    if (error.message) {
                        message = error.message;
                    }
                } catch (e) {
                    console.warn('Could not parse login error response.');
                }

                throw new Error(message);
            }

            const data = await response.json();

            if (!data.token) {
                throw new Error(
                    'Login successful, but authentication token was not returned by the server.'
                );
            }

            await chrome.storage.local.set({
                authToken: data.token,

                user: {
                    fullName: data.fullName,
                    email: data.email,
                    id: data.userId
                }
            });

            this.authToken = data.token;

            this.user = {
                fullName: data.fullName,
                email: data.email,
                id: data.userId
            };

            await this.render();

        } catch (error) {

            console.error('Login error:', error);

            errorMsg.className = 'error';

            errorMsg.textContent =
                error.message || 'Login failed. Try again.';
        }
    }

    async register() {

        const fullNameElement = document.getElementById('register-name');
        const emailElement = document.getElementById('register-email');
        const passwordElement = document.getElementById('register-password');

        const errorMsg = document.getElementById('error-msg-reg');

        const fullName = fullNameElement?.value.trim();
        const email = emailElement?.value.trim();
        const password = passwordElement?.value;

        if (!fullName || !email || !password) {

            errorMsg.className = 'error';

            errorMsg.textContent =
                'Please fill in all fields';

            return;
        }

        if (password.length < 8) {

            errorMsg.className = 'error';

            errorMsg.textContent =
                'Password must be at least 8 characters';

            return;
        }

        try {

            const response = await fetch(
                `${this.backendUrl}/auth/register`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        fullName,
                        email,
                        password
                    })
                }
            );

            if (!response.ok) {

                let message = 'Registration failed';

                try {

                    const error = await response.json();

                    if (error.message) {
                        message = error.message;
                    }

                } catch (e) {
                    console.warn(
                        'Could not parse registration error response.'
                    );
                }

                throw new Error(message);
            }

            const data = await response.json();

            if (!data.token) {

                throw new Error(
                    'Registration successful, but authentication token was not returned by the server.'
                );
            }

            await chrome.storage.local.set({

                authToken: data.token,

                user: {
                    fullName: data.fullName,
                    email: data.email,
                    id: data.userId
                }

            });

            this.authToken = data.token;

            this.user = {
                fullName: data.fullName,
                email: data.email,
                id: data.userId
            };

            await this.render();

        } catch (error) {

            console.error('Registration error:', error);

            errorMsg.className = 'error';

            errorMsg.textContent =
                error.message || 'Registration failed. Try again.';
        }
    }

    async submitJob() {

        const companyElement = document.getElementById('company');
        const jobTitleElement = document.getElementById('jobTitle');
        const portalElement = document.getElementById('portal');

        const errorMsg = document.getElementById('form-error');
        const successMsg = document.getElementById('form-success');

        const company = companyElement?.value.trim();
        const jobTitle = jobTitleElement?.value.trim();
        const portal = portalElement?.value;

        errorMsg.textContent = '';
        successMsg.textContent = '';

        if (!company || !jobTitle || !portal) {

            errorMsg.className = 'error';

            errorMsg.textContent =
                'Company, Job Title, and Portal are required';

            return;
        }

        const jobData = {

            company,

            jobTitle,

            portal,

            location:
                document.getElementById('location').value.trim() || null,

            employmentType:
                document.getElementById('employmentType').value || null,

            jobUrl:
                document.getElementById('jobUrl').value.trim() || null,

            salaryStipend:
                document.getElementById('salaryStipend').value.trim() || null,

            resumeLabel:
                document.getElementById('resumeLabel').value.trim() || null,

            jobDescription:
                document.getElementById('jobDescription').value.trim() || null,

            status: 'APPLIED'
        };

        try {

            const response = await fetch(
                `${this.backendUrl}/applications`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',

                        'Authorization':
                            `Bearer ${this.authToken}`
                    },

                    body: JSON.stringify(jobData)
                }
            );

            if (!response.ok) {

                let message = 'Failed to save application';

                try {

                    const error = await response.json();

                    if (error.message) {
                        message = error.message;
                    }

                } catch (e) {

                    console.warn(
                        'Could not parse application error response.'
                    );
                }

                throw new Error(message);
            }

            successMsg.className = 'success';

            successMsg.textContent =
                '✓ Application saved successfully!';

            // Clear form
            document.getElementById('company').value = '';
            document.getElementById('jobTitle').value = '';
            document.getElementById('portal').value = '';
            document.getElementById('location').value = '';
            document.getElementById('employmentType').value = '';
            document.getElementById('jobUrl').value = '';
            document.getElementById('salaryStipend').value = '';
            document.getElementById('resumeLabel').value = '';
            document.getElementById('jobDescription').value = '';

            setTimeout(() => {

                successMsg.textContent = '';

            }, 3000);

        } catch (error) {

            console.error(
                'Save application error:',
                error
            );

            errorMsg.className = 'error';

            errorMsg.textContent =
                error.message ||
                'Failed to save application';
        }
    }

    setupJobFormListeners() {

        // Submit job
        const submitButton =
            document.getElementById('submit-job-btn');

        if (submitButton) {

            submitButton.addEventListener(
                'click',
                () => this.submitJob()
            );
        }

        // Logout
        const logoutButton =
            document.getElementById('logout-btn');

        if (logoutButton) {

            logoutButton.addEventListener(
                'click',
                () => this.logout()
            );
        }
    }

    async logout() {

        await chrome.storage.local.remove([
            'authToken',
            'user'
        ]);

        this.authToken = null;
        this.user = null;

        await this.render();
    }

    escapeHtml(value) {

        if (!value) {
            return '';
        }

        const div = document.createElement('div');

        div.textContent = value;

        return div.innerHTML;
    }
}

const jobTrackPopup = new JobTrackPopup();