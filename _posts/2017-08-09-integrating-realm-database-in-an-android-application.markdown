---
layout: post
title: Integrating Realm Database in an Android Application
description: Learn how to integrate the Realm mobile database in an Android application.
date: 2017-08-09 12:57
category: Technical Guide, Mobile, Android
author:
  name: Joyce Echessa
  url: https://twitter.com/joyceechessa
  mail: jokhessa@gmail.com
  avatar: https://s.gravatar.com/avatar/f820da721cd1faa5ef4b5e14af3f1ed5
design:
  bg_color: "#1C233F"
  image: https://raw.githubusercontent.com/echessa/various_learning/master/misc/realm_images/realm.png
tags: 
- android
- realm
- database
- mobile
- crud
- open source
related:
- 2017-07-27-authenticating-android-apps-developed-with-kotlin
- 2017-01-11-alternatives-to-native-mobile-app-development
---

## Introduction
The [Realm Mobile Database](https://realm.io/docs/get-started/overview/#the-realm-mobile-database) is a cross-platform database solution that can be used as an alternative to [SQLite](https://www.sqlite.org/) and [Core Data](https://developer.apple.com/reference/coredata). Compared to these two options, Realm is easier to set up and use. To perform the same operation in Realm, you usually end up writing fewer lines of code than you would with SQLite or Core Data. On performance, Realm is said to be faster and it also offers other modern features such as encryption, JSON support and data change notifications.

Unlike a traditional database, objects in Realm are native objects. You don’t have to copy objects out of the database, modify them, and save them back—you’re always working with the “live,” real object. If one thread or process modifies an object, other threads and processes can be immediately notified. Objects always stay in sync.

If your application needs to store user data to the cloud and have it synced on all devices used by the user, you can use the [Realm Mobile Database](https://realm.io/products/realm-mobile-database/) together with the [Realm Object Server](https://realm.io/docs/realm-object-server/) for this. In this article though, we are going to focus on the Realm Mobile Database. We are going to see how to integrate it into an Android app and perform the usual CRUD operations on it. We'll create a To Do application which will enable the user to create, edit and delete tasks from a list.

## Getting Started
To get started, first create an Android project (I named mine Tasky). You can use an IDE of your choice, but the tutorial will give instructions specific to [Android Studio](https://developer.android.com/studio/index.html).

Select a Basic Activity template for it and on the last window of the project creation wizard, change the **Activity Name** to `TaskListActivity`.

To add the Realm library to the project, first add the classpath dependency to the project level `build.gradle` file.

```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath "io.realm:realm-gradle-plugin:3.1.4"
    }
}
```

Then apply the realm-android plugin to the top of the application level `build.gradle` file.

```groovy
apply plugin: 'realm-android'
```

And add the following dependency in the same file. This isn't a requirement when working with Realm, but if your project is going to use Realm adapters, then you have to include the library. We'll use this later when we set up the ListView

```groovy
compile 'io.realm:android-adapters:2.0.0'
```

Sync the project's gradle files.

Before you can use Realm in your app, you must initialize a Realm. Realms are the equivalent of a database. They map to one file on disk and contain different kinds of objects. Initializing a Realm is done once in the app's lifecycle. A good place to do this is in an `Application` subclass.

Create a class named `TaskListApplication` and modify it as shown.

```java
package com.echessa.tasky;

import android.app.Application;

import io.realm.Realm;
import io.realm.RealmConfiguration;

public class TaskListApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Realm.init(this);
        RealmConfiguration realmConfig = new RealmConfiguration.Builder()
                .name("tasky.realm")
                .schemaVersion(0)
                .build();
        Realm.setDefaultConfiguration(realmConfig);
    }
}
```

In the above, we first initialize the Realm and then configure it with a `RealmConfiguration` object. The `RealmConfiguration` controls all aspects of how a Realm is created. The minimal configuration usable by Realm is `RealmConfiguration config = new RealmConfiguration.Builder().build();` which will create a file called `default.realm` located in `Context.getFilesDir()`.

In our configuration, we name the Realm file `tasky.realm` and set a version number on it.

In the manifest file, set this class as the name of the application tag.

```xml
<application
        android:name=".TaskListApplication"
```

Next open the `content_task_list.xml` layout file and replace the TextView with a ListView.

```xml
<ListView
        android:id="@+id/task_list"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
```

In the `activity_task_list.xml` file, change the icon on the FloatingActionButton by modifying its `srcCompat` attribute as shown.

```xml
app:srcCompat="@android:drawable/ic_input_add"
```

Add a layout file named `task_list_row.xml` to the `res/layout` folder that will specify the format of each row of the previously added ListView. Modify it as shown:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="horizontal"
              android:layout_width="match_parent"
              android:layout_height="match_parent"
              android:padding="10dp"
              android:layout_gravity="center_vertical">

    <TextView
        android:id="@+id/task_item_name"
        android:textSize="20sp"
        android:layout_weight="100"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

    <CheckBox
        android:id="@+id/task_item_done"
        android:focusable="false"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

</LinearLayout>
```

Next we'll create a model that will hold the data for each task.

## Creating a Realm Model

Inside your main package, add a package named `models` and create a class named `Task` inside that package. Add the following to the file.

```java
package com.echessa.tasky.models;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;
import io.realm.annotations.Required;

public class Task extends RealmObject {
    @Required
    @PrimaryKey
    private String id;
    @Required
    private String name;
    private boolean done;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }
}

```

In the above, we create a Realm model classe by extending the `RealmObject` base class. Realm supports the following field types: `boolean`, `byte`, `short`, `int`, `long`, `float`, `double`, `String`, `Date` and `byte[]` as well as the boxed types `Boolean`, `Byte`, `Short`, `Integer`, `Long`, `Float` and `Double`. Subclasses of `RealmObject` and `RealmList<? extends RealmObject>` are used to model relationships.

Each Task in our app will have a `name` which will be the description set for the task, a boolean `done` field that will indicate whether the task has been completed or not and a unique ID that will be used to identify the task.

The `id` and `name` fields are marked with a `@Required` annotation. This is used to tell Realm to enforce checks on these fields and disallow `null` values. Only `Boolean`, `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `String`, `byte[]` and `Date` can be annotated with Required. Fields with primitive types and the `RealmList` type are required implicitly while ones with `RealmObject` type are always nullable.

The `id` field is annotated with `@PrimaryKey`thus marking it as the primary key. Supported field types can be either string (`String`) or integer (`byte`, `short`, `int`, or `long`) and its boxed variants (`Byte`, `Short`, `Integer`, and `Long`). Using a string field as a primary key implies that the field is indexed (i.e. it will implicitly be marked with the annotation `@Index`). Indexing a field makes querying it faster, but it slows down the creation and updating of the object, so you should be careful about the number of fields in your object that you `@Index`.

String (`String`) and boxed integer (`Byte`, `Short`, `Integer`, and `Long`) Primary keys can have `null` values and so we also mark `id` with `@Required` to enforce a check.

## Working with RealmBaseAdapter

Our application will display the Task items in a ListView, and to work with this, we need an adapter that will manage the data model and adapt it to individual rows in the ListView.

Realm makes two adapters available that can be used to bind its data to UI widgets, in particular data coming from `OrderedRealmCollection` (`RealmResults` and `RealmList`, which we'll look at shortly, implement this interface). There is the `RealmBaseAdapter` for working with ListViews and `RealmRecyclerViewAdapter` for working with RecyclerViews.

To use any one of these adapters, you have to add the `io.realm:android-adapters:2.0.0` dependency in the application level Gradle file, which we've done.

To create an adapter, create a class named `TaskAdapter` and modify its contents as shown.

```java
package com.echessa.tasky;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ListAdapter;
import android.widget.TextView;

import com.echessa.tasky.models.Task;

import io.realm.OrderedRealmCollection;
import io.realm.RealmBaseAdapter;

public class TaskAdapter extends RealmBaseAdapter<Task> implements ListAdapter {

    private TaskListActivity activity;

    private static class ViewHolder {
        TextView taskName;
        CheckBox isTaskDone;
    }

    TaskAdapter(TaskListActivity activity, OrderedRealmCollection<Task> data) {
        super(data);
        this.activity = activity;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        final ViewHolder viewHolder;
        if (convertView == null) {
            convertView = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.task_list_row, parent, false);
            viewHolder = new ViewHolder();
            viewHolder.taskName = (TextView) convertView.findViewById(R.id.task_item_name);
            viewHolder.isTaskDone = (CheckBox) convertView.findViewById(R.id.task_item_done);
            viewHolder.isTaskDone.setOnClickListener(listener);
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }

        if (adapterData != null) {
            Task task = adapterData.get(position);
            viewHolder.taskName.setText(task.getName());
            viewHolder.isTaskDone.setChecked(task.isDone());
            viewHolder.isTaskDone.setTag(position);
        }

        return convertView;
    }

    private View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            int position = (Integer) view.getTag();
            if (adapterData != null) {
                Task task = adapterData.get(position);
                activity.changeTaskDone(task.getId());
            }
        }
    };
}
```

The above creates the View of row items. Each row will contain a TextView that will display the Task name and a Checkbox that will indicate whether a task has been completed or not. We use the View holder pattern to optimize performance by ensuring reuse of existing views.

We also add an OnClick listener to the view's checkbox that will be used to change the status of Task represented by that view.

In `TaskListActivity` add the following variable to the class.

```java
private Realm realm;
```

Then modify `onCreate()` as shown.

```java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_task_list);

    realm = Realm.getDefaultInstance();

    // RealmResults are "live" views, that are automatically kept up to date, even when changes happen
    // on a background thread. The RealmBaseAdapter will automatically keep track of changes and will
    // automatically refresh when a change is detected.
    RealmResults<Task> tasks = realm.where(Task.class).findAll();
    final TaskAdapter adapter = new TaskAdapter(this, tasks);

    ListView listView = (ListView) findViewById(R.id.task_list);
    listView.setAdapter(adapter);
    listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            final Task task = (Task) adapterView.getAdapter().getItem(i);
            final EditText taskEditText = new EditText(TaskListActivity.this);
            taskEditText.setText(task.getName());
            AlertDialog dialog = new AlertDialog.Builder(TaskListActivity.this)
                    .setTitle("Edit Task")
                    .setView(taskEditText)
                    .setPositiveButton("Save", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            // TODO: 5/4/17 Save Edited Task
                        }
                    })
                    .setNegativeButton("Delete", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            // TODO: 5/4/17 Delete Task
                        }
                    })
                    .create();
            dialog.show();
        }
    });

    Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
    setSupportActionBar(toolbar);

    FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
    fab.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            final EditText taskEditText = new EditText(TaskListActivity.this);
            AlertDialog dialog = new AlertDialog.Builder(TaskListActivity.this)
                    .setTitle("Add Task")
                    .setView(taskEditText)
                    .setPositiveButton("Add", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            realm.executeTransactionAsync(new Realm.Transaction() {
                                @Override
                                public void execute(Realm realm) {
                                    realm.createObject(Task.class, UUID.randomUUID().toString())
                                            .setName(String.valueOf(taskEditText.getText()));
                                }
                            });
                        }
                    })
                    .setNegativeButton("Cancel", null)
                    .create();
            dialog.show();
        }
    });
}
```

In the above, we first get a Realm instance for the thread which will be used in all interactions with the database. When finished with a Realm instance, it is important that you close it with a call to `close()` to deallocate memory and release any other used resource. For a UI thread the easiest way to close a Realm instance is in the `onDestroy()` method. Realm instances are reference counted, which means each call to `getInstance()` must have a corresponding call to `close()`.

After getting the instance, we query the database with `realm.where(Task.class).findAll()` to get all Task objects saved and assign them to a `RealmResults` object. `RealmResults` (and `RealmObject`) are live objects that are automatically kept up to date when changes happen to their underlying data. The `RealmBaseAdapter` also automatically keeps track of changes to its data model and updates when a change is detected.

We then create an instance of a ListView, set its adapter and add an OnItemClickListener on it. When a list item is tapped, we display an AlertDialog that the user can use to either edit the task or delete it. We'll implement these later.

We then create an instance of a FloatingActionButton and set an OnClick listener on it which displays an AlertDialog that can be used to create a task.

All write operations to Realm (create, update and delete) must be wrapped in write transactions. A write transaction can either be committed or cancelled. During a commit, all changes are written to disk, and a commit is only successful if all changes are persisted. By cancelling a write transaction, all changes will be discarded. With write transactions, your data will always be in a consistent state.

Write operations can be made using the following format:

```java
realm.beginTransaction();

//... add or update objects here ...

realm.commitTransaction();
```

Or they can be made using transaction blocks that use the `realm.executeTransaction()` or `realm.executeTransactionAsync()` methods which we use in the application. By default, write transactions block each other. It is recommended that you use asynchronous transactions on the UI thread that will run on a background thread and avoid blocking the UI. This is why we use `executeTransactionAsync()` as opposed to the other function. You can pass a callback function to `executeTransactionAsync()` that will get called when the transaction completes.

We create a Task with `realm.createObject()`, set a random UUID value as its `id` and set the text entered by the user as its `name`. To keep the code simple, we omit any check of the text entered by the user. In a real app, you would ensure that the user entered text before saving it and also display a message to them letting them know that input is required. As the app is right now, when a user doesn't input any text, the value of the Task `name` will be an empty String.

Next, add the following method to the class which will close the Realm instance when the Activity exits.

```java
@Override
protected void onDestroy() {
    super.onDestroy();
    realm.close();
}
```

Add the following to the class. This method is called from the OnClick listener we created in the adapter. It gets an `id` of the Task whose checkbox was clicked and updates its `done` field.

```java
public void changeTaskDone(final String taskId) {
    realm.executeTransactionAsync(new Realm.Transaction() {
        @Override
        public void execute(Realm realm) {
            Task task = realm.where(Task.class).equalTo("id", taskId).findFirst();
            task.setDone(!task.isDone());
        }
    });
}
```

Run the app and you should be able to create tasks, mark them as completed, exit the application and still have your data when you launch it again.

![Tasky](https://raw.githubusercontent.com/echessa/various_learning/master/misc/realmio/image_01.png)

## Editing Tasks
To enable editing the task's title, first add the following to `TaskListActivity`. This queries the database for a Task with a given `id` then sets its `name` with the passed in text.

```java
private void changeTaskName(final String taskId, final String name) {
    realm.executeTransactionAsync(new Realm.Transaction() {
        @Override
        public void execute(Realm realm) {
            Task task = realm.where(Task.class).equalTo("id", taskId).findFirst();
            task.setName(name);
        }
    });
}
```

Call it by replacing the `// TODO: 5/4/17 Save Edited Task` comment in the ListViews's OnItemClickListener with:

```java
changeTaskName(task.getId(), String.valueOf(taskEditText.getText()));
```

Run the app and you should be able to change a task's title.

## Deleting Tasks
Add the following to the `TaskListActivity` class.

```java
private void deleteTask(final String taskId) {
    realm.executeTransactionAsync(new Realm.Transaction() {
        @Override
        public void execute(Realm realm) {
            realm.where(Task.class).equalTo("id", taskId)
                    .findFirst()
                    .deleteFromRealm();
        }
    });
}

private void deleteAllDone() {
    realm.executeTransactionAsync(new Realm.Transaction() {
        @Override
        public void execute(Realm realm) {
            realm.where(Task.class).equalTo("done", true)
                    .findAll()
                    .deleteAllFromRealm();
        }
    });
}
```

The first function deletes a specific Task given an `id` while the second deletes all completed tasks.

Call the first function by replacing the `// TODO: 5/4/17 Delete Task` comment in the ListViews's OnItemClickListener with:

```java
deleteTask(task.getId());
```

Next, we'll add a menu button that will be used to delete all done tasks.

Open `menu_task_list.xml` in the `res/menu` folder and add an `item` to it:

```xml
<item
    android:id="@+id/action_delete"
    android:title="@string/action_delete"
    app:showAsAction="always"/>
```

Add the following to the `strings.xml` file in `res/values`.

```xml
<string name="action_delete">Clear Done</string>
```

Then modify `onOptionsItemSelected()` in `TaskListActivity` as shown.

```java
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();

    //noinspection SimplifiableIfStatement
    if (id == R.id.action_settings) {
        return true;
    } else if (id == R.id.action_delete) {
        deleteAllDone();
        return true;
    }

    return super.onOptionsItemSelected(item);
}
```

Run the app. You should now be able to delete a single task or all completed tasks.

![Tasky](https://raw.githubusercontent.com/echessa/various_learning/master/misc/realmio/image_02.png)

## Working with Migrations
You might have noticed that if you delete a task that isn't the last item in the list, it will be deleted and the last item in the list will move up to take its place. This reordering isn't a big issue, but some users might want their list of item to remain in the same order. To achieve this, we are going to sort the `RealmResults` tasks before passing them to the adapter.

We want the list to keep the order in which items were added. For this, we'll add a timestamp to each item and sort the list using this field. This means that we'll be changing the Realm model and thus the database's schema.

If you have data saved to the disk, you can't just change the database schema and have it work with the saved `.realm` file. You have to perform a migration from the old schema to the new definition. If there is no file on disk when Realm launches, no migration is needed. Realm will just create a new `.realm` file & schema based on the latest models defined in your code.

If your application is in development and you are okay with losing saved data, then you can just delete the `.realm` file on disk instead of having to write a migration. You can delete the Realm file with the following code in the `TaskListApplication`. Remember to remove the `Realm.deleteRealm(realmConfig)` statements on subsequent runs otherwise your database will be deleted each time the app is launched.

```java
RealmConfiguration realmConfig = new RealmConfiguration.Builder()
        .name("tasky.realm")
        .schemaVersion(0)
        .build();
Realm.deleteRealm(realmConfig);
Realm.setDefaultConfiguration(realmConfig);
```

A better way might be to delete the Realm file only when the schema changes:

```java
RealmConfiguration realmConfig = new RealmConfiguration.Builder()
        .name("tasky.realm")
        .schemaVersion(0)
        .deleteRealmIfMigrationNeeded()
        .build()
Realm.setDefaultConfiguration(realmConfig);
```

The above two solutions are only ideal in development. If you have an app in production and want to release an update that uses a different schema, you wouldn't want your user's to lose their data when they update the app. For this, you'll have to create a migration.

First, add a `timestamp` field to the Task model and add setter and getter functions for it.

```java
private long timestamp;

public long getTimestamp() {
    return timestamp;
}

public void setTimestamp(long timestamp) {
    this.timestamp = timestamp;
}
```

Then create a class named `Migration` inside the `models` package and modify it as shown below.

```java
package com.echessa.tasky.models;

import io.realm.DynamicRealm;
import io.realm.DynamicRealmObject;
import io.realm.RealmMigration;
import io.realm.RealmObjectSchema;
import io.realm.RealmSchema;

/**
 * Example of migrating a Realm file from version 0 (initial version) to its latest version (version 1).
 */
public class Migration implements RealmMigration {

    @Override
    public void migrate(final DynamicRealm realm, long oldVersion, long newVersion) {
        // During a migration, a DynamicRealm is exposed. A DynamicRealm is an untyped variant of a normal Realm, but
        // with the same object creation and query capabilities.
        // A DynamicRealm uses Strings instead of Class references because the Classes might not even exist or have been
        // renamed.

        // Access the Realm schema in order to create, modify or delete classes and their fields.
        RealmSchema schema = realm.getSchema();

        /************************************************
         // Version 0
         class Task
         @Required
         @PrimaryKey
         private String id;
         @Required
         private String name;
         private boolean done;

         // Version 1
         class Task
         @Required
         @PrimaryKey
         private String id;
         @Required
         private String name;
         private boolean done;
         private long timestamp;
         ************************************************/
        // Migrate from version 0 to version 1
        if (oldVersion == 0) {
            RealmObjectSchema taskSchema = schema.get("Task");

            taskSchema.addField("timestamp", long.class)
                    .transform(new RealmObjectSchema.Function() {
                        @Override
                        public void apply(DynamicRealmObject obj) {
                            obj.set("timestamp", 0);
                        }
                    });
            oldVersion++;
        }
    }
}
```

The above specifies a migration of the schema from version 0 (which is the version number we set during its creation) to 1. We use `addField()` to add a new field to the RealmObject model class. The `transform()` block isn't necessary, I include it here to show how you would go about setting a value for the field in already existing objects. `transform()`runs a transformation function on each RealmObject instance of the current class. In the above, the existing objects will have a `timestamp` value of `0`.

We then increment the value of `oldVersion`. This isn't necessary here since we only have one migration to perform, but I prefer to end each block that checks for a version number with an increment of `oldVersion` so that I won't have to remember to do so when I add another migration. If I was to migrate from version 1 to 2, then I would add another `if` block ` if (oldVersion == 1)` and if I had forgotten to increment the `oldVersion`, then the app would be buggy. For a detailed example of a migration [check out this example](https://github.com/realm/realm-java/blob/master/examples/migrationExample/src/main/java/io/realm/examples/realmmigrationexample/model/Migration.java) and you'll get what I'm trying to say here.

Finally in your `TaskListApplication` class, change the `schemaVersion` to the version you are upgrading to and add the migration to the configuration code with `migration()`.

```java
RealmConfiguration realmConfig = new RealmConfiguration.Builder()
        .name("tasky.realm")
        .schemaVersion(1)
        .migration(new Migration())
        .build();
Realm.setDefaultConfiguration(realmConfig);
```

Before we run the app, let us complete the original task we were working on, which was to sort the items by their `timestamp`.

## Sorting Data
To sorts the tasks by their timestamps, first make sure that new tasks are created with a timestamp value. Modify the AlertDialog's button OnClick listener (inside the FloatingActionButton code) as shown. This sets the device's current time as the value of the task's timestamp.

```java
@Override
public void onClick(DialogInterface dialogInterface, int i) {
    realm.executeTransactionAsync(new Realm.Transaction() {
        @Override
        public void execute(Realm realm) {
            Task task = realm.createObject(Task.class, UUID.randomUUID().toString());
            task.setName(String.valueOf(taskEditText.getText()));
            task.setTimestamp(System.currentTimeMillis());
        }
    });
}
```

Then add the following right after `RealmResults<Task> tasks` is initialized. Before the `tasks` object is passed to the adapter.

```java
tasks = tasks.sort("timestamp");
```

Run the app and you should now be able to delete tasks and have them keep their original order.

Pat yourself on the back because you have just created an application that performs all [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations on a Realm database.

## Aside: Adding Auth0 Authentication to the Application
Before we conclude, we'll look at how authentication can be added to an Android app using Auth0.

To get started, first <a href="javascript:signup()">sign up</a> for an Auth0 account, then navigate to the [Dashboard](https://manage.auth0.com/). Click on the **New Client** button and fill in the name of the client (or leave it at its default. Select **Native** from the Client type list. On the next page, select **Android** as the Native SDK. After the client has been created, you will see a page with a quickstart guide. Select the **Settings** tab where the client ID, client Secret and Domain can be retrieved. Add the following to the **Allowed Callback URLs** and save the changes with the button at the bottom of the page.

Replace `YOUR_AUTH0_DOMAIN` and `YOUR_APP_PACKAGE_NAME` with your specific values.

```
https://YOUR_AUTH0_DOMAIN/android/YOUR_APP_PACKAGE_NAME/callback
```

You'll require the Client ID and Domain for your client application. You can find these values on your Auth0 dashboard. We'll add them to the app's `strings.xml` file so that they are accessible to the rest of the app.

```xml
<string name="auth0_client_id">YOUR_AUTH0_CLIENT_ID</string>
<string name="auth0_domain">YOUR_AUTH0_DOMAIN</string>
```

To add a login/register screen to the application, we'll use the [Lock](https://github.com/auth0/Lock.Android) Activity which contains default templates (that can be customized) for login with email/password, sign up, social providers integration, and also password recovery.

To add Lock to your project, first add the following dependency and sync your gradle files.

```groovy
compile 'com.auth0.android:lock:2.5.0'
```

Add the following permissions to the manifest file.

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Then add the following to the manifest file inside the `application` tag.

    <!-- Auth0 Lock -->
    <activity
        android:name="com.auth0.android.lock.LockActivity"
        android:label="@string/app_name"
        android:launchMode="singleTask"
        android:screenOrientation="portrait"
        android:theme="@style/Lock.Theme">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />

            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />

            <data
                android:host="@string/auth0_domain"
                android:pathPrefix="/android/YOUR_APP_PACKAGE/callback"
                android:scheme="https" />
        </intent-filter>
    </activity>

    <activity
        android:name="com.auth0.android.provider.WebAuthActivity"
        android:theme="@style/Lock.Theme" />
    <!-- Auth0 Lock End -->

Replace `YOUR_APP_PACKAGE` with your app's package name.

In your main package, create a class named `LoginActivity` and add the following to it.

```java
package com.echessa.tasky;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.auth0.android.Auth0;
import com.auth0.android.lock.AuthenticationCallback;
import com.auth0.android.lock.Lock;
import com.auth0.android.lock.LockCallback;
import com.auth0.android.lock.utils.LockException;
import com.auth0.android.result.Credentials;

public class LoginActivity extends Activity {

    private Lock mLock;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Auth0 auth0 = new Auth0(getString(R.string.auth0_client_id), getString(R.string.auth0_domain));
        mLock = Lock.newBuilder(auth0, mCallback)
                //Add parameters to the builder
                .build(this);
        startActivity(mLock.newIntent(this));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Your own Activity code
        mLock.onDestroy(this);
        mLock = null;
    }

    private final LockCallback mCallback = new AuthenticationCallback() {
        @Override
        public void onAuthentication(Credentials credentials) {
            Toast.makeText(LoginActivity.this, "Log In - Success", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(LoginActivity.this, TaskListActivity.class));
            finish();
        }

        @Override
        public void onCanceled() {
            Toast.makeText(LoginActivity.this, "Log In - Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onError(LockException error) {
            Toast.makeText(LoginActivity.this, "Log In - Error Occurred", Toast.LENGTH_SHORT).show();
        }
    };

}
```

In the above code, we make the added class into an Activity. We'll set this Activity as the first activity that gets called on app launch.

In the activity's `onCreate()` method, we instantiate an `Auth0` object with the client credentials we got from Auth0. We then create a Lock widget and launch it with a call to `startActivity()`.

With the launched widget, the user will be able to login or register for an account.

When the activity is about to exit, you should clean up any used resources. We include an `onDestroy()` function and destroy the instantiated Lock.

We then include some callback functions that will be called after the authentication call to Auth0. We have the `onAuthentication()` that is called on successful authentication. Here, we display a message in a Toast and redirect the user to the `TaskListActivity` activity. We also include the `onCanceled()` callback that is called when authentication is cancelled and an `onError()` callback that is called in case of an authentication error.

Add the LoginActivity to the manifest file as shown below and also remove the `intent-filter` tag from the `TaskListActivity` specification. We've instead added it to LoginActivity and made this activity the Launcher activity.

```xml
<activity
    android:name=".TaskListActivity"
    android:label="@string/app_name"
    android:theme="@style/AppTheme.NoActionBar"/>
<activity android:name=".LoginActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>

        <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>
</activity>
```

Run the app. If everything went well, you should see the Auth0 Lock widget and you should be able to create an account and be logged in.

![Lock widget](https://raw.githubusercontent.com/echessa/various_learning/master/misc/realmio/image_03.png)

In this app, we won't associate the To Do tasks to a particular user. Any logged in user will be able to see the tasks saved to a device. Later on we'll see how you can get the user's Auth0 details, incase you want to associate the data shown to a particular user.

We've added authentication to the app and now our user's list has some protection against prying eyes. That's great and we could call it a day, but let's look at an improvement we could make on the app. Right now, each time the user exits the app and launches it, a login is required. This might be annoying to some users. In the next section, we'll see how we can save the user's session on the device that will be used to automatically log them on subsequent launches.

## Working with Sessions
To keep a user's session, we'll be working with the following key objects.

 - **idToken**: Identity Token that proves the identity of the user.
 - **accessToken**: Access Token used by the Auth0 API.
 - **refreshToken**: Refresh Token that can be used to request new tokens without signing in again.
 
 These objects are the keys needed to keep the user connected, as they will be used in all the API calls.
 
 First we'll add some utility classes to the project. One class will be used to store some constants and the other will be user to save the Auth0 user credentials to disk.
 
 In the main package, add another package named `utils`. Inside this package, add two classes named `Constants` and `CredentialsManager`. Modify them as shown.
 
 Constants.java
 
 ```java
 package com.echessa.tasky.utils;

class Constants {
    final static String REFRESH_TOKEN = "refresh_token";
    final static String ACCESS_TOKEN = "access_token";
    final static String ID_TOKEN = "id_token";
    final static String TOKEN_TYPE = "token_type";
    final static String EXPIRES_IN = "expires_in";
}
```

CredentialsManager.java

```java
package com.echessa.tasky.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.auth0.android.result.Credentials;
import com.echessa.tasky.R;

import static com.echessa.tasky.utils.Constants.ACCESS_TOKEN;
import static com.echessa.tasky.utils.Constants.EXPIRES_IN;
import static com.echessa.tasky.utils.Constants.ID_TOKEN;
import static com.echessa.tasky.utils.Constants.REFRESH_TOKEN;
import static com.echessa.tasky.utils.Constants.TOKEN_TYPE;

public class CredentialsManager {

    public static void saveCredentials(Context context, Credentials credentials) {
        SharedPreferences sharedPref = context.getSharedPreferences(
                context.getString(R.string.auth0_preferences), Context.MODE_PRIVATE);

        sharedPref.edit()
                .putString(ID_TOKEN, credentials.getIdToken())
                .putString(REFRESH_TOKEN, credentials.getRefreshToken())
                .putString(ACCESS_TOKEN, credentials.getAccessToken())
                .putString(TOKEN_TYPE, credentials.getType())
                .putLong(EXPIRES_IN, credentials.getExpiresIn())
                .apply();
    }

    public static Credentials getCredentials(Context context) {
        SharedPreferences sharedPref = context.getSharedPreferences(
                context.getString(R.string.auth0_preferences), Context.MODE_PRIVATE);

        return new Credentials(
                sharedPref.getString(ID_TOKEN, null),
                sharedPref.getString(ACCESS_TOKEN, null),
                sharedPref.getString(TOKEN_TYPE, null),
                sharedPref.getString(REFRESH_TOKEN, null),
                sharedPref.getLong(EXPIRES_IN, 0));
    }

    public static void deleteCredentials(Context context) {
        SharedPreferences sharedPref = context.getSharedPreferences(
                context.getString(R.string.auth0_preferences), Context.MODE_PRIVATE);

        sharedPref.edit()
                .putString(ID_TOKEN, null)
                .putString(REFRESH_TOKEN, null)
                .putString(ACCESS_TOKEN, null)
                .putString(TOKEN_TYPE, null)
                .putLong(EXPIRES_IN, 0)
                .apply();
    }
}
```

The above class has methods that will be used to save, retrieve and delete user credentials from the device's shared preferences.

Add the following to the `strings.xml` file.

```xml
<string name="auth0_preferences">AUTH0_SHARED_PREFERENCES_KEY</string>
```

Modify `LoginActivity` as shown.

```java
package com.echessa.tasky;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.auth0.android.Auth0;
import com.auth0.android.authentication.AuthenticationAPIClient;
import com.auth0.android.authentication.AuthenticationException;
import com.auth0.android.callback.BaseCallback;
import com.auth0.android.lock.AuthenticationCallback;
import com.auth0.android.lock.Lock;
import com.auth0.android.lock.LockCallback;
import com.auth0.android.lock.utils.LockException;
import com.auth0.android.result.Credentials;
import com.auth0.android.result.UserProfile;
import com.echessa.tasky.utils.CredentialsManager;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends Activity {

    private Lock mLock;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Auth0 auth0 = new Auth0(getString(R.string.auth0_client_id), getString(R.string.auth0_domain));
        //Request a refresh token along with the id token.
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("scope", "openid offline_access");
        mLock = Lock.newBuilder(auth0, mCallback)
                .withAuthenticationParameters(parameters)
                //Add parameters to the build
                .build(this);

        String accessToken = CredentialsManager.getCredentials(this).getAccessToken();
        if (accessToken == null) {
            startActivity(mLock.newIntent(this));
            return;
        }

        AuthenticationAPIClient aClient = new AuthenticationAPIClient(auth0);
        aClient.userInfo(accessToken)
                .start(new BaseCallback<UserProfile, AuthenticationException>() {
                    @Override
                    public void onSuccess(final UserProfile payload) {
                        runOnUiThread(new Runnable() {
                            public void run() {
                                Toast.makeText(LoginActivity.this, "Automatic Login Success", Toast.LENGTH_SHORT).show();
                            }
                        });
                        startActivity(new Intent(LoginActivity.this, TaskListActivity.class));
                        finish();
                    }

                    @Override
                    public void onFailure(AuthenticationException error) {
                        runOnUiThread(new Runnable() {
                            public void run() {
                                Toast.makeText(LoginActivity.this, "Session Expired, please Log In", Toast.LENGTH_SHORT).show();
                            }
                        });
                        CredentialsManager.deleteCredentials(LoginActivity.this);
                        startActivity(mLock.newIntent(LoginActivity.this));
                    }
                });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Your own Activity code
        mLock.onDestroy(this);
        mLock = null;
    }

    private final LockCallback mCallback = new AuthenticationCallback() {
        @Override
        public void onAuthentication(Credentials credentials) {
            Toast.makeText(LoginActivity.this, "Log In - Success", Toast.LENGTH_SHORT).show();
            CredentialsManager.saveCredentials(LoginActivity.this, credentials);
            startActivity(new Intent(LoginActivity.this, TaskListActivity.class));
            finish();
        }

        @Override
        public void onCanceled() {
            Toast.makeText(LoginActivity.this, "Log In - Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onError(LockException error) {
            Toast.makeText(LoginActivity.this, "Log In - Error Occurred", Toast.LENGTH_SHORT).show();
        }
    };
}
```
 
Before launching Lock we need to first ask for the `offline_access` scope in order to get a valid `refresh_token` in the response.
 
We then check for a saved `accessToken`. If there is none, the Lock widget is launched and the user can log in. When they log in, the `onAuthentication()` callback will be called and their credentials saved.
 
If an `accessToken` is found on application launch, we check whether it’s still valid. To do this, we fetch the user profile with the `AuthenticationAPI`. If this call succeeds, we launch the `TaskListActivity`.
 
How you deal with a non-valid token is up to you. You will normally choose between two scenarios. You can either ask users to re-enter their credentials or use the `refreshToken` to get a new valid one. In our app, we ask the user to log in again (in the `onFailure()` callback).

Run the app and you'll be able to remain logged in when you exit the app.

## User Profile
If your app needs to work with the logged in user's details, you can grab them from the `UserProfile` object that is passed into the `onSuccess()` callback when making a call to the `AuthenticationAPI`. In our code, we have the following parameter `UserProfile payload`. From this `payload` object you can get details about the user depending on how your application is set up and what details are saved to Auth0. Examples of what you can get are shown.

```java
payload.getName();
payload.getEmail();
payload.getPictureURL();
payload.getUserMetadata().get("country").toString();
```

## User Logout
Next we'll add a Logout option to the app's menu. Add the following item to the `menu/menu_task_list` file.

```xml
<item
    android:id="@+id/logout"
    android:title="@string/logout"
    app:showAsAction="never"/>
```

Add the following to the `strings.xml` file.

```xml
<string name="logout">Logout</string>
```

In `TaskListActivity` add the following. Here we delete the saved user credentials and navigate to the `LoginActivity`.

```java
private void logout() {
    CredentialsManager.deleteCredentials(TaskListActivity.this);
    startActivity(new Intent(this, LoginActivity.class));
}
```

Call this function in `onOptionsItemSelected()` by modifying the if_else block as shown.

```java
if (id == R.id.action_settings) {
    return true;
} else if (id == R.id.action_delete) {
    deleteAllDone();
    return true;
} else if (id == R.id.logout) {
    logout();
}
```

Run the app and you should be able to logout via the Logout menu option

![Logout](https://raw.githubusercontent.com/echessa/various_learning/master/misc/realmio/image_04.png)

## Conclusion
In this article, we've looked at how to use the Realm Mobile Database in an Android app. If you are interested in finding out more on this, be sure to check out its [documentation](https://realm.io/docs). You can download the completed project files from [here](https://github.com/echessa/realm-android-demo). The folder contains two subfolders labelled `completed` and `completed_with_auth0`. The former contains the completed project without the added authentication code, while the latter contains the Auth0 code. For the latter, remember to place in your Auth0 client ID and domain in the `strings.xml` file.
