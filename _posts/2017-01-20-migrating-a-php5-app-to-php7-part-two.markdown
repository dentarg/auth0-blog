---
layout: post
title: "Migrating a PHP 5 App to PHP 7 (Rundown of PHP 7 Features) - Part 2"
description: "Take a look at the PHP 7 features and learn how they can help you in migrating your PHP 5 projects."
date: 2017-01-20 8:30
category: Technical Guide, PHP, Migration
author:
  name: "Prosper Otemuyiwa"
  url: "http://twitter.com/unicodeveloper?lang=en"
  mail: "prosper.otemuyiwa@auth0.com"
  avatar: "https://en.gravatar.com/avatar/1097492785caf9ffeebffeb624202d8f?s=200"
design:
  image: https://cdn.auth0.com/blog/migration/PHPlogo.png
  bg_color: "#312A4C"
tags:
- php5
- php7
- migrate
related:
- 2016-11-07-migrating-an-angular-1-app-to-angular-2-part-1
- 2016-11-09-migrating-an-angular-1-app-to-angular-2-part-2
---


**TL;DR:** Many PHP applications are still running on PHP 5.x, not ready to take full advantage of the awesome features that PHP 7 offers. A lot of developers have not made the switch because of certain fears of compatibility issues, migration challenges and the strange awkward feeling that migrating will take away a big chunk of their time. In the [first part of this tutorial](#link-to-part-1) we learned how to set up a PHP 7 development environment. This time, we'll go learn about all the new PHP 7 features and how you can leaverage them when migrating your php 5 app to PHP 7.

---

## PHP 7 Features

### Scalar Type Declaration

With PHP 5, you could typehint a function parameter with Classes, Interfaces, callable and array types only. For example, if you want a parameter of a certain type `string` to be passed into a function, you would have to do a check within the function like so:

```php

// php 5
function getBookNo($number) {
    if (! is_integer($number)) {
        throw new Exception("Please ensure the value is a number");
    }

    return $number;
}

getBookNo('boooks');

```

PHP 7 eliminates the need for the extra check. With PHP 7, you can now typehint your function parameters with `string`, `int`, `float`, and `bool`.

```php

// PHP 7
function getBookNo(int $number) {
    return $number;
}

getName('boooks');

// Error raised
PHP Fatal error:  Uncaught TypeError: Argument 1 passed to getBookNo() must be of the type integer, string given, called in ....
```
PHP 7 will throw a Fatal error as seen above once you typehint with scalar values. 

### Strong Type Check

By default, PHP 5 and 7 allow for coercion when dealing with operations such as numeric strings. An example is this:

```php

function getBookNo(int $number) {
    return "This is it: " . $number;
}

echo getBookNo("8"); 

// Result
This is it: 8
```

I passed in a string and it concerced it to an integer and allowed it to run successfully. Now in PHP 7, you can be strict and ensure no form of automatic conversion occurs by declaring a strict mode at the top of your php file like so:

```php
declare(strict_types=1);

function getBookNo(int $number) {
    return "This is it: " . $number;
}

echo getBookNo("8"); 

// Result
PHP Fatal error:  Uncaught TypeError: Argument 1 passed to getBookNo() must be of the type integer, string given, called in ......

```

In PHP 5, if you pass in a float value, it automatically strips out the decimal parts and leave you with an integer. Now in PHP 7, If you pass in a float value too, it will throw a Fatal error. When building a financial application, this feature comes in handy! 

Remember something like this in JavaScript? where you have to write `use "strict";` at the top of your JavaScript file.

### Return Type Declaration

PHP 7 supports return types for functions. This feature has been available in several strongly typed languages for a long time. Now, you can easily enforce a function to return a certain type of data like so:

```php

function divideValues(int $firstNumber, int $secondNumber): int {
    $value = $firstNumber / $secondNumber;
    return $value;
}

echo divideValues(8, 9);

// Result
0
```

In the function above, we want the return value to be an integer, regardless of whatever the division turns out to be. Now the default weak(coercive) type checking in PHP comes to play again here. The value returned should be a float and it should throw a Fatal Type Error but it is automatically coerced into an integer.

Enable strict mode by placing `declare(strict_types=1);` at the top of the file and run it again. It should throw a PHP Fatal Type error like so:

```bash

PHP Fatal error:  Uncaught TypeError: Return value of divideValues() must be of the type integer, float returned in .....

```

### Spaceship Operator

PHP 7 ships with a new operator, **<=>**,  for simplifying the evaluation of arithmetic operations. With this operator, it is easier to evaluate less than, equal to, or greater than. The results will either be -1, 0 or 1. Ruby and PERL programmers are familiar with this operator.

This is how it works. If we have two operands $x and $y, and we do `$x <=> $y`, then

* if $x is less than $y, the result will be -1
* if $x equals $y, the result will be 0
* if $x is greater than $y, the result will be 1

```php

function evaluate($x, $y) {
    return $x <=> y;
}

evaluate(9, 8);

// Result
1

```

Good real world cases for this operator is in the simplification of comparison methods and using it for switch operations like so:

```php

$data = [
   ['name' => 'Ado', 'cars' => 2],
   ['name' => 'Tony', 'cars' => 4],
   ['name' => 'Ramirond', 'cars' => 3],
   ['name' => 'Woloski', 'cars' => 12]
];

function sortByCars($x, $y) {
    return $x['cars'] <=> $y['cars'];
}

usort($data, 'sortByCars');

print_r($data);

// Result
Array
(
    [0] => Array
        (
            [name] => Ado
            [cars] => 2
        )

    [1] => Array
        (
            [name] => Ramirond
            [cars] => 3
        )

    [2] => Array
        (
            [name] => Tony
            [cars] => 4
        )

    [3] => Array
        (
            [name] => Woloski
            [cars] => 12
        )

)
```

It sorted the array easily with less code. Without the spaceship operator, I would have to write the `sortByCars` method like so:

```php

function sortByCars($x, $y)
{
    if ($x['cars'] == $y['cars']) {
        return 0;
    }

    return ($x['cars'] < $y['cars']) ? -1 : 1;
}

```

### Array Constants

Before now, constants defined with the `define()` method can only accept scalar values. In PHP 7, you can have constant arrays using the `define()` method like so:

```php

// PHP 7
define('CARS', [
    'fine' => 'Mercedes',
    'strong' => 'Volkswagen',
    'ugly' => 'chevrolet'
]);

echo CARS['fine'];

// Result
Mercedes

```

### Group Use Declarations

Group use declaration helps make the code shorter and simpler. Before now, if you are trying to use multiple classes, functions and constants from the same namespace, you have to write it like so:

```php

// PHP 5
namespace Unicodeveloper\Emoji;

use Unicodeveloper\Emoji\Exceptions\UnknownMethod;
use Unicodeveloper\Emoji\Exceptions\UnknownEmoji;
use Unicodeveloper\Emoji\Exceptions\UnknownUnicode;
use Unicodeveloper\Emoji\Exceptions\UnknownIsNull;
use function Unicodeveloper\Emoji\Exceptions\checkForInvalidEmoji;
use const Unicodeveloper\Emoji\Exceptions\INVALID_EMOJI;

class Emoji {

}

```

With PHP 7, you can group them like so:

```php

// PHP 7
namespace Unicodeveloper\Emoji;

use Unicodeveloper\Emoji\Exceptions\{ 
    UnknownMethod, UnknownEmoji, UnknownUnicode, IsNull, function checkForInvalidEmoji, const INVALID_EMOJI };

class Emoji {
    
}

```

### Anonymous Classes

An Anonymous class is essentially a local class without a name. Anonymous classes offer the ability to spin up throwaway objects. These objects have closure-like capabilities. An anonymous class is defined like so:

```php

new class($constructor, $args) {
    
}

```

A real world case is a situation where you want to have objects that implement some interfaces on the fly, rather than having several files, where you have to define the class and then instantiate it, you can leverage anonymous classes like so:

```php

$meme = new class implements MemeInterface {
    public function memeForm($form) {
      return $form;
    }
};

$app = new App($meme);

```

### Enhanced Unicode Support

In PHP 7, all you need is the hexadecimal code appended to "\u" and you'll have your symbol/emoji as an output. An example is this:

```php

function getMoney() {
    echo "\u{1F4B0}";
}

getMoney();

// Result
💰

```

The enhancements were made possible from the [Unicode Codepoint Escape Syntax RFC](https://wiki.php.net/rfc/unicode_escape).

Now, you can also get the name equivalent of the unicode character, say "\u{1F4B0}" via the new `IntlChar` class like so:

```php

echo IntlChar::charName("\u{1F4B0}");

```
You can get the character from the name like so:

```php

var_dump(IntlChar::charFromName("LATIN CAPITAL LETTER A"));
var_dump(IntlChar::charFromName("SNOWMAN"));
var_dump(IntlChar::charFromName("TURTLE"));

```

> **Note:** The IntlChar class contains about 600 constants and 59 static methods.

This was made possible from the [IntlChar RFC](https://wiki.php.net/rfc/intl.char). The PHP manual has extensive documentation on [IntlChar](http://php.net/manual/en/class.intlchar.php) class.

### Null Coalescing Operator

The purpose of this new operator, **??**, is to allow developers to set values from user inputs without having to check if the value has been set. Before PHP 7, this is how you evaluate input. Check this out:

```php

$occupation = isset($_GET['occupation']) ? $_GET['occupation'] : 'bricklayer';

```

If the value of `$_GET['occupation']` exists, it returns the value else it assigns `bricklayer` to the $occupation variable.  In PHP 7, you can simply shorten that line of code using the **??** operator like so:

```php

// PHP 7
$occupation = $_GET['occupation'] ?? 'bricklayer';

```

It automatically checks whether the value is set and assigns the value to `$occupation` variable if it is, else it returns `bricklayer`.

The Null coalescing operator also allows you to chain expressions like so:

```php

// PHP 7

$_ENV['occupation'] = 'software engineer';

$occupation = isset($_GET['occupation']) ?? $_ENV['occupation'] ?? 'bricklayer';

// Result
software engineer

```
This will assign the first defined value to the `$occupation` variable.

### Closure on Call

There is now a better and more performant way of binding an object scope to a closure and calling it. Before PHP 7, you would bind an object to a closure like so:

```php

class NameRegister {
    private $name = "Prosper";
}

// Closure
$getName = function() {
    return $this->name;
};

$getTheName = $getName->bindTo(new NameRegister, 'NameRegister');
echo $getTheName();

```

With PHP 7, you now have a `call` method on the Closure class. So you can bind an object to a closure easily like so:

```php

class NameRegister {
    private $name = "Prosper";
}

$getName = function() {
    echo $this->name;
};

$getName->call(new NameRegister());

```

Check out the [PHP Manual: Closure::call](https://secure.php.net/manual/en/closure.call.php) for more information. 

### Expectations and Assertions

Assertions are a debugging and development feature. The `assert()` function in PHP 7 is now a language construct, where the first parameter can also be an expression instead of just been a string or boolean. They have been optimized to have zero cost in production. You can now enable or disable assertions from the PHP_INI file like so:

```php

zend.assertions = 1 // Enable assertion
zend.assertions = 0 // Disable assertion 
zend.assertions = -1 // (production mode), don't generate or execute code

```

Assertions can now throw an Exception when it fails. You can enable that from the INI file like so:

```php

assert.exceptions = 1 // Throw exceptions

// or

assert.exceptions = 0 // Issue warnings, which has always been the case.

```

The `assert()` can now take in two arguments where the second argument is a custom error message. It can also be an instance of an `Exception`. An example is shown below:

```php

class ProjectException extends AssertionError {}

public function checkAuthenticityOfProject() {
    
    /* ... */

    assert('$project instanceof \Unicodeveloper\Project', new ProjectException('$project was not a Project object'));
}

```

> **Note:** With this new feature, you might not need to depend on assertion libraries anymore while developing and testing your code.

Check out the [Expectations RFC](https://wiki.php.net/rfc/expectations) for more information.

### Error Handling

Many fatal and recoverable fatal errors have been converted to exceptions in PHP 7. Most errors are now reported by throwing `Error` exceptions. The `Exception` class now implements a `Throwable` Interface.

_Hierarchy_

\Throwable
├── \Exception (implements \Throwable)
│   ├── \LogicException
|   │   │ \BadFunctionCallException
│   |   |  └── \BadMethodCallException
│   │   |── \DomainException
|   |   ├── \InvalidArgumentException
|   |   ├── \LengthException
|   |   └── \OutOfRangeException
│   │  
│   |   
|   └── \RuntimeException
│       ├── \OutOfBoundsException
│       ├── \OverflowException
│       ├── \RangeException
│       ├── \UnderflowException
│       └── \UnexpectedValueException
└── \Error (implements \Throwable)
    ├── \AssertionError
    ├── \ArithmeticError
    ├── \DivisionByZeroError
    ├── \ParseError
    └── \TypeError

So you can catch specific Errors  like so:

```php

try {
    // evaluate something
} catch (\ParseError $e) {
   // do something
}

```

Earlier in this article, we were evaluating scalar type hinting and PHP 7 threw TypeErrors. Remember? Yes, that's how cool PHP 7 is now!

In PHP 7.1, you can catch multiple errors and exceptions in one catch block like so:

```php

try {
   // Some code...
} catch (ExceptionTypeA | ExceptionTypeB | ExceptionTypeC $e) {
   // Code to handle the exception
} catch (\Exception $e) {
   // ...
}

```

This is particular useful when one method throws different type of exceptions that you can handle the same way.

> **Note:** A new `error_clear_last()` method has been added to clear the most recent error. Once used, calling `error_get_last()` will be unable to retrieve the most recent errors.

Check out the [Catching Multiple Exception Types](https://wiki.php.net/rfc/multiple-catch) RFC.

### Integer Division

PHP 7 introduced a new function `intdiv()` which returns the result of an integer division operation as int.

```php

// PHP 7
$result = intdiv(10, 4);

// Result:
2

```

### Regular Expressions

Handling regular expressions just got easier in PHP 7. A new `preg_replace_callback_array()` function has been added to perform a regular expression search and replace using callbacks.

```php

$message = 'Haaaalaaaaaa, Girls and people of Instagrant';

preg_replace_callback_array(
    [
        '~[a]+~i' => function ($match) {
            echo strlen($match[0]), ' matches for "a" have been found';
        },
        '~[b]+~i' => function ($match) {
            echo strlen($match[0]), ' matches for "b" found';
        },
        '~[p]+~i' => function ($match) {
            echo strlen($match[0]), ' matches for "p" found';
        }
    ],
    $message
);


// Result
4 matches for "a" have been found
6 matches for "a" have been found
1 matches for "a" have been found
1 matches for "a" have been found
1 matches for "a" have been found
1 matches for "p" found
1 matches for "p" found

```

### Filtered unserialize()

The `unserialize()` function has been existing since PHP 4. It allows you to take a single serialized variable and convert back into a PHP value.

In PHP 7, the **options** parameter has been added. You can now whitelist classes that can be unserialized like so:

```php

// converts all objects into __PHP_Incomplete_Class object
unserialize($obj, ["allowed_classes" => false]);

// converts all objects into __PHP_Incomplete_Class object except those of FirstClass and SecondClass
unserialize($obj, ["allowed_classes" => ["FirstClass", "SecondClass"]]);

// default behaviour (same as omitting the second argument) that accepts all classes
unserialize($obj, ["allowed_classes" => true]);

```

It was introduced to enhance security when unserializing objects on untrusted data.

> **Note:** In PHP 7.1, the `allowed_classes` element of the **options** parameter is now strictly typed. `unserialize()` returns false if anything other than an array or boolean is given.

### Cryptographically Secure Pseudorandom Number Generator (CSRPNG)

`random_bytes()` and `random_int()` have been added to the CSRPNG functions in PHP 7.

* `random_bytes()` returns a random string of a given length
* `random_int()` returns a random integer from a range

```php

random_bytes(12);

random_int(0, 5000);

```

### Generator Delegation and Return Expressions

Generators were introduced in PHP 5.5. Prior to PHP 7, if you tried to return anything, an error would be thrown. Now, you can use a `return` statement within a generator.

You can get the returned value by calling the `Generator::getReturn()` method. Look at the code below:

```php

$square = function (array $number) {
    foreach($number as $num)
    {
        yield $num * $num;
    }  

    return "Done calculating the square. What next?";  
};

$result = $square([1,2,3,4,5]);

foreach($result as $value)
{
  echo $value . PHP_EOL;
}

echo $result->getReturn(); // grab the return value

// RESULT
1
4
9
16
25
Done calculating the square. What next?

```

Generators can now delegate to another generator by using `yield from` like so:

```php

unction square(array $number) {
    foreach($number as $num)
    {
        yield $num * $num;
    }  

    yield from addition($number); 
};

function addition(array $number) {
    foreach($number as $num)
    {
        yield $num + $num;
    }  
}

foreach(square([1,2,3,4,5]) as $value)
{
  echo $value . PHP_EOL;
}

// Result
1
4
9
16
25
2
4
6
8
10

```

### session_start config enhancements

The `session_start()` method now accepts an array of values that can override the session config in php.ini file.

`session.lazy_write` which is on by default can be turned off by explicitly stating it in the `session_start()` method like so:

```php

session_start([
    'lazy_write' => false,
    'cache_limiter' => 'private'
]);

```

### Unpack objects with list()

The `list()` language construct now allows you to unpack objects implementing the *ArrayAccess* interface.

```php

$fruits = new ArrayObject(['banana', 'mango', 'apple']); 

list($a, $b, $c) = $fruits;

echo $a. PHP_EOL;
echo $b. PHP_EOL;
echo $c. PHP_EOL;

// Result
banana
mango
apple

```

> **Note:** In PHP 7.0.0 list() expressions can no longer be completely empty.
In PHP 5, list() assigns the values starting with the right-most parameter. In PHP 7, list() starts with the left-most parameter. This is true when working with arrays with indices.

### Accessing Static Values

In PHP 5.x, if you try to access a static value like so:

```php

class Auth0 { 
    static $lock = 'v10'; 
}

echo 'Auth0'::$lock;

// Result
Parse error: syntax error, unexpected '::' (T_PAAMAYIM_NEKUDOTAYIM), expecting ',' or ';' in .....

```

Now, In PHP 7.x, it throws no error, it simply works!

```php

// PHP 7

class Auth0 { 
    static $lock = 'v10'; 
}

echo 'foo'::$lock;

// Result
v10

```

### dirname() enhancement

The `dirname()` in PHP 5 returns a parent directory's path. In PHP 7.0.0, an optional *levels* parameter has been added to the function to allow you as developer determine how many levels up you want to go when getting a path.

```php

$path = '/Unicodeveloper/source/php-workspace/laravel/vavoom';

dirname($path, 3);

// Result
/Unicodeveloper/source

```

### Uniform Variable Syntax

This brings a much needed change to the way variable-variable expressions are constructed.

### Reserved Words

PHP 7 now allows globally reserved words such as `new`, `private`, `for` as property, constant, and method names within classes, interfaces, and traits.

```php

class Car {

    private $type, $who, $costs;

    public function new($carType) {
        $this->type = $carType;
        return $this;
    }

    public function for($who) {
        $this->who = $who;
        return $this;
    }

    public function costs($price) {
        $this->price = $price;
        return $this;
    }

    public function __toString() {
        return $this->type . ' ' . $this->who . ' ' . $this->price. PHP_EOL;
    }
}

$car = new Car();
echo $car->new('Mercedes Benz')->for('Wife')->costs(14000);

// Result
Mercedes Benz Wife 14000

```

### Reflection API Enhancements

PHP 7 introduces two new reflection classes. One is the `ReflectionGenerator` class that reports information about generators and the other is the `ReflectionType` class that reports information about a function's return type.

_ReflectionType API_

* `ReflectionType::allowsNull` — Checks if null is allowed
* `ReflectionType::isBuiltin` — Checks if it is a built-in type
* `ReflectionType::__toString` - gets the parameter type name

_ReflectionGenerator API_

* `ReflectionGenerator::__construct` — Constructs a ReflectionGenerator object
* `ReflectionGenerator::getExecutingFile` — Gets the file name of the currently executing generator
* `ReflectionGenerator::getExecutingGenerator` — Gets the executing Generator object
* `ReflectionGenerator::getExecutingLine` — Gets the currently executing line of the generator
* `ReflectionGenerator::getFunction` — Gets the function name of the generator
* `ReflectionGenerator::getThis` — Gets the $this value of the generator
* `ReflectionGenerator::getTrace` — Gets the trace of the executing generator

Two new methods have also been added to the `ReflectionParameter` and `ReflectionFunctionAbstract` classes.

_ReflectionParameter API_

* `ReflectionParameter::hasType` -  Checks if parameter has a type
* `ReflectionParameter::getType` - Gets a parameter's type

_ReflectionFunctionAbstract API_

* `ReflectionFunctionAbstract::hasReturnType` - Checks if the function has a specified return type.
* `ReflectionFunctionAbstract::getReturnType` — Gets the specified return type of a function







```php

class ReflectionType {
    
}



### Deprecated Features

Using deprecated features in PHP will trigger an `E_DEPRECATED` error. 

* PHP 4 Style constructors are deprecated, and will be removed in the future. An example of a PHP 4 style of writing constructors(having the same name with the class) is this:

```php

class Economy {
    function economy() {
        /* ... */
    }
}

```

* Static calls to methods that are actually not *static* are deprecated.

```php

class Economy {
    function affordPrimaryEducation() {
        echo 'I think I might not be able to afford it with this economy';
    }
}

Economy::affordPrimaryEducation();

// Result
Deprecated: Non-static method Economy::affordPrimaryEducation() should not be called statically in ......

```

* The salt option for the `password_hash()` function has been deprecated to prevent developers from generating their own salts which are mostly insecure.

* The `capture_session_meta` SSL context option has been deprecated. `stream_get_meta_data()` can now be used to get SSL metadata.

* The `ldap_sort()` function has been deprecated.

* The alternative PHP tags shown below have been removed:

    _PHP Script tags_

    ```js

    <script language="php"> 
    </script>

    ```

    _PHP ASP tags_

    ```php

    <% %>

    ```

### Backward Incompatible Changes

Here are backward incompatible changes you should be aware of:

* *set_exception_handler()* is no longer guaranteed to receive Exception objects
* Internal constructors always throw exceptions on failure: Prior to PHP 7, some internal classes would return **NULL** when the constructor failed. Now, they will throw an *Exception*.
* Error handling for `eval()` should now include a catch block that can handle the [ParseError](https://php.net/manual/en/class.parseerror.php) object.
* The almighty `E_STRICT` notices now have new behaviors. It's no longer too strict.

    ![E_Strict notice](https://cdn.auth0.com/blog/estrict/notice.png)

* `list()` can no longer unpack string variables. `str_split()` should be used when performing this form of operation.
* `global` can no longer accept *variable variables* unless you fake it by using the curly brace like so `global ${$foo->bar}`.
* An `E_WARNING` will be emitted and **NULL** will be returned when internal functions try to perform float to integer automatic conversions.
* Prefixing comments with `#` in `php.ini` file is no longer allowed. Only semi-colons(;) should be used.
* Dividing by 0 will emit an `E_WARNING` and also one of either `+INF`, `-INF`, or `NAN`.
* `$HTTP_RAW_POST_DATA` was deprecated in PHP 5.6.0 and finally removed in PHP 7.0.0. Use [php://input](https://php.net/manual/en/wrappers.php.php#wrappers.php.input) as a replacement.
* Switch statements can no longer have multiple default blocks. An **E_COMPILE_ERROR** will be triggered if you try to define more than one default block.
* Functions can not have multiple parameters with the same name. `function slap($hand, $hand, $strength)`. An **E_COMPILE_ERROR** will be triggered as a result of this function.
* Static calls made to a non-static method with an incompatible context will now result in the called method having an undefined `$this` variable and a deprecation warning being issued. 

You can check out the few other [PHP core functions](https://secure.php.net/manual/en/migration70.changed-functions.php) that have changed.

### Removed Extensions and SAPIs

The `ext/mysql`, `ext/mssql`, `ereg` and `sybase_ct` extensions have been removed. All the `mysql_` functions have been removed! You should either use the `ext/mysqli` extension or use the `ext/pdo` extension which is has an object-oriented API.

The `aolserver`, `apache`, `apache_hooks`, `apache2filter`, `caudium`, `continuity`, `isapi`, `milter`, `nsapi`, `phttpd`, `pi3web`, `roxen`, `thttpd`, `tux` and `webjames` SAPIs have been removed.



## Conclusion

We have successfully covered all the new features of PHP 7. It might be overwhelming at first because it is a major version with a lot of new features, and lots of deprecations.

Going over the rundown of all these features as highlighted in this article and using it as a handy reference will give you all the necessary information to migrate your PHP 5 apps to PHP 7.

Thanks to the PHP Manual and RFC documents. You can always reference them for more information.

In the next and final part of this series, we'll convert a small PHP 5 app to PHP 7 and measure the performance. 