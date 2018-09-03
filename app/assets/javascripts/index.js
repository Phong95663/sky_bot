(function() {
    var key = 1;
    var chat = {

        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.render();
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button');
            this.$textarea = $('#message-to-send');
            this.$chatHistoryList = this.$chatHistory.find('ul');
        },
        bindEvents: function() {
            this.$button.on('click', this.addMessage.bind(this));
            this.$textarea.on('keyup', this.addMessageEnter.bind(this));
        },
        messageToSend: '',
        messageResponses: [
            // "Tôi không hiểu  ý bạn",
            // 'Chào bạn , rất vui được làm quen với bạn',
            // "Tên mình là SkyBot",
            // "Hiệu trưởng trường Đại học Công nghệ là PGS TS Nguyễn Việt Hà",
            // "Mình được nhóm Skylab tạo ra",
        ],

        processOutput: function(input) {
            $.ajax({
                url: "/answer",
                type: "post",
                async: false,
                context: this,
                dataType: "text",
                data: {
                    question : input,
                },
                success: function(result) {
                    this.setdata(result, this);
                }
            });
            return 0;
        },
        setdata: function (result) {
            var arr = JSON.parse(result);
            if (arr.length > 1) {
                key = 1
                this.messageResponses[0] = arr[0];
                this.messageResponses[1] = arr[1];
            }
            else {
                key = 0;
                this.messageResponses[0] = arr[0];
            }

        },

        render: function() {
            this.scrollToBottom();
            if (this.messageToSend.trim() !== '') {
                var template = Handlebars.compile($("#message-template").html());
                var context = {
                    messageOutput: this.messageToSend,
                    time: this.getCurrentTime()
                };

                this.$chatHistoryList.append(template(context));
                this.scrollToBottom();
                this.$textarea.val('');

                // responses
                var templateResponse = Handlebars.compile($("#message-response-template").html());
                var indexOutput = this.processOutput(this.messageToSend);
                console.log(indexOutput);
                console.log(this.messageResponses)
                var contextResponse = {
                    // response: this.getRandomItem(this.messageResponses),
                    response: this.messageResponses[indexOutput],
                    time: this.getCurrentTime()
                };
                if (key == 1) {
                    var contextResponse1 = {
                        // response: this.getRandomItem(this.messageResponses),
                        response: this.messageResponses[1],
                        time: this.getCurrentTime()
                    };
                }


                setTimeout(function() {
                    this.$chatHistoryList.append(templateResponse(contextResponse));
                    if (key == 1) {
                        this.$chatHistoryList.append(templateResponse(contextResponse1));
                    }
                    this.scrollToBottom();
                }.bind(this), 1200);

            }

        },

        addMessage: function() {
            this.messageToSend = this.$textarea.val()
            this.render();
        },
        addMessageEnter: function(event) {
            // enter was pressed
            if (event.keyCode === 13) {
                this.addMessage();
            }
        },
        scrollToBottom: function() {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        getCurrentTime: function() {
            return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },
        getRandomItem: function(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

    };

    chat.init();

    var searchFilter = {
        options: {
            valueNames: ['name']
        },
        init: function() {
            var userList = new List('people-list', this.options);
            var noItems = $('<li id="no-items-found">No items found</li>');

            userList.on('updated', function(list) {
                if (list.matchingItems.length === 0) {
                    $(list.list).append(noItems);
                } else {
                    noItems.detach();
                }
            });
        }
    };

    searchFilter.init();

})();
