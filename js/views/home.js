directory.HomeView = Backbone.View.extend({

    initialize: function () {
        this.searchResultsTab = new directory.EmployeeCollection();
        this.searchresultsViewTab = new directory.EmployeeListViewTab({model: this.searchResultsTab, className: 'table-list'});
    },

    events:{
        "click #showMeBtn":"showMeBtnClick"
    },

    render:function () {
        this.$el.html(this.template());
        $('.tab-search', this.el).append(this.searchresultsViewTab.render().el);
		//console.log("render");		
		return this;
    },

    showMeBtnClick:function () {
        directory.shellView.search();
        this.searchResultsTab.fetch({reset: true});
		var self = this;
        console.log("showme");
    },
	
	fetchme: function () {
        this.searchResultsTab.fetch({reset: true});	
		return this;
	}
});