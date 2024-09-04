import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    /**
     * 
      > true || false
      true
      > false || true
      true
      > false || false
      false
      > false || null
      null
      > null || false
      false
     */
    if (calculateWinner(squares) || squares[i]) { // false/null未選択の場合は右のコード勝利判定条件を実行。目視の場合は揃っているかどうか。
      return;
    }
    const nextSquares = squares.slice();
    /**
     * プレーヤの手番なのかを確認し交互に着手できるようにする。
     * - xIsNext（真偽値型）反転してstate保存。
     * マス目に既に X や O の値があるかどうかをチェック。空いているマス目にだけ X や O を追加できるようにする。
     * - 早期リターン (early return) 
     */
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);  // 盤面を更新
  }

  /**
   * ゲームが終了したことを知らせる。
   * - “Winner: X” または “Winner: O” というテキストを表示
   *   - status に 結果をテキストstringで保持する。
   * ゲームが続行中の場合は、次がどちらの手番なのか表示する。
   */
  const winner = calculateWinner(squares);
  let status;
  if (winner) { // “Winner: X” または “Winner: O” というテキストを表示
    status = "Winner: " + winner;
  } else { // ゲームが続行中の場合は、次がどちらの手番なのか表示する
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // any. ["X", "O", null, ...]
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // boolean. 手番の処理。先手“X”＝ture。
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // currentMove は jumpTo() 使用する 過去履歴の移動先の 変数。
    // currentMove + 1 は 履歴のうち着手時点までの部分のみが保持。
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // 盤面を更新反映
    setCurrentMove(nextHistory.length - 1); // 着手が起きるたびに、最新の履歴エントリを指し示すように currentMove を更新する必要があります。
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 大抵は、squares実際の配列の中身 が必要になりますが、今回の着手リストのレンダーで必要なのはインデックスの方move だけ.
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
      <ul>
        <li>
          📖react.dev:<a href="https://ja.react.dev/learn/tutorial-tic-tac-toe">Tutorial</a>
        </li>
        <li>
          my Github <a href="https://github.com/ka2yuki/react-tutorials">repository</a>
        </li>
      </ul>
    </div>
  );
}

/**
 * Return: string || null  
 *   - 'X'、'O' または null  
 * @param {*} squares
 * 勝者が決まった際やこれ以上ゲームを進められなくなった際に、そのように表示する。
 * - 実現するために、9 つのマス目の配列を受け取って勝者を判定し 'X'、'O' または null を返す。
 * - calculateWinner という名前のヘルパー関数を追加。
 */
function calculateWinner(squares) {
  /**
   * - square配列のインデックスの場合の勝利条件を配列で用意する。square index: 0~8
   * - 上記の配列をforで回す
   *     - このゲーム判定は文字
   *     - x or o < null
   *     - if( この判定内容 )： 
   *         - 文字の場合は後者が上書く
   *           - b は a で上書く
   *         - null:選択してない 場合は常に「選択してない」が上書く 
   *         - つまり：配列squareを３つの配列の条件でindex世界においては
   *             - 左側の[0,1,2,3,6]は真ん中の[1,3,4,5,7]を上書く
   *             - 右側の[2,5,6,7,8]はそのまま 
   *             - 結果は３つの値が全て同じ状況"x"もしくは"o"。で「左側」の位置の値が返却される。x・oはアイコン。
    "x" && "x" 
    > 'x'
    "x" && "o" 
    > 'o'
    "x" && null 
    > null
   */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]; // 勝利条件
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}