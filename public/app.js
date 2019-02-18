const pusher = new Pusher("a1a323918b2d9d777cf6", {
        cluster: "eu",
        encrypted: true,
        authEndpoint: 'pusher/auth'
    });
    const app = new Vue({
        el: '#app',
        data: {
            fresh: true,
            joined: false,
            opinion: '',
            username: '',
            members: '',
            newMessage: '',
            messages: [],
            status: '',
            isHidden: false
        },
        methods: {
            /*startChat(){
                let opinion = {
                    opinion: this.opinion
                }
                axios.post('/start-chat', opinion);
                //.then(response => {
                //    this.fresh = false;
                //});
            },
            */
            joinChat() {
                axios.post('join-chat', {username: this.username})
                    .then(response => {
                        // User has joined the chat
                        this.joined = true;
                        const channel = pusher.subscribe('presence-groupChat');
                        channel.bind('pusher:subscription_succeeded', (members) => {
                            this.members = channel.members;
                        });
                        // User joins chat
                        channel.bind('pusher:member_added', (member) => {
                            this.status = `${member.id} joined the chat`;
                        });
                        // Listen for chat messages
                        this.listen();
                    });
            },
            sendMessage() {
                let message = {
                    username: this.username,
                    opinion: this.opinion,
                    message: this.newMessage
                }
                // Clear input field
                this.newMessage = '';
                axios.post('/send-message', message);
            },
            listen() {
                const channel = pusher.subscribe('presence-groupChat');
                channel.bind('message_sent', (data) => {
                    this.messages.push({
                        username: data.username,
                        opinion: data.opinion,
                        message: data.message
                    });
                });

            }
        }
    });