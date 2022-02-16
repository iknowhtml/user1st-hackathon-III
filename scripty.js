const script = document.createElement('script');
script.src = `http://localhost:8080/dist/script.js`;
document.head.insertAdjacentElement('afterbegin', script);
