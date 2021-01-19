# table-tennis-game

## play-mode
==========================
### battle
## ***comming later***

### rally challenge
## ***comming later***
==========================
## WIP
まだまだこれから！
### 目的
- amplifyを使ってみる
- Three.jsを使って3D表示をしてみる。
- Cannon.jsを使って物理シミュレーションのようなことをしてみる。

### 導入したもの
- Vue.js  
一番よく使っていたのでVueにしました。
- Three.js  
今回の目的！部分的にも使えるのでうまく使っていきたい！
- Cannon.js  
今回の目的！なかなか難しいところもあったけど、使いこなせたらいいな
- amplify  
今回の目的！めっちゃ便利だった！これからも利用したい！
- storybook  
componentの一覧がみやすくなるので入れてみたいなと
- jest  
（まだ使ってないのは内緒）
- husky  
commitやpushのタイミングで処理を挟むために使用
- lint-staged  
gitのstagedのファイルに特定の処理を行うために使用
### できること
- 画面をグリグリするとカメラの位置を変えられる
- scrollでズームイン、アウト
- 右下のコントローラーでラケットの位置を変えられる
- 左下のアクションボタンでボールがトスされる（最初のみ）
- ボールをトスした後にもう一度アクションボタンを押すと、ラケットが煽っているかのように台の周りを回り始める

### やろうとしたこと
- なるべく今後の開発でも取り入れたい環境は準備するようにした。
- atomic designに従ってcomponentを分けた。（めっちゃ少ないけど）
- Three.jsやCannon.jsはVue.jsに依存させず、jsファイルとして切り出した。
->Frameworkに依存させずReactとかでも流用できるようにしたかった。
->読み込みを1回で済ませたかった（各componentで読み込むと無駄に重くなるかな？...と）
結果: Three.js、Cannon.jsを探り探りやってたら中身ぐっちゃぐちゃになった。。。

## Project setup
```
yarn install
```
## Project start
### Compiles and hot-reloads for development
```
yarn serve
```
## StoryBook start
```
yarn storybook
```