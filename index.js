Vue.component('magic-8-ball', {
    props: ['question'],
    data: function () {
        return {
            answer: 'I cannot give you an answer until you ask a question!',
            image: '8ball.png',
            tag: {
                affirmative: 'yes',
                contrary: 'no',
                neutral: 'don\'t know'
            },
            loading: false
        }
    },
    watch: {
        // whenever question changes, this function will run
        question: function (newQuestion, oldQuestion) {
            this.answer = 'Waiting for you to stop typing...';
            this.image = '8ball.png';
            this.loading = true;
            this.debouncedGetAnswer();
        }
    },
    created: function () {
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
    },
    methods: {
        getAnswer: function () {
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Questions usually contain a question mark. ;-)';
                this.loading = false;
                return
            }
            this.answer = 'Thinking...';

            var vm = this;
            axios.get('https://8ball.delegator.com/magic/JSON/question?')
                .then(function (response) {
                    vm.answer = response.data.magic.answer;

                    const type = response.data.magic.type.toLowerCase();
                    const params = {
                        q: vm.tag[type],
                        media_filter: 'minimal',
                        limit: '1'
                    };
                    return axios.get('https://api.tenor.com/v1/random', {params: params});
                })
                .then(function (response) {
                    vm.image = response.data.results[0].media[0].gif.url;
                })
                .catch(function (error) {
                    vm.answer = 'Error! Could not reach the API. ' + error;
                })
                .then(function () {
                    vm.loading = false;
                })
        }
    },
    template: `
        <div style="display: flex; flex-direction: column; align-items: center; ">
          <p>{{ answer }}</p>
          <img :class="{ wobble: loading }" :src="image"/>
        </div>
    `
});

var app = new Vue({
    el: '#app',
    data: {
        question: ''
    }
});
