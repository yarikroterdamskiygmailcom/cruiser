import Vue from 'vue';
import VueResource from 'vue-resource';
import {enviroment} from "../config";

Vue.use(VueResource);
Vue.http.options.root = enviroment.url;

export default ({ store }) => {
    const errorInterseptor = (request, next) => {
        return next(response => {
            switch (response.status) {
                case 404: toStore('red', 'error');
                    return;
                case 405: toStore('info', 'error');
                    return;
                case 200: toStore('green', 'error');
                    return;
            }
        });
    };

    const toStore = (type, text) => {
        store.dispatch('error/actionValue', {
            name: 'data',
            data: {type: type, text: text, active: true}
        });
    };

    const urlInterseptor = (request, next) => {
        request.url = `${request.root}${request.url}`;
        return next();
    };

    Vue.http.interceptors.push(urlInterseptor);
    Vue.http.interceptors.push(errorInterseptor);
}


