---
layout: post
title: "New Features for Developing AngularJS Applications - Part 1: Component-Based Architecture"
description: "Learn how to develop applications in AngularJS using a component-based architecture."
longdescription: "Learn about the latest recipes in building AngularJS applications. The use of component directives, one-way dataflow, advanced directives, single-slot and multi-slot transclusions, and lifecycle hooks."
date: 2018-04-24 08:30
category: Technical Guide, Frontend, AngularJS
design:
  image: https://cdn.auth0.com/blog/logos/angularjs.png
  bg_color: "#072858"
author:
  name: Prosper Otemuyiwa
  url: http://twitter.com/unicodeveloper?lang=en
  mail: prosper.otemuyiwa@auth0.com
  avatar: https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200
tags:
- angular
- angularjs
- identity
- auth0
- component
- authentication
- javascript
related:
- 2017-06-28-real-world-angular-series-part-1
- 2016-09-29-angular-2-authentication
- 2017-02-21-reactjs-authentication-tutorial
---

**TL;DR:** AngularJS 1.5+ has undergone major updates. In this article, you'll learn how to develop AngularJS applications using a component-based architecture and leverage the API changes that will help you write your AngularJS applications in an Angular(v2+) style.

The Component-based Architecture is prevalent in frontend development today. JavaScript Client-side frameworks such as React, Preact, Ember, Vue.js all advocate building applications in components. _Angular_ also popularly known as _Angular(v2+)_ which is a major rewrite of AngularJS is completely component-based.

{% include tweet_quote.html quote_text="The Component-based Architecture is prevalent in frontend development today." %}

A typical example of an application built applying the component architecture involves developing several features of the application as modules with reusable components. 

For example, let's use a Music Player application. A required feature for this product could be a Music Player widget. A developer designing their app in a component-based architecture style can model this feature as a *Module*.

Let's call it the _Music Player Widget_ Module. Inside the module, we can have the following components:

- _Music Search_ Component, `<music-search>`.
- _Music Playlist_ Component, `<music-playlist>`.
- _Currently Playing Song_ Component, `<music-currently-playing>`.

In a Component-based Architecture, we usually have _Parent_ and _Child_ components. The three individual components mentioned above can be referred to as _Child_ components wrapped up into a big component that will be known as the _Parent Component_ or _Root_ component. 

## The AngularJS .component() method 

The Angular team introduced the `.component()` method in AngularJS 1.5. This method allows developers to write their applications using the component-based architecture. How do we use the `.component()` ?

Before Angular 1.5, we only had directives, Angular directives such as `ngHide`, `ngHref`, `ngRepeat`, and custom directives. 

Directives are a unique and powerful feature that allows you create custom HTML-like tags, specific to your application. In this article, we'll examine a directive, and convert it to a component using the `.component()` method.

{% include tweet_quote.html quote_text="Directives are a unique and powerful feature that allows you create custom HTML-like tags, specific to your application" %}

```js
angular.module('tutorial', [])
  .directive('abacus', function abacus() {
    return {
      scope: {},
      bindToController: {
        count: '='
      },
      controller: function () {
        function increment() {
          this.count++;
        }
        function decrement() {
          this.count--;
        }
        this.increment = increment;
        this.decrement = decrement;
      },
      controllerAs: 'abacus',
      template: `
        <div>
          <input type="text" ng-model="$ctrl.count">
          <button type="button" ng-click="$ctrl.decrement();">-</button>
          <button type="button" ng-click="$ctrl.increment();">+</button>
        </div>
      `
    };
  });
```

The first step in converting the directive to a component is to change `.directive()` to `.component()`.

_directive_

```js
.directive('abacus', function abacus() {
  return {

  };
});
```

_component_

```js
.component('abacus', function abacus() {

});
```

Nice and simple. Essentially the return `{};` statement inside the `.directive()` becomes the Object definition inside `.component()`. Awesome!

## Bindings

In a `.directive()`, the scope property allows us to define whether we want to isolate the `$scope` or inherit it, this has now become a sensible default to always make our directives have isolated scope. So repeating ourselves each time just creates excess boilerplate. 

