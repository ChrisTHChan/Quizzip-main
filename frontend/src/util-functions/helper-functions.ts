export function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export function getServerURL() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:9000/api'
    } else {
        return '/api'
    }
}