-- リポジトリ一覧: GitHub リポジトリのショーケース
-- Supabase SQL Editor で実行する

create table if not exists public.github_repos (
  id bigint generated always as identity primary key,
  name text not null unique,
  title text not null,
  description text,
  usage text,
  app_type text not null default 'local' check (app_type in ('web', 'local')),
  app_url text,
  repo_url text not null,
  thumbnail text,
  language text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.github_repos enable row level security;

revoke all on public.github_repos from anon, authenticated;
grant select on public.github_repos to anon, authenticated;

drop policy if exists "github_repos public select" on public.github_repos;
create policy "github_repos public select"
  on public.github_repos
  for select
  to anon, authenticated
  using (true);

insert into public.github_repos (name, title, description, usage, app_type, app_url, repo_url, thumbnail, language, sort_order) values
('job_post', '求人スキル分析アプリ', '企業の求人情報を集め、会社・職種・スキル・資格の採用要件を比較・統計表示するWebアプリ。', '・公開URLを開き、企業名やスキルで求人を検索・絞り込みできます。
・統計ページでは職種・スキル・資格ごとの求人件数と月別推移をグラフで確認できます。
・求人の詳細では必須／歓迎スキルや資格、勤務地などを構造化して表示します。', 'web', 'https://jobpostview.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/job_post', 'assets/job_post.svg', 'JavaScript', 1),
('tech_stack', '技術スタック', '3Dシミュレーション系を中心に、商用利用できるオープンソースツールを用途別にまとめたレジストリ。', '・カテゴリや判定（商用OK／要確認／対象外）で絞り込んでツールを探せます。
・検索で名前・概要・ライセンスからも探せます。
・各カードにライセンス、概要、利用時の注意点を表示します。', 'web', 'https://techstack.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/tech_stack', 'assets/tech_stack.svg', 'JavaScript', 2),
('recipes', 'レシピボード', 'レシピ一覧と「今日の一品」のランダムピックができるレシピサイト。', '・カテゴリの絞り込みや検索でレシピを探せます。
・カードを広げると材料と作り方の手順を確認できます。
・迷ったときは「ランダムで1品選ぶ」で今日の一品を決められます（未作成のみの絞り込みも可能）。', 'web', 'https://recipes.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/recipes', 'assets/recipes.svg', 'JavaScript', 3),
('podcast', '仕組みを基礎から（ITAIST）', 'AI・IT・金融の仕組みを基礎から解説するポッドキャスト「ITAIST」のエピソード一覧サイト。', '・エピソード一覧から聞きたい回を選ぶと、その場で再生できます。
・各回のテーマと長さを見ながら、基礎から順に聞き進められます。', 'web', 'https://podcast.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/podcast', 'assets/podcast.svg', 'JavaScript', 4),
('stock_picks', '株ピック記録', 'バリュー株／株主優待のスクリーニング実行ごとに、ピック銘柄をまとめた記録サイト。', '・ラン（実行日）を選ぶと、その回のピック銘柄と選定理由を確認できます。
・各銘柄には代表ブランド名と5年週足チャートを表示します。
・種別フィルタ（バリュー／優待／日本株／米国株）と検索で絞り込めます。', 'web', 'https://stockpicks.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/stock_picks', 'assets/stock_picks.svg', 'JavaScript', 5),
('earnings_viewer', 'Earnings Atelier', '国内主要30社の株価と公表済み業績を自動更新する、決算を読むためのダッシュボード。', '・左側の会社メニューから対象企業を切り替えます。
・最新株価・前日比、業績推移、四半期内訳、公式IR PDFを確認できます。
・直近1年の日足チャート（移動平均・フィボナッチ付き）も表示します。', 'web', 'https://earningsviewer.gongonticktack.workers.dev/', 'https://github.com/gongonticktack/earnings_viewer', 'assets/earnings_viewer.svg', 'JavaScript', 6),
('ai_research_lab', 'AI Research Lab', 'SAM 3D Bodyの実験結果を記録・集計・3D表示する研究ダッシュボードと、ブラウザで動く骨格検知AI Studio。', '・ダッシュボードで実験結果の集計と性能変化の検出結果を確認できます。
・AI Studioでは画像を選んでモデル（MoveNet／PoseNet／BlazePose）を実行し、骨格検知の結果をその場で確認できます。
・GPUモデル（TripoSR等）はローカル環境から実行します。', 'web', 'https://gongonticktack.github.io/ai_research_lab/', 'https://github.com/gongonticktack/ai_research_lab', 'assets/ai_research_lab.svg', 'JavaScript', 7),
('stock_daily_reports', 'STOCK NEWS', '日本株・米国株の株価、値動き候補、市場ニュースをまとめた日刊レポートサイト。', '・公開サイトで日付を選ぶと、その日の株式日報を読めます。
・日別サマリーから銘柄ごとの詳細分析へ移動できます。
・日英表示の切替に対応しています。', 'web', 'https://gongonticktack.github.io/stock_daily_reports/', 'https://github.com/gongonticktack/stock_daily_reports', 'assets/stock_daily_reports.svg', 'Python', 8),
('it_news', 'IT NEWS', 'RSSとGoogle NewsからAI・ITニュースを収集し、重要度や重複を考慮して作る日刊ニュースサイト。', '・公開サイトで日付を選ぶと、その日のニュースと情報源を確認できます。
・見出し・概要・重要性つきで1日5件程度に厳選して表示します。
・日英表示の切替に対応しています。', 'web', 'https://gongonticktack.github.io/it_news/', 'https://github.com/gongonticktack/it_news', 'assets/it_news.svg', 'Python', 9),
('mock_exam', '資格試験学習アプリ', '資格試験の問題を登録し、ブラウザで演習・復習・学習履歴の確認ができる学習プラットフォーム。', '・ローカルアプリのため、リポジトリを取得して起動します（静的確認は python -m http.server 8000、画像抽出も使う場合は npx wrangler pages dev .）。
・Supabaseの接続設定（supabase-config.json）を用意すると問題・履歴を保存できます。
・Excel・JSONからの問題取り込み、カメラ画像からの問題抽出に対応します。', 'local', null, 'https://github.com/gongonticktack/mock_exam', 'assets/mock_exam.svg', 'JavaScript', 10),
('kakeiboDX', 'Kakeibo DX', 'クレジットカードの利用明細PDFを取り込み、支出を月別・年別・カテゴリ別に確認するローカル家計簿。', '・Windowsで start.bat を起動し、初回ウィザードでPostgreSQLの接続を設定します。
・カード明細PDFをアップロードすると支出データとして登録されます。
・ダッシュボードで期間・カテゴリを切り替えて支出とグラフを確認します。', 'local', null, 'https://github.com/gongonticktack/kakeiboDX', 'assets/kakeiboDX.svg', 'Python', 11),
('yt3', 'YT3', 'YouTubeのURLを入力して、MP3音声またはMP4動画として取得できるローカル変換アプリ。', '・Windowsで start.bat を起動し、http://127.0.0.1:8000/ を開きます。
・YouTubeのURLを入力して「Convert to MP3」または「Convert to MP4」を押します。
・変換が終わったらダウンロードボタンでファイルを保存します。', 'local', null, 'https://github.com/gongonticktack/yt3', 'assets/yt3.svg', 'Python', 12),
('photo2mesh', 'photo2mesh', '写真からSAMで対象物のマスクを作り、SAM 3D Objectsで3Dメッシュ（PLY）を生成するローカルアプリ。', '・Windows＋WSL2＋NVIDIA GPUの環境で start.bat を起動します（SAM／SAM3Dの環境と重みが別途必要）。
・写真をアップロードし、画像内をクリックして対象物のマスクを作成します。
・生成した3DモデルはPLY形式でダウンロードできます。', 'local', null, 'https://github.com/gongonticktack/photo2mesh', 'assets/photo2mesh.svg', 'Python', 13),
('music_station', 'Music Station / Seed-VC', '参照音声を使って音声・歌声の声質を変換する、Seed-VCベースのローカルアプリ。', '・Windowsで start.bat を起動し、http://127.0.0.1:7860/ を開きます（NVIDIA GPU推奨、初回はモデルのダウンロードがあります）。
・変換元の音声と参照音声をアップロードし、ステップ数や音程を調整して変換します。
・生成されたWAVは試聴・保存できます。', 'local', null, 'https://github.com/gongonticktack/music_station', 'assets/music_station.svg', 'Python', 14),
('movie_to_3D', 'MILo Video to 3D', '動画からフレームを抽出し、COLMAPとMILoで3D形状を再構成してOBJ／USDAで保存するローカルアプリ。', '・Windowsで start.bat を起動します（初回はGPUに合うPyTorch・CUDAやCOLMAP等の準備が入ります）。
・動画をアップロードし、出力形式（OBJ／USDA）を指定して変換します。
・変換はキューで1件ずつ処理され、結果をダウンロードできます。', 'local', null, 'https://github.com/gongonticktack/movie_to_3D', 'assets/movie_to_3D.svg', 'Python', 15),
('auto_coder', 'Fretlab', '音楽ファイルからパートを分離し、コード・歌詞を推定して、編集可能なギター伴奏TABを作成するローカルアプリ。', '・Windowsで start.bat を起動し、http://127.0.0.1:5173/ を開きます。
・音声を入力すると、音源分離（ボーカル／ベース／ドラム等）とコード・歌詞の推定が行われます。
・ブラウザ上でTABを編集・再生でき、MIDI・MusicXMLへ書き出せます。', 'local', null, 'https://github.com/gongonticktack/auto_coder', 'assets/auto_coder.svg', 'TypeScript', 16)
on conflict (name) do nothing;

notify pgrst, 'reload schema';