With the introduction of `bindToController`, we can explicitly define which properties we want to pass into our isolate scope and bind directly to the Controller.

With the bindings property on `.component()` we can remove this boilerplate and simply define what we want to pass down to the component, under the assumption that the component will have an isolated scope.

```js
// before
.directive('abacus', function abacus() {
  return {
    scope: {},
    bindToController: {
      count: '='
    }
  };
});

// after
.component('abacus', {
  bindings: {
    count: '='
  }
});
```

## Refactoring Controller Function

Nothing has changed in the way we declare controller, however it’s now a little smarter and has a default `controllerAs` value of `$ctrl`.

If we’re using a controller local to the component, we’ll do this:

    ```js
    // 1.4
    {
      ...
      controller: function () {}
      ...
    }
    ```

If we’re using another controller defined elsewhere, we’ll do this:

```js
// 1.4
{
  ...
  controller: 'SomeCtrl'
  ...
}
```

If we want to define `controllerAs` at this stage, we’ll need to create a new property and define the instance alias:

```js
// 1.4
{
  ...
  controller: 'SomeCtrl',
  controllerAs: 'vm'
  ...
}
```

This then allows us to use something like `vm.title` inside our template to talk to the instance of the controller. In AngularJS 1.5, we can do the following inside `.component()`:

```js
// 1.5
{
  ...
  controller: 'SomeCtrl as vm'
  ...
}
```

This helps us minimize our code by preventing the use of `controllerAs` property. However, we can add the `controllerAs` property to maintain backwards compatibility or keep it if that’s within your style for writing directives or components. 

There is another option that completely eliminates the need for `controllerAs`, and Angular automatically uses the property, `$ctrl`. For instance:

```js
.component('bet', {
  controller: function () {
    this.betNumber = 777;
  }
});
```

In the code above, there is no `controllerAs` property. In our template, controller defaults to `$ctrl`, so we can get the value of `777` in our template using `$ctrl.betNumber`.

Since there is no need for the `controllerAs` property, we can just have our directive refactored to a component like so:

```js
// before
.directive('abacus', function abacus() {
  return {
    scope: {},
    bindToController: {
      count: '='
    },
    controller: function () {
      function increment() {
        this.count++;
      }
      function decrement() {
        this.count--;
      }
      this.increment = increment;
      this.decrement = decrement;
    },
    controllerAs: 'abacus'
  };
});

// after
.component('abacus', {
  bindings: {
    count: '='
  },
  controller: function () {
    function increment() {
      this.count++;
    }

    function decrement() {
      this.count--;
    }

    this.increment = increment;
    this.decrement = decrement;
  }
});
```

## Templating Changes

Look at the code below, and how the template property is defined.

```js
.component('abacus', {
  bindings: {
    count: '='
  },
  controller: function () {
    function increment() {
      this.count++;
    }
    function decrement() {
      this.count--;
    }
    this.increment = increment;
    this.decrement = decrement;
  },
  template: `
    <div>
      <input type="text" ng-model="$ctrl.count">
      <button type="button" ng-click="$ctrl.decrement();">-</button>
      <button type="button" ng-click="$ctrl.increment();">+</button>
    </div>
  `
});
```

The template property can be defined as a function injected with `$element` and `$attrs` parameters. If the template property is a function then it needs to return a String representing the HTML to compile:

```js
{
  ...
  template: function ($element, $attrs) {
    // access to $element and $attrs
    return `
      <div>
        <input type="text" ng-model="$ctrl.count">
        <button type="button" ng-click="$ctrl.decrement();">-</button>
        <button type="button" ng-click="$ctrl.increment();">+</button>
      </div>
    `
  }
  ...
}
```

## One Way Data Binding

If you have been using AngularJS long enough, you will be accustomed to the two-data way binding it provides. However, in AngularJS 1.5+, there is a new one-way data binding that we can explore and also use to improve the performance of our AngularJS applications.

A new syntax expression for the one-way data binding is the use of `<` notation. For two-way data bindings, the `=` notation is used instead.

