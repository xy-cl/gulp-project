new Vue({
	el: '#home',
	data: {
		homeTitle: 'this is home page index.html'
	},
	methods: {
		page2: function() {
			window.location.href = '/build/html/main/'
		}
	}
})
