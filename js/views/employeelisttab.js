directory.EmployeeListViewTab = Backbone.View.extend({

    tagName:"tbody",
	//el:$("tbody"),

    //className:'nav nav-list',

    initialize:function () {
        var self = this;
		console.log("ListViewTab");
        this.model.on("reset", this.render, this);
		//this.model.on("remove", this.deleteEmployee, this);
        this.model.on("add", function (employee) {
            self.$el.append(new directory.EmployeeListItemViewTab({model:employee}).render().el);
			console.log('Dodano listItemViewTab !');
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (employee) {
            this.$el.append(new directory.EmployeeListItemViewTab({model:employee}).render().el);
			console.log("ListViewTab render item");
        }, this);
        return this;
    }
	
});

directory.EmployeeListItemViewTab = Backbone.View.extend({

    tagName:"tr",
	//el:$("tr"),
	
    //editTemplate: _.template($("#employeeEditTemplate").html()),

	events: {
		"click a.delete":"deleteEmployee",
		"click a.editme":"editEmployee"
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
	
	deleteEmployee:function () {
	    var answer = confirm("Czy na pewno chcesz usunąć te osobę ?" + this.model.id);
		if (answer) {
	
			this.model.destroy();
			this.remove();
			};
		return false;	
	},
	
	editEmployee:function () {
	    //this.$el.html(this.editTemplate(this.model.toJSON()));
		//console.log('Odpalone editme !');
		$('.homediv').html('');
		$('.homediv').append(new directory.EmployeeListItemEditTab({model:this.model}).render().el);
		$('#myModal2').modal('show');
		return false;
	},
	
    cancelEdit: function () {
		console.log('wcisnieto cancel !');
        this.render();
    }
	
});

directory.EmployeeListItemEditTab = Backbone.View.extend({

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
		$('#myModal2').modal('hide');

    },

    cancelEdit: function () {
		console.log('wcisnieto cancel !');
		$('#myModal2').modal('hide');
        //this.render();
		return false;
    }
	
});	