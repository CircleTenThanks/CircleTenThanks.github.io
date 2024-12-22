const CACHE_CONFIG = {
    key: 'lastCommitDate',
    timeKey: 'lastCommitDateTime',
    duration: 3600000 // 1時間（ミリ秒）
};

const GITHUB_API_URL = 'https://api.github.com/repos/CircleTenThanks/CircleTenThanks.github.io/commits?path=_data/songs.csv';

/**
 * 日付をフォーマットする
 * 日付オブジェクトを受け取り、YYYY/MM/DD HH:mm形式の文字列に変換する
 * @param {Date} date - フォーマットする日付
 * @returns {string} - フォーマットされた日付文字列
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * キャッシュから最終更新日を取得する
 * ローカルストレージからキャッシュされた日付を取得し、
 * 有効期限内であればその日付を返す。無効な場合はnullを返す。
 * @returns {string|null} - キャッシュされた日付またはnull
 */
function getFromCache() {
    const cachedDate = localStorage.getItem(CACHE_CONFIG.key);
    const cachedTime = localStorage.getItem(CACHE_CONFIG.timeKey);
    
    if (cachedDate && cachedTime && (Date.now() - cachedTime < CACHE_CONFIG.duration)) {
        return cachedDate;
    }
    return null;
}

/**
 * キャッシュを更新する
 * フォーマットされた日付をローカルストレージに保存し、
 * 現在のタイムスタンプを更新することで次回の取得時に
 * キャッシュの有効性を確認できるようにする。
 * @param {string} formattedDate - フォーマットされた日付
 */
function updateCache(formattedDate) {
    localStorage.setItem(CACHE_CONFIG.key, formattedDate);
    localStorage.setItem(CACHE_CONFIG.timeKey, Date.now());
}

/**
 * 最終更新日を表示する
 * 指定されたテキストをHTML要素に表示することで、
 * ユーザーに最新の更新情報を提供する。
 * @param {string} text - 表示するテキスト
 */
function updateLastCommitDisplay(text) {
    document.getElementById('last-updated').innerText = `最終更新: ${text}`;
}

/**
 * 最終更新日を取得する非同期関数
 * キャッシュを確認し、キャッシュが無効な場合は
 * GitHub APIを呼び出して最新のコミット日を取得する。
 * これにより、APIリクエストの回数を減らし、
 * サーバーへの負荷を軽減する。
 */
async function fetchLastCommitDate() {
    try {
        // キャッシュチェック
        const cachedDate = getFromCache();
        if (cachedDate) {
            updateLastCommitDisplay(cachedDate);
            return;
        }

        // APIリクエスト
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error('GitHub APIの取得に失敗しました');
        }

        const commits = await response.json();
        if (commits.length > 0) {
            const lastCommitDate = new Date(commits[0].commit.committer.date);
            const formattedDate = formatDate(lastCommitDate);
            
            updateLastCommitDisplay(formattedDate);
            updateCache(formattedDate);
        } else {
            updateLastCommitDisplay('更新履歴がありません');
        }
    } catch (error) {
        console.error('Error:', error);
        updateLastCommitDisplay('更新日時の取得に失敗しました');
    }
}

window.onload = fetchLastCommitDate;
