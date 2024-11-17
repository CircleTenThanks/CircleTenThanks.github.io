// グローバル変数として列ごとの状態を保持
const columnStates = {};

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
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("songsTable");
    switching = true;

    // 列の状態を初期化（未設定の場合）
    if (!columnStates[columnIndex]) {
        columnStates[columnIndex] = "asc";
    }
    dir = columnStates[columnIndex];

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnIndex];
            y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

            // 空文字の行を非表示にする
            if (x.innerHTML.trim() === "") {
                rows[i].style.display = dir === "original" ? "" : "none";
                continue; // 次の行へ
            } else {
                rows[i].style.display = ""; // 空文字でない行は表示
            }

            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0) {
                if (dir === "asc") {
                    dir = "desc"; // 降順に切り替え
                } else if (dir === "desc") {
                    dir = "original"; // 元の状態に切り替え
                } else if (dir === "original") {
                    dir = "asc"; // 昇順に戻す
                }
                columnStates[columnIndex] = dir; // 状態を保存
                switching = true;
            }
        }
    }
}