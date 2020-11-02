const create = async (user) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json"
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const list = async (credentials, signal) => {
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            signal: signal
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const read = async (params, credentials, signal) => {
    try {
        const response = await fetch('/api/users/' + params.userId, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            signal: signal
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const update = async (params, credentials, user) => {
    try {
        const response = await fetch('/api/users/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            body: user
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const remove = async (params, credentials) => {
    try {
        const response = await fetch('/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            }
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const follow = async (params, credentials, followId) => {
    try {
        const response = await fetch('/api/users/follow', {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId: params.userId, followId})
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const unfollow = async (params, credentials, unfollowId) => {
    try {
        const response = await fetch('/api/users/unfollow', {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({userId: params.userId, unfollowId})
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export {
    create, list, read, update, remove, follow, unfollow
};