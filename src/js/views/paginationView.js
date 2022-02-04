// This model is about implementing pagination view in the UI.

import View from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends View{
    _parentElement = document.querySelector(".pagination");

    addHandlerClick(handler) {
        this._parentElement.addEventListener("click", e => {
            const btn = e.target.closest(".btn--inline");
            if (!btn) return;

            const gotoPage = +btn.dataset.goto;

            handler(gotoPage);
        })
    }

    _generateMarkup() {
        // To count how many pages do we have.
        const currPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Scenario 1: We are in page 1 and there are other pages.
        if (currPage === 1 && numPages > 1) {
            return `
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }

        // Scenario 2: We are in the last page.
        if (currPage === numPages && numPages > 1) {
            return `
                <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>
            `;
        }

        // Scenario 3: We are in between 2 pages.
        if (currPage < numPages) {
            return `
                <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }

        // Scenario 4: We are in page 1 and there are NO other pages.
        return "";
    }
}

export default new PaginationView();
