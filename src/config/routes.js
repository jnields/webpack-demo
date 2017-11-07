// import Home from '../containers/HomeContainer';
// import About from '../containers/AboutContainer';

export default [
  {
    props: {
      path: '/',
      // component: Home,
      component: import('../containers/HomeContainer'),
      exact: true,
    },
  },
  {
    path: '/about',
    // component: About,
    component: import('../containers/AboutContainer'),
  },
];
