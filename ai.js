// 簡易的な感情分析関数
async function analyzeText(text) {
    // シンプルなキーワードによる感情分析
    return new Promise((resolve) => {
      setTimeout(() => {
        const positiveWords = ['楽しい', '嬉しい', '素晴らしい', '最高', '幸せ', '大好き'];
        const negativeWords = ['悲しい', '嫌い', '辛い', '最悪', '怒り', '失望'];
        const neutralWords = ['普通', 'まあまあ', '微妙', 'どちらでもない'];
  
        let score = 0;
  
        positiveWords.forEach(word => {
          if (text.includes(word)) score += 1;
        });
  
        negativeWords.forEach(word => {
          if (text.includes(word)) score -= 1;
        });
  
        neutralWords.forEach(word => {
          if (text.includes(word)) score += 0;
        });
  
        if (score > 0) {
          resolve('ポジティブ');
        } else if (score < 0) {
          resolve('ネガティブ');
        } else {
          resolve('ニュートラル');
        }
      }, 1000); // 模擬的な処理時間
    });
  }