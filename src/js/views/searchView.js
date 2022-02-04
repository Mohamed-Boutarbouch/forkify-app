// This vue model is going to be about getting the query in the input search field and loading the search results when the search button is clicked.

// We do not want render anything here. This class function will get the query and listen to the click event on the button.
class SearchView {
    _parentElement = document.querySelector(".search");

    getQuery() {
        const query = this._parentElement.querySelector(".search__field").value;
        this._clearInput();
        return query
    }

    // To clear the search field
    _clearInput() {
        this._parentElement.querySelector(".search__field").value = "";
    }

    // In order for the search button to work, we will listen for the event in the "searchView.js" model and then pass the controller function (or handler function) into the "addHandlerSearch" method. This is publisher-subscriber pattern. So the "addHandlerSearch" function is going to be the publisher and the "controlSearchResult" function is going to be the subscriber.
    addHandlerSearch(handler) {
        this._parentElement.addEventListener("submit", e => {
            e.preventDefault();
            handler();
        })
    }
}

// We will not export the whole class. We only need to export the instance (an object created by that class).
export default new SearchView();
