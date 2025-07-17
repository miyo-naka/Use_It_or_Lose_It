# Use It Or Lose It

語学学習のための単語管理・クイズ・進捗管理アプリ  
（Laravel + Next.js + MySQL）

---
## 主な機能

- **単語管理**：単語の追加・編集・削除・CSV一括インポート
- **クイズ**：ランダム出題、正解/不正解の記録
- **進捗表示**：正解率・間違い回数・最近の間違い単語など
- **ソート・検索・ページネーション**：単語一覧で利用可能
- **UIはNext.js（React + Tailwind CSS）**

---

## 各ページ
<kbd><img width="500" height="400" alt="home" src="https://github.com/user-attachments/assets/0d5ea123-00b4-4e72-b931-7eac0a8bfe1f" /></kbd>

<kbd><img width="500" height="400" alt="word" src="https://github.com/user-attachments/assets/15e89fec-8166-4841-af9a-629442b4952c" /></kbd>

<kbd><img width="500" height="400" alt="quiz" src="https://github.com/user-attachments/assets/11d199e3-6cb6-4db8-8e67-63d1d3548101" /></kbd>

<kbd><img width="500" height="400" alt="progress" src="https://github.com/user-attachments/assets/48469b96-14ec-4315-a9ee-a9c7c630b650" /></kbd>


---

## 使用技術

- バックエンド：Laravel 10
- フロントエンド：Next.js 15, TypeScript, Tailwind CSS

---

## ディレクトリ構成

```
UseItOrLoseIt/
  backend/   
  frontend/  
  docker/    
  docker-compose.yml
```

---



## セットアップ

### 1. Dockerで一括起動

```sh
docker-compose up --build
```
- `http://localhost:3000` … フロントエンド（Next.js）
- `http://localhost:8000` … バックエンドAPI（Laravel）

### 2. バックエンド（Laravel）

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed # 必要に応じて
php artisan serve
```

### 3. フロントエンド（Next.js）

```sh
cd frontend
npm install
cp .env.example .env.local # 必要に応じて
npm run dev
```

---

## CSVインポートについて

- メニューから「CSVインポート」ボタンでファイル選択
- テンプレートダウンロードも可能
- CSV例：

  ```
  単語,意味,品詞,例文
  hello,こんにちは,noun,Hello, how are you?
  world,世界,noun,The world is beautiful.
  study,勉強する,verb,I study English every day.
  ```



