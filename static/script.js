import Home from './components/Home.js'
import Register from './components/Register.js'
import Login from './components/Login.js'
import NavBar from './components/NavBar.js'   
import Foot from './components/Footer.js'
import Dashboard from './components/Dashboard.js'
import Admin from './components/Admin.js'

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/dashboard', component: Dashboard},
    {path: '/admin', component: Admin}
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: '#app',
    router,
    template: '<div class = "container"><nav-bar></nav-bar><router-view></router-view><foot></foot></div>',
    data: {
        message: 'Hello Vue!',
        title: 'Hello Vue!!',
        link: 'https://www.google.com',
        finishedLink: '<a href="https://www.google.com">Google</a>'
    },
    components: {
        'nav-bar': NavBar,
        'foot': Foot
    }
})