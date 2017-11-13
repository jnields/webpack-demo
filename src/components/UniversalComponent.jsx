/* global __webpack_require__ */

import React, { Component } from 'react';
import { func, string } from 'prop-types';

const NullComponent = () => null;
const modules = __webpack_require__; // eslint-disable-line camelcase

const mounted = [];

export default class UniversalComponent extends Component {
  static get propTypes() {
    return {
      LoadingComponent: func,
      loadComponent: func.isRequired,
      moduleId: string.isRequired,
    };
  }

  static getModules() {
    const result = mounted.slice();
    mounted.length = 0;
    return result;
  }

  static get defaultProps() {
    return {
      component: null,
      LoadingComponent: NullComponent,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      Component: (modules(this.props.moduleId) || {}).default,
    };
  }

  componentWillMount() {
    mounted.push(this.props.moduleId);
    if (this.state.Component) return;
    this.props
      .loadComponent()
      .then(component => this.setState({
        Component: component.default,
      }));
  }

  render() {
    const Result = this.state.Component || this.props.LoadingComponent;
    return <Result />;
  }
}
