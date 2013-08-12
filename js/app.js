var directory = {

    views: {},

    models: {},
	
	tagcolors: {
		tag1: "label-warning",
		tag2: "label-info",
		tag3: "label-important",
		tag4: "label-success",
		tag5: "label-inverse",
		tag6: "label-color1",
		tag7: "label-color2",
		tag8: "label-color3"
	},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (directory[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    directory[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert("Template " + view + " not found !");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

directory.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "contact":          "contact",
        "employees/:id":    "employeeDetails"
    },

    initialize: function () {
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        //if (!directory.homelView) {
            directory.homelView = new directory.HomeView();
            directory.homelView.render();
        //} else {
        //    console.log('reusing home view');
        //    directory.homelView.delegateEvents(); // delegate events when the view is recycled
        //}
        this.$content.html(directory.homelView.el);
        directory.shellView.selectMenuItem('home-menu');
		directory.homelView.showMeBtnClick();
		directory.homelView.showMeBtnClickT();
		//directory.homelView.createSelect();
    },

    contact: function () {
        if (!directory.contactView) {
            directory.contactView = new directory.ContactView();
            directory.contactView.render();
        }
        this.$content.html(directory.contactView.el);
        directory.shellView.selectMenuItem('contact-menu');
    },

    employeeDetails: function (id) {
        var employee = new directory.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new directory.EmployeeView({model: data}).render().el);
            }
        });
        directory.shellView.selectMenuItem();
    }

});

$(document).on("ready", function () {
    directory.loadTemplates(["HomeView", "ContactView", "ShellView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView", "EmployeeListItemViewTab", "EmployeeListItemEditTab", "TelekomListItemViewTab", "TelekomListItemEditTab", "DyzuryListItemViewTab"],
        function () {
            directory.router = new directory.Router();
            Backbone.history.start();
        });
		
	$('#myTabKont a:first').tab('show');
			
	$('#myTabKont a[href="#dlist"]').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

});
