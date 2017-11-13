import { connect } from 'react-redux';
import UniversalComponent from '../components/UniversalComponent';

const moduleId = require.resolveWeak('../components/Home');

export default connect(
  state => ({
    ...state,
    moduleId,
    loadComponent: () => import('../components/Home' /* webpackChunkName: 'home' */),
  }),
  null,
)(UniversalComponent);
