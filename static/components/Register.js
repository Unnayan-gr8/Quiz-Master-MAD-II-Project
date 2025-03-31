export default {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card shadow-lg p-4 rounded" style="width: 350px;">
            <h3 class="text-center mb-4">Register</h3>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter your email" v-model="FormData.email">
                </div>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your Username" v-model="FormData.username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password" v-model="FormData.password">
                </div>
                <button class="btn btn-primary w-100" @click="addUser">Register</button>
            <div class="text-center mt-3">
                <a href="#" class="text-decoration-none">Forgot Password?</a>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            FormData: {
                email: '',
                username: '',
                password: ''
            }
        }
    },
    methods: {
        addUser() {
            fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.FormData)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);   
                this.$router.push('/login');
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        }
    }
}
