import Home from '../containers/HomeContainer';
import About from '../containers/AboutContainer';

export default [
  {
    key: 0,
    component: Home,
    exact: true,
    path: '/',
  },
  {
    key: 1,
    component: About,
    path: '/about',
  },
  {
    key: 2,
    component: () => 'wtf is happening',
  },
];
