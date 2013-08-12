directory.HomeView = Backbone.View.extend({

    initialize: function () {
        this.searchResultsTab = new directory.EmployeeCollectionTab();
        this.searchResultsTabT = new directory.TelekomCollection();

        this.searchresultsViewTab = new directory.EmployeeListViewTab({model: this.searchResultsTab, className: 'table-list'});
        this.searchresultsViewTabT = new directory.TelekomListViewTab({model: this.searchResultsTabT, className: 'table-list'});
		this.on("change:filterType", this.filterByTag, this);
		//this.searchResultsTab.on("reset", this.render, this);
    },

    events:{
        "click #impDir":"showMeBtnClick",
        "click #impDird":"showMeBtnClickT",
		"click #showMeBtn":"showMeBtnClick2",
		"click #newemp":"createItem",
		"click #newempd":"createItemT",
		"click button.newedit":"saveItem",
		"click button.canceledit": "cancelEdit",
		"click #tagul li a": "setFilter"
    },

    render:function () {
        this.$el.html(this.template());
        $('.tab-search', this.el).append(this.searchresultsViewTab.render().el);
        $('.tab-searchd', this.el).append(this.searchresultsViewTabT.render().el);
		//console.log("render");		
		return this;
    },

    showMeBtnClick:function () {
		var key = $('#searchText').val();
        this.searchResultsTab.fetch({
			reset: true, 
			data: {name: key},
			success: function() {
				//alert("No error!");
				//console.log('Success');
				//this.createSelect();
				directory.homelView.createSelect();
			},
			error: function() {
				alert("error!");
			}
		});
		console.log('Kolekcja Tab - ' + JSON.stringify(this.getUniqTags()));
		var self = this;
		//this.createSelect();
    },

    showMeBtnClickT:function () {
		//var key = $('#searchText').val();
        this.searchResultsTabT.fetch({
			reset: true, 
			//data: {name: key},
			success: function() {
				//alert("No error!");
				console.log('Success Telekom');
				//this.createSelect();
				//directory.homelView.createSelect();
			},
			error: function() {
				alert("error!");
			}
		});
		//console.log('Kolekcja Tab - ' + JSON.stringify(this.getUniqTags()));
		var self = this;
		//this.createSelect();
    },

    filterByTag: function () {
        if (this.filterType === "Wszystkie") {
            this.searchResultsTab.fetch({reset: true, data: {name: ''}});
			console.log('Filtrowanie - All');
            //app.contactsRouter.navigate("filter/all");
        } else {
			var filterType = this.filterType;
            this.searchResultsTab.fetch({reset: true, data: {tags: filterType}});
			console.log('Filtrowanie - tags' + filterType);
		};
		var self = this;
	},
	
	getTags: function () {
        return _.uniq(this.searchResultsTab.pluck("tags"), false, function (tags) {
			return tags.toLowerCase();
        });
    },
	
	getUniqTags: function () {
		return _.uniq(_.map(this.getTags(), function(tag){
			if (tag.indexOf("-") == -1) {
				return tag.substring(0);
			} else {
				return tag.substring(0, tag.indexOf("-")); 
			}
			}), false);
	},
	
    createSelect: function () {
		var filter = $("#tagul");
		filter.html("");
		$("<li value='Wszystkie'><a tabindex='-1' href='#'>Wszystkie</a></li>").appendTo(filter);
		_.each(this.getUniqTags(), function (item) {
			var option = $("<li value='" + item.toLowerCase() + "'><a tabindex='-1' href='#'>" + item.toLowerCase() + "</a></li>").appendTo(filter);
			
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
		$('#myModal3 #department').val('').removeAttr('disabled');
		$('#myModal3 #city').val('').removeAttr('disabled');
		$('#myModal3 #tags').val('').removeAttr('disabled');
		$('#myModal3').modal('show');
	},
	
	createItemT: function () {
		//$('.homediv').html('');
		$('#myModal3 #department').val('PSE Centrum').attr('disabled', 'disabled');
		$('#myModal3 #city').val('Warszawa').attr('disabled', 'disabled');
		$('#myModal3 #tags').val('PSEC - ZT').attr('disabled', 'disabled');
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

		this.searchResultsTab.create(formData);

		$('#myModal3').modal('hide');
		//this.render();
		//this.showMeBtnClick();
		directory.homelView.showMeBtnClick();
		directory.homelView.showMeBtnClickT();
	},
	
    cancelEdit: function () {
		console.log('wcisnieto cancel !');
		$('#myModal3').modal('hide');
        //this.render();
		return false;
    }	

});