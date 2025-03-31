export default {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">
            <h4 class="navbar-brand fw-bold text-white">Quiz Master</h4>
            <div class="ms-auto d-flex">
                <router-link to="/login" class="btn btn-outline-light me-2 rounded-pill px-4">Login</router-link>
                <router-link to="/register" class="btn btn-light rounded-pill px-4">Register</router-link>
            </div>
        </div>
    </nav>`
}
