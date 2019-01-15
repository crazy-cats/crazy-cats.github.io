# Area

Area is a concept that aims to optimize organizing request processing. System points a request to a defined controller when it has a correct route, area is actually ***type of controller***.

System checks whether a request is come through HTTP or CLI and create related processor, this is process in `CrazyCat\Framework\App\Io\Factory`. For CLI request, system creates a `CrazyCat\Framework\App\Io\Cli\Request` instance to execute a CLI controller. For HTTP request, system creates a `CrazyCat\Framework\App\Io\Http\Request` instance to do further checking.

Different area of requests have different configurations.

In CrazyCat, there are five areas:


## api

CrazyCat supports Web API REST. When a request comes through HTTP and the URL is with `[base_url] + rest/V1/`, it is specified as API area.

Response of an API request must be a JSON string.


## backend

When a request comes through HTTP and the URL is with `[base_url] + [backend_route_name]`, it is specified as backend area.

The `backend_route_name` is set in `app/config/env.php`.


## frontend

When a request comes through HTTP is neither api nor backend area, it is specified as frontend area.


## cli

Developers and administrators usually do system update or debug with CLI, thoes requests are processed in CLI controllers.


## cron

CRON-jobs execute with CRON controllers.


# Module

A module is a logical group, that is, a directory containing blocks, controllers, helpers, models which are related to a specific business feature. 

In keeping with commitment to optimal modularity, a module encapsulates one feature and has minimal dependencies on other modules.

A module may exists in `app/modules` or `vendor` folders with standard file structure.


## Controller

A controller is a request processor.


## Block

Block is used to render contents which are shown in front-end or back-end.


## Model

Model is data processor, it handles loading, saving methods of data. One model is usually related to one type of data which is of one main table.

These are two types of model in CrazyCat, the general model and language model.


## Collection

Collection is short for model collection. It is a group of models with some handling methods.


# Theme

A theme may exists in `app/themes` or `vendor` folders with standard file structure.


# Stage

Only front-end request has a stage.

