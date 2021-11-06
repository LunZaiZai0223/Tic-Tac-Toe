# Tic-Tac-Toe
## 專案網址及預覽
**now version 2**
<img width="1263" alt="螢幕快照 2021-11-06 17 31 28" src="https://user-images.githubusercontent.com/77038018/140605285-18163a01-d753-42c0-9fa1-3bd9a25553fc.png">

<img width="1264" alt="螢幕快照 2021-11-06 17 31 57" src="https://user-images.githubusercontent.com/77038018/140605289-ff0982c6-c3b9-4750-9c82-1d695951fb36.png">

<img width="286" alt="螢幕快照 2021-11-06 17 32 25" src="https://user-images.githubusercontent.com/77038018/140605294-0783690d-b902-422f-8d1c-bc1c4bc18b5b.png">

*version 1*<br>
<img width="827" alt="螢幕快照 2021-11-04 15 23 16" src="https://user-images.githubusercontent.com/77038018/140273445-336a3fec-60c7-40ab-b62d-6ed7a8588035.png">

https://lunzaizai0223.github.io/Tic-Tac-Toe/

## 專案介紹
此專案是完成課程 THE ODIN PROJECT 中的 [PROJECT: TIC TAC TOE](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/tic-tac-toe) 的結果。

### 使用技術
純 JavaScript, CSS 及 HTML 開發。
第一次使用 Module 及 Factory Function 的觀念實作，之後做任何專案都要強迫自己用這樣子的方式實作。

### 參考資訊
- 功能參考自：https://sultanbadri.github.io/tic-tac-toe/
- CSS 實作 OOXX：[Build Tic Tac Toe With JavaScript - Tutorial](https://www.youtube.com/watch?v=Y-GkMjUZsmM)
- Module：[The Odin Project- Tic Tac Toe 打造一個無法被擊倒的圈圈叉叉AI](https://97ssps30212.medium.com/the-odin-project-tic-tac-toe-6844b372287b)

感謝大神們的分享。

### 功能
- 可選擇兩人遊戲或者獨自與 AI 遊戲
- RWD

## 時程
- 2021/11/01 開始專案
- 2021/11/04 完成 version 1
- 2021/11/06 完成 version 2
   - 版面更新
   - JS 有分制定規則的 `Game Module`、負責操控 DOM 的 `DomController Module` 以及玩家物件的藍圖 `PlayerFactory Factory Function`
   - 因為是用 CSS `class` 當作標記，把 `nodeList` 轉為 `array` 後用 `forEach` 迭代判別有沒有達到勝利，所以在 `DomController Module` 內有判定勝負的 `_checkWinner` 以及判斷平手的 `_isDraw`

## 預計實作
- 記錄玩家的勝利次數
- 版面優化 （done, version 2)
- 代碼整理
