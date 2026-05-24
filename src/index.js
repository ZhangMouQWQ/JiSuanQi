/**
 * Cloudflare Worker - 股票当日信息查询
 * 基于 Ashare 的数据接口逻辑
 */

// HTML 模板
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>股票当日信息查询</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
            font-size: 28px;
        }
        
        .subtitle {
            text-align: center;
            color: #999;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .input-group {
            flex: 1;
            min-width: 200px;
            display: flex;
            align-items: center;
        }
        
        input[type="text"] {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .loading {
            display: none;
            text-align: center;
            color: #667eea;
            margin: 20px 0;
            font-size: 14px;
        }
        
        .loading.show {
            display: block;
        }
        
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .result-container {
            display: none;
            margin-top: 30px;
        }
        
        .result-container.show {
            display: block;
        }
        
        .stock-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .stock-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        .stock-code {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        
        .stock-time {
            color: #999;
            font-size: 12px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        
        .info-label {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        
        .info-value {
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }
        
        .info-value.up {
            color: #ff0000;
        }
        
        .info-value.down {
            color: #00b050;
        }
        
        .error {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border-left: 4px solid #c33;
            display: none;
        }
        
        .error.show {
            display: block;
        }
        
        .help-text {
            background: #f0f4ff;
            padding: 12px 15px;
            border-radius: 6px;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            border-left: 4px solid #667eea;
        }
        
        .help-text strong {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📈 股票当日信息查询</h1>
        <p class="subtitle">Cloudflare Worker 版 - 基于实时行情数据</p>
        
        <div class="search-box">
            <div class="input-group">
                <input type="text" id="stockCode" placeholder="输入股票代码 (如: 600519, sh600519, 000001)" autocomplete="off">
            </div>
            <button onclick="searchStock()">查询</button>
        </div>
        
        <div class="loading" id="loading">
            <span class="spinner"></span>加载中...
        </div>
        
        <div class="error" id="error"></div>
        
        <div class="result-container" id="result">
            <div class="stock-info">
                <div class="stock-header">
                    <div>
                        <div class="stock-code" id="resultCode"></div>
                        <div class="stock-time" id="resultTime"></div>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">开盘价</div>
                        <div class="info-value" id="openPrice">-</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">收盘价</div>
                        <div class="info-value" id="closePrice">-</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">最高价</div>
                        <div class="info-value" id="highPrice">-</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">最低价</div>
                        <div class="info-value" id="lowPrice">-</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">成交量</div>
                        <div class="info-value" id="volume">-</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="help-text">
            <strong>支持的代码格式：</strong><br>
            通达信格式: sh600519（上证）、sz000001（深证）<br>
            标准格式: 600519.XSHG、000001.XSHE
        </div>
    </div>

    <script>
        const stockCodeInput = document.getElementById('stockCode');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const resultDiv = document.getElementById('result');
        
        // 回车键搜索
        stockCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStock();
            }
        });
        
        async function searchStock() {
            const code = stockCodeInput.value.trim();
            
            if (!code) {
                showError('请输入股票代码');
                return;
            }
            
            showLoading(true);
            hideError();
            hideResult();
            
            try {
                const response = await fetch('/api/stock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: code })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    displayResult(data);
                } else {
                    showError(data.error || '查询失败，请检查股票代码');
                }
            } catch (err) {
                showError('网络错误: ' + err.message);
            } finally {
                showLoading(false);
            }
        }
        
        function displayResult(data) {
            document.getElementById('resultCode').textContent = data.code;
            document.getElementById('resultTime').textContent = data.date;
            
            const open = parseFloat(data.open).toFixed(2);
            const close = parseFloat(data.close).toFixed(2);
            const high = parseFloat(data.high).toFixed(2);
            const low = parseFloat(data.low).toFixed(2);
            
            document.getElementById('openPrice').textContent = open;
            document.getElementById('closePrice').textContent = close;
            document.getElementById('highPrice').textContent = high;
            document.getElementById('lowPrice').textContent = low;
            document.getElementById('volume').textContent = formatVolume(data.volume);
            
            showResult();
        }
        
        function formatVolume(volume) {
            if (volume >= 1e8) {
                return (volume / 1e8).toFixed(2) + '亿';
            } else if (volume >= 1e4) {
                return (volume / 1e4).toFixed(2) + '万';
            }
            return Math.round(volume).toString();
        }
        
        function showLoading(show) {
            loadingDiv.classList.toggle('show', show);
        }
        
        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
        
        function hideError() {
            errorDiv.classList.remove('show');
        }
        
        function showResult() {
            resultDiv.classList.add('show');
        }
        
        function hideResult() {
            resultDiv.classList.remove('show');
        }
    </script>
</body>
</html>`;

/**
 * 标准化股票代码
 */
function normalizeStockCode(code) {
  code = code.trim().toUpperCase();
  
  // 如果已经是标准格式就直接返回
  if (code.includes('.XSHG') || code.includes('.XSHE')) {
    return code;
  }
  
  // 处理通达信格式
  if (code.startsWith('SH')) {
    return code.substring(2) + '.XSHG';
  }
  if (code.startsWith('SZ')) {
    return code.substring(2) + '.XSHE';
  }
  
  // 纯数字的情况，根据首位判断
  if (/^\d+$/.test(code)) {
    if (code.startsWith('0') || code.startsWith('3')) {
      return code + '.XSHE'; // 深证
    } else {
      return code + '.XSHG'; // 上证
    }
  }
  
  return code;
}

/**
 * 从腾讯API获取日线数据
 */
async function getPriceFromTencent(code) {
  try {
    const url = `http://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,,1,qfqday`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.data || !data.data[code]) {
      return null;
    }
    
    const stk = data.data[code];
    const buf = stk.day || stk.qfqday;
    
    if (!buf || buf.length === 0) {
      return null;
    }
    
    const latest = buf[buf.length - 1];
    return {
      time: latest[0],
      open: parseFloat(latest[1]),
      close: parseFloat(latest[2]),
      high: parseFloat(latest[3]),
      low: parseFloat(latest[4]),
      volume: parseFloat(latest[5])
    };
  } catch (err) {
    console.error('腾讯 API 错误:', err);
    return null;
  }
}

