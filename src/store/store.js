import { createStore } from 'redux'
import initApp from '../reducers/reducers'
import {playVideo} from "../actions/actions";
const store = createStore(initApp);

const unsubscribe = store.subscribe(() => console.log(store.getState()))


export default store;