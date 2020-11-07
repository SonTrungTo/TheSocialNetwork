const listNewsFeed = async (params, credentials, signal) => {
    try {
        const response = await fetch('/api/posts/feed/' + params.userId, {
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

const listByUser = async (params, credentials) => {
    try {
        const response = await fetch('/api/posts/by/' + params.userId, {
            method: 'GET',
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

const create = async (params, credentials, post) => {
    try {
        const response = await fetch('/api/posts/new/' + params.userId, {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                'Authorization': 'Bearer ' + credentials.t
            },
            body: post
        });
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

export {
    listNewsFeed, listByUser, create
};