<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>指标计算器</title>
  <style>
    body{font-family:Helvetica,Arial;margin:0;padding:20px;background:#f6f8fa}
    .container{max-width:640px;margin:0 auto;background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
    label{display:block;margin-top:12px;font-size:14px}
    input[type=number]{width:100%;padding:8px;margin-top:6px;font-size:16px;border:1px solid #ddd;border-radius:6px}
    button{margin-top:14px;padding:10px 14px;font-size:16px;border:none;border-radius:6px;background:#2f80ed;color:#fff}
    .result{margin-top:16px;padding:12px;background:#f3f9ff;border-radius:6px}
    .row{display:flex;gap:8px}
    @media (max-width:480px){.row{flex-direction:column}}
  </style>
</head>
<body>
  <div class="container">
    <h2>技术指标计算器</h2>
    <p>请输入指标数值（可为小数或整数），支持手机与电脑浏览器。</p>
    <label>RSI24 <input id="rsi24" type="number" step="any" value="50"></label>
    <label>RSI12 <input id="rsi12" type="number" step="any" value="50"></label>
    <label>RSI6  <input id="rsi6"  type="number" step="any" value="50"></label>
    <label>MACD  <input id="macd"  type="number" step="any" value="0"></label>
    <label>DIFF  <input id="diff"  type="number" step="any" value="0"></label>
    <label>DEA   <input id="dea"   type="number" step="any" value="0"></label>
    <label>M5    <input id="m5"    type="number" step="any" value="0"></label>

    <div class="row">
      <button id="calc">计算</button>
      <button id="reset" type="button">重置</button>
    </div>

    <div class="result" id="result">结果将在此显示</div>
  </div>

  <script>
    function getNum(id){return parseFloat(document.getElementById(id).value)||0}
    function compute(){
      const rsi24=getNum('rsi24'), rsi12=getNum('rsi12'), rsi6=getNum('rsi6')
      const macd=getNum('macd'), diff=getNum('diff'), dea=getNum('dea'), m5=getNum('m5')
      // 简单加权评分：RSI 越高偏多，MACD/DIFF-DEA 越大偏多，M5 越大偏多
      const score = (rsi24*0.15 + rsi12*0.25 + rsi6*0.25) + (macd*0.15) + ((diff-dea)*0.15) + (m5*0.05)
      let trend='中性'
      if(score>60) trend='看多'
      else if(score<40) trend='看空'
      const out = []
      out.push('综合评分: '+score.toFixed(2))
      out.push('建议: '+trend)
      out.push('详情: RSI24='+rsi24+', RSI12='+rsi12+', RSI6='+rsi6+', MACD='+macd+', DIFF='+diff+', DEA='+dea+', M5='+m5)
      document.getElementById('result').textContent = out.join('\n')
    }
    document.getElementById('calc').addEventListener('click',compute)
    document.getElementById('reset').addEventListener('click',()=>{document.querySelectorAll('input[type=number]').forEach(i=>i.value= i.id.startsWith('rsi')?50:0);document.getElementById('result').textContent='结果将在此显示'})
  </script>
</body>
</html>
