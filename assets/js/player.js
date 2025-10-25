(function(){
  const input = document.getElementById('input-url');
  const playBtn = document.getElementById('play-btn');
  const video = document.getElementById('html5-video');
  const iframe = document.getElementById('parser-iframe');
  const meta = document.getElementById('meta');
  const parserSelect = document.getElementById('parser-select');
  const quickParsers = document.getElementById('quick-parsers');

  // 🔗 解析接口（只要在这里加就会自动出现在前端）
  const parsers = [
    { name: "直播接口测试", url: "https://tv.20110208.xyz/LiveApp/streams/J8ugyq9arau7iE372422981621426254.m3u8" },
  ];

  // 填充 select 和快速选择
  parsers.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.url; opt.textContent = "解析器：" + p.name;
    parserSelect.appendChild(opt);

    const btn = document.createElement("button");
    btn.textContent = p.name; btn.dataset.url = p.url;
    quickParsers.appendChild(btn);
  });

  // 初始化 Plyr
  try { new Plyr(video); } catch(e){}

  // 模式切换
  const modePlay = document.getElementById('mode-play');
  const modeIframe = document.getElementById('mode-iframe');
  let mode = 'play';
  function setMode(m){
    mode = m;
    modePlay.classList.toggle('active', m==='play');
    modeIframe.classList.toggle('active', m==='iframe');
    video.style.display = (m==='play') ? 'block' : 'none';
    iframe.style.display = (m==='iframe') ? 'block' : 'none';
  }
  modePlay.addEventListener('click', ()=> setMode('play'));
  modeIframe.addEventListener('click', ()=> setMode('iframe'));

  // 快速选择按钮
  quickParsers.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-url]');
    if(!btn) return;
    parserSelect.value = btn.dataset.url;
  });

  // 判断是否 m3u8
  function isM3U8(str){
    return /\.m3u8(\?|$)/i.test(str) || (str.startsWith('http') && str.includes('m3u8'));
  }

  // 播放逻辑修改：现在支持直接打开解析器页面
  function play(){
    const val = input.value.trim();
    const parser = parserSelect.value || parsers[0].url;

    if(val && mode==='play' && isM3U8(val)){
      meta.textContent = '状态指示：直接播放 m3u8...';
      if(window._hls){ try{ window._hls.destroy(); }catch(e){} }
      if(video.canPlayType('application/vnd.apple.mpegurl')){
        video.src = val; video.play().catch(()=>{});
      } else if(Hls.isSupported()){
        const hls = new Hls(); window._hls = hls;
        hls.loadSource(val); hls.attachMedia(video);
      } else {
        meta.textContent = '状态指示：浏览器不支持 m3u8';
      }
      setMode('play');
    } else {
      meta.textContent = '状态指示：正在加载解析器页面，请稍候...';
      iframe.src = parser; // ✅ 直接加载解析器
      setMode('iframe');
    }
  }

  playBtn.addEventListener('click', play);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') play(); });
  iframe.addEventListener('load', ()=> meta.textContent='状态指示：iframe解析器播放窗口 已加载完成！');
})();

// 自动弹窗公告
window.addEventListener("load", () => {
  const modal = document.getElementById("announcement-modal");
  const okBtn = document.getElementById("modal-ok");

  if (modal && okBtn) {
    modal.classList.add("show");
    okBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }
});