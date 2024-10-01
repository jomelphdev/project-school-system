import { createStore } from 'vuex'

const store = createStore({
    state: {
      authString: []
      },
    mutations: {
        addAuthString: function( state, payload ) {
          state.authString.push(payload);
        }
      },
    getters: {
          getAuthString: function( state ){
            return state.authString; 
      },
          removeAuthString: function ( state ){
            return state.authString = [];
          }
    },
  })

  export default store