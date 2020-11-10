const APIURL = 'api';

async function isAuthenticated() {

    let url = APIURL + '/user';

    const response = await fetch(url);
    const user = await response.json();

    if (response.ok) {
        return user;
    } else {
        throw response.status; //just send status code
    }
}

async function login(username, password) {

    return new Promise((resolve, reject) => {
        fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => resolve(obj))
                    .catch((err) => reject(err));
            } else {
                response.json()
                    .then((obj) => reject(obj)) //to send username/password errors
                    .catch((err) => reject(err));
            }
        }).catch((err) => reject(err));
    });
}

async function logout() {
    const url = APIURL + '/logout';
    const response = await fetch(url, {
        method: 'POST'
    });
    if (response.ok) {
        return;
    } else {
        throw response.status;
    }
}

export default { isAuthenticated, login, logout };