var Beverage = function(){}
Beverage.prototype.boilWater = function(){
    console.log('把水煮沸')
}
Beverage.prototype.brew = function(){
    //空方法，由子类重写
}
Beverage.prototype.pourInCup = function(){

}
Beverage.prototype.addCondiments = function(){

}
Beverage.prototype.init = function(){
    this.boilWater()
    this.brew()
    this.pourInCup()
    this.addCondiments()
}

//创建子类
var Coffee = function(){}
Coffee.prototype =new Beverage()

const coffee = new Coffee()
console.log(coffee instanceof Coffee)//true
console.log(coffee instanceof Beverage)//true

//instanceof的原理
function instance_of(L, R) { // L即per ；  R即Person
 
    var O = R.prototype; //O为Person.prototype
  
    L = L.__proto__;       // L为per._proto_
  
    while (true) {    //执行循环
  
         if (L === null)   //不通过
  
             return false;   
  
         if (O === L)       //判断：Person.prototype ===per._proto_？
  
              return true;  //如果等于就返回true，证明per是Person类型
  
         L = L.__proto__;                   
  
    }
  
 }  

//完全重写原型对象的话，虽然instanceof仍然正确，但是coffee.constructor 已经不是Coffee了
//手动设置的时候用Object.definePropery enumberable:false
//实例的对象只指向原型，而不指向构造函数
//实例的constructor属性去是搜索原型链使用原型链上的方法


function Person(){

}

//注意 friend = new Person() 代码写在原型对象下面不会报错
//P157 红宝书

//给原型添加方法的代码 一定要在替换原型对象之后 否在会被新的对象覆盖掉
var friend = new Person()

Person.prototype={
    constructor:Person,
    name:"xjm",
    age:25,
    sayName(){
        console.log(this.name)
    }
}


friend.sayName()