document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('youtube-container');

    const extractVideoId = (url) => {
        const urlObj = new URL(url);
        if (urlObj.hostname === "youtu.be") {
            return urlObj.pathname.substring(1); // "skMGJyR74YE"を返す
        } else if (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") {
            const params = new URLSearchParams(urlObj.search);
            return params.get("v"); // "v"パラメータからIDを取得
        }
        return null; // 不正なURLの場合
    };

    const loadVideos = () => {
        const embeds = document.querySelectorAll('.youtube-embed');
        embeds.forEach(embed => {
            const rect = embed.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const url = embed.getAttribute('data-url');
                const videoId = extractVideoId(url);
                if (videoId) {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    embed.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
                }
            }
        });
    };

    window.addEventListener('scroll', loadVideos);
    // 初回読み込み時にもチェック
    loadVideos();
});
