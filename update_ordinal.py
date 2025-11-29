#!/usr/bin/env python3
"""
CSV内の特定行のordinalを挿入・変更し、
他行のordinalをシフトさせるためのスクリプト。

想定しているCSVのカラム:
number,name,member,url,ordinal,note,bpm,...
"""

import csv
import argparse
from pathlib import Path
from typing import List, Dict, Optional


def update_ordinal(
    csv_path: Path,
    target_number: str,
    new_ordinal: int,
) -> None:
    """
    - number 列が target_number の行を探し、その行の ordinal を new_ordinal に設定する
    - そのうえで、「対象行以外」で ordinal >= new_ordinal の行の ordinal をすべて +1 する
    - ordinal が空、もしくは数値でない行はシフト対象から除外する
    """
    if new_ordinal <= 0:
        raise ValueError("new_ordinal は 1 以上の整数を指定してください。")

    # CSVを読み込む
    with csv_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows: List[Dict[str, str]] = list(reader)
        fieldnames: Optional[List[str]] = reader.fieldnames

    if not fieldnames:
        raise RuntimeError("CSVヘッダが読み取れませんでした。")

    if "number" not in fieldnames or "ordinal" not in fieldnames:
        raise RuntimeError("CSVに 'number' または 'ordinal' カラムが存在しません。")

    # 対象行を特定
    target_index: Optional[int] = None
    for i, row in enumerate(rows):
        if row.get("number") == target_number:
            target_index = i
            break

    if target_index is None:
        raise ValueError(f"number='{target_number}' の行が見つかりません。")

    # 1. 対象行「以外」で ordinal >= new_ordinal のものを +1
    for i, row in enumerate(rows):
        if i == target_index:
            continue  # 対象行は後でまとめて処理

        ordinal_str = (row.get("ordinal") or "").strip()
        if not ordinal_str:
            # 元々ordinalに値が設定されていない場合 → 何もしない
            continue

        try:
            ordinal_val = int(ordinal_str)
        except ValueError:
            # 数値に変換できない場合はシフト対象から除外
            continue

        if ordinal_val >= new_ordinal:
            row["ordinal"] = str(ordinal_val + 1)

    # 2. 対象行の ordinal を new_ordinal に設定（元々の値の有無にかかわらず上書き）
    rows[target_index]["ordinal"] = str(new_ordinal)

    # CSVを書き戻す
    with csv_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "CSV内の特定行のordinalを挿入し、"
            "それ以上のordinalを持つ他行のordinalを+1してシフトさせるスクリプト"
        )
    )
    parser.add_argument(
        "csv_path",
        help="操作対象のCSVファイルパス（例: _data/songs.csv）",
    )
    parser.add_argument(
        "target_number",
        help="対象行の 'number' 列の値（例: KS07_01, P05_06 など）",
    )
    parser.add_argument(
        "new_ordinal",
        type=int,
        help="新しく設定したい ordinal の値（1以上の整数）",
    )

    args = parser.parse_args()

    csv_file = Path(args.csv_path)
    if not csv_file.exists():
        raise FileNotFoundError(f"CSVファイルが見つかりません: {csv_file}")

    update_ordinal(csv_file, args.target_number, args.new_ordinal)


if __name__ == "__main__":
    main()


