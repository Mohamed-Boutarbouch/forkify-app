// import { async } from "regenerator-runtime";

// Import this reuseable function from "helper.js" module.
import { getJSON } from "./helpers";

// We need to our constant variables here from "config.js" file.
import { API_URL, RES_PER_PAGE } from "./config.js";

// We have a big state model that contains objects for "recipe", "search" and bookmarks. And then export it to "controller.js" module which acts like a bridge between the "model.js" and "/views/recipeView.js" file.
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

// This function is responsible for fetching the recipe data from Forkify API
export const loadRecipe = async function (id) {
    // Handling the errors using "try/catch" block
    try {
        // Using getJSON() function from "helper.js" module
        const data = await getJSON(`${API_URL}${id}`)

        // Reformat the keys of "recipe" object to get rid of snake_case and replace them with camelCase
        const { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        };

        // To save bookmarks if you switch between recipes
        if (state.bookmarks.some(bookmark => bookmark.id == id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
    } catch (err) {
        // Temporary error handling
        console.error(`${err} 💥💥💥`);
        // Rethrow the error to handle it in the "controller.js" module
        throw err
    }
};

// Implementing the search functionality and then export it so it can be use by the "controller.js" module. This function will have an "query" (should be a string) parameter that which we can pluck into our IPA call.
export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}`)

        // Tap into the recipe search array, create a new array where the search result is nicely formatted, and then store it in the state function.
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })
        state.search.page = 1;
    } catch (err) {
        // Temporary error handling
        console.error(`${err} 💥💥💥`);
        // Rethrow the error to handle it in the "controller.js" module
        throw err
    }
}

// This function is created in the "model.js" module to take in page that we want to render and then returns the results that we actually want to render for that page.
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; // =0
    const end = page * state.search.resultsPerPage; // =9

    return state.search.results.slice(start, end);
};

// This function will reach into the state (into the recipe ingredients, particularly) and then change the quantity.
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        // Formula: newQuantity = oldQuantity * newServings / oldServing (2 * 8 / 4 = 4)
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function () {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as a bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = function (id) {
    // Remove bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem("bookmarks");
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
    localStorage.clear("bookmarks");
};

// clearBookmarks();
