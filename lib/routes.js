FlowRouter.route('/', {
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'HomeLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/test', {
    name: 'test',
    action() {
      BlazeLayout.render('TestLayout');
    }
});

FlowRouter.route('/graph', {
    name: 'graph',
    action(params, queryParams) {
      BlazeLayout.render('MainLayout', {main: 'GraphLayout', nav: 'Navbar'});
    }
});