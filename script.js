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
  // 首句问候
  createMsg('我是您的智能客服，很高兴为您服务。', 'bot');
  // 禁用手动打字输入
  userInput.readOnly = true;                       // 输入框只读
  userInput.addEventListener('keydown', e => e.preventDefault()); // 拦截按键
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
    createMsg('您好，可以了解一下您对台灯的需求吗？比如：<br>- 使用场景？<br>- 亮度要求？<br>- 是否偏好极简/可爱/复古等外观风格？<br>告诉我您的偏好，我来为您推荐合适的台灯哦！', 'bot');
  } else if(stage === 1){
    createMsg('亲，为您推荐以下产品：<br><b>「X-Lux 多功能智能台灯」</b><br>- 支持多段亮度与色温调节<br>- 搭载无线充电、时间显示与蓝牙音箱功能<br>- 外观简洁百搭，适合卧室、书桌、化妆台等多种空间<br>- 满足办公、阅读、放松等多种场景下的使用需求', 'bot');

    setTimeout(() => {
      createMsg('🎉 感谢您的反馈，本轮对话已结束，请返回问卷继续作答。', 'bot');
    }, 1000);
  }

  stage++;
};

const sendMessage = () => {
  const text = userInput.value.trim();
  if(!text) return;
  createMsg(text, 'user');
  userInput.value = '';
  setTimeout(botRespond, 1000);
};

sendBtn.onclick = sendMessage;
userInput.onkeypress = (e)=>{ if(e.key==='Enter'){ sendMessage(); } };
