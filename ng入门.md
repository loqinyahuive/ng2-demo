# Angular 入门以及组件传值问题

2016年9月底，谷歌发布了 Angular2 的正式版，可谓众望所归。相比 Angular1.x，Angular2 有了质的改变，组件化（Component）是它的核心灵魂。

下面我们一起来搭建这个 QuickStart 应用，让页面显示一条消息：”Welcome to ng2-demo!”。

---
<!-- page_number: true -->

# 1. 设置开发环境: node.js, npm, angular cli
    npm install -g @angular/cli

---

# 2. 创建一个新项目
	ng new ng2-demo

---
    
# 3. 为应用程序提供服务
    cd ng2-demo
    ng serve --open

---

# 4. 编辑第一个Angular组件

---

# 5. 项目文件介绍

app/app.component.{ts,html,css,spec.ts}:
定义AppComponentHTML模板，CSS样式表和单元测试。随着应用程序的发展，它将成为嵌套组件树的根组件。
app/app.module.ts:
定义AppModule，告诉Angular如何组装应用程序的根模块。现在它只声明了AppComponent。很快就会有更多的组件要申报。
assets/*:
在构建应用程序时，可以在其中放置图像和其他任何要复制的文件的文件夹。
environments/*:
此文件夹包含每个目标环境的一个文件，每个文件都导出要在应用程序中使用的简单配置变量。在构建应用程序时，文件会立即被替换。您可以使用与生产不同的API端点进行开发，也可以使用不同的分析令牌。你甚至可以使用一些模拟服务。无论哪种方式，CLI都涵盖了您。

---

favicon.ico:
每个网站都希望在书签栏上看起来不错。开始使用您自己的Angular图标。
index.html:
有人访问您的网站时提供的主HTML页面。大多数情况下，您永远不需要编辑它。CLI 在构建应用程序时自动添加所有文件js和css文件，因此您无需手动添加任何文件
main.ts:
您应用的主要入口点。使用JIT编译器编译应用程序， 并引导应用程序的根模块（AppModule）在浏览器中运行。您也可以使用AOT编译器 不通过传递改变任何代码--aot到ng build或ng serve
polyfills.ts:
不同的浏览器对Web标准有不同程度的支持。Polyfills帮助规范化这些差异。你应该对非常安全的core-js和zone.js，但一定要检查出的浏览器支持指南获取更多信息

---

styles.css:
你的全球风格就在这里。大多数情况下，您希望在组件中使用本地样式以便于维护，但影响所有应用程序的样式需要位于中心位置。
test.ts:
这是单元测试的主要入口点。它有一些可能不熟悉的自定义配置，但它不是你需要编辑的东西。
tsconfig.{app|spec}.json:
Angular app（tsconfig.app.json）和单元测试（tsconfig.spec.json）的TypeScript编译器配置。

----

# 6. Angular应用程序的基本构建块

模块(Module)
组件(Component)
模板(Template)
元数据(Metadata)
数据绑定:
```
<li>{{hero.name}}</li>
<hero-detail [hero]="selectedHero"></hero-detail>
<li (click)="selectHero(hero)"></li>
<input [(ngModel)]="hero.name">
```
指令(Directive)
```
<li *ngFor="let hero of heroes"></li>
<hero-detail *ngIf="selectedHero"></hero-detail>

```

---

服务(Service)

```
export class HeroService {
  private heroes: Hero[] = [];

  constructor(
    private backend: BackendService,
    private logger: Logger) { }

  getHeroes() {
    this.backend.getAll(Hero).then( (heroes: Hero[]) => {
      this.logger.log(`Fetched ${heroes.length} heroes.`);
      this.heroes.push(...heroes); // fill cache
    });
    return this.heroes;
  }
}

```

依赖注入

```
constructor(private service: HeroService) { }

```
---
# 7. 传值问题
### 父传子
### 子传父
### 兄弟组件传值
---
# 7.1 父传子
#### 首先父组件声明2个对象: name 和 price
```
股票: <input [(ngModel)]="name"/>
<br/>
金额: <input [(ngModel)]="price"/>

```
#### 子组件通过@Input接受父组件输入的值
```
  @Input()
  name: String;
  @Input()
  price: Number;
```
---
## error:
#### Can't bind to 'ngModel' since it isn't a known property of 'input'.
    app.module.ts: import { FormsModule } from '@angular/forms';
---
## 父传子属性绑定是单向的
#### 父组件可以改变子组件的值，子组件的改变并不会影响父组件
#### 现在我们要来验证这一结论, 将子组件的name值3秒后还原
```
setInterval(()=>{
      this.name='Apple'
    },3000)
```
---
# 7.2 子传父
#### 首先我们来定义一个子组件stock-price.

```
ng generate component stock-price
```
我们通过随机数模拟价格的变化
```
setInterval(() => {
      const current_price = 100 * Math.random();
      this.price = current_price;
    }, 1000);
```
```
{{price !== undefind ? price.toFixed(2) : ''}}
```
---
#### 接下来我们需要将price广播出去，谁需要谁订阅该消息
```
@Output()
  lastPrice: EventEmitter<Number> = new EventEmitter();
```
```
setInterval(() => {
      const current_price = 100 * Math.random();
      this.price = current_price;
      this.lastPrice.emit(this.price);
    }, 1000);
```
---
#### 父组件订阅消息
```
<app-stock-price (lastPrice)="priceHandle($event)"></app-stock-price>
```
```
priceHandle (event) {
    this.price = event.toFixed(2);
  }
```
---
总结： 通过输出属性发射事件，并通过事件携带数据，在父组件模版中通过事件绑定的方式来捕获并处理。
---
---
## 7.3: 非父子组件: 中间人模式
#### 子组件1广播price, 父组件订阅price传递给子组件2
---
参考链接： https://v2.angular.io/docs/ts/latest/guide/cheatsheet.html
