const API_CALL_REQUEST = "API_CALL_REQUEST";
const API_CALL_SUCCESS = "API_CALL_SUCCESS";
const API_CALL_FAILURE = "API_CALL_FAILURE";
const API_CALL_RESTORE = "API_CALL_RESTORE";

const initialState = {
  fetching: false,
  pokemon: null,
  error: null
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case API_CALL_REQUEST:
      return { ...state, fetching: true, error: null };
    case API_CALL_SUCCESS:
      return { ...state, fetching: false, pokemon: action.pokemon };
    case API_CALL_FAILURE:
      return { ...state, fetching: false, error: action.error };
    case API_CALL_RESTORE:
      return { ...state, fetching: false, error: null };
    default:
      return state;
  }
}
