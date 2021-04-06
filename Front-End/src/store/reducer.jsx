/* eslint-disable no-underscore-dangle */
const initialState = {
  id: '',
  name: '',
  refreshBit: false,
  refreshBitYouOwe: false,
  refreshBitProfileImage: false,
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
  if (action.type === 'RENDER_YOU_OWE') {
    return {
      refreshBitYouOwe: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'RENDER_PROFILE_IMAGE') {
    return {
      refreshBitProfileImage: action.value.modifiedRefreshBitLocal,
    };
  }
  if (action.type === 'REMOVE_USER') {
    return {};
  }
  return state;
};

export default reducer;
