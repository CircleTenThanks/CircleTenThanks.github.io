## ordinal 更新スクリプトの使い方

### 概要

`_data/songs.csv` の `ordinal` をずらしながら、特定の曲を任意の位置に差し込むスクリプトである。  

### 実行方法

リポジトリのルートで次のように実行する。

```bash
python update_ordinal.py _data/songs.csv <number> <new_ordinal>
```

- `<number>`: 対象となる行の `number` 列の値（例: `KS07_01`, `P05_06`）
- `<new_ordinal>`: 新しく設定したい `ordinal` の値（1以上の整数）

### 挙動

- 指定した `number` の行の `ordinal` を `<new_ordinal>` に設定する。
- それ以外の行で
  - `ordinal` が空でなく
  - 数値として解釈でき
  - かつ `ordinal >= <new_ordinal>`
  
  であるものの `ordinal` を、すべて +1 する。
