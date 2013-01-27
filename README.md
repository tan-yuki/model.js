model.js
========

### 0. 概要


このJavaScriptはOreilly社の
『[ステートフルJavaScript――MVCアーキテクチャに基づくWebアプリケーションの状態管理](http://www.oreilly.co.jp/books/9784873115542/)』
という本を参考に（というかほぼ丸写し）してModel部分の機能を実装しました。

はじめはこの本を元にMVCフレームワークを作ろうと考えていたのですが、
自分的にはModelの部分だけあればいいかなと思いModel部分のみの実装としました。

### 1. 前提条件

- [jQuery](https://github.com/jquery/jquery) (version >= 1.5)

### 2. 使い方

上記本を参考にしていただければ大丈夫かとは思いますが、持っていない人のために記載しておきます。


````
  // make Person Model
  var Person = Model.create();
  
  // set attributes
  Person.attributes = ['name', 'age', 'male'];
  
  // make Person record
  var person1 = Person.init({
    name: 'tanaka',
    age:  25,
    male: true
  });
  
  var person2 = Person.init({
    name: 'akiyama',
    age:  26,
    male: false
  });
  
  person1.save();
  person2.save();
  
  person1.id;   // (set guid)
  person1.name; // === 'tanaka'
  person1.age;  // === 25
  person1.male; // === true
  
  // search record
  Person.find(person1.id); // === person1
  Person.find(person2.id); // === person2
  
  // update record
  person1.name = 'sato';
  person1.save();
  
  Person.find(person1.id).name; // === 'sato'
  
````

##### 1.3 その他使い方いろいろ


