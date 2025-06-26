const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');

let stage = 0; // 控制对话阶段

const createMsg = (text, sender) => {
  const wrap = document.createElement('div');
  wrap.className = 'msg-wrapper ' + sender;

  const avatar = document.createElement('div');
  avatar.className = 'avatar ' + sender;

  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  bubble.innerHTML = text.replace(/\n/g, '<br>');

  if(sender === 'bot'){
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
  } else {
    wrap.appendChild(bubble);
    wrap.appendChild(avatar);
  }
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
};

window.onload = () => {
  createMsg('我是您的智能客服，很高兴为您服务。', 'bot');
};

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if(recognition){
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
}

micBtn.onclick = () => {
  if(!recognition){ alert('当前浏览器不支持语音识别'); return; }
  recognition.start();
  micBtn.textContent = '⏺';
};

if(recognition){
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    micBtn.textContent = '🎤';
  };
  recognition.onerror = () => { micBtn.textContent = '🎤'; };
}

const botRespond = () => {
  if(stage === 0){
    createMsg('您好，可以方便了解下您的购买需求吗？比如：需要有线/无线，是否需要带有RGB功能，或者其他需求等，我来为您推荐合适的哦。', 'bot');
  } else {
    createMsg('亲，为您推荐以下商品：<br>1. 有线RGB电竞耳机<br>2. 无线降噪耳机<br>3. 蓝牙运动耳机<br><br>', 'bot');
  }
  stage++;
};

const sendMessage = () => {
  const text = userInput.value.trim();
  if(!text) return;
  createMsg(text, 'user');
  userInput.value = '';
  setTimeout(botRespond, 600);
};

sendBtn.onclick = sendMessage;
userInput.onkeypress = (e)=>{ if(e.key==='Enter'){ sendMessage(); } };