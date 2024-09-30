// shooting-game.js
// シューティングゲームのスクリプト

function initializeShootingGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
  
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  
    const volumeControl = document.getElementById('volume-control'); // 音量調節スライダー
  
    let gameInterval;
    let player, enemies, bullets, indestructibleBullets, explodingBullets;
    let keys = {};
    let difficultyLevel = 1;
    let gameDuration;
    let gameStartTime;
  
    difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
        difficultyLevel = parseInt(button.getAttribute('data-level'));
        startGame();
      });
    });
  
    function startGame() {
      resetGame();
      canvas.style.display = 'block';
  
      document.addEventListener('keydown', keyDownHandler);
      document.addEventListener('keyup', keyUpHandler);
  
      if (difficultyLevel <= 2) {
        gameDuration = difficultyLevel * 60000; // レベル1-1分、レベル2-2分
      } else {
        gameDuration = 3 * 60000; // レベル3~5は3分
      }
      gameStartTime = Date.now();
  
      gameInterval = setInterval(gameLoop, 1000 / 60);
    }
  
    function resetGame() {
      clearInterval(gameInterval);
      player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 60,
        width: 40,
        height: 40,
        speed: 5,
        canShoot: false,
      };
      enemies = [];
      bullets = [];
      indestructibleBullets = [];
      explodingBullets = [];
      keys = {};
    }
  
    function keyDownHandler(e) {
      const preventKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar', 'w', 'a', 's', 'd'];
      if (preventKeys.includes(e.key) || preventKeys.includes(e.code)) {
        e.preventDefault();
      }
      keys[e.key.toLowerCase()] = true;
    }
  
    function keyUpHandler(e) {
      const preventKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar', 'w', 'a', 's', 'd'];
      if (preventKeys.includes(e.key) || preventKeys.includes(e.code)) {
        e.preventDefault();
      }
      keys[e.key.toLowerCase()] = false;
    }
  
    function gameLoop() {
      update();
      draw();
  
      const elapsedTime = Date.now() - gameStartTime;
      const remainingTime = Math.max(0, gameDuration - elapsedTime);
      displayRemainingTime(remainingTime);
  
      if (remainingTime <= 0) {
        gameWin();
      }
    }
  
    function update() {
      // プレイヤーの移動
      if ((keys['arrowleft'] || keys['a']) && player.x > 0) {
        player.x -= player.speed;
      }
      if ((keys['arrowright'] || keys['d']) && player.x < canvas.width - player.width) {
        player.x += player.speed;
      }
      // 上下移動を追加
      if ((keys['arrowup'] || keys['w']) && player.y > 0) {
        player.y -= player.speed;
      }
      if ((keys['arrowdown'] || keys['s']) && player.y < canvas.height - player.height) {
        player.y += player.speed;
      }
  
      // 弾の発射間隔を音量に応じて調整
      let volume = parseFloat(volumeControl.value); // 0から1の値
      let minFireInterval = 100; // 最短発射間隔（ミリ秒）
      let maxFireInterval = 300; // 最長発射間隔（ミリ秒）
      let fireInterval = maxFireInterval - (volume * (maxFireInterval - minFireInterval));
  
      if (keys[' '] || keys['spacebar']) {
        // 弾を発射
        if (!player.canShoot || player.canShoot === undefined) {
          bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            speed: 7
          });
          player.canShoot = true;
          setTimeout(() => { player.canShoot = false; }, fireInterval);
        }
      }
  
      // --- 以下、他のupdate処理（省略） ---
  
      // 弾の移動
      bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }
      });
      // 敵の生成
      if (Math.random() < 0.02 * difficultyLevel) {
        enemies.push({
          x: Math.random() * (canvas.width - 40),
          y: -40,
          width: 40,
          height: 40,
          speed: 1 + difficultyLevel
        });
      }
  
      // レベル3以上での壊せない弾幕の生成
      if (difficultyLevel >= 3 && Math.random() < 0.005 * difficultyLevel) {
        indestructibleBullets.push({
          x: Math.random() * (canvas.width - 10),
          y: -20,
          width: 10,
          height: 20,
          speed: 2 + difficultyLevel
        });
      }
  
      // レベル4以上での爆発する弾幕の生成
      if (difficultyLevel >= 4 && Math.random() < 0.002 * difficultyLevel) {
        explodingBullets.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: Math.random() * (canvas.height / 2),
          width: 20,
          height: 20,
          speedX: (Math.random() - 0.5) * 4,
          speedY: (Math.random() - 0.5) * 4,
          creationTime: Date.now(),
          timeToExplode: 5000 // 5秒で爆発
        });
      }
  
      // 壊せない弾幕の移動
      indestructibleBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) {
          indestructibleBullets.splice(index, 1);
        }
  
        // プレイヤーと壊せない弾幕の衝突判定
        if (isColliding(bullet, getPlayerHitbox())) {
          gameOver();
        }
      });
  
      // 爆発する弾幕の移動と処理
      explodingBullets.forEach((bullet, index) => {
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;
  
        // 壁でのバウンド
        if (bullet.x <= 0 || bullet.x + bullet.width >= canvas.width) {
          bullet.speedX *= -1;
        }
        if (bullet.y <= 0 || bullet.y + bullet.height >= canvas.height) {
          bullet.speedY *= -1;
        }
  
        // 弾とプレイヤー弾の衝突判定
        bullets.forEach((playerBullet, bIndex) => {
          if (isColliding(playerBullet, bullet)) {
            bullets.splice(bIndex, 1);
            explodingBullets.splice(index, 1);
          }
        });
  
        // プレイヤーと爆発する弾幕の衝突判定
        if (isColliding(bullet, getPlayerHitbox())) {
          gameOver();
        }
  
        // 爆発タイマー
        const timeSinceCreation = Date.now() - bullet.creationTime;
        if (timeSinceCreation >= bullet.timeToExplode) {
          // 爆発処理（ここではゲームオーバー）
          explodingBullets.splice(index, 1);
          gameOver();
        }
      });
  
      // 敵の移動
      enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
          enemies.splice(index, 1);
        }
  
        // 弾と敵の衝突判定
        bullets.forEach((bullet, bIndex) => {
          if (isColliding(bullet, enemy)) {
            bullets.splice(bIndex, 1);
            enemies.splice(index, 1);
          }
        });
  
        // プレイヤーと敵の衝突判定
        if (isColliding(enemy, getPlayerHitbox())) {
          gameOver();
        }
      });
    }
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // プレイヤーの描画
      ctx.fillStyle = 'lime';
      ctx.fillRect(player.x, player.y, player.width, player.height);
  
      // 弾の描画
      ctx.fillStyle = 'yellow';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
  
      // 敵の描画
      ctx.fillStyle = 'red';
      enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
  
      // 壊せない弾幕の描画
      ctx.fillStyle = 'purple';
      indestructibleBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
  
      // 爆発する弾幕の描画（青色）
      explodingBullets.forEach(bullet => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  
        // 残り時間の計算
        const timeSinceCreation = Date.now() - bullet.creationTime;
        const remainingTime = Math.max(0, bullet.timeToExplode - timeSinceCreation);
        const seconds = (remainingTime / 1000).toFixed(1);
  
        // 残り時間を表示
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`${seconds}秒`, bullet.x, bullet.y - 5);
      });
    }
  
    function displayRemainingTime(remainingTime) {
      const seconds = Math.ceil(remainingTime / 1000);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`クリアまで残り時間: ${seconds} 秒`, 10, 30);
    }
  
    function getPlayerHitbox() {
      return {
        x: player.x + player.width * 0.25,
        y: player.y + player.height * 0.25,
        width: player.width * 0.5,
        height: player.height * 0.5
      };
    }
  
    function isColliding(a, b) {
      return !(
        a.y + a.height < b.y ||
        a.y > b.y + b.height ||
        a.x + a.width < b.x ||
        a.x > b.x + b.width
      );
    }
  
    function gameOver() {
      clearInterval(gameInterval);
      canvas.style.display = 'none';
      alert('ゲームオーバー！');
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    }
  
    function gameWin() {
      clearInterval(gameInterval);
      canvas.style.display = 'none';
      alert('ゲームクリア！おめでとうございます！');
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    }
  }