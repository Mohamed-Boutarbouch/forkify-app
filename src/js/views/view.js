// This model is about generalizing some DOM elements (such as loading spinner, render function...) by using class inheritance.

// import { mark } from "regenerator-runtime";
import icons from "url:../../img/icons.svg";

export default class View {
    _data;
    // Creating a general function that renders recipes in the UI (to be inherited later)
    render(data, render = true) {
        // If there is no data (wrong query keyword, for example) or if there is an empty array return and render error message
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        // Insert the rendered HTML above by using the parent element "recipe"
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    update(data) {
        this._data = data;
        
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(this._parentElement.querySelectorAll("*"));

        newElements.forEach((newEl, i ) => {
            const curEl = curElements[i];

            // Updates changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }

            // Updates changed ATTRIBUTES
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        })
    }
    
    // To clear the parent element
    _clear() {
        // Emptying out the initial message in the recipe container 
        this._parentElement.innerHTML = "";
    }

    
    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;
    // Clear all the elements to render the spinner
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    // To display an error in the UI
    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
                <p>${message}</p>
        </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    // To render before search message in the recipe container.
    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}