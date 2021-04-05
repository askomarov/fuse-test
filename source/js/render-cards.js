const cardsWrapper = document.querySelector('.cards');
const similarCardTemplate = document.querySelector('#card').content;

const fillCardElement = (arrayItem, newElement) => {
  // заполняем данными конкертного объекта
  const element = newElement.querySelector('.card')
  newElement.querySelector('.card__title').textContent = arrayItem.title;
  newElement.querySelector('.card__address').textContent = arrayItem.address;
  newElement.querySelector('.card__price-value').textContent = ' £' + arrayItem.price;
  const elementLink = `/details/${arrayItem.id}`
  element.setAttribute('href', elementLink);

  if (arrayItem.type === 'IndependentLiving') {
    newElement.querySelector('.card__living-type').textContent = 'Independent living';
    element.classList.add('card--indepdent');

  } else {
    newElement.querySelector('.card__living-type').textContent = 'Restaurant & Support available';
    element.classList.add('card--support');
  }
  return newElement;
};

const createNewCard = (element) => {
  const cardElement = similarCardTemplate.cloneNode(true);
  fillCardElement(element, cardElement);
  return cardElement;
};

const renderCards = (array) => {
  cardsWrapper.innerHTML = '';
  array.forEach(element => {
    const newCard = createNewCard(element);
    cardsWrapper.appendChild(newCard)
  });
};

export { renderCards };
