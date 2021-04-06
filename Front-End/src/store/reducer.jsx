/* eslint-disable no-underscore-dangle */
const initialState = {
  id: '',
  name: '',
  refreshBit: false,
};

const reducer = (state = initialState, action) => {
  if (action.type === 'REGISTER_USER') {
    return {
      id: action.value._id,
      name: action.value.name,
    };
  }
  if (action.type === 'RENDER') {
    return {
      refreshBit: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'REMOVE_USER') {
    return {};
  }
  return state;
};

export default reducer;
