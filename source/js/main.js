import { getData } from './get-send-data.js';
import { renderCards } from './render-cards.js';
import { onInputRenderFilteredCards } from './filter.js';

const GET_URL = 'https://603e38c548171b0017b2ecf7.mockapi.io/homes';


const onSuccessGetData = (data) => {
  renderCards(data);
  onInputRenderFilteredCards(data);
};

getData(GET_URL, onSuccessGetData);
