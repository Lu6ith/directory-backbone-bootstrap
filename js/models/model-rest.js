/*
    If you are using the sample RESTFul services I published on GitHub, use the following URLs...

      - For the Node.js sample backend (available in https://github.com/ccoenraets/directory-rest-nodejs)
        Use: http://localhost:3000/employees

        If you are using this Node.js endpoint, the pages of the application must be served from the same domain/port (http://localhost:3000).
        If you want to serve the pages and the data from different domains/ports, use the JSONP adapter instead.

      - For the PHP sample backend (available in https://github.com/ccoenraets/directory-rest-php)
        Use: /directory-rest-php/employees

 */

directory.Employee = Backbone.Model.extend({

    urlRoot:"/dir/directory-rest-php/employees",
//    urlRoot:"http://localhost:3000/employees",

    initialize:function () {
        this.reports = new directory.EmployeeCollection();
        this.reports.url = this.urlRoot + "/" + this.id + "/reports";
    }

});

directory.EmployeeCollection = Backbone.Collection.extend({

    model: directory.Employee,

    url:"/dir/directory-rest-php/employees"
//    url:"http://localhost:3000/employees"

});

directory.EmployeeCollectionTab = Backbone.Collection.extend({

    model: directory.Employee,

    url:"/dir/directory-rest-php/employees"
//    url:"http://localhost:3000/employees"

});

directory.Telekom = Backbone.Model.extend({

    urlRoot:"/dir/directory-rest-php/telekom",
//    urlRoot:"http://localhost:3000/employees",

    // initialize:function () {
        // this.reports = new directory.EmployeeCollection();
        // this.reports.url = this.urlRoot + "/" + this.id + "/reports";
    // }

});

directory.TelekomCollection = Backbone.Collection.extend({

    model: directory.Telekom,

    url:"/dir/directory-rest-php/telekom"
//    url:"http://localhost:3000/employees"

});

directory.Dyzury = Backbone.Model.extend({

    urlRoot:"/dir/directory-rest-php/dyzury",
//    urlRoot:"http://localhost:3000/employees",

    // initialize:function () {
        // this.reports = new directory.EmployeeCollection();
        // this.reports.url = this.urlRoot + "/" + this.id + "/reports";
    // }

});

directory.DyzuryCollection = Backbone.Collection.extend({

    model: directory.Dyzury,
	
    url: "/dir/directory-rest-php/dyzury"
//    url:"http://localhost:3000/employees"

});
