window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 优化后的拦截逻辑
const hookClick = (e) => {
    const origin = e.target.closest('a');
    if (!origin || !origin.href) return;

    // 1. 排除下载链接：如果链接包含 download 属性，或者是常见的文件后缀，不进行拦截
    const isDownload = origin.hasAttribute('download') || 
                       /\.(zip|exe|rar|pdf|jpg|png|webp|mp4)$/i.test(origin.href);

    if (isDownload) {
        // 让系统默认处理下载，不要干预
        console.log('检测到下载请求，放行:', origin.href);
        return; 
    }

    // 2. 处理原本要打开新窗口的链接
    const isTargetBlank = origin.target === '_blank' || 
                          document.querySelector('head base[target="_blank"]');

    if (isTargetBlank) {
        e.preventDefault();
        // 如果是站内链接，在当前窗口打开
        if (origin.href.startsWith(window.location.origin)) {
            location.href = origin.href;
        } else {
            // 如果是外部链接，可以考虑调用系统浏览器打开（需要 Tauri 权限）
            // 或者直接在当前窗口打开
            location.href = origin.href;
        }
    }
};

// 优化 window.open
window.open = function (url) {
    if (url) {
        console.log('window.open 拦截并跳转:', url);
        location.href = url;
    }
};

document.addEventListener('click', hookClick, { capture: true });