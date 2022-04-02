import Enzyme from 'enzyme';
import 'regenerator-runtime/runtime';
import Adapter from 'enzyme-adapter-react-16';
import 'jsdom-global/register';
import 'window-resizeto/polyfill';

Enzyme.configure({ adapter: new Adapter() });
