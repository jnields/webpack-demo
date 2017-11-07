import { ROUTE_CHANGED as type } from './types';

export default ({ from, to, method }) => ({ from, to, method, type });
