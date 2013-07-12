directory.HomeView = Backbone.View.extend({

    initialize: function () {
        this.searchResultsTab = new directory.EmployeeCollectionTab();
        this.searchresultsViewTab = new directory.EmployeeListViewTab({model: this.searchResultsTab, className: 'table-list'});
    },

    events:{
        "click #impDir":"showMeBtnClick",
		"click #showMeBtn":"showMeBtnClick2"
    },

    render:function () {
        this.$el.html(this.template());
        $('.tab-search', this.el).append(this.searchresultsViewTab.render().el);
		//console.log("render");		
		return this;
    },

    showMeBtnClick:function () {
        //directory.shellView.search();
		var key = $('#searchText').val();
        this.searchResultsTab.fetch({reset: true, data: {name: key}});
		//console.log('Kolekcja Tab - ' + JSON.stringify(this.searchResultsTab));
		var self = this;
    },

    showMeBtnClick2:function () {
        directory.shellView.search();
		var self = this;
    }	
	
});