import { renderCards } from './render-cards.js';
import { debounce } from './debounce.js';

const RERENDER_TIME = 500;

const cardsWrapper = document.querySelector('.cards');
const searchInput = document.querySelector('#search');

const renderFilteredCards = (data, value) => {
  cardsWrapper.innerHTML = '';
  const filteredData = data.filter((item) => {
    return item.title.toLowerCase().includes(value);
  });
  renderCards(filteredData);
};

const onInputRenderFilteredCards = (data) => {
  searchInput.addEventListener('input', debounce(() => {
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue.length >= 3) {
      renderFilteredCards(data, searchValue)
    } else {
      return renderCards(data);
    }
  }, RERENDER_TIME)
  )
};

export { onInputRenderFilteredCards };
