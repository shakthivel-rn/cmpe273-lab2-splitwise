const initialState = {
  id: '',
  name: '',
  email: '',
};

const reducer = (state = initialState, action) => {
  if (action.type === 'REGISTER_USER') {
    return {
      id: action.value.id,
      name: action.value.name,
      email: action.value.email,
    };
  }
  if (action.type === 'REMOVE_USER') {
    return {};
  }
  return state;
};

export default reducer;
