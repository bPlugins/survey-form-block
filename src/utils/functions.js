export const generateUniqueId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

export const valueConvert = (value) => {
    const hyphenReplace = value.replace(/ /g, '-');
    return hyphenReplace.toLowerCase();
}

// Example POST method implementation:
export async function postData(url = "", data = {}) {
    const formData = new FormData();

    Object.keys(data).map(key => {
        formData.append(key, data[key]);
    });

    window.formData = formData;
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        // headers: {
        //     "Content-Type": "application/json",
        //     // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}