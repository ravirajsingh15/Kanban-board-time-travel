# Kanban Board Time Travel

A modern full-stack Kanban board application built with

- Ruby on Rails
- React
- Inertia.js
- PostgreSQL
- Vite
--------------------------------------------------------------------------------------------------------------------------------

# Requirements version

Make sure these versions are installed on your system

- Ruby version - 3.3.3
- Rails version - 8.0.5
- Node.js version - 22.22.2
- PostgreSQL version - 16.13

--------------------------------------------------------------------------------------------------------------------------------------------

# Clone Repository

```bash
git clone https://github.com/ravirajsingh15/Kanban-board-time-travel.git

cd kanban_time_travel
```
-----------------------------------------------------------------------------------------------------------------------------------------------
# Install Dependencies

```bash
bundle install
npm install
```
--------------------------------------------------------------------------------------------------------------------------------------------------
# PostgreSQL Setup

## Login to PostgreSQL

```bash
sudo -u postgres psql
```

## Create Database User

```sql
CREATE USER kanban_board WITH PASSWORD 'kanban2434';
```

## Give Superuser Permission
```sql
ALTER USER kanban_board WITH SUPERUSER;
```
## Create Database

```sql
CREATE DATABASE kanban_time_travel;
```

## Grant All Permissions

```sql
GRANT ALL PRIVILEGES ON DATABASE kanban_time_travel TO kanban_board;
```

## Exit PostgreSQL

```bash
\q
```
---------------------------------------------------------------------------------------------------------------------------------------------------
# Database Setup

Run migrations:

```bash
rails db:create
rails db:migrate
```
--------------------------------------------------------------------------------------------------------------------------------------------------

# Change or add configration database.yml

```
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: karban_board - user name
  password: karban2434 - user password access database
  host: localhost
  database: karban_time_travel - database store all table ,column etc
```

------------------------------------------------------------------------------------------------------------------------------------------

# Run Application

Start the development server:

```bash
bin/dev
```
-----------------------------------------------------------------------------------------------------------------------------

# Tech Stack

- Ruby on Rails - Backend
- React - Frontend UI
- Inertia.js - SPA(Single Page Application) Integration
- PostgreSQL - Database
- Vite - Frontend Bundler

-----------------------------------------------------------------------------------------------------------------------------------------------

# Deployment

Run these commands before deployment:

```bash
RAILS_ENV=production rails db:migrate
RAILS_ENV=production rails assets:precompile
```

--------------------------------------------------------------------------------------------------------------------------------------------

# Architecture Overview

The application uses state-management architecture designed to simplicity, performance,
	1 - The current state of the Kanban board is stored directly in the cards table
	 Store column
	  - title - Card title
	  - description - card description
	  - column - manage card movement like backlog, to do , In review etc.
	  - position - manage card postion
	  - deleted_at - soft delete easy manage delete record detail

# Historical Event Storage

	1 - All user actions are stored separately in an append-only events table.

	Store column

	event_type - state management moving card
	card_id - card id easy justfy who card 
	data - Store card details like title, description, column, postion etc.
	occurred_at - store event time (timestamp)

# Approach

The current board state is stored directly in the database for fast loading and easy frontend rendering.
At the same time, all historical actions are stored separately to support history tracking and time travel functionality.

	- Fast board loading
 	- Complete Activity logs tracking
	- Easy debugging code
	- Simpler frontend integration

# Scaling Discussion

With 100,000 historical events, the system would still work correctly because the latest board state is stored directly in the database and it could be performace issues

	- To improve scalability and performance, several optimizations can be added:

	- Database indexing for faster searching queries on events and cards
	- Proper query scopes to keep database operations clean and efficient
	- Resolved N+1 query issues using eager loading
	- Background jobs for heavy tasks such as historical reconstruction and event processing

# Production Improvements

 production-scale systems, I would add several optimizations to improve performance and scalability.

 	1 - Event Partitioning

		Partition the events table by:

		board ID
		organization
		time ranges

		Note:- This improves database indexing and query performance

	2 - Background Processing

		Heavy tasks like historical reconstruction can run asynchronously using:

		Sidekiq
		background workers
		Redis server
		background jobs

		Note: - This prevents slow user-facing requests.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------