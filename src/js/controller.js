// import everything in the "model.js"
import * as model from "./model";

// eslint-disable-next-line import/no-named-as-default-member
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";

// For polyfilling async/await
import "core-js/stable";
// For polyfilling everything else
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2
// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

// /////////////////////////////////////
const controlRecipes = async function () {
    try {
        // Extract the the hash code and inject it in the url of the async function
        const id = window.location.hash.slice(1);

        // Guard clause: if there is no id then return nothing. This line of code prevent the error message.
        if (!id) return;

        recipeView.renderSpinner();

        // 0. Update result view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 1. Loading recipe:
        // Importing the async function from "model.js" and the keyword "await" is really important because that function will return a promise so we should handle it with "async/await" keyword.
        await model.loadRecipe(id);

        // 2. Rendering recipe:

        // Creating the method render() and refactor the code below
        recipeView.render(model.state.recipe);
        // const recipeView = new recipeView(model)

        // 3. Updating bookmarks view
        bookmarksView.update(model.state.bookmarks);
    } catch (err) {
        // Render the error in the UI
        recipeView.renderError();
    }
};

const controlSearchResult = async function () {
    try {
        resultsView.renderSpinner();

        // 1) Get search query
        // Getting the value of query imported from "searchView.js" model.
        const query = searchView.getQuery();
        // If there is no query returns nothing (guard clause).
        if (!query) return;

        // 2) Load search results
        await model.loadSearchResult(query);

        // 3) Render search results
        resultsView.render(model.getSearchResultsPage());

        // 4) Render the initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};

// Following the "Publisher-Subscriber Pattern".
const controlPagination = function (gotoPage) {
    // 1) Render NEW search results
    resultsView.render(model.getSearchResultsPage(gotoPage));

    // 2) Render NEW pagination buttons
    paginationView.render(model.state.search);
};

// Increase or decrease the serving number.
const controlServings = function (newServings) {
    // Update the recipe servings
    model.updateServings(newServings);

    // Update the recipe view
    recipeView.update(model.state.recipe);
    // recipeView.render(model.state.recipe)
};

const controlAddBookmark = function () {
    // 1) Add/Remove a bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // 2) Update recipe view
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

// This function is the subscriber that passes the data to the publisher function (in this case "addHandlerMethod" function in the "recipeView.js" module) (following "Publisher-Subscriber Pattern").
const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerMethod(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResult);
    paginationView.addHandlerClick(controlPagination);
};

init();
