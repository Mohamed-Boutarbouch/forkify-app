// This model is going to be about rendering results from the search query.

import View from "./view";
import previewView from "./previewView";

class ResultsView extends View{
    _parentElement = document.querySelector(".results");

    _errorMessage = "No recipes found in your query. Please try another one!"
    _message = "Start by searching for a recipe or an ingredient. Have fun!"

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false)).join("");
    }
}

export default new ResultsView();
