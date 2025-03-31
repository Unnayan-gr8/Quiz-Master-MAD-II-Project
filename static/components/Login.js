export default {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-4 rounded" style="width: 380px;">
            <h3 class="text-center mb-3 fw-bold text-primary">Login Form</h3>

            <!-- Animated Message -->
            <transition name="fade">
                <div v-if="message" class="alert text-center" :class="messageType">
                    {{ message }}
                </div>
            </transition>

            <!-- Email Input -->
            <div class="mb-3">
                <label for="email" class="form-label fw-semibold">Email Address : </label>
                <input type="email" class="form-control" id="email" placeholder="Enter your email" v-model="FormData.email">
            </div>

            <!-- Password Input -->
            <div class="mb-3">
                <label for="password" class="form-label fw-semibold">Password : </label>
                <input type="password" class="form-control" id="password" placeholder="Enter your password" v-model="FormData.password">
            </div>

            <!-- Login Button -->
            <button class="btn btn-primary w-100 fw-semibold" @click="loginUser">Login</button>
        </div>
    </div>
    `,

    data() {
        return {
            FormData: {
                email: '',
                password: ''
            },
            message: '',
            messageType: '' // Bootstrap alert class
        };
    },

    methods: {
        loginUser() {
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.FormData)
            })
            .then(response => response.json())
            .then(data => {
                if (data["Authentication-Token"]) {
                    localStorage.setItem("id", data.id);
                    localStorage.setItem("auth_token", data["Authentication-Token"]);
                    localStorage.setItem("role", data.role);
                    
                    this.message = "Login successful!";
                    this.messageType = "alert-success";

                    setTimeout(() => {
                        if (data.role === 'admin') {
                            this.$router.push('/admin');
                        } else {
                            this.$router.push('/dashboard');
                        }
                    }, 1500);
                } else {
                    this.message = data.message || "Login failed!";
                    this.messageType = "alert-danger"; // Red message
                }

                setTimeout(() => { this.message = ''; }, 3000);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                this.message = "Server error. Please try again.";
                this.messageType = "alert-danger";
                setTimeout(() => { this.message = ''; }, 3000);
            });
        }
    }
}