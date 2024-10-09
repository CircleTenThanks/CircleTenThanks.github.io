function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

async function fetchLastCommitDate() {
    const cacheKey = 'lastCommitDate';
    const cacheTimeKey = 'lastCommitDateTime';
    const cacheDuration = 3600000; // 1時間（ミリ秒）

    // キャッシュの取得
    const cachedDate = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    // キャッシュが存在し、かつまだ有効であれば表示
    if (cachedDate && cachedTime && (Date.now() - cachedTime < cacheDuration)) {
        document.getElementById('last-updated').innerText = `最終更新: ${cachedDate}`;
        return;
    }

    // APIリクエストを送信
    const response = await fetch('https://api.github.com/repos/CircleTenThanks/CircleTenThanks.github.io/commits?path=_data/songs.csv');
    const commits = await response.json();
    if (commits.length > 0) {
        const lastCommitDate = new Date(commits[0].commit.committer.date);
        const formattedDate = formatDate(lastCommitDate);
        document.getElementById('last-updated').innerText = `最終更新: ${formattedDate}`;

        // キャッシュを保存
        localStorage.setItem(cacheKey, formattedDate);
        localStorage.setItem(cacheTimeKey, Date.now());
    } else {
        document.getElementById('last-updated').innerText = '更新履歴がありません';
    }
}

window.onload = fetchLastCommitDate;
