directory.ShellView = Backbone.View.extend({

    initialize: function () {
        this.searchResults = new directory.EmployeeCollection();
        this.searchresultsView = new directory.EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
		//console.log('Element - ' + this.el);
        //this.searchResultsTab = new directory.EmployeeCollection();
        //this.searchresultsViewTab = new directory.EmployeeListViewTab({model: this.searchResultsTab, className: 'table-list'});
    },

    render: function () {
        this.$el.html(this.template());
        $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        //$('.tab-search', this.el).append(this.searchresultsViewTab.render().el);
		//console.log("render");
        return this;
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress"
    },

    search: function (event) {
        var key = $('#searchText').val();
        this.searchResults.fetch({reset: true, data: {name: key}});
        //directory.HomeView.fetchme();
        var self = this;
        setTimeout(function () {
            $('.dropdown').addClass('open');
        });
    },

    onkeypress: function (event) {
        if (event.keyCode === 13) { // enter key pressed
            event.preventDefault();
        }
    },

    selectMenuItem: function(menuItem) {
        $('.navbar .nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});