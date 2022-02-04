// "helper.js" module is to store some functions that we reuse over and over in our project.

import { TIMEOUT_SEC } from "./config";

// This function returns an error message after loading data for a few seconds. So that our app does not load forever.
const timeout = function (s) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`),
            );
        }, s * 1000);
    });
};

// We will use this function more often to get the URL of the recipes
export const getJSON = async function (url) {
    try {
        const fetchPromise = await fetch(url);
        const res = await Promise.race(([fetchPromise, timeout(TIMEOUT_SEC)]));
        const data = await res.json();

        // Rewrite errors with a meaningful error message
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data;
    } catch {
        // Rethrow the error to handle it in the "model.js" not in this module
        // eslint-disable-next-line no-undef
        throw err;
    }
};
