import Home from '../containers/HomeContainer';
import About from '../containers/AboutContainer';

export default [
  {
    path: '/',
    component: Home,
    exact: true,
    // component: import('../containers/HomeContainer'),
  },
  {
    path: '/about',
    component: About,
    // component: import('../containers/AboutContainer'),
  },
];
