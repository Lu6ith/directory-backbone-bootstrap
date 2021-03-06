﻿directory.TelekomListViewTab = Backbone.View.extend({

    tagName:"tbody",

    initialize:function () {
        var self = this;
		console.log("TelekomViewTab");
        this.model.on("reset", this.render, this);
		//this.model.on("remove", this.deleteEmployee, this);
        this.model.on("add", function (telekom) {
            self.$el.append(new directory.TelekomListItemViewTab({model:telekom}).render().el);
			console.log('Dodano telekomItemViewTab !');
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (telekom) {
            this.$el.append(new directory.TelekomListItemViewTab({model:telekom}).render().el);
			//console.log("ListViewTab render item - " + tagstab[licz]);
        }, this);
        return this;
    }
	
});

directory.TelekomListItemViewTab = Backbone.View.extend({

    tagName:"tr",

	tagColor: "label",
	
	events: {
		"click a.delete":"deleteTelekom",
		"click a.editme":"editTelekom",
		"click a.editdyzur":"editDyzur"		
	},
	
    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        return this;
    },
	
	deleteTelekom:function () {
	    var answer = confirm("Czy na pewno chcesz usunąć te osobę ?" + this.model.id);
		if (answer) {
	
			this.model.destroy();
			this.remove();
			};
		return false;	
	},
	
	editTelekom:function () {
	    //this.$el.html(this.editTemplate(this.model.toJSON()));
		//console.log('Odpalone editme !');
		$('.homediv').html('');
		$('.homediv').append(new directory.TelekomListItemEditTab({model:this.model}).render().el);
		$('#myModal2').modal('show');
		return false;
	},
	
    editDyzur:function () {
		//var key = $('#searchText').val();
		$('.tab-dyzury').html(
		'<thead class="info"><tr class="blue"><th>#</th><th>Data od</th><th>Data do</th><th>Grupa</th><th style="width: 54px;"></th></tr></thead>');
		$('#myModal4 #myModalLabel').html('Dyżury -- ' + this.model.get('firstName') + ' ' +this.model.get('lastName'));
		this.searchResultsDyzury = new directory.DyzuryCollection();
		this.searchResultsDyzury.url = this.searchResultsDyzury.url + "/" + this.model.id;
		this.searchResultsViewDyzury = new directory.DyzuryListViewTab({model: this.searchResultsDyzury, className: 'table-list'});
        this.searchResultsDyzury.fetch({
			reset: true, 
			//data: {idem: this.model.id},
			success: function() {
				//alert("No error!");
				console.log('Success Dyzury');
				//this.createSelect();
				//directory.homelView.createSelect();
				$('#myModal4').modal('show');
			},
			error: function() {
				alert("error!");
			}
		});
		$('.tab-dyzury').append(this.searchResultsViewDyzury.render().el);
		//console.log('Kolekcja Tab - ' + JSON.stringify(this.getUniqTags()));
		var self = this;
		//this.createSelect();
    },

    cancelEdit: function () {
		console.log('wcisnieto cancel !');
        this.render();
    }
	
});

directory.TelekomListItemEditTab = Backbone.View.extend({

	//className:'homediv',
	events: {
        "click button.canceledit": "cancelEdit",
        "click button.updateedit": "saveEdits",
        "click button.newedit": "saveNew"
	},
	
    render:function () {
		console.log('render - ' + JSON.stringify(this.model.attributes));
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    saveEdits: function (e) {
        e.preventDefault();

        var formData = {},
            prev = this.model.previousAttributes();

        //get form data
        $(e.target).closest("form").find(":input").not("button").each(function () {
            var el = $(this);
            formData[el.attr("id")] = el.val();
			//console.log('Po edycji - ' + [el.attr("id")] + formData[el.attr("id")]);
        });
		
        //update model and save to server
		//this.model.unset("reportCount");
        this.model.set(formData).save();
		
		//render view
        this.render();
		directory.homelView.showMeBtnClickT();		
		$('#myModal2').modal('hide');

    },

    saveNew: function (e) {
        e.preventDefault();

        var formData = {};

        //get form data
        $(e.target).closest("form").find(":input").not("button").each(function () {
            var el = $(this);
            formData[el.attr("id")] = el.val();
			//console.log('Po edycji - ' + [el.attr("id")] + formData[el.attr("id")]);
        });
		
        //update model and save to server
		//this.model.unset("reportCount");
        //this.model.set(formData).save();
		directory.HomeView.createItem(formData);
		
		//render view
        this.render();
		//directory.homelView.showMeBtnClick();
		$('#myModal2').modal('hide');
    },

    cancelEdit: function () {
		console.log('wcisnieto cancel !');
		$('#myModal2').modal('hide');
        //this.render();
		return false;
    }
	
});	