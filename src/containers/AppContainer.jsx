import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import App from '../components/App';

export default withRouter(connect()(App));
