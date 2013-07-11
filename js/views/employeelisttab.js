directory.EmployeeListViewTab = Backbone.View.extend({

    tagName:'tbody',

    //className:'nav nav-list',

    initialize:function () {
        var self = this;
		console.log("ListViewTab");
        this.model.on("reset", this.render, this);
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
    }

});