```js
{
  ...
  bindings: {
    firstObj: '<',
    secondObj: '='
  },
  ...
}
```

Check out a good example of one-way data binding below:

```js
var sample = {
  bindings: {
    firstObj: '<',
    secondObj: '<'
  },
  template: `
    <div class="section">
      <h4>
        One way Data binding Example
      </h4>
      <p>First Object: {{ $ctrl.firstObj }}</p>
      <p>Second Object: {{ $ctrl.secondObj }}</p>
      <a href="" ng-click="$ctrl.testDataBinding();">
        Change Values
      </a>
    </div>
  `,
  controller: function () {
    this.testDataBinding = function () {
      this.firstObj = 10;
      this.secondObj = {
        maxwell: {
          language: 'PHP',
          name: 'Jack Maxwell'
        }
      };
    };
  }
};

function ExampleController() {
  this.exfirstObj = 99;
  this.exSecondObj = {
    unicodeveloper: {
      language: 'JavaScript',
      name: 'Prosper Otemuyiwa'
    }
  };
  this.testDataBinding = function () {
    this.exfirstObj = 33;
    this.exSecondObj = {
      lesasote: {
        language: 'Scala',
        name: 'Shitta Kalesaso'
      }
    };
  };
}

angular
  .module('app', [])
  .component('sample', sample)
  .controller('ExampleController', ExampleController);
```

{% highlight html %}
{% raw %}
<div ng-app="app">
  <div ng-controller="ExampleController as example">
    <h3>
      One way data-binding
    </h3>
    <div class="section">
      <h4>
        Parent
      </h4>
      <p>
        First Object: {{ example.exfirstObj }}
      </p>
      <p>
        Second Object: {{ example.exSecondObj }}
      </p>
      <a href="" ng-click="example.testDataBinding();">
        Change Parent Values
      </a>
    </div>
    <sample firstObj="example.exfirstObj" secondObj="example.exSecondObj"></sample>
  </div>
</div>
{% endraw %}
{% endhighlight %}

One-way data binding allows changes to propagate down and flow into the component to update it with new data.

## LifeCycle Hooks

Lifecycle hooks shipped alongside the `.component()` method in AngularJS 1.5. These hooks are functions that can be invoked at different stages of a component's life in AngularJS apps. These hooks are:

- **$onInit()**
- **$onChanges()**
- **$onDestroy()**
- **$postLink()**


### $onInit()

The `$onInit()` hook is invoked when controllers have been constructed. It is used for initialization work for controllers. A typical example is populating a table or some form of list once a controller has been loaded.

```js
function MyController() {
  this.$onInit = function () {
    this.players = [{
        "name": "Lionel Messi",
        "club": "Barcelona",
        "jerseyNumber": 10,
        "position": "Forward",
      },
      ...

    ];
  };
}
```

{% highlight html %}
{% raw %}
  <div ng-repeat="player in players">
    <td>{{ player.name }}</td>
    <td>{{ player.club }}</td>
    <td>{{ player.jerseyNumber }}</td>
    <td>{{ player.position }}</td>
  </div>
{% endraw %}
{% endhighlight %}

### $onChanges()

Remember the old way of detecting changes with `$scope.$watch()`. In Angular 1.5, changes can be detected with the `$onChanges()` hook. When building components at one point you will have data coming into your component from an external source e.g parent component. With `$onChanges()`, we can react to this changes and update the child component data effectively.

Before we go ahead into examples it is important for us to understand, how, why and when this hook is called. `$onChanges` hook is called in two scenarios, one being during component initialization, it passes down the initial changes that can be used right away through `isFirstChange` method.

```js
$ctrl.onChanges = function (changes) { 
    if (changes.commit) {
        $ctrl.issues = openIssues(changes.commit.currentValue); 
        $ctrl.repo = createdRepos(changes.commit.currentValue);
    }
}
```

### $onDestroy()

This hook is called when its containing scope is destroyed. We can use this hook to release external resources, watches and event handlers. This is basically the same as `$scope.on($destroy, fn)` when used in controllers.

