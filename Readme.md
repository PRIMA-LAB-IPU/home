# PRIMA LAB website

岩手県立大学 PRIMA研究室のホームページ。HTML / CSS / JavaScriptだけで動作します。ビルド、npm、サーバー側処理は不要です。

## 見る

`index.html` をブラウザーで開いてください。画像は同梱されています。Google Fontsに接続できない場合は端末のフォントで表示します。

## GitHub Pagesで公開する

1. 公開先リポジトリの `main` ブランチのルートに、このフォルダーの**中身**を置きます。`index.html` がリポジトリ直下になるようにしてください。隠しフォルダー `.github` と `.nojekyll` も含めます。
2. GitHubの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選びます。
3. `main` にpushするか、**Actions → Deploy PRIMA LAB to GitHub Pages → Run workflow** を実行します。
4. 完了後、Pages設定またはActionsのdeployment欄に表示されるURLを開きます。

ユーザー・組織サイトと、リポジトリ配下のプロジェクトサイトの両方で動作するよう、画像・CSS・JavaScriptには相対パスを使っています。

この納品時点ではリポジトリが未指定のため、公開・push・独自ドメイン設定は実施していません。既存の www.prima-lab.org の設定は変更していません。

既存ドメインを移行する場合は、GitHub Pagesで動作確認した後にCustom domainとDNSを設定してください。このパッケージにはCNAMEを入れていません。

公式手順: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 内容を更新する

- `index.html`: ヘッダー、トップ画面、メタ情報、フッター
- `content.js`: 4研究領域、6件の論文、教員紹介、参加案内、日本語・英語
- `app.js`: 3D点群の座標投影、ドラッグ、回転スライダー、自動回転
- `styles.css`: 色、レイアウト、スマートフォン対応
- `assets/`: 既存研究室サイトから取得した研究画像2点
- `SOURCES.md`: 掲載内容と画像の出典

英語はヘッダーのENで切り替え、日本語にはJPで戻ります。言語設定のみ端末内に保存します。訪問者情報を送信する解析ツールやフォームはありません。相談ボタンはメールアプリを開きます。

## 動作とアクセシビリティ

- 研究タブ: クリック、左右矢印、Home / Endで切替
- 論文一覧: 全件 / 学術雑誌 / 国際会議の切替
- 3D点群: ドラッグ、キーボード対応スライダー、明示的な自動回転開始・停止
- 自動回転は初期停止。タブが非表示になると停止します。
- JavaScript無効時は基本案内と現行サイトへのリンクを表示します。

写真以外の図は研究の考え方を示す概念図であり、実験結果や推論出力ではありません。未公表原稿の数値や、学生個人の指導情報は掲載していません。
