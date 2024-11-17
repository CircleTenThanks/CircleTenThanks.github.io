// グローバル変数として列ごとの状態を保持
const columnStates = {};
const originalOrder = [];

function filterTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.getElementById("songsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none"; // 初期状態で非表示
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = ""; // 一致する場合は表示
                    break;
                }
            }
        }
    }
}

function sortTable(columnIndex) {
    const table = document.getElementById("songsTable");
    const rows = Array.from(table.rows).slice(1);

    // 初回実行時に元の順序を保存
    if (originalOrder.length === 0) {
        rows.forEach(row => originalOrder.push(row.cloneNode(true)));
    }

    // 列の状態を初期化（未設定の場合）
    if (!columnStates[columnIndex]) {
        columnStates[columnIndex] = "asc";
    }
    let dir = columnStates[columnIndex];

    // 空の行の表示/非表示を設定
    rows.forEach(row => {
        const cell = row.getElementsByTagName("TD")[columnIndex];
        row.style.display = cell.innerHTML.trim() === "" && dir !== "original" ? "none" : "";
    });

    // ソート処理
    if (dir === "original") {
        // 元の順序に戻す
        table.tBodies[0].innerHTML = '';
        originalOrder.forEach(row => {
            table.tBodies[0].appendChild(row.cloneNode(true));
        });
    } else {
        rows.sort((rowA, rowB) => {
            const cellA = rowA.getElementsByTagName("TD")[columnIndex].innerHTML.toLowerCase();
            const cellB = rowB.getElementsByTagName("TD")[columnIndex].innerHTML.toLowerCase();
            return dir === "asc" 
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        });

        // ソートされた行を再配置
        rows.forEach(row => table.tBodies[0].appendChild(row));
    }

    // 次の状態を設定
    columnStates[columnIndex] = dir === "asc" ? "desc" 
        : dir === "desc" ? "original"
        : "asc";
}