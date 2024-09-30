// チャットボットのスクリプト

function initializeChatbot() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
  
    chatbotSendBtn.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  
    function sendMessage() {
      const messageText = chatbotInput.value.trim();
      if (messageText === '') return;
  
      // ユーザーのメッセージを表示
      addMessage('user', messageText);
      chatbotInput.value = '';
  
      // ボットの応答を取得
      getBotResponse(messageText);
    }
  
    function addMessage(sender, text) {
      const message = document.createElement('div');
      message.classList.add('message', sender);
  
      const messageText = document.createElement('div');
      messageText.classList.add('text');
      messageText.textContent = text;
  
      message.appendChild(messageText);
      chatbotMessages.appendChild(message);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
  
    function getBotResponse(userMessage) {
      // シンプルなルールベースの応答
      let botMessage = '申し訳ありませんが、よくわかりません。';
  
      if (userMessage.includes('こんにちは') || userMessage.includes('こんばんは') || userMessage.includes('おはよう')) {
        botMessage = 'こんにちは！ご用件をお聞かせください。';
      } else if (userMessage.includes('あなたは誰')) {
        botMessage = '私は仮の名前のチャットボットです。';
      } else if (userMessage.includes('趣味')) {
        botMessage = '私の趣味はプログラミングと音楽鑑賞です。';
      } else if (userMessage.includes('ありがとう')) {
        botMessage = 'どういたしまして。';
      } else if (userMessage.includes('さようなら') || userMessage.includes('バイバイ')) {
        botMessage = 'ご利用ありがとうございました。またお話ししましょう！';
      }
  
      // ボットのメッセージを表示
      addMessage('bot', botMessage);
    }
  }