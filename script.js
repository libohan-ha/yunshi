document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyze');
    const resultCard = document.getElementById('result');
    const loadingDiv = document.querySelector('.loading');
    const contentDiv = document.querySelector('.content');

    const API_URL = 'https://xiaoai.plus/v1/chat/completions';
    const API_KEY = 'sk-wkJ8C4yXkzkXiwUm2e0322A6Bf254239824bC7D6F91a3468';

    async function getAnalysis(zodiac, mbti) {
        const prompt = `# Role: 星座与MBTI人格分析大师

分析对象信息：
星座：${zodiac}
MBTI：${mbti}

请以轻松有趣但专业的语气，按照以下格式提供分析：

一、性格画像 ⭐
1. 核心特质：[用3-4句话描述此类型人的典型特征]
2. 闪光点：[列出5个最突出的优点]
3. 成长空间：[委婉指出3个需要注意的特点]

二、星座解析 ✨
1. 元素属性：[星座所属元素及其影响]
2. 守护星：[守护星及其带来的能量]
3. 关键词：[3-5个代表性词汇]

三、MBTI分析 ⚡
1. 能量来源：[E/I] [具体解释]
2. 信息接收：[S/N] [具体解释]
3. 决策方式：[T/F] [具体解释]
4. 生活方式：[J/P] [具体解释]

四、2024运势预测
1. 爱情运势 ⭐
   - 桃花指数：[1-5颗星]
   - 最佳配对：[最适合的3个星座/MBTI]
   - 注意事项：[情感建议]

2. 事业运势 ✨
   - 发展指数：[1-5颗星]
   - 适合领域：[3个最匹配的职业方向]
   - 职场优势：[3点独特优势]
   - 建议重点：[具体建议]

3. 财运分析 ⚡
   - 财运指数：[1-5颗星]
   - 理财建议：[适合的理财方式]
   - 财运高峰期：[最旺的3个月份]

4. 健康提醒 ⭐
   - 易感部位：[需要关注的身体部位]
   - 建议运动：[最适合的3种运动]
   - 饮食宜忌：[建议和禁忌]

五、个性解码 ✨
1. 压力源：[最容易带来压力的3种情况]
2. 减压方式：[最有效的3种减压方法]
3. 潜在天赋：[3个容易被忽视的特殊才能]

六、成功路径 ⚡
1. 适合的学习方式：[3种最有效的学习方法]
2. 职业发展建议：[长期职业规划建议]
3. 人际关系处理：[社交相处技巧]

七、个性标签 ⭐
[用5-6个新颖独特的标签形容这类人]

八、2024年度关键词 ✨
[用3个词概括2024年的整体运势]

九、个性化建议 ⚡
1. 短期目标：[未来3个月可以做的事]
2. 长期规划：[2024年的重点发展方向]
3. 注意事项：[需要特别注意的3点]

请直接开始分析，不要有任何开场白。注重实用性和可操作性，语气要温暖积极但不过分夸张。`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.8,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    function formatAnalysis(text) {
        return text
            .replace(/【/g, '<span class="highlight">')
            .replace(/】/g, '</span>')
            .replace(/^(.+?)：/gm, '<strong>$1：</strong>')
            .replace(/([⭐✨⚡])/g, '<span class="emoji">$1</span>')
            .replace(/\[(.+?)\]/g, '<em>$1</em>');
    }

    analyzeButton.addEventListener('click', async () => {
        const zodiac = document.getElementById('zodiac').value;
        const mbti = document.getElementById('mbti').value;

        if (!zodiac || !mbti) {
            alert('请选择星座和MBTI类型');
            return;
        }

        resultCard.classList.remove('hidden');
        loadingDiv.classList.remove('hidden');
        contentDiv.classList.add('hidden');
        contentDiv.innerHTML = '';
        analyzeButton.disabled = true;
        analyzeButton.textContent = '分析中...';

        try {
            const analysis = await getAnalysis(zodiac, mbti);
            contentDiv.innerHTML = formatAnalysis(analysis);
            loadingDiv.classList.add('hidden');
            contentDiv.classList.remove('hidden');
        } catch (error) {
            contentDiv.innerHTML = `
                <div class="error-message">
                    <span class="emoji">❌</span>
                    <p>抱歉，获取分析结果时出现错误，请稍后重试。</p>
                    <p class="error-details">${error.message}</p>
                </div>`;
            loadingDiv.classList.add('hidden');
            contentDiv.classList.remove('hidden');
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.textContent = '获取分析';
        }
    });
}); 