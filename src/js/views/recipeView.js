// Importing icon directory from dist folder because parcel is using icons from the latter folder
import icons from "url:../../img/icons.svg";

import View from "./view";

// Importing a module that Converts float numbers into fractional numbers (1.5 => 1 1/2)
import { Fraction } from "fractional";

// Setting the view up
class RecipeView extends View {
    // Making "parentElement" as private property because it will make it easy to render elements inside the recipe container (such as loading spinner and render success or error message...).
    _parentElement = document.querySelector(".recipe");

    _errorMessage = "We could not find that recipe. Please try another one!";
    _message = "Start by searching for a recipe or an ingredient. Have fun!";

    // This method is the publisher that needs to get access to the subscriber (following "Publisher-Subscriber Pattern").
    addHandlerMethod(handler) {
        // Load the recipe in the UI based on the hash code and refactor the code below
        ["hashchange", "load"].forEach(ev => addEventListener(ev, handler));
        // window.addEventListener("hashchange", handler);
        // window.addEventListener("load", handler);
    }

    // Increase or decrease the serving number.
    addHandlerUpdateServings(handler) {
        this._parentElement.addEventListener("click", e => {
            const btn = e.target.closest(".btn--update-servings");
            if (!btn) return;
            const { updateTo } = btn.dataset;

            if (+updateTo > 0) handler(+updateTo);
        });
    }

    addHandlerAddBookmark(handler) {
      this._parentElement.addEventListener("click", e => {
        const btn = e.target.closest(".btn--bookmark");
        if (!btn) return;
        handler();
      })
    }

    _generateMarkup() {
        return `
    <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
            this._data.title
        }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${this._data.bookmarked ? "-fill" : ""}"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${this._data.ingredients
                .map(this._generateMarkupIngredient)
                .join("")}
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
              this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;
    }

    _generateMarkupIngredient(ing) {
        // To loop over the ingredients array in order to return a string of array so map() method best used here; forEach will simply not work. And nest it inside a private function to refactor our code.
        return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
              ing.quantity ? new Fraction(ing.quantity).toString() : ""
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
          </div>
        </li>
        `;
    }
}

// Avoiding to export "RecipeView" class to the "controller.js" module directly because it will save up some unnecessary exports.
export default new RecipeView();
