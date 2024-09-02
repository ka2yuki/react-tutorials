# Tutorial MEMO:note:
### README.md に メモする
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
  
history が [[null,null,null], ["X",null,null]] で nextSquares が ["X",null,"O"] の場合、新しい [...history, nextSquares] 配列は [[null,null,null], ["X",null,null], ["X",null,"O"]] になります。


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

---
2024年8月26日
- Chromeエクステンションは 結構javascript読み込んでた。
  - 検証 > Sources > Content scripts
---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
