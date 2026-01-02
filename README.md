Requirements

- PHP 8.1+
- Composer
- Node.js & npm
- MySQL / PostgreSQL / SQLite

Clone the repository

Install PHP dependencies
``` composer install ```

Install JavaScript dependencies
``` npm install ```

Environment setup
``` cp .env.example .env ```
``` php artisan key:generate ```

Configure the database

Edit your .env file and set your database credentials:

- DB_DATABASE=your_database
- DB_USERNAME=your_username
- DB_PASSWORD=your_password

Run migrations and seeders:

``` php artisan migrate ```
``` php artisan db:seed ```

Build frontend assets
``` npm run dev ```

Start the Laravel server
``` php artisan serve ```

Queue & Scheduled Jobs

Run the queue worker in a separate terminal:
``` php artisan queue:work ```

Run the scheduler locally in another terminal:
``` php artisan schedule:work ```

Mail Configuration (Local Development)

For local testing, emails are logged instead of being sent.

Set this in your .env file:
``` MAIL_MAILER=log ```

Emails will appear in:

storage/logs/laravel.log
