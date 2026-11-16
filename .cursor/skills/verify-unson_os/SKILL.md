---
name: verify-unson_os
description: unson_osのPR headを検証し、RUNNER_VERIFYを記録する。箱の検証手配（verify-dispatch）と翌朝の抜き取りで使う。
---

# verify-unson_os

自動マージ（runner-merge）は、PRの head に `verify-skill` の成功が付いていることを条件にしている。
このスキルは、その元になる RUNNER_VERIFY の記録を作る手順である。PRのコードは変えない。

## Launch

対象PRの40桁の head SHA を、作業用の detached worktree に取り出す。サーバーの起動・配備・外部への送信はしない。

```bash
git -C <clone> fetch origin <40-hex-head-sha>
git -C <clone> worktree add --detach <worktree> <40-hex-head-sha>
```

証拠は worktree の外のディレクトリに残す。

## Doctor

- worktree の `git rev-parse HEAD` が対象SHAと一致する。
- `git status --porcelain` が空である。
- 失敗したら Drive へ進まず、全体を FAIL にする。

## Drive

CIの「Test」と同じものを流す。
```bash
npm ci
npm run lint
```
Vercelへの配備（`vercel deploy`）は動かさない。

どのPRでも、続けて次も確かめる。

- 差分の範囲: `git diff --stat origin/main...<sha>` がPR本文の説明と合っている。
- 変更したMarkdownの相対リンク先が、そのheadに存在する。
- 秘密情報（鍵・トークン・パスワード）が差分に入っていない。
- PR本文に「確かめ方」や利用者の操作が書いてあれば、それを再現して結果を残す。

## Evidence

実行したコマンド・出力の要点・各段の結果（PASS・N/A・FAIL・SKIPPED）と全体結果を、PRのコメントに書く。
全段が PASS か理由付きの `N/A:` のときだけ全体を PASS にする。流せなかった段（`SKIPPED:`）と FAIL は全体を FAIL にする。
手元のファイルは証拠の代わりにならない。PRから読めるコメントか Actions run のURLを使う。

## Cleanup

この実行で作った worktree だけを削除する（`git worktree remove <worktree>`）。証拠は残す。

## RUNNER_VERIFY の書き方

```text
RUNNER_VERIFY repository=Unson-LLC/unson_os pr=<number> head=<40-hex SHA> skill=.cursor/skills/verify-unson_os/SKILL.md@<commit> result=PASS|FAIL evidence=<https URL>
```

- `head` は実際に流した40桁SHAにする。headが変わっていたら新しいheadでは流さず、その旨だけ書く。
- `skill` の commit は、このスキルを最後に変えた main 上のcommitにする。
- `evidence` は同じリポジトリのPRコメント（`https://github.com/Unson-LLC/unson_os/pull/<n>#issuecomment-<id>`）か Actions run のURLにする。
- 書き込みできる人（OWNER・MEMBER・COLLABORATOR）の本文とコメントだけが記録として数えられる。同じheadでは最後の記録が採られ、後の FAIL は前の PASS を取り消す。
