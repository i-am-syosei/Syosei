document.addEventListener('DOMContentLoaded', () => {
    // --- アシストボタンのドラッグ移動 ---
    const assistBtn = document.getElementById('assist-btn');
    let isDragging = false;
    let offsetX, offsetY;
    let clickStartTime = 0;
  
    assistBtn.addEventListener('mousedown', (e) => {
      isDragging = false;
      offsetX = e.clientX - assistBtn.offsetLeft;
      offsetY = e.clientY - assistBtn.offsetTop;
      clickStartTime = Date.now();
      document.addEventListener('mousemove', onMouseMove);
    });
  
    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      const clickDuration = Date.now() - clickStartTime;
      if (!isDragging && clickDuration < 200) {
        // クリックのみの場合はメニューを開閉
        toggleAssistMenu();
      }
      isDragging = false;
    });
  
    function onMouseMove(e) {
      const moveX = e.clientX - offsetX;
      const moveY = e.clientY - offsetY;
      if (Math.abs(moveX - assistBtn.offsetLeft) > 5 || Math.abs(moveY - assistBtn.offsetTop) > 5) {
        isDragging = true;
      }
      assistBtn.style.left = moveX + 'px';
      assistBtn.style.top = moveY + 'px';
    }
  
    function toggleAssistMenu() {
      const assistMenu = document.getElementById('assist-menu');
      assistMenu.style.display = (assistMenu.style.display === 'block') ? 'none' : 'block';
    }
  
    // --- アシストメニューの機能 ---
    const playAudioBtn = document.getElementById('play-audio-btn');
    const volumeControl = document.getElementById('volume-control');
    const audio = new Audio('assets/audio/background-music.mp3');
    audio.loop = true;
  
    playAudioBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playAudioBtn.innerHTML = '<i class="fas fa-music"></i> 音声停止';
      } else {
        audio.pause();
        playAudioBtn.innerHTML = '<i class="fas fa-music"></i> 音声再生';
      }
    });
  
    volumeControl.addEventListener('input', () => {
      audio.volume = volumeControl.value;
    });
  
    // テーマカラーの変更
    const colorSelect = document.getElementById('color-select');
  
    colorSelect.addEventListener('change', () => {
      document.body.classList.remove('theme-dark', 'theme-blue', 'theme-green');
      const selectedTheme = colorSelect.value;
      if (selectedTheme !== 'default') {
        document.body.classList.add('theme-' + selectedTheme);
      }
    });
  
    // TOPに戻る機能
    const backToTopBtn = document.getElementById('back-to-top-btn');
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // --- SNSリンクの追加 ---
    const snsForm = document.getElementById('sns-form');
    const snsLinksContainer = document.getElementById('sns-links');
    const socialIconsFooter = document.querySelector('.footer .social-icons');
  
    snsForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const githubUrl = document.getElementById('github-url').value.trim();
      const youtubeUrl = document.getElementById('youtube-url').value.trim();
      const xUrl = document.getElementById('x-url').value.trim();
  
      snsLinksContainer.innerHTML = '';
      socialIconsFooter.innerHTML = '';
  
      if (githubUrl) {
        const a = createSocialLink('fab fa-github', githubUrl);
        snsLinksContainer.appendChild(a.cloneNode(true));
        socialIconsFooter.appendChild(a);
      }
  
      if (youtubeUrl) {
        const a = createSocialLink('fab fa-youtube', youtubeUrl);
        snsLinksContainer.appendChild(a.cloneNode(true));
        socialIconsFooter.appendChild(a);
      }
  
      if (xUrl) {
        const a = createSocialLink('fab fa-twitter', xUrl);
        snsLinksContainer.appendChild(a.cloneNode(true));
        socialIconsFooter.appendChild(a);
      }
  
      // 入力欄をクリア
      snsForm.reset();
    });
  
    function createSocialLink(iconClass, url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `<i class="${iconClass}"></i>`;
      return a;
    }
  
    // --- AIデモの機能 ---
    const analyzeBtn = document.getElementById('analyze-btn');
    const userInput = document.getElementById('user-input');
    const aiResult = document.getElementById('ai-result');
  
    analyzeBtn.addEventListener('click', () => {
      const text = userInput.value;
      if (text.trim() === '') {
        aiResult.textContent = 'テキストを入力してください。';
        return;
      }
  
      aiResult.textContent = '分析中...';
  
      // AI分析を実行
      analyzeText(text).then(result => {
        aiResult.textContent = `感情分析結果: ${result}`;
      }).catch(err => {
        aiResult.textContent = 'エラーが発生しました。';
        console.error(err);
      });
    });

    // --- チャットボットの初期化 ---
    initializeChatbot(); // チャットボットの初期化関数を呼び出します

    // --- シューティングゲームの初期化 ---
    initializeShootingGame(); // シューティングゲームの初期化関数を呼び出します

  });