```js
function MyController($element) {
  
  var eventHandler = function () {
    /**
     * Write code here
     */
  };

  /**
   * [$onInit: Attach our eventHandler when the element is clicked]
   */
  this.$onPostLink = function () {
    // When the component DOM has been compiled attach you eventHandler.
  };

  /**
   * [$onDestroy: Destroy the eventHandler once the component is destroyed]
   */
  this.$onDestroy = function () {
    // Destroy all custom events or bindings when the component scope is destroyed.
  };
}
```

When our component is constructed, we attach a click event to the component element that does something to it when clicked, it can be wherever we want let's say show alert box saying I am clicked.

In the duration when this component is active we would be happy to have this event, but when this component is inactive, we don't need this event anymore it has to go. Since this is our custom event and it's not native to Angular, it will not be detached from our app along with the component, but it will be left snooping around for an element which does not exist.

We need to tell Angular through the `$onDestroy` hook that when this component is destroyed, the event should be detached too.

### $postLink()

This hook is called after the controller's element and its children have been linked. When the component elements have been compiled and ready to go, this hook will be fired.

```js
function MyController($element) {
  /**
   * When the element and its child nodes have been compiled
   */

  this.$postLink = function () {
    /**
     * Engineer something epic here
     */
  };

}
```

This hook can help us to implement some functionalities that depend on the component elements to be fully compiled. It is important to note that this is not a complete replacement for DOM manipulation, this functionality should be handled by decorator directives.


## Stateless components

There’s now the ability to create `stateless` components. This is essentially a component with no controller attribute.

```js
var Person = {
  bindings: {
    name: '<',
    age: '<',
    sex: '<'
  },
  template: `
    <div>
      <p>Name: {{ ::$ctrl.name }}</p>
      <p>Age: {{ ::$ctrl.age }}</p>
      <p>Age: {{ ::$ctrl.sex }}</p>
    </div>
  `
};

angular
  .module('app', [])
  .component('person', Person);
```

Use in a html file like so:

{% highlight html %}
{% raw %}
  <person name="prosper" age="14" sex="male"></person>
{% endraw %}
{% endhighlight %}


## Stateful Components

Stateful components are components that perform stateful tasks such as handling form data, making HTTP requests and generally manipulating data. In a stateful component, you can have a controller that loads a list of car items to display from an external service (API).

```js
var CarItems = {
  template: './car.html',
  controller: function($http) {
    var ctrl = this;
    // Initialising the component
    ctrl.$onInit = function() {
      $http.get('/api/carlistings').then(function (data) {
        ctrl.items = data;
      });
    };
  }
};

angular
  .module('app', [])
  .component('carItems', CarItems);
});
```

## Multi-slot Transclusions

In AngularJS, **transclusion** simply allows you to include content from one place into another template. In basic computer science definition, **transclusion** refers to the inclusion of part or all of an electronic document into one or more other documents by reference.

Multi-slot transclusions was one of the features included in Angular 1.5. How does this work? AngularJS 1.5+ allows us define multiple slots. A good case study is trying to create a generic `card` component. Something like:

{% highlight html %}
{% raw %}
  <card>
    <card-title>Great Title</card-title>
    <card-body>
      This is the body of the card component.
    </card-body>
  </card>
{% endraw %}
{% endhighlight %}

In the definition of the `<card>` component, the `<card-title>` and `<card-body>` elements are the transclusion slots that will be present in the component.

```js
app.component('card', {
  template: [
      '<div style="border: 1px solid black;">'
      '<div ng-transclude="title"></div>',
      '<div ng-transclude="body"></div>',
      '</div>'
  ].join(''),
  transclude: {
    title: 'cardTitle',
    body: '?cardBody'
  },
  controller: function() {
    // Render the component as a card
  }
});
```

**Note:** `?` signifies that the slot is optional.


## Conclusion

As we can see, AngularJS applications can be better with these features listed above. Much work has gone in to the project from the team to make it very similar to the way we write Angular apps using the component archictecture.

In the next and final part of this series, we'll build a sample application with AngularJS 1.5+ that harnesses somes of these features. Stay tuned!
