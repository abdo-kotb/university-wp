# [![University WP]](https://university-wp.x10.mx/wp/)

## University WP

Welcome to University WP, a custom WordPress project designed for a fictional university. This project includes a custom theme and a signup/login system, as well as different pages and post types. Additionally, the site includes live search functionality, different user roles, and the ability to write and delete notes. To achieve this functionality, the project makes use of the WordPress REST API, as well as custom REST APIs for various CRUD operations.

— Abdulrhman Kotb

## Installation: Famous 5-minute install

1.  Unzip the package in an empty directory and upload everything.
2.  Open [wp-admin/install.php](wp-admin/install.php) in your browser. It will take you through the process to set up a `wp-config.php` file with your database connection details.
    1.  If for some reason this does not work, do not worry. It may not work on all web hosts. Open up `wp-config-sample.php` with a text editor like WordPad or similar and fill in your database connection details.
    2.  Save the file as `wp-config.php` and upload it.
    3.  Open [wp-admin/install.php](wp-admin/install.php) in your browser.
3.  Once the configuration file is set up, the installer will set up the tables needed for your site. If there is an error, double check your `wp-config.php` file, and try again. If it fails again, please go to the [WordPress support forums](https://wordpress.org/support/forums/) with as much data as you can gather.
4.  **If you did not enter a password, note the password given to you.** If you did not provide a username, it will be `admin`.
5.  The installer should then send you to the [login page](wp-login.php). Sign in with the username and password you chose during the installation. If a password was generated for you, you can then click on “Profile” to change the password.
