import {Basket} from "../../../helpers/basket";

export default {
    name: 'basket',
    components: {},
    props: [],
    data() {
        return {
            data: [],
            total: 0,
            BASKET: new Basket(this.$store)
        }
    },
    created() {
        this.getThings()
    },
    methods: {

        getThings() {
            this.total = 0;
            this.data = this.getLocalStorageThings() || [];
            this.data.forEach(
                item => item.basket &&
                    item.basket.prices &&
                    (this.total += Number(item.basket.prices) * (Number(item.basket.qty) || 1))
            );
            this.total = this.total.toFixed(2)
        },

        getLocalStorageThings () {
            return this.BASKET.getAllThing() || this.$store.getters['cookie/getAllThing']
        },

        deleteThingsInBasket(index) {
            this.BASKET.deleteThing(index);
            this.getThings();
            this.$store.commit('error/setValue', {
                name: 'data',
                data: {type: 'red', text: 'Successfully removed from the basket', active: true}
            });
            this.$emit('refresh', true)
        },

        toRouter(data) {
            this.$router.push(`/products/${data.url}`)
        }
    }
}
