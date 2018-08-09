var app = new Vue({
    el: '#app',
    data: {
        question: '',
        answer: 'I cannot give you an answer until you ask a question!',
        image: '',
        type: 'neutral',
        position: {
            affirmative: '0',
            contrary: '0',
            neutral: '0'
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
                    console.log(response);
                    vm.answer = _.capitalize(response.data.magic.answer);
                    vm.type = response.data.magic.type.toLowerCase();

                    return axios.get('https://api.tenor.com/v1/search?q=' + vm.type + '&media_filter=minimal&limit=1&pos=' + vm.position[vm.type]);
                    // return axios.get('https://api.tenor.com/v1/random?q=' + vm.type + '&media_filter=minimal&limit=1&pos=' + vm.position[vm.type]);

                })
                .then(function (response) {
                    console.log(response);
                    vm.image = response.data.results[0].media[0].gif.url;
                    vm.position[vm.type] = response.data.next ? response.data.next : '0';
                })
                .catch(function (error) {
                    console.log(error);
                    vm.answer = 'Error! Could not reach the API. ' + error
                })
        }
    }
});