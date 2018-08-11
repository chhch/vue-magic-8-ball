var app = new Vue({
    el: '#app',
    data: {
        question: '',
        answer: 'I cannot give you an answer until you ask a question!',
        image: '',
        tag: {
            affirmative: 'yes',
            contrary: 'no',
            neutral: 'don\'t know'
        }
    },
    watch: {
        // whenever question changes, this function will run
        question: function (newQuestion, oldQuestion) {
            this.answer = 'Waiting for you to stop typing...';
            this.debouncedGetAnswer()
        }
    },
    created: function () {
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
    },
    methods: {
        getAnswer: function () {
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Questions usually contain a question mark. ;-)';
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
                    return axios.get('https://api.tenor.com/v1/random', {params: params });

                })
                .then(function (response) {
                    vm.image = response.data.results[0].media[0].gif.url;
                })
                .catch(function (error) {
                    vm.answer = 'Error! Could not reach the API. ' + error
                })
        }
    }
});