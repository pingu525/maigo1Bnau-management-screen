javascript: (function() {
let wakeLock = null;

const root = document.createElement('div');
const shadowRoot = root.attachShadow({ mode: "open" });
shadowRoot.innerHTML = `
<div class="button">
    <div class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
    </div>
</div>`;

const button = shadowRoot.querySelector('div.button');
const checkbox = shadowRoot.querySelector('input[type="checkbox"]');

async function requestWakeLock() {
try {
  wakeLock = await navigator.wakeLock.request('screen');
  checkbox.checked = true;
  wakeLock.addEventListener('release', () => {
    checkbox.checked = false;
  });
} catch (err) {
  button.style.background = 'rgba(255, 0, 0, 0.7)';
  console.error(`${err.name}, ${err.message}`);
}
}

function releaseWakeLock() {
if (wakeLock !== null) {
  wakeLock.release();
}
}

button.addEventListener('click', (e) => {
if (wakeLock!==null&&!wakeLock.released) {
  releaseWakeLock();
} else {
  requestWakeLock();
}
});

requestWakeLock();

const style = document.createElement('style');
style.innerHTML = `
.button{
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    padding: 7.5px;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    border-radius: 10px;
    background: rgba(128, 128, 128, 0.7);
    color: white;
    font-size: 24px;
    cursor: pointer;
}
.switch {
  position: relative;
  width: 45px;
  height: 25.5px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 25.5px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 19.5px;
  width: 19.5px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:checked + .slider:before {
  transform: translateX(19.5px);
}
`;
shadowRoot.appendChild(style);
document.body.appendChild(root);
})();
