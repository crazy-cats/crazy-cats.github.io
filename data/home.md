# What is CrazyCat

CrazyCat is a PHP framework based on Composer.

- It is built as Model-View-Controller (MVC) pattern
- It is built with dependency injection
- It is flexible for development by customizing modules
- It supports multiple languages by nature
- It is open source and follows the GNU General Public License Version 3


# Why Composer

Composer is a tool for dependency management in PHP. It helps us to install and update libraries and the related dependency which are used in the project.

We can make focus on the business logic while using a number of libraries, instead of wasting time on processing the dependencies and conflicts.

For more details please check <https://getcomposer.org>.


# Why Dependency Injection

In a single entry point framework, we always use some singletons such as event manager, module manager, cache manager, database manager etc..

It is more simple to get a correct singleton, and more flexible to override an existing singleton with Dependency Injection.

