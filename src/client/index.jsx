import '../style/hello.css';
import frog from '../assets/frog.jpg';

const img = document.createElement('img');
img.src = frog;
img.className = 'img';

const hello = document.createElement('h1');
hello.appendChild(document.createTextNode('Hello world!'));
hello.className = 'hello';

const container = document.createElement('div');
container.appendChild(img);
container.appendChild(hello);
document.body.appendChild(container);
