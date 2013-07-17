directory.HomeView = Backbone.View.extend({

    initialize: function () {
        this.searchResultsTab = new directory.EmployeeCollectionTab();
        this.searchresultsViewTab = new directory.EmployeeListViewTab({model: this.searchResultsTab, className: 'table-list'});
    },

    events:{
        "click #impDir":"showMeBtnClick",
		"click #showMeBtn":"showMeBtnClick2",
		"click #newemp":"createItem",
		"click button.newedit":"saveItem",
		"click button.canceledit": "cancelEdit",
		"click #tagul li a": "setFilter"
    },

    render:function () {
        this.$el.html(this.template());
        $('.tab-search', this.el).append(this.searchresultsViewTab.render().el);
		//console.log("render");		
		return this;
    },

    showMeBtnClick:function () {
		var key = $('#searchText').val();
        this.searchResultsTab.fetch({reset: true, data: {name: key}});
		console.log('Kolekcja Tab - ' + JSON.stringify(this.getTags()));
		var self = this;
		this.createSelect();
    },

    getTags: function () {
        return _.uniq(this.searchResultsTab.pluck("tags"), false, function (tags) {
            return tags.toLowerCase();
        });
    },

    createSelect: function () {
		var filter = $("#tagul");
		filter.html("");
		_.each(this.getTags(), function (item) {
			var option = $("<li value='" + item.toLowerCase() + "'><a tabindex='-1' href='#'>" + item.toLowerCase() + "</a></li>")	
            .appendTo(filter);
        });

        //return filter;
    },

    setFilter: function (e) {
        this.filterType = e.currentTarget.text;
        this.trigger("change:filterType");
		console.log('Triggered setFilter !' + this.filterType);
    },

    showMeBtnClick2:function () {
        directory.shellView.search();
		var self = this;
    },	
	
	createItem: function () {
		//$('.homediv').html('');
		$('#myModal3').modal('show');
	},
	
	saveItem: function (e) {
        e.preventDefault();

        var formData = {};

        //get form data
        $("#tab3").closest("form").find(":input").not("button").each(function () {
           var el = $(this);
            formData[el.attr("id")] = el.val();
			console.log('Po edycji - ' + [el.attr("id")] + formData[el.attr("id")]);
        });
		formData.title = "pracownik";
		console.log("Po wprowadzaniu!");		
		//render view

		$('#myModal3').modal('hide');

		this.searchResultsTab.create(formData, {wait: true});
		this.render();
	},
	
    cancelEdit: function () {
		console.log('wcisnieto cancel !');
		$('#myModal3').modal('hide');
        //this.render();
		return false;
    }	

});