/**
 * 从新浪API获取日线数据
 */
async function getPriceFromSina(code) {
  try {
    const url = `http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${code}&scale=1&ma=5&datalen=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    
    const latest = data[data.length - 1];
    return {
      time: latest.day,
      open: parseFloat(latest.open),
      close: parseFloat(latest.close),
      high: parseFloat(latest.high),
      low: parseFloat(latest.low),
      volume: parseFloat(latest.volume)
    };
  } catch (err) {
    console.error('新浪 API 错误:', err);
    return null;
  }
}

/**
 * 获取股票价格数据
 */
async function getStockPrice(code) {
  const normalizedCode = normalizeStockCode(code);
  
  // 先尝试腾讯 API
  let result = await getPriceFromTencent(normalizedCode);
  if (result) {
    return result;
  }
  
  // 再尝试新浪 API
  result = await getPriceFromSina(normalizedCode);
  if (result) {
    return result;
  }
  
  return null;
}

/**
 * 处理 API 请求
 */
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/stock' && request.method === 'POST') {
    try {
      const body = await request.json();
      const code = body.code?.trim();
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: '股票代码不能为空' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      const priceData = await getStockPrice(code);
      
      if (!priceData) {
        return new Response(
          JSON.stringify({ error: `找不到代码为 ${code} 的股票，请检查代码是否正确` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          code: code,
          date: priceData.time,
          open: priceData.open,
          close: priceData.close,
          high: priceData.high,
          low: priceData.low,
          volume: priceData.volume
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('API 错误:', err);
      return new Response(
        JSON.stringify({ error: `查询失败: ${err.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
  if (url.pathname === '/api/health' && request.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'ok' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  return null;
}

/**
 * 主处理程序
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 处理 API 请求
    if (url.pathname.startsWith('/api/')) {
      const apiResponse = await handleApiRequest(request);
      if (apiResponse) {
        return apiResponse;
      }
    }
    
    // 返回 HTML 主页
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(HTML_TEMPLATE, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 404
    return new Response('Not Found', { status: 404 });
  }
};
