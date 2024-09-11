## Todo
- ポートフォリオに掲載してみる。https://react-tutorial-eda61.web.app/
- 再度、memoしたところを踏まえながらブランチを新規作成して作成してみる
- GitHub Actions: CI/CDでGitHubプッシュとついでに自動化デプロイしてみようと思ったが良くわからなかった。。[.github/workflows](https://github.com/ka2yuki/react-tutorials/blob/master/.github/workflows/firebase-hosting-merge.yml) 2024年9月4日
  - README.mdの更新でもGitHub Actionsのワークフローが実行される。。

# Tutorial MEMO :open_book:

- README.md に メモする
  - 章ごと：タスクなど
  

## 巻き戻す機能 
- squares 配列をミューテート（書き換え）していた場合、タイムトラベルの実装は非常に困難。
- 各着手ごとに slice() を使って squares 配列の新しいコピーを作成し、それをイミュータブルなものとして扱う
- このおかげで、過去のすべてのバージョンの squares 配列を保存し、すでに発生した着手の間で移動することができるようになります。
  - [link](https://ja.react.dev/learn/tutorial-tic-tac-toe#storing-a-history-of-moves)

方法
- 過去の squares 配列を、history という名前の別の配列に入れて、それを新たに state 変数として保持する
- history 配列は、最初の着手から最新の着手まで、盤面のすべての状態を表現しており、以下のような形になります。

```js
[ // STATE: history
  // Before first move
  [null, null, null, null, null, null, null, null, null], // 初期
  // After first move
  [null, null, null, null, 'X', null, null, null, null], // 初手
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```
  

## もう一度 state をリフトアップ
- ゲーム履歴全体を保持する state の history を置く場所：
  - 新しいトップレベルのコンポーネント Gameを作成
- Gameコンポーネントは Boardのデータを完全に制御し、history からの過去の盤面の状態を Boardにレンダーさせることができます。  
  
`<Game/> → <Board/> → <Square/>`

Todo:
- Gameコンポーネントに現在の手番と着手の履歴を管理するための state をリフトアップ
- 現在の盤面をレンダーするには、history の最後にあるマス目の配列を読み取る `[ [...], [...] ]`
- ゲーム内容を更新するための関数handlePlay を Board コンポーネントに props として渡す
  - Board コンポーネントが 3 つの props を受け取るようにします。xIsNext、squares、そして、プレーヤの着手時に Board がコールして新たな盤面の状態を伝えるための onPlay 関数

コード説明：
  
```js
setHistory([...history, nextSquares]);
```
  
history が `[[null,null,null], ["X",null,null]]` で nextSquares が `["X",null,"O"]` の場合、新しい `[...history, nextSquares]` 配列は `[[null,null,null], ["X",null,null], ["X",null,"O"]]` になります。


## 過去の着手の表示 
React で複数のアイテムをレンダーするには：React 要素の配列を使うことができる。  
- state として着手履歴の配列である history がありますので、ここでそれを React 要素の配列に変換する。
- JavaScript では、配列を別の配列に変換するために、配列の map メソッド を使うことがでる。
- historyを *mapで変換*  して、画面上のボタンを表す **React要素の配列** にする。
  

## codeﾒﾓ 以降検討
```js
function Board():
```  
  

## ハマッタポイント
### 描画されない
historyのstateを配列で括弧っていなかった
- `Uncaught TypeError: Cannot read properties of null (reading '0')`
  - at calculateWinner (App.js:161:1)
  - at Board (App.js:50:1)
```js
- const [history, setHistory] = useState(Array(9).fill(null)); // before
+ const [history, setHistory] = useState([Array(9).fill(null)]); // update
```

```js
// at Board (App.js:50:1)
const winner = calculateWinner(squares);
// at calculateWinner (App.js:161:1)
if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { ... }// error
```

## key を選ぶ 
- リストをレンダーすると、**Reactは** レンダーされたリストの各アイテムに関するとある情報を保持します。
- そのリストが更新されると、React は何が変更されたのかを判断する必要があります。
  - リストのアイテムを *追加、削除、並べ替え、更新* を行ったのかもしれません。
- データがデータベースから取得されている場合　データベース ID を key として使用できます。 
- *key が props として渡されているかのように見えます* が、key は **Reactが** 自動的に使用して、どのコンポーネントを更新するかを自動的に決定します。
  - 子コンポーネント側が、親コンポーネントが指定  した key が何であるかを知る方法はありません。
- key はグローバルに一意である必要はなく、コンポーネントとその兄弟間で一意であれば十分です。

key が指定されていない場合、React はエラーを報告し、デフォルトでは配列のインデックスを key として使用します。  
**配列のインデックスを key として使用する** と、リストの項目を並べ替えたり、挿入・削除したりする際に *問題が生じます*。  
明示的に key={i} を渡すとエラーを止めることはできますが、配列のインデックスを使うのと同じ問題になるだけですので、ほとんどの場合お勧めできません。


## タイムトラベルの実装 
**着手は** 並び変わったり、削除されたり、途中に挿入されることは **ない** ため、手番のインデックスを key として使用することは安全です。  

**TODO:**
- 現在ユーザが見ているのが何番目の着手であるのかを管理させる必要があります。
  - これを行うために、currentMove という名前の新しい state 変数を定義し、デフォルト値を 0 に設定
  - currentMove を変更する数値が偶数の場合は、xIsNext を true に設定します。

### 過去に戻ってその時点から新しい着手を行う場合
- その時点までの履歴を維持して残りは消去したいでしょう。
- nextSquares を history のすべての履歴（... スプレッド構文）の後に追加するのではなく、履歴の一部である `history.slice(0, currentMove + 1)` の後に追加するようにして、履歴のうち着手時点までの部分のみが保持されるようにします。
- 着手が起きるたびに、最新の履歴エントリを指し示すように currentMove を更新する必要があります。


## 最後のお掃除 
- currentMove が偶数のときは常に xIsNext === true であり、currentMove が奇数のとき xIsNext === false である
  - currentMove の値さえ知っていれば、xIsNext が何であるべきなのかも常に分かるということ
- これらを両方とも state に格納する理由はありません。実際、冗長な state は常に避けるようにしてください。state に格納するものを単純化すると、バグが減り、コードが理解しやすくなります。
  - xIsNext を別の state 変数として保存するのではなく、currentMove に基づいて求めるように Game を変更しましょう。
- xIsNext の state 宣言や setXIsNext の呼び出しはもはや必要ありません。


## まとめ 
- 三目並べをプレイできる
- プレーヤがゲームに勝ったときにそれを判定して表示する
- ゲームの進行に伴って履歴を保存する
- プレーヤがゲームの履歴を振り返り、盤面の以前のバージョンを確認できる

---
2024年8月26日
- Chromeエクステンションは 結構javascript読み込んでた。
  - 検証 > Sources > Content scripts

